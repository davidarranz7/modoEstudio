import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({selector:'app-code-workspace',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`
<section class="code-workspace">
 <div class="code-workspace-bar"><span>{{filename}}</span><span>Editor de texto · {{language}}</span></div>
 <div class="code-workspace-body">
  <div class="code-line-numbers" aria-hidden="true">@for(n of lines();track n){<span>{{n}}</span>}</div>
  <textarea spellcheck="false" autocomplete="off" autocapitalize="off" [value]="value" (input)="emit($event)" (keydown)="onKeydown($event)" [attr.aria-label]="'Código del archivo '+filename"></textarea>
 </div>
 <p>Escribe y compara con la solución modelo. Este editor no ejecuta PHP ni comprueba automáticamente el código.</p>
</section>`})
export class CodeWorkspaceComponent {
 @Input() value='';
 @Input() filename='solucion.php';
 @Input() language='PHP';
 @Output() valueChange=new EventEmitter<string>();
 lines():number[]{return Array.from({length:Math.max(9,this.value.split('\n').length)},(_,i)=>i+1);}
 emit(event:Event):void {this.valueChange.emit((event.target as HTMLTextAreaElement).value);}
 onKeydown(event:KeyboardEvent):void {
  if(event.key!=='Tab')return;
  event.preventDefault();
  const area=event.target as HTMLTextAreaElement;
  const start=area.selectionStart,end=area.selectionEnd;
  const result=area.value.slice(0,start)+'    '+area.value.slice(end);
  area.value=result;
  area.selectionStart=area.selectionEnd=start+4;
  this.valueChange.emit(result);
 }
}
