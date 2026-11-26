import { Injectable, OnDestroy, signal } from '@angular/core';

export interface PhpRequest {
  url: string;
  method?: 'GET' | 'POST' | 'HEAD';
  body?: Record<string, string | string[] | File> | string;
  headers?: Record<string, string>;
  stdin?: string;
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
  async request(request: PhpRequest): Promise<PhpResponse> {
    if (!this.opened) throw Error('Abre el proyecto antes de ejecutarlo.');
    return this.send('request', {request}, 8000) as Promise<PhpResponse>;
  }
  async execute(input: {files:Record<string,string>; entry:string; stdin?:string}): Promise<PhpResponse> {
    await this.open(input.files);
    return this.request({url:'/'+input.entry, stdin:input.stdin});
  }
  cancel(): void { this.stop('Ejecución cancelada. Vuelve a ejecutar para reiniciar el entorno.'); }
  ngOnDestroy(): void { this.stop('Laboratorio cerrado.'); }
  private stop(message: string): void {
    this.worker?.terminate(); this.worker = null; this.opened = false;
    for (const {reject,timer} of this.pending.values()) { clearTimeout(timer); reject(Error(message)); }
    this.pending.clear(); this.busy.set(false); this.status.set(message);
  }
  private send(action: string, payload: object, timeout: number): Promise<unknown> {
    if (this.pending.size) return Promise.reject(Error('Hay una ejecución en curso. Espera o cancélala.'));
    if (!this.worker) {
      this.worker = new Worker(new URL('php-runtime/worker.js', document.baseURI), {type:'module', name:'ESTUDIO PHP aislado'});
      this.worker.onmessage = ({data}) => {
        const item = this.pending.get(data.id); if (!item) return;
        clearTimeout(item.timer); this.pending.delete(data.id); this.busy.set(false);
        data.error ? item.reject(Error(data.error)) : item.resolve(data.result);
      };
      this.worker.onerror = event => this.stop('No se pudo cargar PHP: '+(event.message || 'comprueba la conexión o la descarga offline.'));
    }
    this.busy.set(true);
    const id = ++this.sequence;
    return new Promise((resolve,reject) => {
      const timer = setTimeout(() => this.stop(action === 'open' ? 'La descarga de PHP ha tardado demasiado. Reintenta con conexión.' : 'Límite de tiempo alcanzado (8 segundos). El intérprete se ha detenido.'), timeout);
      this.pending.set(id,{resolve,reject,timer});
      this.worker!.postMessage({id,action,...payload});
    });
  }
}
