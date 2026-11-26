import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Question } from '../core/questions';
import { findSubject, themeName } from '../core/subjects';
@Component({selector:'app-question-source',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`
@if(question.section || question.activity){
 <aside class="academic-reference" aria-label="Referencia al temario">
  <strong>Referencia al temario</strong>
  <span>{{subjectName()}} · UD{{question.unit}} — {{unitName()}}</span>
  <span>{{question.section || question.activity}}</span>
  @if(question.reference){<small>Fuente: {{question.reference}}</small>}
  @if(question.subjectId==='dwcs' && question.sourcePage){<a [href]="'/apuntes/dwcs-ud'+question.unit+'.pdf#page='+question.sourcePage" target="_blank" rel="noopener">Consultar este apartado en la guía PDF · pág. {{question.sourcePage}}</a>}
  @if(question.referenceUrl){<a [href]="question.referenceUrl" target="_blank" rel="noopener">Consultar recurso original citado</a>}
  @if(question.reference?.startsWith('PDF de Juan Pavón')){<a href="/apuntes/dwcs-ud1-original-protocolos.pdf" target="_blank" rel="noopener">Abrir PDF original de clase</a>}
 </aside>
}`})
export class QuestionSourceComponent {
 @Input({required:true}) question!:Question;
 subjectName():string{return findSubject(this.question.subjectId)?.name??this.question.subjectId;}
 unitName():string{return themeName(this.question.subjectId,this.question.unit);}
}
