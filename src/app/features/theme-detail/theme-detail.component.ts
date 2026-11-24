import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QUESTIONS, QuestionKind } from '../../core/questions';
import { findSubject } from '../../core/subjects';
import { ExamMode, StudyService } from '../../core/study.service';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent, IconName } from '../../shared/icon.component';

@Component({selector:'app-theme-detail',standalone:true,imports:[HeaderComponent,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./theme-detail.component.html'})
export class ThemeDetailComponent {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly study = inject(StudyService);
  readonly subjectId = this.route.snapshot.paramMap.get('subjectId') ?? '';
  readonly subject = findSubject(this.subjectId);
  readonly unit = Number(this.route.snapshot.paramMap.get('unit'));
  readonly theme = this.subject?.themes.find(t => t.id === this.unit);
  readonly cards = QUESTIONS.filter(q => q.subjectId === this.subjectId && q.unit === this.unit);
  readonly types: {mode:ExamMode;label:string;description:string;icon:IconName; kinds:QuestionKind[]}[] = [
    {mode:'test',label:'Modo test',description:'Preguntas de una o varias respuestas correctas',icon:'check',kinds:['single','multi']},
    {mode:'short',label:'Respuestas breves',description:'Define o explica conceptos en pocas líneas',icon:'layers',kinds:['short']},
    {mode:'develop',label:'Preguntas de desarrollo',description:'Razona y desarrolla respuestas completas',icon:'layers',kinds:['develop']},
    {mode:'code',label:'Código · mixto',description:'Interpreta y escribe fragmentos de PHP',icon:'code',kinds:['code']},
    {mode:'write',label:'Escribir código PHP',description:'Resuelve ejercicios escribiendo funciones y programas',icon:'code',kinds:['code']},
    {mode:'interpret',label:'Interpretar código PHP',description:'Calcula salidas y explica fragmentos de código',icon:'code',kinds:['code']},
    {mode:'mixed',label:'Examen mixto',description:'Combina test, preguntas breves, desarrollo y código',icon:'refresh',kinds:['single','multi','short','develop','code']}
  ];
  readonly seen = computed(() => this.cards.filter(q => this.study.record(q.id).seen > 0).length);
  readonly percent = computed(() => Math.round(this.seen() / Math.max(1, this.cards.length) * 100));
  count(types: QuestionKind[], mode: ExamMode): number { return this.cards.filter(q => types.includes(q.kind) && (mode !== 'write' && mode !== 'interpret' || q.codeTask === mode)).length; }
  open(mode: ExamMode = 'mixed'): void {
    if (this.study.hasActiveExam() && !window.confirm('Ya tienes un examen en curso. ¿Descartarlo para empezar esta práctica? Sus respuestas se retirarán del progreso.')) return;
    if (this.study.hasActiveExam()) this.study.discardActiveExam();
    if (this.study.startQuick(this.subjectId, [this.unit], mode)) void this.router.navigateByUrl('/estudiar');
  }
}
