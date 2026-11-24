import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionKind } from '../../core/questions';
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
  readonly cards = computed(() => this.study.questions().filter(q => q.subjectId === this.subjectId && q.unit === this.unit));
  readonly showMore = signal(false);
  readonly mainTypes: {id:string;mode:ExamMode;label:string;description:string;icon:IconName;kinds:QuestionKind[];activity?:boolean}[] = [
    {id:'test',mode:'test',label:'Test',description:'Elige respuestas',icon:'check',kinds:['single','multi']},
    {id:'written',mode:'written',label:'Escribir',description:'Breves y desarrollo',icon:'layers',kinds:['short','develop']},
    {id:'code',mode:'code',label:'Código',description:'Escribir e interpretar',icon:'code',kinds:['code']},
    {id:'practices',mode:'mixed',label:'Prácticas',description:'Ejercicios de clase',icon:'play',kinds:['single','multi','short','develop','code','match','order'],activity:true},
    {id:'mixed',mode:'mixed',label:'Mixto',description:'Todos los tipos',icon:'refresh',kinds:['single','multi','short','develop','code','match','order']}
  ];
  readonly extraTypes: {id:string;mode:ExamMode;label:string;description:string;icon:IconName;kinds:QuestionKind[];activity?:boolean}[] = [
    {id:'short',mode:'short',label:'Respuestas breves',description:'Definiciones y respuestas cortas',icon:'layers',kinds:['short']},
    {id:'develop',mode:'develop',label:'Desarrollo',description:'Explicaciones completas',icon:'layers',kinds:['develop']},
    {id:'write',mode:'write',label:'Escribir código o configuración',description:'Resuelve desde cero',icon:'code',kinds:['code']},
    {id:'interpret',mode:'interpret',label:'Interpretar código o configuración',description:'Predice la salida o el efecto',icon:'code',kinds:['code']},
    {id:'match',mode:'match',label:'Relacionar',description:'Relaciona conceptos',icon:'layers',kinds:['match']},
    {id:'order',mode:'order',label:'Ordenar pasos',description:'Ordena el procedimiento',icon:'layers',kinds:['order']}
  ];
  readonly seen = computed(() => this.cards().filter(q => this.study.record(q.id).seen > 0).length);
  readonly percent = computed(() => Math.round(this.seen() / Math.max(1, this.cards().length) * 100));
  count(type: {mode:ExamMode;kinds:QuestionKind[];activity?:boolean}): number {
    return this.cards().filter(q => type.kinds.includes(q.kind) && (!type.activity || !!q.activity) && (type.mode !== 'write' && type.mode !== 'interpret' || q.codeTask === type.mode)).length;
  }
  toggleMore(): void { this.showMore.update(value=>!value); }
  open(mode: ExamMode = 'mixed', activities = false): void {
    if (this.study.hasActiveExam() && !window.confirm('Ya tienes un examen en curso. ¿Descartarlo para empezar esta práctica? Sus respuestas se retirarán del progreso.')) return;
    if (this.study.hasActiveExam()) this.study.discardActiveExam();
    if (this.study.startQuick(this.subjectId, [this.unit], mode, false, activities ? 'activities' : 'all')) void this.router.navigateByUrl('/estudiar');
  }
}
