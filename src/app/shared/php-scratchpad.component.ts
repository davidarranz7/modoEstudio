import { ChangeDetectionStrategy, Component, Input, OnChanges, signal } from '@angular/core';
import { Question } from '../core/questions';
import { EditorSnapshot } from '../core/editor-state';
import { CodeWorkspaceComponent } from './code-workspace.component';
import { PhpRunnerComponent } from './php-runner.component';

@Component({selector:'app-php-scratchpad',standalone:true,imports:[CodeWorkspaceComponent,PhpRunnerComponent],changeDetection:ChangeDetectionStrategy.OnPush,template:`
<details class="lab-panel">
 <summary>{{title}}</summary>
 <app-code-workspace [projectId]="'fragmento-'+question.id" filename="solucion.php" [value]="code()" [files]="files()" [savedState]="editorState()" [saveStatus]="saveStatus()" [allowCheck]="allowCheck" (valueChange)="changeCode($event)" (stateChange)="saveEditorState($event)"/>
 <app-php-runner [question]="question" [files]="files()" [compareOutput]="true" [allowCheck]="allowCheck"/>
</details>`})
export class PhpScratchpadComponent implements OnChanges {
 @Input({required:true}) question!:Question;
 @Input() title='Escribir y probar código PHP';
 @Input() allowCheck=true;
 readonly code=signal('');readonly files=signal<Record<string,string>>({});readonly editorState=signal<EditorSnapshot|undefined>(undefined);readonly saveStatus=signal('Guardado');
 private activeId='';
 ngOnChanges():void{
  if(this.question.id===this.activeId)return;this.activeId=this.question.id;let code=this.question.code;this.editorState.set(undefined);this.saveStatus.set('Guardado');
  try{const stored=JSON.parse(localStorage.getItem(this.key())??'null');if(stored&&typeof stored.code==='string'){code=stored.code;this.editorState.set(stored.editorState);}}catch{this.saveStatus.set('No se pudo recuperar la copia local');}
  this.code.set(code);this.files.set({'solucion.php':code});
 }
 changeCode(code:string):void{this.code.set(code);this.files.set({'solucion.php':code});this.save();}
 saveEditorState(state:EditorSnapshot):void{this.editorState.set(state);this.save();}
 private key():string{return 'estudio-php-fragmento-v1:'+this.activeId;}
 private save():void{try{localStorage.setItem(this.key(),JSON.stringify({code:this.code(),editorState:this.editorState()}));this.saveStatus.set('Guardado');}catch{this.saveStatus.set('Error de guardado: copia tu código');}}
}
