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
  readonly advanced = signal(false);
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
    {id:'write',label:'Escribir código o configuración'},
    {id:'interpret',label:'Interpretar código o configuración'},
    {id:'match',label:'Relacionar conceptos'}, {id:'order',label:'Ordenar pasos'}
  ];
  readonly basicModes: {id:string; label:string; description:string; icon:IconName}[] = [
    {id:'test',label:'Test',description:'Elegir opciones',icon:'check'},
    {id:'written',label:'Escribir',description:'Breves y desarrollo',icon:'layers'},
    {id:'code',label:'Código',description:'Programar e interpretar',icon:'code'},
    {id:'practices',label:'Prácticas',description:'Ejercicios de clase',icon:'play'},
    {id:'mixed',label:'Mixto',description:'Un poco de todo',icon:'refresh'}
  ];
  readonly selectedBasicMode = computed(() => {
    const f = this.study.filters();
    if (f.content === 'activities' && f.mode === 'mixed') return 'practices';
    if (f.content === 'all' && ['test','written','code','mixed'].includes(f.mode)) return f.mode;
    return 'custom';
  });
  readonly allThemesSelected = computed(() => this.study.filters().units.length === this.activeSubject().themes.length);
  readonly sections = computed(() => [...new Set(this.study.questions().filter(q=>q.subjectId===this.study.filters().subjectId&&this.study.filters().units.includes(q.unit)).map(q=>q.section).filter((v):v is string=>!!v))].sort((a,b)=>a.localeCompare(b,'es',{numeric:true})));
  includedCount():number {return this.study.filters().count===0?this.study.filtered().length:Math.min(this.study.filters().count,this.study.filtered().length);}
  modesLabel(): string { return this.modes.find(m => m.id === this.study.filters().mode)?.label ?? 'Mixto'; }
  closeLauncher(): void { this.launcher.close(); this.advanced.set(false); this.error.set(''); }
  start(): void {
    if (!this.study.filtered().length) { this.error.set('No existen preguntas con esta combinación. Cambia los filtros.'); return; }
    if (this.study.hasActiveExam() && !window.confirm('Se descartará el examen en curso y se retirarán sus resultados de las estadísticas. ¿Crear un simulacro nuevo?')) return;
    if (this.study.hasActiveExam()) this.study.discardActiveExam();
    if (!this.study.start()) { this.error.set('No hay preguntas para este simulacro.'); return; }
    this.launcher.close();
    this.advanced.set(false);
    this.error.set('');
    void this.router.navigateByUrl('/estudiar');
  }
  setBasicMode(value: string): void {
    if (value === 'practices') this.study.updateFilters({mode:'mixed',content:'activities'});
    else if (['test','written','code','mixed'].includes(value)) this.study.updateFilters({mode:value as ExamMode,content:'all'});
  }
  setAllThemes(): void { this.study.updateFilters({units:this.activeSubject().themes.map(t=>t.id)}); }
  selectTheme(unit: number): void {
    const selected = this.study.filters().units;
    const all = this.activeSubject().themes.map(t=>t.id);
    if (selected.length === all.length) this.study.updateFilters({units:[unit]});
    else if (selected.includes(unit)) { if (selected.length > 1) this.study.updateFilters({units:selected.filter(u=>u!==unit)}); }
    else this.study.updateFilters({units:[...selected,unit].sort((a,b)=>a-b)});
  }
  setLevel(v: string): void { this.study.updateFilters({level:v as 'all'|'medio'|'alto'}); }
  setMode(v: string): void { this.study.updateFilters({mode:v as ExamMode}); }
  setCount(v: string): void { this.study.updateFilters({count:Number(v)}); }
  setSource(v: string): void { this.study.updateFilters({source:v as 'all'|'audio'|'temario'}); }
  setContent(v: string): void { this.study.updateFilters({content:v as 'all'|'theory'|'activities'}); }
  selectSubject(v: string): void { this.study.selectSubject(v); this.error.set(''); }
  toggleAdvanced(): void { this.advanced.update(v=>!v); }
}
