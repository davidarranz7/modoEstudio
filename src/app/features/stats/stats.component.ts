import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QUESTIONS } from '../../core/questions';
import { DEFAULT_SUBJECT_ID, findSubject, SUBJECTS } from '../../core/subjects';
import { StudyService } from '../../core/study.service';
import { IconComponent } from '../../shared/icon.component';
import { HeaderComponent } from '../../shared/header.component';

@Component({selector:'app-stats',standalone:true,imports:[IconComponent,HeaderComponent],templateUrl:'./stats.component.html',changeDetection:ChangeDetectionStrategy.OnPush})
export class StatsComponent {
  readonly router = inject(Router);
  readonly study = inject(StudyService);
  readonly subjects = SUBJECTS;
  readonly selectedSubject = signal(DEFAULT_SUBJECT_ID);
  readonly currentSubject = computed(() => findSubject(this.selectedSubject()));
  readonly subjectQuestions = computed(() => QUESTIONS.filter(q => q.subjectId === this.selectedSubject()));
  readonly totals = computed(() => this.subjectQuestions().reduce((acc,q) => {
    const record = this.study.record(q.id);
    return { good: acc.good+record.good, medium: acc.medium+record.medium, bad: acc.bad+record.bad, reviewed: acc.reviewed+record.seen };
  }, {good:0,medium:0,bad:0,reviewed:0}));
  readonly accuracy = computed(() => { const t = this.totals(); return t.good+t.medium+t.bad ? Math.round(t.good/(t.good+t.medium+t.bad)*100) : 0; });
  readonly subjectWeak = computed(() => this.subjectQuestions().filter(q => ['bad','medium'].includes(this.study.record(q.id).lastGrade ?? '')).length);
  readonly byUnit = computed(() => (this.currentSubject()?.themes ?? []).map(theme => {
    const q = QUESTIONS.filter(x => x.subjectId === this.selectedSubject() && x.unit === theme.id);
    const seen = q.filter(x => this.study.record(x.id).seen).length;
    const weak = q.filter(x => ['bad','medium'].includes(this.study.record(x.id).lastGrade ?? '')).length;
    return {unit:theme.id,name:theme.name,total:q.length,seen,weak,pct:Math.round(seen/Math.max(1,q.length)*100)};
  }));
  reviewWeak(): void {
    if (this.study.hasActiveExam() && !window.confirm('¿Descartar el examen actual para repasar las preguntas falladas?')) return;
    if (this.study.hasActiveExam()) this.study.discardActiveExam();
    if (this.study.startQuick(this.selectedSubject(), this.currentSubject()?.themes.map(t=>t.id) ?? [], 'mixed', true)) void this.router.navigateByUrl('/estudiar');
  }
}
