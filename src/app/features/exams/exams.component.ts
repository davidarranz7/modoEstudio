import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StudyService, ExamMode } from '../../core/study.service';
import { LauncherService } from '../../core/launcher.service';
import { SUBJECTS, themeName } from '../../core/subjects';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';

const MODE_LABEL: Record<ExamMode,string> = {
  mixed:'Mixto', test:'Tipo test', single:'Test de una respuesta', multi:'Test de varias respuestas',
  written:'Preguntas escritas', short:'Breves', develop:'Desarrollo', code:'Código',
  write:'Escribir PHP', interpret:'Interpretar PHP',match:'Relacionar',order:'Ordenar'
};
@Component({selector:'app-exams',standalone:true,imports:[HeaderComponent,IconComponent],templateUrl:'./exams.component.html',changeDetection:ChangeDetectionStrategy.OnPush})
export class ExamsComponent {
  readonly router = inject(Router);
  readonly study = inject(StudyService);
  readonly launcher = inject(LauncherService);
  readonly subjects = SUBJECTS;
  readonly modes = MODE_LABEL;
  readonly count = computed(() => this.study.questions().length);
  readonly recent = computed(()=>this.study.results().slice(0,20));
  readonly latest = computed(()=>this.study.results()[0] ?? null);
  readonly themeName=themeName;
  subjectName(id:string):string { return this.subjects.find(s=>s.id===id)?.name ?? id; }
  accuracy(good:number,total:number):number {return Math.round(100*good/Math.max(total,1));}
  formatDate(date:string):string {return new Date(date).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'});}
  readonly presets = [
    {id:'ud1',label:'UD1 · Prueba teórica',description:'Conceptos, relaciones y explicaciones sobre arquitectura y tecnologías web',count:15},
    {id:'ud2',label:'UD2 · Prueba práctica',description:'Escribir, interpretar y razonar código PHP',count:12},
    {id:'ud3t',label:'UD3 · Prueba teórica',description:'HTTP sin estado, cookies, sesiones y mecanismos de autenticación',count:15},
    {id:'ud3p',label:'UD3 · Prueba práctica',description:'Cookies, sesiones, login, redirecciones y protección de páginas',count:12},
    {id:'global',label:'Evaluación completa',description:'Preguntas de las tres unidades, con modalidades combinadas',count:30}
  ];
  startPreset(id:string):void {
    if(this.study.hasActiveExam()&&!window.confirm('Ya tienes un examen pendiente. ¿Descartarlo para comenzar otro?'))return;
    if(this.study.hasActiveExam())this.study.discardActiveExam();
    const units=id==='global'?[1,2,3]:[id==='ud1'?1:id==='ud2'?2:3];
    const config={...this.study.filters(),subjectId:'dwcs',units,mode:'mixed' as const,count:this.presets.find(p=>p.id===id)?.count??10,level:'all' as const,source:'all' as const,content:'all' as const,weakOnly:false,strict:true,withImages:false};
    let pool=this.study.questions().filter(q=>q.subjectId==='dwcs'&&units.includes(q.unit));
    if(id==='ud1'||id==='ud3t')pool=pool.filter(q=>q.kind==='single'||q.kind==='multi'||q.kind==='short'||q.kind==='develop'||q.kind==='match'||q.kind==='order');
    if(id==='ud2')pool=pool.filter(q=>q.kind==='code'||q.kind==='develop'||q.kind==='match'||q.kind==='order');
    if(id==='ud3p')pool=pool.filter(q=>q.kind==='code'||!!q.activity);
    pool=pool.filter(q=>!this.study.reports()[q.id]?.reasons?.length);
    const ids=[...pool].sort(()=>Math.random()-0.5).slice(0,config.count).map(q=>q.id);
    if(this.study.start(ids,config))void this.router.navigateByUrl('/estudiar');
  }
  create():void {this.launcher.open();}
  resume():void {void this.router.navigateByUrl('/estudiar');}
  details(id:string):void {void this.router.navigate(['/examenes',id]);}
  discard():void {
    if (!window.confirm('¿Descartar este examen? Se retirarán solamente las respuestas de este intento, sin tocar los resultados anteriores.')) return;
    this.study.discardActiveExam();
  }
}
