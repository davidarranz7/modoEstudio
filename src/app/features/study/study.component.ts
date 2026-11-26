import { PhpScratchpadComponent } from '../../shared/php-scratchpad.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';
import { PhpRunnerComponent } from '../../shared/php-runner.component';
import { ImageViewerComponent } from '../../shared/image-viewer.component';
import { QuestionSourceComponent } from '../../shared/question-source.component';
import { ChangeDetectionStrategy,Component,computed,effect,inject,signal } from '@angular/core';
import { Router } from '@angular/router';
import { StudyService,Grade } from '../../core/study.service';
import { LauncherService } from '../../core/launcher.service';
import { Question, TYPE_NAMES } from '../../core/questions';
import { themeName, findSubject } from '../../core/subjects';
import { IconComponent } from '../../shared/icon.component';
import { HeaderComponent } from '../../shared/header.component';
import { CodeWorkspaceComponent } from '../../shared/code-workspace.component';
import { QuestionReportComponent } from '../../shared/question-report.component';
@Component({selector:'app-exam',standalone:true,imports:[CodeSnippetComponent,PhpScratchpadComponent,ImageViewerComponent,PhpRunnerComponent,QuestionSourceComponent,IconComponent,HeaderComponent,QuestionReportComponent,CodeWorkspaceComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./study.component.html',styleUrl:'./study-editor.component.css'})
export class ExamComponent {
  readonly router=inject(Router);readonly study=inject(StudyService);readonly launcher=inject(LauncherService);
  readonly paused=signal(false);readonly imageOpen=signal(false);
  readonly currentFile=signal('');
  private readonly preparedStarter=signal<{id:string;files:Record<string,string>}|null>(null);
  constructor(){
    effect(onCleanup=>{
      const question=this.study.current();let active=true;onCleanup(()=>{active=false;});
      if(question?.subjectId!=='dwcs'||question.codeTask!=='write'||!question.starterFiles)return;
      const original=question.starterFiles;
      void import('../../core/code-snippet-format').then(({formatSnippet})=>{
        const files=Object.fromEntries(Object.entries(original).map(([name,code])=>[name,formatSnippet(code,name.endsWith('.php')?'PHP':name.endsWith('.html')?'HTML':'CSS')]));
        if(active)this.preparedStarter.set({id:question.id,files});
      }).catch(()=>{if(active)this.preparedStarter.set({id:question.id,files:original});});
    });
  }
  starterReady(question:Question):boolean{return question.subjectId!=='dwcs'||!question.starterFiles||this.preparedStarter()?.id===question.id;}
  returnsValue(question:Question):boolean{return !!question.phpTests?.length&&question.phpTests.every(test=>(test.mode??'return')==='return');}
  isPrediction(question:Question):boolean{return question.subjectId==='dwcs'&&question.kind==='code'&&question.codeTask==='interpret';}
  codeLanguage(code:string):string{return code.includes('<?')||!/^\s*</.test(code)?'PHP':'HTML';}
  referenceCode(question:Question):string{return question.codeTask==='interpret'?question.code:question.solution;}
  referenceFiles(question:Question):Record<string,string>{const starter=question.starterFiles??{},entry=Object.hasOwn(starter,'index.php')?'index.php':Object.keys(starter)[0]??'solucion.php';return {...starter,[entry]:this.referenceCode(question)};}
  runnerFiles(starter?:Record<string,string>):Record<string,string>{const session=this.study.session();return starter?{...(session?.files??{}),...Object.fromEntries(Object.keys(starter).map(name=>[name,this.codeFor(name,starter)]))}:{'solucion.php':session?.draft??''};}
  files(starter:Record<string,string>):string[]{return Object.keys(starter);}
  chooseFile(name:string):void {this.currentFile.set(name);}
  activeFile(starter:Record<string,string>):string {return Object.hasOwn(starter,this.currentFile())?this.currentFile():Object.keys(starter)[0]??'solucion.php';}
  codeFor(name:string,starter:Record<string,string>):string {
    const saved=this.study.session()?.files?.[name],original=starter[name]??'',prepared=this.preparedStarter();
    if(saved!==undefined&&saved!==original)return saved;
    return prepared?.id===this.study.current()?.id?prepared?.files[name]??original:original;
  }readonly typeNames=TYPE_NAMES;readonly themeName=themeName;readonly findSubject=findSubject;
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
