import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StudyService, ExamMode } from '../../core/study.service';
import { LauncherService } from '../../core/launcher.service';
import { QUESTIONS } from '../../core/questions';
import { SUBJECTS, themeName } from '../../core/subjects';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';

const MODE_LABEL: Record<ExamMode,string> = {
  mixed:'Mixto', test:'Tipo test', single:'Test de una respuesta', multi:'Test de varias respuestas',
  written:'Preguntas escritas', short:'Breves', develop:'Desarrollo', code:'Código',
  write:'Escribir PHP', interpret:'Interpretar PHP'
};
@Component({selector:'app-exams',standalone:true,imports:[HeaderComponent,IconComponent],templateUrl:'./exams.component.html',changeDetection:ChangeDetectionStrategy.OnPush})
export class ExamsComponent {
  readonly router = inject(Router);
  readonly study = inject(StudyService);
  readonly launcher = inject(LauncherService);
  readonly subjects = SUBJECTS;
  readonly modes = MODE_LABEL;
  readonly count = QUESTIONS.length;
  readonly recent = computed(()=>this.study.results().slice(0,20));
  readonly latest = computed(()=>this.study.results()[0] ?? null);
  readonly themeName=themeName;
  subjectName(id:string):string { return this.subjects.find(s=>s.id===id)?.name ?? id; }
  accuracy(good:number,total:number):number {return Math.round(100*good/Math.max(total,1));}
  formatDate(date:string):string {return new Date(date).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'});}
  create():void {this.launcher.open();}
  resume():void {void this.router.navigateByUrl('/estudiar');}
  details(id:string):void {void this.router.navigate(['/examenes',id]);}
  discard():void {
    if (!window.confirm('¿Descartar este examen? Se retirarán solamente las respuestas de este intento, sin tocar los resultados anteriores.')) return;
    this.study.discardActiveExam();
  }
}
