import { PhpRunnerComponent } from '../../shared/php-runner.component';
import { ImageViewerComponent } from '../../shared/image-viewer.component';
import { QuestionSourceComponent } from '../../shared/question-source.component';
import { ChangeDetectionStrategy,Component,computed,inject,signal } from '@angular/core';
import { Router } from '@angular/router';
import { StudyService,Grade } from '../../core/study.service';
import { LauncherService } from '../../core/launcher.service';
import { TYPE_NAMES } from '../../core/questions';
import { themeName, findSubject } from '../../core/subjects';
import { IconComponent } from '../../shared/icon.component';
import { HeaderComponent } from '../../shared/header.component';
import { CodeWorkspaceComponent } from '../../shared/code-workspace.component';
import { QuestionReportComponent } from '../../shared/question-report.component';
@Component({selector:'app-exam',standalone:true,imports:[ImageViewerComponent,PhpRunnerComponent,QuestionSourceComponent,IconComponent,HeaderComponent,QuestionReportComponent,CodeWorkspaceComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./study.component.html'})
export class ExamComponent {
  readonly router=inject(Router);readonly study=inject(StudyService);readonly launcher=inject(LauncherService);
  readonly paused=signal(false);readonly imageOpen=signal(false);
  readonly currentFile=signal('');
  runnerFiles(starter?:Record<string,string>):Record<string,string>{const session=this.study.session();return starter?{...starter,...(session?.files??{})}:{'solucion.php':session?.draft??''};}
  files(starter:Record<string,string>):string[]{return Object.keys(starter);}
  chooseFile(name:string):void {this.currentFile.set(name);}
  activeFile(starter:Record<string,string>):string {return Object.hasOwn(starter,this.currentFile())?this.currentFile():Object.keys(starter)[0]??'solucion.php';}
  codeFor(name:string,starter:Record<string,string>):string {return this.study.session()?.files?.[name]??starter[name]??'';}readonly typeNames=TYPE_NAMES;readonly themeName=themeName;readonly findSubject=findSubject;
  readonly position=computed(()=>Math.min((this.study.session()?.pointer??0)+1,this.study.session()?.ids.length??0));
  readonly total=computed(()=>this.study.session()?.ids.length??0);
  readonly progressPct=computed(()=>Math.round(this.position()*100/Math.max(1,this.total())));
  readonly openAnswer=computed(()=>{const q=this.study.current();return q?.kind==='short'||q?.kind==='develop'||q?.kind==='code';});
  isCorrect(index:number){return this.study.current()?.correct.includes(index)??false;}
  goHome(){this.paused.set(false);void this.router.navigateByUrl('/inicio');}
  grade(g:Grade){this.study.grade(g);}
  revealAnswer(){
    this.study.reveal();
    setTimeout(() => document.querySelector('.answer')?.scrollIntoView({behavior:'smooth',block:'nearest'}), 60);
  }
  next(){this.study.next();window.scrollTo({top:0,behavior:'instant'});}
  skip(){this.study.skip();window.scrollTo({top:0,behavior:'instant'});}
  togglePause(){this.paused.update(v=>!v);}
  finalAccuracy():number {const s=this.study.session();return s?Math.round(s.good/s.ids.length*100):0;}
  viewResult():void {const id=this.study.session()?.resultId;if(id)void this.router.navigate(['/examenes',id]);else void this.router.navigateByUrl('/examenes');}
  restart(){this.study.abandon();this.goHome();this.launcher.open();}
  discardExam(): void {
    if (!window.confirm('¿Eliminar el examen en curso y sus respuestas? Esto no borrará tus resultados anteriores ni tus favoritas.')) return;
    this.study.discardActiveExam();
    this.goHome();
  }
}
