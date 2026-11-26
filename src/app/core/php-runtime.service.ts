import { Injectable, OnDestroy, signal } from '@angular/core';
import type { PhpTestCase } from './questions';

export interface PhpDiagnostic {
  severity:'error'|'warning'|'notice';
  kind:'syntax'|'runtime'|'warning'|'notice';
  message:string;
  explanation:string;
  detail?:string;
  file?:string;
  line?:number;
}
export interface PhpFileInfo {
  path:string;
  size:number;
  kind:'file'|'directory'|'symlink';
  contentIncluded:boolean;
  reason?:string;
}
export interface PhpFunctionResult {
  label:string;
  input:unknown[];
  expected:unknown;
  actual:unknown;
  actualType:string;
  printed:string;
  initialOutput:string;
  error?:string|null;
  diagnostics:PhpDiagnostic[];
  passed:boolean;
  exitCode:number;
  elapsedMs:number;
}
export class PhpRuntimeError extends Error {
  constructor(message:string,readonly kind:'load'|'runtime'|'timeout'|'cancelled'){super(message);}
}

export interface PhpRequest {
  url: string;
  method?: 'GET' | 'POST' | 'HEAD';
  body?: Record<string, string | string[] | File | File[]> | string;
  headers?: Record<string, string>;
  stdin?: string;
  resource?:boolean;
}
export interface PhpResponse {
  body: string;
  stdout: string;
  stderr: string;
  status: number;
  headers: Record<string, string[]>;
  requestHeaders: Record<string, string>;
  cookies: Record<string, string>;
  /** Raw PHP session files, owned only by this laboratory. */
  session: Record<string, string>;
  files: Record<string, string>;
  /** Missing content is never an implicit deletion. */
  inventory?:PhpFileInfo[];
  deletedFiles?:string[];
  fileSnapshotComplete?:boolean;
  diagnostics?:PhpDiagnostic[];
  bytes?:Uint8Array;
  exitCode: number;
  elapsedMs: number;
  truncated?: boolean;
}

/** Provide on the laboratory component so each project gets a private worker. */
@Injectable()
export class PhpRuntimeService implements OnDestroy {
  readonly busy = signal(false);
  readonly status = signal('PHP 8.2 · WebAssembly');
  private worker: Worker | null = null;
  private sequence = 0;
  private pending = new Map<number, {resolve:(result:unknown)=>void; reject:(error:Error)=>void; timer:ReturnType<typeof setTimeout>}>();
  private opened = false;

  async open(files: Record<string,string>): Promise<void> {
    this.opened = false;
    this.status.set('Preparando PHP 8.2 (primera descarga: 18 MB)…');
    await this.send('open', {files}, 60000);
    this.opened = true;
    this.status.set('PHP 8.2 listo · ejecución en este dispositivo');
  }
  async updateFiles(files:Record<string,string>,deletedFiles:string[]=[],folders:string[]=[],deletedFolders:string[]=[]):Promise<void>{
    if(!this.opened)throw Error('Abre el proyecto antes de actualizarlo.');
    await this.send('update',{files,deletedFiles,folders,deletedFolders},8000);
  }
  async request(request: PhpRequest): Promise<PhpResponse> {
    if (!this.opened) throw Error('Abre el proyecto antes de ejecutarlo.');
    return this.send('request', {request}, 8000) as Promise<PhpResponse>;
  }
  async execute(input: {files:Record<string,string>; entry:string; stdin?:string}): Promise<PhpResponse> {
    await this.open(input.files);
    return this.request({url:'/'+input.entry, stdin:input.stdin});
  }
  async checkFunctions(input:{files:Record<string,string>;entry:string;tests:PhpTestCase[];stdin?:string}):Promise<PhpFunctionResult[]>{
    await this.open(input.files);
    const tests=input.tests.map(({functionName,args,mode})=>({functionName,args,mode:mode??'return'}));
    this.status.set('Comprobando con PHP real…');
    const runs=await this.send('check',{input:{files:input.files,entry:input.entry,stdin:input.stdin,tests}},8000) as Omit<PhpFunctionResult,'label'|'input'|'expected'|'passed'>[];
    this.opened=true;
    return input.tests.map((test,index)=>{
      const run=runs[index];
      if(!run)return{label:test.label,input:test.args,expected:test.expected,actual:null,actualType:'unknown',printed:'',initialOutput:'',error:'No se recibió un resultado de prueba.',diagnostics:[],passed:false,exitCode:1,elapsedMs:0};
      return{...run,label:test.label,input:test.args,expected:test.expected,passed:run.exitCode===0&&!run.error&&!run.diagnostics.some(d=>d.severity==='error'||d.severity==='warning')&&samePhpValue(run.actual,test.expected)&&((test.mode??'return')!=='return'||(!run.printed&&!run.initialOutput))};
    });
  }
  cancel(): void { this.stop('Ejecución cancelada. Vuelve a ejecutar para reiniciar el entorno.','cancelled'); }
  ngOnDestroy(): void { this.stop('Laboratorio cerrado.'); }
  private stop(message: string,kind:'load'|'runtime'|'timeout'|'cancelled'='runtime'): void {
    this.worker?.terminate(); this.worker = null; this.opened = false;
    for (const {reject,timer} of this.pending.values()) { clearTimeout(timer); reject(new PhpRuntimeError(message,kind)); }
    this.pending.clear(); this.busy.set(false); this.status.set(message);
  }
  private send(action: string, payload: object, timeout: number): Promise<unknown> {
    if (this.pending.size) return Promise.reject(Error('Hay una ejecución en curso. Espera o cancélala.'));
    if (!this.worker) {
      this.worker = new Worker(new URL('php-runtime/worker.js', document.baseURI), {type:'module', name:'ESTUDIO PHP aislado'});
      this.worker.onmessage = ({data}) => {
        const item = this.pending.get(data.id); if (!item) return;
        clearTimeout(item.timer); this.pending.delete(data.id); this.busy.set(false);
        if(data.error){
          item.reject(new PhpRuntimeError(data.error,data.kind??'runtime'));
          if(data.kind==='load'){this.worker?.terminate();this.worker=null;this.opened=false;this.status.set('No se pudo descargar PHP. Puedes volver a intentarlo.');}
        }else item.resolve(data.result);
      };
      this.worker.onerror = event => this.stop('No se pudo cargar PHP: '+(event.message || 'comprueba la conexión o la descarga offline.'),'load');
    }
    this.busy.set(true);
    const id = ++this.sequence;
    return new Promise((resolve,reject) => {
      const timer = setTimeout(() => this.stop(action === 'open' ? 'La descarga de PHP ha tardado demasiado. Reintenta con conexión.' : action==='check'?'Las pruebas han superado el límite de tiempo. El intérprete se ha detenido.':'Límite de tiempo alcanzado (8 segundos). El intérprete se ha detenido.','timeout'), timeout);
      this.pending.set(id,{resolve,reject,timer});
      this.worker!.postMessage({id,action,...payload});
    });
  }
}

export function samePhpValue(a:unknown,b:unknown):boolean {
  if(typeof a==='number'&&typeof b==='number')return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b));
  if(a===b)return true;
  if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((value,index)=>samePhpValue(value,b[index]));
  if(a&&b&&typeof a==='object'&&typeof b==='object'){const left=a as Record<string,unknown>,right=b as Record<string,unknown>;return Object.keys(left).length===Object.keys(right).length&&Object.keys(right).every(key=>Object.hasOwn(left,key)&&samePhpValue(left[key],right[key]));}
  return false;
}
