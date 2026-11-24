import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { ExamMode, StudyService } from './core/study.service';
import { DEFAULT_SUBJECT_ID, findSubject, SUBJECTS } from './core/subjects';
import { LauncherService } from './core/launcher.service';
import { IconComponent, IconName } from './shared/icon.component';

@Component({selector:'app-root',standalone:true,imports:[RouterLink,RouterLinkActive,RouterOutlet,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./app.component.html'})
export class AppComponent {
  readonly router = inject(Router);
  readonly study = inject(StudyService);
  readonly launcher = inject(LauncherService);
  readonly opened = this.launcher.opened;
  readonly error = signal('');
  readonly subjects = SUBJECTS;
  readonly activeSubject = computed(() => findSubject(this.study.filters().subjectId) ?? findSubject(DEFAULT_SUBJECT_ID)!);
  readonly navItems: {url:string;label:string;icon:IconName}[] = [
    {url:'/inicio',label:'Inicio',icon:'home'},
    {url:'/asignaturas',label:'Asignaturas',icon:'layers'},
    {url:'/examenes',label:'Exámenes',icon:'chart'},
    {url:'/perfil',label:'Perfil',icon:'settings'}
  ];
  readonly currentPath = toSignal(this.router.events.pipe(filter((event:unknown):event is NavigationEnd => event instanceof NavigationEnd),map((event:NavigationEnd) => event.urlAfterRedirects),startWith(this.router.url)),{initialValue:this.router.url});
  readonly studyScreen = computed(() => this.currentPath().startsWith('/estudiar') && this.study.hasActiveExam());
  readonly modes: {id:ExamMode;label:string}[] = [
    {id:'mixed',label:'Mixto · todos los tipos'},
    {id:'test',label:'Solo test'},
    {id:'single',label:'Test · una respuesta'},
    {id:'multi',label:'Test · varias respuestas'},
    {id:'written',label:'Todas las escritas'},
    {id:'short',label:'Respuestas breves'},
    {id:'develop',label:'Desarrollo'},
    {id:'code',label:'Código · todos'},
    {id:'write',label:'Escribir código PHP'},
    {id:'interpret',label:'Interpretar código PHP'}
  ];
  includedCount():number {return this.study.filters().count===0?this.study.filtered().length:Math.min(this.study.filters().count,this.study.filtered().length);}
  modesLabel(): string { return this.modes.find(m => m.id === this.study.filters().mode)?.label ?? 'Mixto'; }
  closeLauncher(): void { this.launcher.close(); }
  start(): void {
    if (!this.study.filtered().length) { this.error.set('No existen preguntas con esta combinación. Cambia los filtros.'); return; }
    if (this.study.hasActiveExam() && !window.confirm('Se descartará el examen en curso y se retirarán sus resultados de las estadísticas. ¿Crear un simulacro nuevo?')) return;
    if (this.study.hasActiveExam()) this.study.discardActiveExam();
    if (!this.study.start()) { this.error.set('No hay preguntas para este simulacro.'); return; }
    this.launcher.close();
    this.error.set('');
    void this.router.navigateByUrl('/estudiar');
  }
  setLevel(v: string): void { this.study.updateFilters({level:v as 'all'|'medio'|'alto'}); }
  setMode(v: string): void { this.study.updateFilters({mode:v as ExamMode}); }
  setCount(v: string): void { this.study.updateFilters({count:Number(v)}); }
  setSource(v: string): void { this.study.updateFilters({source:v as 'all'|'audio'|'temario'}); }
  setContent(v: string): void { this.study.updateFilters({content:v as 'all'|'theory'|'activities'}); }
  selectSubject(v: string): void { this.study.selectSubject(v); this.error.set(''); }
}
