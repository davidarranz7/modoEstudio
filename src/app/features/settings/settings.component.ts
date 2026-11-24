import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { StudyService } from '../../core/study.service';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { HeaderComponent } from '../../shared/header.component';

@Component({ selector: 'app-settings', standalone: true, imports: [IconComponent,HeaderComponent], templateUrl: './settings.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class SettingsComponent {
  readonly study = inject(StudyService);
  readonly router=inject(Router);
  readonly message = signal('');
  readonly error = signal(false);
  async import(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      this.study.importFile(await file.text());
      this.error.set(false);
      this.message.set('Progreso importado correctamente.');
    } catch {
      this.error.set(true);
      this.message.set('No se ha podido importar el archivo. Debe ser una copia de Estudio.');
    }
  }
  clear(): void {
    if (!window.confirm('¿Borrar todas tus respuestas, favoritas y notas de este dispositivo?')) return;
    this.study.reset();
    this.message.set('Progreso restablecido.');
    this.error.set(false);
  }
}
