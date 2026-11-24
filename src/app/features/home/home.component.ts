import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QUESTIONS } from '../../core/questions';
import { SUBJECTS, Subject } from '../../core/subjects';
import { StudyService } from '../../core/study.service';
import { LauncherService } from '../../core/launcher.service';
import { IconComponent } from '../../shared/icon.component';

@Component({selector:'app-home',standalone:true,imports:[IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./home.component.html'})
export class HomeComponent {
  readonly router = inject(Router);
  readonly study = inject(StudyService);
  readonly launcher = inject(LauncherService);
  readonly subjects = SUBJECTS;
  readonly total = QUESTIONS.length;
  readonly latestExam = computed(() => this.study.results()[0] ?? null);
  readonly recentAccuracy = computed(() => { const r=this.latestExam();return r?Math.round(r.good/Math.max(1,r.total)*100):0; });
  readonly today = computed(() => Object.values(this.study.records()).filter(r => r.lastDate && new Date(r.lastDate).toDateString() === new Date().toDateString()).length);
  readonly todayGood = computed(() => Object.values(this.study.records()).filter(r => r.lastGrade === 'good' && r.lastDate && new Date(r.lastDate).toDateString() === new Date().toDateString()).length);
  readonly accuracy = computed(() => { const t = this.study.gradeTotals();return t.good + t.bad + t.medium ? Math.round(t.good / (t.good + t.bad + t.medium) * 100) : 0; });
  readonly ring = computed(() => `${Math.min(this.today()/10,1)*360}deg`);
  readonly greeting = computed(() => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'; });
  count(subject: Subject): number { return QUESTIONS.filter(q => q.subjectId === subject.id).length; }
  seenSubject(subject: Subject): number { return QUESTIONS.filter(q => q.subjectId === subject.id && this.study.record(q.id).seen > 0).length; }
  pctSubject(subject: Subject): number { return Math.round(this.seenSubject(subject) / Math.max(1, this.count(subject)) * 100); }
  continueExam(): void { if (this.study.hasActiveExam()) void this.router.navigateByUrl('/estudiar'); }
  createSimulation(): void { this.launcher.open(); }
  discardExam(): void {
    if (!this.study.hasActiveExam()) return;
    if (!window.confirm('¿Descartar este examen? Se perderán sus respuestas y se retirarán sus resultados de las estadísticas. No se borrarán exámenes anteriores.')) return;
    this.study.discardActiveExam();
  }
  openSubject(id: string): void { void this.router.navigate(['/asignaturas', id, 'temas']); }
}
