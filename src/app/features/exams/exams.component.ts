import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StudyService, ExamMode } from '../../core/study.service';
import { LauncherService } from '../../core/launcher.service';
import { SUBJECTS, themeName } from '../../core/subjects';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';
import { selectQuestions } from '../../core/question-selection';
import { DWCS_EXAM_GUIDANCE } from '../../core/exam-priority';

const MODE_LABEL: Record<ExamMode,string> = {
  mixed:'Mixto', test:'Tipo test', single:'Test de una respuesta', multi:'Test de varias respuestas',
  written:'Preguntas escritas', short:'Breves', develop:'Desarrollo', code:'Código',
  write:'Escribir código', interpret:'Interpretar código',match:'Relacionar',order:'Ordenar'
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
  readonly guidance=DWCS_EXAM_GUIDANCE;
  readonly sections=computed(()=>[...new Set(this.study.questions().filter(q=>q.subjectId===this.study.filters().subjectId&&this.study.filters().units.includes(q.unit)).map(q=>q.section).filter((section):section is string=>!!section))].sort((a,b)=>a.localeCompare(b,'es',{numeric:true})));
  subjectName(id:string):string { return this.subjects.find(s=>s.id===id)?.name ?? id; }
  accuracy(good:number,total:number):number {return Math.round(100*good/Math.max(total,1));}
  formatDate(date:string):string {return new Date(date).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'});}
  readonly presets = [
    {id:'ud1',label:'DWCS · UD1 teórica',description:'Conceptos, relaciones y explicaciones sobre arquitectura y tecnologías web',count:15},
    {id:'ud2',label:'DWCS · UD2 práctica',description:'Proyectos PHP completos con formularios, arrays y funciones',count:0},
    {id:'ud3t',label:'DWCS · UD3 teórica',description:'HTTP sin estado, cookies, sesiones y mecanismos de autenticación',count:15},
    {id:'ud3p',label:'DWCS · UD3 práctica',description:'Proyectos con cookies, sesiones, JSON, login y roles',count:0},
    {id:'global',label:'DWCS · Repaso escrito combinado',description:'Preguntas de las tres unidades; completa la preparación con proyectos prácticos',count:30},
    {id:'dep1',label:'Despregamento · UD1 teórica',description:'Arquitecturas web, virtualización, contenedores y servidores',count:15},
    {id:'dep2',label:'Despregamento · UD2 teoría y configuración',description:'Apache, VirtualHosts, directivas, HTTPS, logs y LDAP',count:18},
    {id:'depall',label:'Despregamento · Evaluación mixta',description:'Preguntas de las UD1 y UD2, con test y prácticas',count:25}
  ];
  startPreset(id:string):void {
    if(id==='ud2'||id==='ud3p'){void this.router.navigate(['/laboratorio'],{queryParams:{unit:id==='ud2'?2:3,exam:1}});return;}
    if(this.study.hasActiveExam()&&!window.confirm('Ya tienes un examen pendiente. ¿Descartarlo para comenzar otro?'))return;
    if(this.study.hasActiveExam())this.study.discardActiveExam();
    const deploy=id.startsWith('dep');
    const subjectId=deploy?'despregamento':'dwcs';
    const units=deploy?(id==='depall'?[1,2]:[id==='dep1'?1:2]):(id==='global'?[1,2,3]:[id==='ud1'?1:id==='ud2'?2:3]);
    const config={...this.study.filters(),subjectId,units,mode:'mixed' as const,count:this.presets.find(p=>p.id===id)?.count??10,level:'all' as const,source:'all' as const,content:'all' as const,weakOnly:false,strict:true,withImages:false,preparation:deploy?'general' as const:'exam' as const,priorityShare:this.study.filters().priorityShare??70,section:'all',pendingOnly:false};
    let pool=this.study.questions().filter(q=>q.subjectId===subjectId&&units.includes(q.unit));
    if(id==='ud1'||id==='ud3t'||id==='dep1')pool=pool.filter(q=>q.kind==='single'||q.kind==='multi'||q.kind==='short'||q.kind==='develop'||q.kind==='match'||q.kind==='order');
    if(id==='ud2')pool=pool.filter(q=>q.kind==='code'||q.kind==='develop'||q.kind==='match'||q.kind==='order');
    if(id==='ud3p')pool=pool.filter(q=>q.kind==='code'||!!q.activity);
    pool=pool.filter(q=>!this.study.reports()[q.id]?.reasons?.length);
    const ids=selectQuestions(pool,config.count,this.study.records(),config).map(q=>q.id);
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
