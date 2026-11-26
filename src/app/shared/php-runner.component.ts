import {ChangeDetectionStrategy,Component,ElementRef,HostListener,Input,OnChanges,OnDestroy,inject,signal} from '@angular/core';
import {DomSanitizer,SafeHtml} from '@angular/platform-browser';
import {Question} from '../core/questions';
import {PhpDiagnostic,PhpFunctionResult,PhpResponse,PhpRuntimeError,PhpRuntimeService} from '../core/php-runtime.service';
import {PhpPreviewService} from '../core/php-preview.service';
import {PhpPreviewNavigation,PhpResultComponent} from './php-result.component';
export {samePhpValue} from '../core/php-runtime.service';

@Component({selector:'app-php-runner',standalone:true,imports:[PhpResultComponent],providers:[PhpRuntimeService,PhpPreviewService],changeDetection:ChangeDetectionStrategy.OnPush,template:`
<section class="php-quick-runner" aria-label="Ejecución PHP">
 @if(referenceMode){
  <div class="php-reference-heading"><strong>Resultado de la solución de referencia</strong>@if(result()||error()){<button type="button" [disabled]="working()" (click)="execute(false)">Volver a ejecutar</button>}</div>
  <p class="php-quick-note">Ejecución real en un entorno independiente de tu trabajo.@if(referenceInput()){ Datos de ejemplo: {{referenceInput()}}}@if(referenceExample()){ Llamada de ejemplo: {{referenceExample()!.functionName}}({{describe(referenceExample()!.args).slice(1,-1)}}).@if(referenceExample()!.mode!=='output'){ Se muestra el valor devuelto por la función.}}</p>
 }@else{
 <div class="php-quick-actions">
  <button type="button" class="php-quick-primary" [disabled]="working()||!hasCode()" (click)="execute(false)"><span aria-hidden="true">▶</span> Ejecutar</button>
  <button type="button" [disabled]="working()||!hasCode()||!allowCheck" (click)="execute(true)" [attr.title]="allowCheck?null:'La corrección estará disponible al terminar el examen'">Corregir</button>
 </div>
 @if(executionExample();as example){<p class="php-quick-note">Ejecutar llama a {{callDescription(example.functionName,example.args)}} y muestra por separado el valor devuelto y la salida impresa.</p>}
 @if(!allowCheck){<p class="php-quick-note">La corrección estará disponible al terminar el examen.</p>}
 }
 @if(working()){<div class="php-quick-progress"><small role="status">{{executionStatus()}}</small><button type="button" (click)="cancel()">Cancelar</button></div>}
 @if(notice()){<p role="status" class="php-quick-note">{{notice()}}</p>}
 @if(stale()){<p class="php-quick-note" role="status">El resultado corresponde a una versión anterior del código.</p>}
 @if(error()){<p role="alert" class="php-quick-error">{{error()}}</p>}
 @if(functionRun();as run){
  <section class="academic-runner-result php-function-output" aria-label="Resultado de la llamada">
   <strong>Valor devuelto por {{callDescription(executionExample()!.functionName,run.input)}}</strong>
   @if(run.error){<p>No se obtuvo un valor de retorno: la llamada terminó con un error.</p>}@else{<pre class="php-return-value">{{describe(run.actual)}}</pre><small>Tipo PHP: {{run.actualType}}</small>}
   <strong>Salida impresa</strong>
   @if(run.initialOutput||run.printed){<pre class="php-printed-output">{{run.initialOutput+run.printed}}</pre>}@else{<p class="php-no-printed-output">La función no ha impreso nada.</p>}
   @if(run.error){<p class="php-quick-error" role="alert">{{run.error}}</p>}
   @if(run.diagnostics.length){<details><summary>Problemas de la llamada</summary>@for(problem of run.diagnostics;track $index){<p>{{problem.message}}</p>@if(problem.file){<button type="button" (click)="goTo(problem)">{{problem.file}}:{{problem.line}}</button>}}</details>}
  </section>
 }@else{<app-php-result [response]="result()" [preview]="html()" [diagnostics]="problems()" [url]="address()" [token]="token" [busy]="working()" [initialView]="referenceMode?'html':'output'" (diagnostic)="goTo($event)" (navigation)="navigate($event)"/>}
 @if(outputCheck();as comparison){<div class="academic-runner-result php-check-summary" [attr.data-ok]="comparison.passed"><strong>{{comparison.passed?'✓ La salida coincide':'✗ La salida no coincide'}}</strong><small>Comparación de esta ejecución; revisa también el razonamiento y los requisitos.</small><details><summary>Comparación de salida</summary><small>Salida esperada</small><pre>{{comparison.expected}}</pre><small>Salida obtenida</small><pre>{{comparison.actual}}</pre></details></div>}
 @if(tests().length){
  <div class="academic-runner-result php-check-summary" [attr.data-ok]="passed()===tests().length"><strong>Comprobación finalizada · {{passed()}} / {{tests().length}} pruebas superadas</strong><details><summary>Ver pruebas</summary><p>Las pruebas ejecutan funciones y comprueban sus resultados. Los casos adicionales también se distribuyen con la aplicación.</p>
   @for(test of tests();track $index){<div class="academic-runner-test"><strong>{{test.passed?'✓':'✗'}} {{test.label}}</strong><small>Argumentos: {{describe(test.input)}}</small><small>{{returnsValue()?'Valor devuelto esperado':'Salida esperada'}}: {{describe(test.expected)}}</small><small>{{returnsValue()?'Valor devuelto obtenido':'Salida obtenida'}}: {{describe(test.actual)}} · Tipo PHP: {{test.actualType}}</small>@if(test.error){<small>{{test.error}}</small>}@if(test.printed){<small>Salida impresa: {{test.printed}}</small>}@for(problem of test.diagnostics;track $index){<p>{{problem.message}}</p>@if(problem.file){<button type="button" (click)="goTo(problem)">{{problem.file}}:{{problem.line}}</button>}}</div>}
  </details></div>
 }
 @if(!referenceMode){<details class="php-quick-options"><summary>Entrada y opciones de ejecución</summary><label>Entrada de consola<textarea [value]="stdin()" (input)="stdin.set($any($event.target).value)" aria-label="Entrada estándar PHP" placeholder="Un dato por línea"></textarea></label><small>fgets() y fscanf() leen estos datos antes de ejecutar; la entrada no es interactiva.</small><small>PHP 8.2 real en este dispositivo. Primera descarga: 18 MB.</small><button type="button" [disabled]="working()" (click)="restart()">Reiniciar cookies y sesión</button></details>}
</section>`,styles:[`
:host{display:block;min-width:0}.php-quick-runner{margin:5px 0 12px;min-width:0}.php-quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.php-quick-actions button{display:flex;gap:7px;align-items:center;justify-content:center;min-height:45px;padding:9px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--text);font:750 13px 'DM Sans',sans-serif}.php-quick-actions .php-quick-primary{background:var(--blue);border-color:var(--blue);color:#fff}.php-quick-actions button:disabled{opacity:.5;cursor:default}.php-quick-note,.php-quick-error{font-size:11px;line-height:1.5;margin:9px 0;color:var(--muted)}.php-quick-error{color:var(--red,#c34747);overflow-wrap:anywhere}.php-quick-progress{display:flex;justify-content:space-between;gap:8px;align-items:center;padding-top:9px;font-size:11px;color:var(--muted)}.php-quick-progress button,.php-quick-options button{border:1px solid var(--line);border-radius:7px;background:var(--surface);color:var(--text);padding:6px 9px;font-size:11px}.php-quick-options{margin-top:11px;color:var(--muted);font-size:10px}.php-quick-options summary{cursor:pointer}.php-quick-options label,.php-quick-options small{display:grid;gap:5px;margin:8px 0}.php-quick-options textarea{width:100%;box-sizing:border-box;min-height:70px;resize:vertical;background:var(--surface);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:8px;font:16px 'JetBrains Mono',monospace}.php-check-summary{display:grid;gap:5px;margin-top:10px;font-size:12px;overflow-wrap:anywhere}.php-check-summary small{font-size:11px}.php-check-summary summary{cursor:pointer;font-size:11px}.php-check-summary pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:220px;overflow:auto;font:11px/1.6 'JetBrains Mono',monospace}.academic-runner-test{display:grid;gap:4px}.academic-runner-test p{margin:0}.academic-runner-test button{justify-self:start;border:0;background:transparent;color:var(--blue);padding:3px 0;text-decoration:underline;font-size:11px}
 .php-reference-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:17px;font-size:12px}.php-reference-heading button{flex:none;min-height:40px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--blue);font:600 11px 'DM Sans',sans-serif}
 .php-function-output{display:grid;gap:9px;margin-top:13px;padding:13px;font-size:12px;overflow-wrap:anywhere}.php-function-output strong{font-size:12px}.php-function-output p{margin:0;font-size:11px;color:var(--muted)}.php-function-output pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.6 'JetBrains Mono',monospace}.php-function-output small,.php-function-output summary{font-size:11px;color:var(--muted)}.php-function-output button{border:0;background:transparent;color:var(--blue);padding:5px 0;font:11px 'DM Sans',sans-serif;text-decoration:underline}
`]})
export class PhpRunnerComponent implements OnChanges,OnDestroy {
 @Input({required:true}) question!:Question;
 @Input() files:Record<string,string>={};
 @Input() compareOutput=false;
 @Input() allowCheck=true;
 @Input() referenceMode=false;
 readonly runtime=inject(PhpRuntimeService);
 private readonly preview=inject(PhpPreviewService);private readonly sanitizer=inject(DomSanitizer);private readonly host=inject<ElementRef<HTMLElement>>(ElementRef);
 private readonly referenceRuntime=new PhpRuntimeService();
 readonly stdin=signal('');readonly result=signal<PhpResponse|null>(null);readonly tests=signal<PhpFunctionResult[]>([]);readonly error=signal('');readonly notice=signal('');readonly stale=signal(false);readonly working=signal(false);
 readonly html=signal<SafeHtml|null>(null);readonly problems=signal<PhpDiagnostic[]>([]);readonly address=signal('');
 readonly functionRun=signal<PhpFunctionResult|null>(null);
 readonly outputCheck=signal<{passed:boolean;expected:string;actual:string}|null>(null);
 token='';private activeId='';private generation=0;private filesSnapshot='';private environmentReady=false;private deployedFiles:Record<string,string>={};
 ngOnChanges():void{
  const snapshot=JSON.stringify(this.files),changed=this.question.id!==this.activeId;
  if(!changed&&snapshot===this.filesSnapshot)return;
  this.activeId=this.question.id;this.filesSnapshot=snapshot;this.generation++;
  if(changed||this.working()){this.runtime.cancel();this.referenceRuntime.cancel();this.preview.clear();this.environmentReady=false;this.working.set(false);}
  if(changed){this.stdin.set(this.question.consoleInput??'');this.result.set(null);this.html.set(null);this.problems.set([]);this.tests.set([]);this.functionRun.set(null);this.outputCheck.set(null);this.error.set('');this.notice.set('');this.stale.set(false);this.deployedFiles={};}
  if(this.referenceMode&&changed&&this.hasCode())queueMicrotask(()=>{if(this.activeId===this.question.id)void this.execute(false);});
  else if(this.result()||this.tests().length||this.functionRun()||this.outputCheck())this.stale.set(true);
 }
 ngOnDestroy():void{this.activeId='';this.generation++;this.referenceRuntime.cancel();this.preview.clear();}
 @HostListener('document:estudio-editor-execute',['$event']) onEditorExecute(event:Event):void{if(this.ownsEvent(event))void this.execute(false);}
 @HostListener('document:estudio-editor-check',['$event']) onEditorCheck(event:Event):void{if(this.ownsEvent(event))void this.execute(true);}
 private ownsEvent(event:Event):boolean{return !this.referenceMode&&!this.working()&&event.target instanceof Element&&!!event.target.closest('.flashcard')?.contains(this.host.nativeElement);}
 goTo(problem:PhpDiagnostic):void{this.host.nativeElement.closest('.flashcard')?.dispatchEvent(new CustomEvent('estudio-editor-diagnostic',{bubbles:true,detail:{file:problem.file,line:problem.line??1}}));}
 hasCode():boolean{return Object.values(this.files).some(code=>!!code.trim());}
 hasProblems(run:PhpResponse):boolean{return !!run.diagnostics?.some(d=>d.severity==='error'||d.severity==='warning');}
 describe(value:unknown):string{return typeof value==='string'?value:JSON.stringify(value,null,2)??'Sin resultado';}
 passed():number{return this.tests().filter(test=>test.passed).length;}
 returnsValue():boolean{return !!this.question.phpTests?.length&&this.question.phpTests.every(test=>(test.mode??'return')==='return');}
 executionExample(){return !this.referenceMode&&this.returnsValue()?this.question.phpTests?.[0]:null;}
 callDescription(name:string,args:unknown[]):string{return name+'('+args.map(value=>JSON.stringify(value)).join(', ')+')';}
 executionStatus():string{return this.referenceRuntime.busy()?this.referenceRuntime.status():this.runtime.status();}
 private sourceEntry():string{return Object.hasOwn(this.files,'solucion.php')?'solucion.php':Object.hasOwn(this.files,'index.php')?'index.php':Object.keys(this.files).find(name=>name.endsWith('.php'))??(Object.hasOwn(this.files,'index.html')?'index.html':Object.keys(this.files).find(name=>name.endsWith('.html'))??Object.keys(this.files)[0]??'solucion.php');}
 referenceExample(){const test=this.question.phpTests?.[0];return this.referenceMode&&test&&/^[a-zA-Z_]\w*$/.test(test.functionName)?test:null;}
 private entry():string{return this.referenceExample()?'__estudio_reference_example.php':this.sourceEntry();}
 private sourceFiles():Record<string,string>{
  const files=Object.fromEntries(Object.entries(this.files).map(([name,code])=>[name,name.endsWith('.php')&&!code.includes('<?')&&!/^\s*</.test(code)?'<?php\n'+code:code])),test=this.referenceExample();
  if(test){
   const quote=(value:string)=>"'"+value.replaceAll('\\','\\\\').replaceAll("'","\\'")+"'",args=quote(JSON.stringify(test.args));
   files[this.entry()]=`<?php require __DIR__ . '/' . ${quote(this.sourceEntry())}; $estudioReferenceValue = ${test.functionName}(...json_decode(${args}, true));`+(test.mode==='output'?'':` echo '<pre>' . htmlspecialchars(var_export($estudioReferenceValue, true), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</pre>';`);
  }
  return files;
 }
 private async ensureEnvironment():Promise<void>{
  const files=this.sourceFiles();
  if(!this.environmentReady){await this.runtime.open(files);this.environmentReady=true;}else{
   const changes=Object.fromEntries(Object.entries(files).filter(([path,value])=>this.deployedFiles[path]!==value));const deleted=Object.keys(this.deployedFiles).filter(path=>!Object.hasOwn(files,path));
   if(Object.keys(changes).length||deleted.length)await this.runtime.updateFiles(changes,deleted);
  }
  this.deployedFiles={...files};
 }
 private path(url:string,base='/'+this.entry()):string{const parsed=new URL(url,'https://estudio-lab.invalid'+base);if(parsed.origin!=='https://estudio-lab.invalid')throw Error('Solo puedes abrir archivos de este ejercicio.');return parsed.pathname+parsed.search;}
 private bridge(url:string):string{
  this.token=crypto.randomUUID();const token=JSON.stringify(this.token),base=JSON.stringify('https://estudio-lab.invalid'+url);
  return `document.addEventListener('submit',function(e){e.preventDefault();var form=e.target,data=Object.create(null),submitter=e.submitter;for(var pair of new FormData(form,submitter).entries()){if(pair[0] in data)data[pair[0]]=Array.isArray(data[pair[0]])?data[pair[0]].concat(pair[1]):[data[pair[0]],pair[1]];else data[pair[0]]=pair[1];}var target=new URL((submitter&&submitter.getAttribute('formaction'))||form.getAttribute('action')||${JSON.stringify(url)},${base});var method=((submitter&&submitter.getAttribute('formmethod'))||form.getAttribute('method')||'GET').toUpperCase();if(method==='GET'){target.search='';for(var name in data)for(var value of [].concat(data[name]))target.searchParams.append(name,typeof value==='string'?value:value.name);}parent.postMessage({token:${token},url:target.href,method:method,body:method==='POST'?data:undefined},'*');});document.addEventListener('click',function(e){var link=e.target.closest('a[href]');if(!link)return;var href=link.getAttribute('href');if(href.startsWith('#'))return;e.preventDefault();parent.postMessage({token:${token},url:new URL(href,${base}).href,method:'GET'},'*');});`;
 }
 private async requestPage(request:PhpPreviewNavigation,generation:number):Promise<PhpResponse|null>{
  await this.ensureEnvironment();let target=this.path(request.url,this.address()||'/'+this.entry()),method=request.method,body=request.body;
  for(let redirects=0;redirects<=8;redirects++){
   const run=await this.runtime.request({url:target,method,body,stdin:this.stdin()});if(generation!==this.generation)return null;
   const location=run.headers['location']?.[0];if(location&&[301,302,303,307,308].includes(run.status)){if(redirects===8)throw Error('Se han superado ocho redirecciones.');target=this.path(location,target);if(![307,308].includes(run.status)){method='GET';body=undefined;}continue;}
   const rendered=await this.preview.prepare(run,target,this.bridge(target));if(generation!==this.generation)return null;
   this.address.set(target);this.result.set(run);this.html.set(this.sanitizer.bypassSecurityTrustHtml(rendered.html));this.problems.set([...(run.diagnostics??[]),...rendered.diagnostics]);return run;
  }
  return null;
 }
 async navigate(request:PhpPreviewNavigation):Promise<void>{
  if(this.working())return;const generation=++this.generation;this.working.set(true);this.error.set('');this.tests.set([]);this.outputCheck.set(null);
  try{await this.requestPage(request,generation);if(generation===this.generation)this.stale.set(false);}catch(error){this.fail(error,generation);}finally{if(generation===this.generation)this.working.set(false);}
 }
 cancel():void{this.generation++;this.runtime.cancel();this.referenceRuntime.cancel();this.preview.clear();this.environmentReady=false;this.working.set(false);this.notice.set('Ejecución cancelada. Tu código se conserva.');}
 restart():void{if(this.working())return;this.runtime.cancel();this.preview.clear();this.environmentReady=false;this.notice.set('Entorno reiniciado. La próxima ejecución comenzará sin cookies ni sesión.');}
 private revealResult():void{if(!this.referenceMode)setTimeout(()=>this.host.nativeElement.scrollIntoView({block:'nearest',behavior:'instant'}));}
 referenceInput():string{return this.referenceMode&&/^[\w%.[\]-]+=[^&\s]*(?:&[\w%.[\]-]+=[^&\s]*)*$/.test(this.question.exampleInput??'')?this.question.exampleInput!:'';}
 private fail(error:unknown,generation:number):void{if(generation!==this.generation)return;this.environmentReady=false;this.error.set(error instanceof PhpRuntimeError&&error.kind==='load'?'No se pudo cargar PHP. Vuelve a pulsar Ejecutar para reintentarlo. '+error.message:error instanceof Error?error.message:'No se pudo ejecutar PHP.');}
 async execute(check:boolean):Promise<void>{
  if(this.working())return;
  if(check&&!this.allowCheck){this.notice.set('La corrección estará disponible al terminar el examen.');this.revealResult();return;}
  if(check&&!this.question.phpTests?.length&&!this.compareOutput){this.notice.set('Este ejercicio no tiene casos automáticos. Revisa la solución y sus requisitos.');this.revealResult();return;}
  const generation=++this.generation;this.working.set(true);this.tests.set([]);this.functionRun.set(null);this.outputCheck.set(null);this.error.set('');this.notice.set('');if(!check||!this.question.phpTests?.length||this.executionExample())this.stale.set(false);this.revealResult();
  try{
   const example=this.executionExample();
   if(!check&&example){try{const [run]=await this.referenceRuntime.checkFunctions({files:this.sourceFiles(),entry:this.entry(),stdin:this.stdin(),tests:[example]});if(generation===this.generation)this.functionRun.set(run);}finally{this.referenceRuntime.cancel();}}
   else if(check&&this.question.phpTests?.length){try{const tests=await this.referenceRuntime.checkFunctions({files:this.sourceFiles(),entry:this.entry(),stdin:this.stdin(),tests:this.question.phpTests});if(generation===this.generation)this.tests.set(tests);}finally{this.referenceRuntime.cancel();}}
   else{
    let expected=this.question.expectedOutput;
    if(check&&this.compareOutput&&expected===undefined){const original=this.question.code;try{const reference=await this.referenceRuntime.execute({files:{'solucion.php':original.includes('<?')||/^\s*</.test(original)?original:'<?php\n'+original},entry:'solucion.php',stdin:this.stdin()});if(generation!==this.generation)return;if(reference.exitCode!==0||this.hasProblems(reference)||reference.truncated){this.notice.set('No se pudo comprobar automáticamente la salida de referencia. Revisa la solución y sus requisitos.');return;}expected=reference.stdout;}finally{this.referenceRuntime.cancel();}}
    const input=this.referenceInput(),run=await this.requestPage({url:'/'+this.entry()+(input?'?'+input:''),method:'GET'},generation);if(!run||generation!==this.generation)return;
    if(check&&this.compareOutput&&expected!==undefined){const normalize=(value:string)=>value.replace(/\r\n/g,'\n').replace(/\n$/,'');this.outputCheck.set({passed:run.exitCode===0&&!this.hasProblems(run)&&!run.truncated&&normalize(run.stdout)===normalize(expected),expected,actual:run.stdout});}
   }
  }catch(error){this.fail(error,generation);}finally{if(generation===this.generation){this.working.set(false);this.revealResult();}}
 }
}
