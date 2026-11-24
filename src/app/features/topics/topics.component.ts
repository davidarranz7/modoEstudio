import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QUESTIONS } from '../../core/questions';
import { findSubject, Theme } from '../../core/subjects';
import { StudyService } from '../../core/study.service';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';

@Component({selector:'app-topics',standalone:true,imports:[HeaderComponent,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./topics.component.html'})
export class TopicsComponent {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly study = inject(StudyService);
  readonly subjectId = this.route.snapshot.paramMap.get('subjectId') ?? '';
  readonly subject = findSubject(this.subjectId);
  readonly cards = QUESTIONS.filter(q => q.subjectId === this.subjectId);
  readonly seen = computed(() => this.cards.filter(q => this.study.record(q.id).seen > 0).length);
  readonly percent = computed(() => Math.round(this.seen() / Math.max(1, this.cards.length) * 100));
  count(unit: number): number { return this.cards.filter(q => q.unit === unit).length; }
  seenTheme(unit: number): number { return this.cards.filter(q => q.unit === unit && this.study.record(q.id).seen > 0).length; }
  openTheme(theme: Theme): void { void this.router.navigate(['/asignaturas', this.subjectId, 'temas', theme.id]); }
  openExam(): void {
    if (!this.subject) return;
    if (this.study.hasActiveExam() && !window.confirm('Ya tienes un examen en curso. ¿Descartarlo para empezar esta práctica? Se retirarán sus resultados.')) return;
    if (this.study.hasActiveExam()) this.study.discardActiveExam();
    if (this.study.startQuick(this.subjectId, this.subject.themes.map(t=>t.id), 'mixed')) void this.router.navigateByUrl('/estudiar');
  }
}
