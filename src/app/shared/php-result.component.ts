import {ChangeDetectionStrategy,Component,ElementRef,EventEmitter,HostListener,Input,Output,ViewChild,signal} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {PhpDiagnostic,PhpResponse} from '../core/php-runtime.service';

export interface PhpPreviewNavigation {url:string;method:'GET'|'POST';body?:Record<string,string|string[]|File>;}

/** The iframe receives only the existing isolated preview service's HTML. */
@Component({selector:'app-php-result',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,styleUrl:'./php-result.component.css',template:`
<section class="php-result" [class.academic-runner-result]="!!response" aria-label="Resultado PHP">
 <div class="php-output-tabs" role="tablist" aria-label="Vista del resultado">
  <button type="button" role="tab" [attr.aria-selected]="view()==='output'" (click)="view.set('output')">Salida</button>
  <button type="button" role="tab" [attr.aria-selected]="view()==='html'" (click)="view.set('html')">Vista HTML</button>
 </div>
 @if(error){<p class="php-result-message" role="alert">{{error}}</p>}
 @if(stale){<p class="php-result-message" role="status">El resultado corresponde a una versión anterior del código.</p>}
 <div class="php-output-body" [hidden]="view()!=='output'">
  @if(response;as run){
   <p class="php-execution-status">{{run.truncated?'Límite de salida alcanzado':run.exitCode!==0?'Ejecución con error':diagnostics.length?'Ejecución finalizada con avisos':'Ejecución finalizada'}} · {{run.elapsedMs}} ms</p>
   @if(run.stdout){<pre>{{run.stdout}}</pre>}
   @else if(!run.stderr&&!diagnostics.length&&run.exitCode===0){<p>El programa no ha escrito nada. Un valor devuelto solo se muestra si el programa lo imprime.</p>}
   @if(run.stderr){<details open><summary>Canal de errores</summary><pre>{{run.stderr}}</pre></details>}
  }@else{<p>{{busy?'Ejecutando PHP…':'Ejecuta el código para ver el resultado.'}}</p>}
  <ng-content/>
 </div>
 <div class="php-html-body" [hidden]="view()!=='html'">
  @if(preview){<iframe #frame title="Vista HTML del programa PHP" sandbox="allow-scripts allow-forms" referrerpolicy="no-referrer" [srcdoc]="preview" (load)="frameLoaded()"></iframe>}
  @else{<p>Ejecuta el código para ver su HTML.</p>}
 </div>
 @if(diagnostics.length){<details class="php-result-details" open><summary>Problemas · {{diagnostics.length}}</summary>
  @for(problem of diagnostics;track $index){<div class="php-problem"><strong>{{problem.kind==='syntax'?'Error de sintaxis':problem.severity==='error'?'Error de ejecución':'Aviso PHP'}}</strong><p>{{problem.message}}</p><small>{{problem.explanation}}</small>@if(problem.file){<button type="button" (click)="diagnostic.emit(problem)">{{problem.file}}@if(problem.line){:{{problem.line}}}</button>}</div>}
 </details>}
 @if(response;as run){<details class="php-result-details"><summary>HTTP · {{run.status}}</summary><small>{{url}}</small><pre>{{describe({peticion:run.requestHeaders,respuesta:run.headers,cookies:run.cookies,sesion:run.session})}}</pre></details>}
</section>`})
export class PhpResultComponent {
 @Input() response:PhpResponse|null=null;
 @Input() preview:SafeHtml|null=null;
 @Input() token='';
 @Input() url='';
 @Input() diagnostics:PhpDiagnostic[]=[];
 @Input() error='';
 @Input() stale=false;
 @Input() busy=false;
 @Input() set initialView(value:'output'|'html'){this.view.set(value);}
 @Output() diagnostic=new EventEmitter<PhpDiagnostic>();
 @Output() navigation=new EventEmitter<PhpPreviewNavigation>();
 @Output() iframeReady=new EventEmitter<HTMLIFrameElement>();
 @ViewChild('frame') frame?:ElementRef<HTMLIFrameElement>;
 readonly view=signal<'output'|'html'>('output');
 get previewFrame():HTMLIFrameElement|undefined{return this.frame?.nativeElement;}
 show(view:'output'|'html'):void{this.view.set(view);}
 frameLoaded():void{if(this.previewFrame)this.iframeReady.emit(this.previewFrame);}
 describe(value:unknown):string{return JSON.stringify(value,null,2);}
 @HostListener('window:message',['$event']) onMessage(event:MessageEvent):void{
  if(event.source!==this.frame?.nativeElement.contentWindow||!event.data||event.data.token!==this.token)return;
  if(typeof event.data.url==='string'&&['GET','POST'].includes(event.data.method))this.navigation.emit({url:event.data.url,method:event.data.method,body:event.data.body});
 }
}
