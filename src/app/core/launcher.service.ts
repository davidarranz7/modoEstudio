import { Injectable, inject, signal } from '@angular/core';
import { ExamMode, StudyService } from './study.service';
import { findSubject } from './subjects';

@Injectable({ providedIn: 'root' })
export class LauncherService {
  readonly opened = signal(false);
  private readonly study = inject(StudyService);

  open(subjectId?: string, unit?: number, mode?: ExamMode): void {
    if (subjectId) this.study.selectSubject(subjectId);
    if (unit !== undefined) this.study.updateFilters({ units: [unit] });
    if (mode) this.study.updateFilters({ mode });
    this.opened.set(true);
  }
  close(): void { this.opened.set(false); }
}
