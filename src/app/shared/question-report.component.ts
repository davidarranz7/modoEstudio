import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { QuestionReport, ReportReason, StudyService } from '../core/study.service';

@Component({
 selector:'app-question-report',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,
 template:`<div class="question-report">
   <div class="feedback-line">
     <button type="button" class="question-report-trigger" [class.has-report]="hasReport()" (click)="openEditor()">{{hasReport()?'⚑ Problema reportado · editar':'⚑ Reportar problema'}}</button>
     <button class="question-report-trigger" type="button" (click)="study.toggleUseful(questionId)" [attr.aria-pressed]="!!isUseful()">{{isUseful()?'♥ Útil':'♡ Útil'}}</button>
   </div>
   @if(open()){
    <section class="question-report-editor"><strong>¿Qué falla? Puedes marcar varios motivos</strong>
     <div class="report-reasons">
      @for(item of reasons;track item.id){
       <label><input type="checkbox" [checked]="selected().includes(item.id)" (change)="toggle(item.id,$any($event.target).checked)"> {{item.label}}</label>
      }
     </div>
     <label>Observación (opcional)<textarea rows="3" maxlength="2000" [value]="comment()" (input)="comment.set($any($event.target).value)" placeholder="Explica en qué parte está el error..."></textarea></label>
     <div class="question-report-actions"><button type="button" class="question-report-save" [disabled]="!selected().length" (click)="save()">Guardar aviso</button><button type="button" (click)="open.set(false)">Cancelar</button>@if(hasReport()){<button type="button" class="question-report-remove" (click)="remove()">Quitar aviso</button>}</div>
     <p>Tu reporte queda guardado en este dispositivo. Exporte los reportes desde el banco para revisarlos o corregirlos.</p>
    </section>
   }
 </div>`
})
export class QuestionReportComponent {
 @Input({required:true}) questionId='';
 readonly study=inject(StudyService);
 readonly open=signal(false);
 readonly selected=signal<ReportReason[]>([]);
 readonly comment=signal('');
 readonly existing=computed<QuestionReport | undefined>(()=>this.study.reports()[this.questionId]);
 readonly hasReport=computed(()=>!!this.existing()?.reasons.length);
 readonly isUseful=computed(()=>!!this.existing()?.useful);
 readonly reasons:{id:ReportReason;label:string}[]=[
 {id:'enunciado',label:'Enunciado ambiguo'}, {id:'contexto',label:'Falta contexto'},
 {id:'respuesta',label:'Solución incorrecta'}, {id:'respuesta-incompleta',label:'Respuesta incompleta'},
 {id:'referencia',label:'Referencia académica incorrecta'},
 {id:'codigo',label:'Código no corresponde'}, {id:'salida-falta',label:'Falta salida del código'},
 {id:'salida-incorrecta',label:'Salida de código incorrecta'}, {id:'imagen',label:'Imagen equivocada'},
 {id:'opciones',label:'Opciones de test incorrectas'}, {id:'pista',label:'Pista revela la respuesta'},
 {id:'duplicada',label:'Pregunta repetida'}, {id:'fuera-temario',label:'Fuera del temario'},
 {id:'dificultad',label:'Dificultad inadecuada'}, {id:'redaccion',label:'Redacción deficiente'}, {id:'otro',label:'Otro'}
 ];
 openEditor():void {const old=this.existing();this.selected.set(old?.reasons??(old?.reason?[old.reason]:[]));this.comment.set(old?.comment??'');this.open.update(v=>!v);}
 toggle(id:ReportReason,on:boolean):void {this.selected.update(v=>on?[...new Set([...v,id])]:v.filter(r=>r!==id));}
 save():void {this.study.reportQuestion(this.questionId,this.selected(),this.comment());this.open.set(false);}
 remove():void {this.study.clearReport(this.questionId);this.open.set(false);}
}
