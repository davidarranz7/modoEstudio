import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QUESTIONS, TYPE_NAMES } from '../../core/questions';
import { SUBJECTS, findSubject } from '../../core/subjects';
import { StudyService } from '../../core/study.service';
import { IconComponent } from '../../shared/icon.component';
import { HeaderComponent } from '../../shared/header.component';

@Component({selector:'app-library',standalone:true,imports:[IconComponent,HeaderComponent],templateUrl:'./library.component.html',changeDetection:ChangeDetectionStrategy.OnPush})
export class LibraryComponent {
  readonly study = inject(StudyService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly subjects = SUBJECTS;
  readonly search = signal('');
  readonly subjectId = signal(this.route.snapshot.queryParamMap.get('asignatura') ?? 'all');
  readonly unit = signal(Number(this.route.snapshot.queryParamMap.get('tema')) || 0);
  readonly currentSubject = computed(() => findSubject(this.subjectId()));
  readonly kind = signal('all');
  readonly view = signal<'all'|'weak'|'new'|'stars'|'images'|'activities'>('all');
  readonly limit = signal(24);
  readonly total = QUESTIONS.length;
  readonly TYPE_NAMES = TYPE_NAMES;
  readonly filtered = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('es');
    return QUESTIONS.filter(q => {
      const record = this.study.record(q.id);
      if (this.subjectId() !== 'all' && q.subjectId !== this.subjectId()) return false;
      if (this.unit() && this.unit() !== q.unit) return false;
      if (this.kind() !== 'all' && this.kind() !== q.kind && !(q.kind === 'code' && this.kind() === q.codeTask)) return false;
      if ((this.kind() === 'interpret' || this.kind() === 'write') && q.codeTask !== this.kind()) return false;
      if (query && ![q.prompt, q.solution, q.code, q.activity ?? '', TYPE_NAMES[q.kind]].join(' ').toLocaleLowerCase('es').includes(query)) return false;
      if (this.view() === 'weak' && !['bad', 'medium'].includes(record.lastGrade ?? '')) return false;
      if (this.view() === 'new' && record.seen) return false;
      if (this.view() === 'stars' && !record.starred) return false;
      if (this.view() === 'images' && !q.image) return false;
      if (this.view() === 'activities' && !q.activity) return false;
      return true;
    });
  });
  readonly visible = computed(() => this.filtered().slice(0, this.limit()));
  open(id: string): void {
    if (this.study.hasActiveExam() && !window.confirm('Al abrir esta pregunta perderás el examen que tienes en curso. ¿Quieres continuar?')) return;
    const question = QUESTIONS.find(q => q.id === id);
    if (!question) return;
    this.study.selectSubject(question.subjectId);
    this.study.updateFilters({units:[question.unit],mode:question.kind==='code'?question.codeTask??'code':question.kind,level:'all',source:'all',content:'all',weakOnly:false,withImages:false,count:1});
    if (this.study.hasActiveExam()) this.study.discardActiveExam();
    else this.study.abandon();
    if (this.study.start([id])) void this.router.navigate(['/estudiar']);
  }
  chooseSubject(v: string): void { this.subjectId.set(v); this.unit.set(0); this.limit.set(24); }
  chooseUnit(v: number): void { this.unit.set(v); this.limit.set(24); }
  chooseView(v: 'all'|'weak'|'new'|'stars'|'images'|'activities'): void { this.view.set(v); this.limit.set(24); }
}
