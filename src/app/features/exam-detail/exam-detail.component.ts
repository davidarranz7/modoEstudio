import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../../core/questions';
import { StudyService, ExamAnswer, ExamResult, ExamMode } from '../../core/study.service';
import { SUBJECTS, themeName } from '../../core/subjects';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';
const names:Record<ExamMode,string>={mixed:'Mixto',test:'Test',single:'Test único',multi:'Test múltiple',written:'Escrito',short:'Breves',develop:'Desarrollo',code:'Código',write:'Escribir PHP',interpret:'Interpretar PHP',match:'Relacionar',order:'Ordenar'};
@Component({selector:'app-exam-detail',standalone:true,imports:[HeaderComponent,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./exam-detail.component.html'})
export class ExamDetailComponent {
  readonly router=inject(Router);
  readonly route=inject(ActivatedRoute);
  readonly study=inject(StudyService);
  readonly id=this.route.snapshot.paramMap.get('id')??'';
  readonly result=computed(()=>this.study.results().find(r=>r.id===this.id)??null);
  readonly expanded=signal<string[]>([]);
  readonly themeName=themeName;
  readonly names=names;
  subjectName(subjectId:string):string {return SUBJECTS.find(s=>s.id===subjectId)?.name??subjectId;}
  question(id:string):Question|undefined {return this.study.questions().find(q=>q.id===id);}
  assess(id:string,grade:'good'|'medium'|'bad'):void {this.study.assessResult(this.id,id,grade);}
  accuracy(result:ExamResult):number {return Math.round(result.good/result.total*100);}
  toggle(id:string):void {this.expanded.update(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);}
  isExpanded(id:string):boolean {return this.expanded().includes(id);}
  gradeLabel(answer:ExamAnswer):string {return answer.skipped?'Omitida':answer.grade===null?'Pendiente de autocorrección':answer.grade==='good'?'Correcta':answer.grade==='medium'?'Regular':'Incorrecta';}
  selectedOptions(q:Question,answer:ExamAnswer):string {return answer.selected.map(n=>q.options[n]??'').join(' · ');}
  correctOptions(q:Question):string {return q.correct.map(n=>q.options[n]).join(' · ');}
  retryMissed(result:ExamResult):void {
    if(this.study.hasActiveExam()&&!window.confirm('Tienes otro examen empezado. ¿Descartarlo para practicar estas preguntas?'))return;
    if(this.study.hasActiveExam())this.study.discardActiveExam();
    const ids=result.answers.filter(a=>a.grade!=='good').map(a=>a.questionId);
    if(!ids.length)return;
    const f={...result.config,units:[...result.config.units],count:ids.length,level:'all' as const,source:'all' as const,content:'all' as const,weakOnly:false,withImages:false};
    if(this.study.start(ids,f))void this.router.navigateByUrl('/estudiar');
  }
}
