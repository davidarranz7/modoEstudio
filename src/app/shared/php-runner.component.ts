import { ChangeDetectionStrategy, Component, Input, OnChanges, inject, signal } from '@angular/core';
import { Question, PhpTestCase } from '../core/questions';
import { PhpResponse, PhpRuntimeService } from '../core/php-runtime.service';

interface TestResult { label:string; input:unknown; expected:unknown; actual:unknown; printed?:string; error?:string; passed:boolean; }
export function samePhpValue(a:unknown,b:unknown):boolean {
  if(typeof a==='number' && typeof b==='number') return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b));
  if(a===b)return true;
  if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>samePhpValue(v,b[i]));
  if(a&&b&&typeof a==='object'&&typeof b==='object'){const left=a as Record<string,unknown>,right=b as Record<string,unknown>;return Object.keys(left).length===Object.keys(right).length&&Object.keys(right).every(k=>Object.hasOwn(left,k)&&samePhpValue(left[k],right[k]));}
  return false;
}
@Component({selector:'app-php-runner',standalone:true,providers:[PhpRuntimeService],changeDetection:ChangeDetectionStrategy.OnPush,template:`
<section class="academic-runner" aria-label="Laboratorio PHP en el dispositivo">
 <strong>PHP 8.2 real · en este dispositivo</strong>
 <small>El intérprete WebAssembly se descarga al usarlo por primera vez (18 MB). La ejecución no necesita Docker ni otro ordenador.</small>
 @if(question.runnerMode==='manual'){<small>Ejecutar muestra la salida y las cabeceras reales. Los requisitos de interfaz y estructura se revisan con la rúbrica; utiliza Proyectos PHP para navegar entre formularios y páginas.</small>}
 <label>Entrada estándar antes de ejecutar<textarea [value]="stdin()" (input)="stdin.set($any($event.target).value)" aria-label="Entrada estándar PHP" placeholder="Un dato por línea, si el programa lo necesita"></textarea></label>
 <small>fgets() y fscanf() leen estos datos. No se solicita entrada interactiva durante la ejecución.</small>
 <div class="code-file-tabs">
  <button type="button" [disabled]="runtime.busy()||!hasCode()" (click)="execute(false)">Ejecutar código</button>
  @if(question.phpTests?.length){<button type="button" [disabled]="runtime.busy()||!hasCode()" (click)="execute(true)">Comprobar solución</button>}
  @if(runtime.busy()){<button type="button" (click)="runtime.cancel()">Cancelar</button>}
 </div>
 @if(runtime.busy()){<p role="status" class="small-muted">{{runtime.status()}}</p>}
 @if(error()){<p role="alert" class="small-muted">{{error()}}</p>}
 @if(result();as run){
  <div class="academic-runner-result" [attr.data-ok]="run.exitCode===0&&!run.stderr&&!run.truncated">
   <strong>{{run.truncated?'Límite de salida alcanzado':run.exitCode===0?'Ejecución finalizada':'Ejecución con error'}} · {{run.elapsedMs}} ms</strong>
   @if(run.stdout){<small>Salida estándar</small><pre>{{run.stdout}}</pre>}
   @if(run.stderr){<small>Errores o avisos</small><pre>{{run.stderr}}</pre>}
   @if(!run.stdout&&!run.stderr&&run.exitCode===0&&!tests().length){<small>El programa no ha escrito nada. Definir una función no la llama automáticamente.</small>}
   @if(question.runnerMode==='manual'){<details><summary>Respuesta HTTP · {{run.status}}</summary><pre>{{describe(run.headers)}}</pre></details>}
  </div>
 }
 @if(tests().length){
  <p>{{passed()}} / {{tests().length}} pruebas superadas. Casos públicos distribuidos con la aplicación; no sustituyen la revisión de requisitos.</p>
  @for(test of tests();track $index){<div class="academic-runner-test"><strong>{{test.passed?'✓':'✗'}} {{test.label}}</strong><small>Entrada: {{describe(test.input)}}</small><small>Esperado: {{describe(test.expected)}}</small><small>Obtenido: {{describe(test.actual)}}</small>@if(test.error){<small>{{test.error}}</small>}@if(test.printed){<small>Salida: {{test.printed}}</small>}</div>}
 }
 @if(!question.phpTests?.length){<small>Este ejercicio no dispone de comprobación automática. Ejecuta el código y revisa los criterios de corrección y la solución razonada.</small>}
</section>`})
export class PhpRunnerComponent implements OnChanges {
 @Input({required:true}) question!:Question;
 @Input() files:Record<string,string>={};
 readonly runtime=inject(PhpRuntimeService);
 readonly stdin=signal(''); readonly result=signal<PhpResponse|null>(null); readonly tests=signal<TestResult[]>([]); readonly error=signal('');
 private activeId=''; private generation=0; private filesSnapshot='';
 ngOnChanges():void {
  const snapshot=JSON.stringify(this.files),questionChanged=this.question.id!==this.activeId;
  if(questionChanged||snapshot!==this.filesSnapshot){
   this.runtime.cancel();this.activeId=this.question.id;this.filesSnapshot=snapshot;this.generation++;
   if(questionChanged)this.stdin.set(this.question.consoleInput??'');
   this.result.set(null);this.tests.set([]);this.error.set('');
  }
 }
 hasCode():boolean{return Object.values(this.files).some(x=>!!x.trim());}
 describe(value:unknown):string{return typeof value==='string'?value:JSON.stringify(value,null,2)??'Sin resultado';}
 passed():number{return this.tests().filter(t=>t.passed).length;}
 async execute(check:boolean):Promise<void>{
  const generation=++this.generation; this.result.set(null);this.tests.set([]);this.error.set('');
  try{
   const entry=Object.hasOwn(this.files,'solucion.php')?'solucion.php':Object.hasOwn(this.files,'index.php')?'index.php':Object.keys(this.files).find(name=>name.endsWith('.php'))??'solucion.php';
   const files=Object.fromEntries(Object.entries(this.files).map(([name,code])=>[name,name.endsWith('.php')&&!code.includes('<?')&&!/^\s*</.test(code)?'<?php\n'+code:code]));
   const cases:PhpTestCase[]=check?this.question.phpTests??[]:[];
   let run:PhpResponse;
   if(cases.length){
    const harness=`<?php\n$tests=json_decode(file_get_contents(__DIR__.'/estudio-tests.json'),true,512,JSON_THROW_ON_ERROR);\nob_start();try{require __DIR__.'/${entry}';}catch(Throwable $e){ob_end_clean();throw $e;}\n$initial=ob_get_clean();$cases=[];foreach($tests as $test){$actual=null;$error=null;ob_start();try{if(!function_exists($test['functionName']))throw new RuntimeException('No existe la función '.$test['functionName']);$actual=call_user_func_array($test['functionName'],$test['args']);}catch(Throwable $e){$error=$e::class.': '.$e->getMessage();}$printed=ob_get_clean();if(($test['mode']??'return')==='output')$actual=$printed;$cases[]=['actual'=>$actual,'error'=>$error,'printed'=>$printed];}echo json_encode(['initialOutput'=>$initial,'cases'=>$cases],JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_SUBSTITUTE);`;
    run=await this.runtime.execute({files:{...files,'estudio-tests.json':JSON.stringify(cases),'estudio-check.php':harness},entry:'estudio-check.php',stdin:this.stdin()});
    if(generation!==this.generation)return;
    if(run.exitCode===0&&!run.truncated){
     try{
      const parsed=JSON.parse(run.stdout) as {initialOutput:string;cases:{actual:unknown;error?:string;printed:string}[]};
      if(!Array.isArray(parsed.cases)||parsed.cases.length!==cases.length)throw Error('Resultados incompletos');
      this.tests.set(cases.map((test,i)=>{const actual=parsed.cases[i];return {label:test.label,input:test.args,expected:test.expected,actual:actual.actual,printed:actual.printed,error:actual.error,passed:!actual.error&&!run.stderr&&samePhpValue(actual.actual,test.expected)&&((test.mode??'return')!=='return'||(!actual.printed&&!parsed.initialOutput))};}));
      run={...run,stdout:parsed.initialOutput,body:parsed.initialOutput};
     }catch{this.error.set('No se han obtenido resultados de prueba válidos. Revisa llamadas a exit(), salida ajena a la función o errores.');}
    }
   }else run=await this.runtime.execute({files,entry,stdin:this.stdin()});
   if(generation===this.generation)this.result.set(run);
  }catch(error){if(generation===this.generation)this.error.set(error instanceof Error?error.message:'No se pudo ejecutar PHP.');}
 }
}
