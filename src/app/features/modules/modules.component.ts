import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SUBJECTS, Subject } from '../../core/subjects';
import { IconComponent } from '../../shared/icon.component';
import { StudyService } from '../../core/study.service';
import { HeaderComponent } from '../../shared/header.component';

@Component({selector:'app-modules',standalone:true,imports:[IconComponent,HeaderComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./modules.component.html'})
export class ModulesComponent {
  readonly router = inject(Router);
  readonly study = inject(StudyService);
  readonly subjects = SUBJECTS;
  count(subject: Subject): number { return this.study.questions().filter(q => q.subjectId === subject.id).length; }
  open(id: string): void { void this.router.navigate(['/asignaturas', id, 'temas']); }
}
