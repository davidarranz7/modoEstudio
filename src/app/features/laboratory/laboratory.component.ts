import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, ViewChild, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';
import { CodeWorkspaceComponent } from '../../shared/code-workspace.component';
import { PHP_PROJECTS } from '../../data/php-projects';
import { PhpProject } from '../../core/php-project';
import { PhpDiagnostic, PhpResponse, PhpRuntimeService } from '../../core/php-runtime.service';
import { PhpPreviewService } from '../../core/php-preview.service';
import { PhpCheckService, ProjectCheckResult } from '../../core/php-check.service';
import { EditorSnapshot } from '../../core/editor-state';
import { ProjectAttempt, ProjectStorageService, ProjectWork, download, safeProjectPath, projectPathConflict } from '../../core/project-storage.service';
import { ProjectTreeNode, deleteProjectPath, renameProjectPath } from '../../core/project-files';
import { projectZip } from '../../core/project-zip';
import { FileExplorerComponent } from './file-explorer.component';
import { ProjectDialog, ProjectDialogComponent } from './project-dialog.component';
import { PhpResultComponent } from '../../shared/php-result.component';

interface HttpSnapshot {method:string;url:string;get:string;post:unknown;requestHeaders:Record<string,string>;status:number;headers:Record<string,string[]>;cookies:Record<string,string>;session:unknown;body:string;stderr:string;}
type LabTab='statement'|'editor'|'preview'|'http'|'check'|'solution';
type ResultTab='preview'|'console'|'problems'|'http'|'check';
interface FileOperation {kind:'createFile'|'createFolder'|'rename'|'delete'|'restore';path:string;folder:boolean;}

@Component({selector:'app-laboratory',standalone:true,
 imports:[HeaderComponent,IconComponent,CodeWorkspaceComponent,FileExplorerComponent,ProjectDialogComponent,PhpResultComponent],
 providers:[PhpRuntimeService,PhpPreviewService,PhpCheckService],
 host:{'[class.lab-workspace-open]':'!!project()'},
 encapsulation:ViewEncapsulation.None,styleUrl:'./laboratory.component.css',changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./laboratory.component.html'})
export class LaboratoryComponent implements OnDestroy {
 readonly storage=inject(ProjectStorageService);readonly runtime=inject(PhpRuntimeService);readonly previewService=inject(PhpPreviewService);readonly checker=inject(PhpCheckService);
 private route=inject(ActivatedRoute);private sanitizer=inject(DomSanitizer);
 readonly unit=signal(Number(this.route.snapshot.queryParamMap.get('unit'))||0);readonly search=signal('');readonly project=signal<PhpProject|null>(null);readonly work=signal<ProjectWork|null>(null);
 readonly tab=signal<LabTab>('statement');readonly resultTab=signal<ResultTab>('preview');readonly resultsOpen=signal(false);readonly explorerOpen=signal(false);readonly menuOpen=signal(false);
 readonly exam=signal(this.route.snapshot.queryParamMap.get('exam')==='1');readonly submitted=signal(false);readonly hint=signal(0);readonly busy=signal(false);
 readonly message=signal('');readonly error=signal('');readonly address=signal('/index.php');readonly preview=signal<SafeHtml|null>(null);readonly log=signal<HttpSnapshot[]>([]);readonly checks=signal<ProjectCheckResult[]>([]);
 readonly lastRun=signal<PhpResponse|null>(null);readonly diagnostics=signal<PhpDiagnostic[]>([]);readonly executionState=signal<'idle'|'running'|'done'|'cancelled'|'timeout'|'failed'>('idle');
 readonly revision=signal(0);readonly executionRevision=signal(-1);readonly checkRevision=signal(-1);readonly navigateTo=signal<{line:number;column?:number;revision?:number}|undefined>(undefined);
 readonly dialog=signal<ProjectDialog|null>(null);readonly contextNode=signal<ProjectTreeNode|null>(null);readonly viewportHeight=signal(window.visualViewport?.height??window.innerHeight);readonly viewportTop=signal(window.visualViewport?.offsetTop??0);
 readonly visibleProjects=computed(()=>PHP_PROJECTS.filter(p=>(!this.unit()||p.unit===this.unit())&&`${p.title} ${p.skills.join(' ')}`.toLowerCase().includes(this.search().toLowerCase())));
 readonly canReview=computed(()=>!this.exam()||this.submitted());readonly activeCode=computed(()=>this.work()?.files[this.work()!.activeFile]??'');
 readonly filePaths=computed(()=>{const paths=Object.keys(this.work()?.files??{}),entry=this.project()?.entry;return entry&&paths.includes(entry)?[entry,...paths.filter(path=>path!==entry)]:paths;});
 readonly resultStale=computed(()=>this.lastRun()!==null&&this.executionRevision()!==this.revision());readonly checkStale=computed(()=>this.checks().length>0&&this.checkRevision()!==this.revision());
 readonly editorProblems=computed(()=>this.diagnostics().map(item=>({file:item.file,line:item.line??1,severity:item.severity==='notice'?'info' as const:item.severity,message:item.message})));
 readonly tabs:{id:LabTab;label:string}[]=[{id:'statement',label:'Enunciado'},{id:'editor',label:'Código'},{id:'preview',label:'Resultados'},{id:'check',label:'Corrección'},{id:'solution',label:'Solución'}];
 @ViewChild(PhpResultComponent) resultPanel?:PhpResultComponent;
 @ViewChild('results',{read:ElementRef}) resultsElement?:ElementRef<HTMLElement>;
 @ViewChild('documentPane') documentPane?:ElementRef<HTMLElement>;
 @ViewChild('fileManager') fileManager?:ElementRef<HTMLElement>;
 @ViewChild(CodeWorkspaceComponent) codeEditor?:CodeWorkspaceComponent;
 private environmentReady=false;private token='';private generation=0;private deployedFiles:Record<string,string>={};private operation:FileOperation|null=null;private readonly deletedFolders=new Set<string>();
 private readonly onViewport=()=>{this.viewportHeight.set(window.visualViewport?.height??window.innerHeight);this.viewportTop.set(window.visualViewport?.offsetTop??0);};
 constructor(){window.visualViewport?.addEventListener('resize',this.onViewport);window.visualViewport?.addEventListener('scroll',this.onViewport);window.addEventListener('resize',this.onViewport);}

 async open(project:PhpProject):Promise<void>{
  if(this.busy())return;const generation=++this.generation;this.runtime.cancel();this.checker.cancel();this.previewService.clear();this.environmentReady=false;this.deployedFiles={};
  this.deletedFolders.clear();this.project.set(project);this.work.set(null);this.tab.set('editor');this.resultsOpen.set(false);this.explorerOpen.set(false);this.menuOpen.set(false);this.submitted.set(false);this.hint.set(0);
  this.log.set([]);this.preview.set(null);this.lastRun.set(null);this.diagnostics.set([]);this.checks.set([]);this.error.set('');this.message.set('');this.executionState.set('idle');
  const saved=await this.storage.load(project.id);if(generation!==this.generation)return;
  const files=Object.fromEntries(project.files.filter(f=>f.role!=='create').map(f=>[f.path,f.starter]));
  this.work.set(saved??{id:project.id,files,folders:[],activeFile:project.entry,tabs:[project.entry],note:'',attempts:[],updatedAt:new Date().toISOString()});
  if(!Object.hasOwn(this.work()!.files,this.work()!.activeFile))this.patch({activeFile:Object.keys(this.work()!.files)[0]??''});
  this.revision.set(this.work()?.revision??0);this.executionRevision.set(-1);this.checkRevision.set(-1);this.address.set('/'+project.entry.replace(/^\//,''));
 }
 close():void{this.codeEditor?.capture();this.runtime.cancel();this.checker.cancel();this.previewService.clear();this.generation++;this.environmentReady=false;this.busy.set(false);void this.storage.flush();this.project.set(null);this.work.set(null);this.preview.set(null);this.dialog.set(null);}
 ngOnDestroy():void{this.codeEditor?.capture();this.runtime.cancel();this.checker.cancel();this.previewService.clear();this.generation++;void this.storage.flush();window.visualViewport?.removeEventListener('resize',this.onViewport);window.visualViewport?.removeEventListener('scroll',this.onViewport);window.removeEventListener('resize',this.onViewport);}
 @HostListener('window:pagehide') flushWork():void{void this.storage.flush();}
 patch(change:Partial<ProjectWork>,sourceChanged=false):void{const work=this.work();if(!work)return;if(sourceChanged)this.revision.update(x=>x+1);const next={...work,...change,revision:this.revision(),updatedAt:new Date().toISOString()};this.work.set(next);this.storage.save(next);}
 changeCode(value:string):void{const work=this.work();if(!work||this.busy()||work.files[work.activeFile]===value)return;this.patch({files:{...work.files,[work.activeFile]:value}},true);}
 saveEditorState(snapshot:EditorSnapshot):void{const work=this.work();if(!work||!Object.hasOwn(work.files,snapshot.file))return;this.patch({editorState:{...(work.editorState??{}),[snapshot.file]:snapshot}});}
 selectFile(path:string):void{const work=this.work();if(!work||!Object.hasOwn(work.files,path))return;this.patch({activeFile:path,tabs:work.tabs.includes(path)?work.tabs:[...work.tabs,path]});this.tab.set('editor');this.explorerOpen.set(false);this.navigateTo.set(undefined);}
 closeTab(path:string):void{const work=this.work();if(!work)return;const tabs=work.tabs.filter(x=>x!==path);this.patch({tabs,activeFile:work.activeFile===path?(tabs[0]??Object.keys(work.files).find(x=>x!==path)??''):work.activeFile});}
 setTab(tab:LabTab):void{this.tab.set(tab);this.menuOpen.set(false);if(tab==='preview'||tab==='http'||tab==='check'){this.resultsOpen.set(true);this.resultTab.set(tab==='http'?'http':tab==='check'?'check':'preview');}else this.resultsOpen.set(false);}
 showResults(tab:ResultTab):void{this.resultTab.set(tab);this.resultsOpen.set(true);this.tab.set(tab==='check'?'check':'preview');this.resultPanel?.show(tab==='preview'?'html':'output');requestAnimationFrame(()=>this.resultsElement?.nativeElement.scrollIntoView({block:'nearest',behavior:'instant'}));}
 toggleExplorer():void{this.explorerOpen.update(value=>!value);if(this.explorerOpen())requestAnimationFrame(()=>this.fileManager?.nativeElement.scrollIntoView({block:'nearest',behavior:'instant'}));}
 fileRole(path:string):string{const file=this.project()?.files.find(f=>f.path===path);return file?.role==='provided'?'Proporcionado':file?.role==='create'?'Creado por ti':file?.role==='complete'?'Completar':'Archivo propio';}

 beginOperation(kind:FileOperation['kind'],path='',folder=false):void{
  if(this.busy())return;this.operation={kind,path,folder};this.contextNode.set(null);this.menuOpen.set(false);this.error.set('');
  const labels:Record<FileOperation['kind'],ProjectDialog>={
   createFile:{title:'Nuevo archivo',description:'Ruta relativa dentro del proyecto. PHP, HTML, CSS, JSON o TXT.',label:'Nombre o ruta',confirm:'Crear archivo'},
   createFolder:{title:'Nueva carpeta',description:'Puedes crear una carpeta o una ruta de carpetas.',label:'Nombre o ruta',confirm:'Crear carpeta'},
   rename:{title:folder?'Renombrar carpeta':'Renombrar archivo',description:'Se conservará el código. Revisa después las rutas include, require y los enlaces.',label:'Nueva ruta',value:path,confirm:'Renombrar'},
   delete:{title:folder?'Eliminar carpeta':'Eliminar archivo',description:`Se eliminará ${path}${folder?' y sus archivos':''} de tu copia. Puedes descargar antes el proyecto.`,confirm:'Eliminar',danger:true},
   restore:{title:'Restaurar archivos iniciales',description:'Se reemplazará tu código por los archivos iniciales de esta práctica. Descarga antes tu proyecto si quieres conservar una copia.',confirm:'Restaurar inicio',danger:true}
  };this.dialog.set(labels[kind]);
 }
 confirmOperation(value:string):void{
  const operation=this.operation,work=this.work(),project=this.project();if(!operation||!work||!project)return;
  try{
   const path=value.trim();
   if(operation.kind==='createFile'){
    if(!safeProjectPath(path)||! /\.(php|html|css|json|txt)$/i.test(path)||Object.hasOwn(work.files,path)||projectPathConflict({...work.files,[path]:''},work.folders))throw Error('Ruta no válida, extensión no admitida o nombre ya utilizado.');
    this.patch({files:{...work.files,[path]:path.endsWith('.php')?'<?php\n':''},activeFile:path,tabs:[...work.tabs,path]},true);this.tab.set('editor');this.explorerOpen.set(false);
   }else if(operation.kind==='createFolder'){
    if(!safeProjectPath(path+'/.estudio-folder.txt')||projectPathConflict(work.files,[...work.folders,path]))throw Error('La ruta de carpeta no es válida o coincide con un archivo.');
    this.patch({folders:[...new Set([...work.folders,path])]},true);
   }else if(operation.kind==='rename'){const renamed=renameProjectPath(work,operation.path,path,operation.folder);if(operation.folder)this.deletedFolders.add(operation.path);this.replaceWork(renamed);}
   else if(operation.kind==='delete'){const removed=deleteProjectPath(work,operation.path,operation.folder);if(operation.folder)this.deletedFolders.add(operation.path);this.replaceWork(removed);}
   else{
    this.runtime.cancel();this.previewService.clear();this.environmentReady=false;this.deployedFiles={};this.deletedFolders.clear();
    this.patch({files:Object.fromEntries(project.files.filter(f=>f.role!=='create').map(f=>[f.path,f.starter])),folders:[],activeFile:project.entry,tabs:[project.entry],editorState:{}},true);
    this.preview.set(null);this.lastRun.set(null);this.log.set([]);this.checks.set([]);this.diagnostics.set([]);
   }
   this.dialog.set(null);this.operation=null;this.message.set('Cambio aplicado al proyecto.');
  }catch(error){this.error.set(error instanceof Error?error.message:String(error));this.dialog.set(null);}
 }
 private replaceWork(next:ProjectWork):void{this.revision.update(x=>x+1);this.work.set({...next,revision:this.revision(),updatedAt:new Date().toISOString()});this.storage.save(this.work()!);}
 dismissDialog():void{this.dialog.set(null);this.operation=null;}
 private executionFiles(work:ProjectWork):Record<string,string>{return {...Object.fromEntries(work.folders.map(folder=>[folder+'/.estudio-folder.txt',''])),...work.files};}
 private async ensureEnvironment():Promise<void>{
  const work=this.work();if(!work)throw Error('Abre una práctica.');const files=this.executionFiles(work);
  if(!this.environmentReady){await this.runtime.open(files);this.environmentReady=true;}else{
   const changes=Object.fromEntries(Object.entries(files).filter(([path,value])=>this.deployedFiles[path]!==value));const deleted=Object.keys(this.deployedFiles).filter(path=>!Object.hasOwn(files,path));
   if(Object.keys(changes).length||deleted.length||this.deletedFolders.size)await this.runtime.updateFiles(changes,deleted,work.folders,[...this.deletedFolders]);
  }
  this.deployedFiles={...files};this.deletedFolders.clear();
 }
 private path(url:string,base=this.address()):string{const parsed=new URL(url,'https://estudio-lab.invalid/'+base.replace(/^\//,''));if(parsed.origin!=='https://estudio-lab.invalid')throw Error('Solo puedes abrir archivos de este proyecto.');return parsed.pathname+parsed.search;}
 async run():Promise<void>{this.codeEditor?.collapse();const project=this.project();if(project)await this.navigate('/'+project.entry.replace(/^\//,''),'GET');}
 async openAddress():Promise<void>{await this.navigate(this.address(),'GET');}
 async restartEnvironment():Promise<void>{if(this.busy())return;this.runtime.cancel();this.previewService.clear();this.environmentReady=false;this.deployedFiles={};this.log.set([]);await this.run();}
 cancel():void{this.runtime.cancel();this.checker.cancel();this.generation++;this.environmentReady=false;this.busy.set(false);this.executionState.set('cancelled');this.message.set('Ejecución cancelada. Tu código se conserva.');this.showResults('problems');}

 async navigate(url:string,method:'GET'|'POST'='GET',body?:Record<string,string|string[]|File>):Promise<void>{
  if(this.busy()||!this.work())return;const generation=this.generation,revision=this.revision();this.busy.set(true);this.error.set('');this.executionState.set('running');this.diagnostics.set([]);this.lastRun.set(null);this.preview.set(null);
  try{
   await this.ensureEnvironment();let target=this.path(url),verb=method,post=body;
   for(let redirects=0;redirects<=8;redirects++){
    const response=await this.runtime.request({url:target,method:verb,body:post});if(generation!==this.generation)return;
    this.syncRuntimeFiles(response);this.log.update(all=>[...all.slice(-49),{method:verb,url:target,get:new URL(target,'https://estudio-lab.invalid').searchParams.toString(),post:post??{},requestHeaders:response.requestHeaders,status:response.status,headers:response.headers,cookies:response.cookies,session:response.session,body:response.body,stderr:response.stderr}]);
    this.address.set(target);const location=response.headers['location']?.[0];
    if(location&&[301,302,303,307,308].includes(response.status)){
     if(redirects===8)throw Error('Se han superado ocho redirecciones. Revisa las condiciones de acceso.');target=this.path(location,target);if(![307,308].includes(response.status)){verb='GET';post=undefined;}continue;
    }
    const bridge=this.previewBridge(target);const rendered=await this.previewService.prepare(response,target,bridge);if(generation!==this.generation)return;
    this.preview.set(this.sanitizer.bypassSecurityTrustHtml(rendered.html));this.lastRun.set(response);this.executionRevision.set(revision);
    this.diagnostics.set([...(response.diagnostics??[]),...rendered.diagnostics]);this.executionState.set(response.exitCode!==0||this.diagnostics().some(x=>x.severity==='error')?'failed':'done');
    this.showResults(this.diagnostics().length?'problems':'preview');this.message.set('');break;
   }
  }catch(error){if(generation===this.generation){const text=error instanceof Error?error.message:String(error);this.error.set(text);this.executionState.set(/tiempo|seconds|timeout/i.test(text)?'timeout':'failed');this.environmentReady=false;this.showResults('problems');}}
  finally{if(generation===this.generation)this.busy.set(false);}
 }
 private syncRuntimeFiles(response:PhpResponse):void{
  const work=this.work();if(!work)return;const merged={...work.files};let changed=false;
  for(const [path,value] of Object.entries(response.files)){
   if(!safeProjectPath(path)||path.endsWith('/.estudio-folder.txt')||! /\.(php|html|css|json|txt)$/i.test(path))continue;
   if(work.files[path]!==this.deployedFiles[path])continue;
   if(value!==this.deployedFiles[path]){merged[path]=value;this.deployedFiles[path]=value;changed=true;}
  }
  // PHP unlink affects the running application, never silently removes an editor document.
  if(response.deletedFiles?.some(path=>Object.hasOwn(work.files,path)))this.message.set('La aplicación ha eliminado un archivo virtual. Se conserva tu copia en el editor.');
  if(changed)this.patch({files:merged});
 }
 private previewBridge(url:string):string{
  this.token=crypto.randomUUID();const token=JSON.stringify(this.token),base=JSON.stringify('https://estudio-lab.invalid'+url);
  return `document.addEventListener('submit',function(e){e.preventDefault();var form=e.target,data=Object.create(null),submitter=e.submitter;for(var pair of new FormData(form,submitter).entries()){if(pair[0] in data)data[pair[0]]=Array.isArray(data[pair[0]])?data[pair[0]].concat(pair[1]):[data[pair[0]],pair[1]];else data[pair[0]]=pair[1];}var target=new URL((submitter&&submitter.getAttribute('formaction'))||form.getAttribute('action')||${JSON.stringify(url)},${base});var method=((submitter&&submitter.getAttribute('formmethod'))||form.getAttribute('method')||'GET').toUpperCase();if(method==='GET'){target.search='';for(var name in data)for(var value of [].concat(data[name]))target.searchParams.append(name,typeof value==='string'?value:value.name);}parent.postMessage({token:${token},url:target.href,method:method,body:method==='POST'?data:undefined},'*');});document.addEventListener('click',function(e){var link=e.target.closest('a[href]');if(!link)return;var href=link.getAttribute('href');if(href.startsWith('#'))return;e.preventDefault();parent.postMessage({token:${token},url:new URL(href,${base}).href,method:'GET'},'*');});`;
 }
 @HostListener('window:message',['$event']) onMessage(event:MessageEvent):void{if(event.source!==this.resultPanel?.previewFrame?.contentWindow||!event.data||event.data.token!==this.token)return;if(typeof event.data.url==='string'&&['GET','POST'].includes(event.data.method))void this.navigate(event.data.url,event.data.method,event.data.body);}
 goToProblem(problem:PhpDiagnostic):void{if(!problem.file||!this.work()||!Object.hasOwn(this.work()!.files,problem.file))return;this.selectFile(problem.file);this.resultsOpen.set(false);this.navigateTo.set({line:problem.line??1,revision:Date.now()});requestAnimationFrame(()=>this.documentPane?.nativeElement.scrollIntoView({block:'center',behavior:'instant'}));}

 async check(submit=this.exam()&&!this.submitted()):Promise<void>{
  const project=this.project(),work=this.work();if(!project||!work||this.busy())return;this.codeEditor?.collapse();const generation=this.generation,revision=this.revision();this.busy.set(true);this.error.set('');this.checks.set([]);this.showResults('check');
  try{
   const results=await this.checker.check(project,this.executionFiles(work),{onProgress:items=>{if(generation===this.generation&&this.canReview())this.checks.set(items);},isCancelled:()=>generation!==this.generation});
   if(generation!==this.generation)return;this.checks.set(results);this.checkRevision.set(revision);if(submit)this.submitted.set(true);
   const attempt:ProjectAttempt={date:new Date().toISOString(),mode:this.exam()?'exam':'practice',passed:results.filter(x=>x.passed).length,total:results.length,details:results};
   this.patch({attempts:[attempt,...(this.work()?.attempts??[])].slice(0,50)});this.message.set('Comprobaciones terminadas. Revisa también la rúbrica orientativa.');
  }catch(error){if(generation===this.generation)this.error.set(error instanceof Error?error.message:String(error));}finally{if(generation===this.generation)this.busy.set(false);}
 }
 startExam():void{this.exam.set(true);this.submitted.set(false);this.hint.set(0);this.checks.set([]);this.setTab('statement');this.message.set('Simulacro práctico iniciado. Puedes consultar apuntes locales; la solución y las comprobaciones se muestran al entregar.');}
 leaveExam():void{this.exam.set(false);this.submitted.set(false);}
 exportCode():void{const work=this.work();if(work)download(work.id+'.zip',projectZip({...Object.fromEntries(work.folders.map(folder=>[folder+'/',''])),...work.files}),'application/zip');}
 exportPractice():void{const project=this.project(),work=this.work();if(!project||!work||!this.canReview())return;download(project.id+'-practica-completa.zip',projectZip({...Object.fromEntries(Object.entries(work.files).map(([path,code])=>['mi-codigo/'+path,code])),...Object.fromEntries(project.files.map(file=>['inicial/'+file.path,file.starter])),...Object.fromEntries(project.files.map(file=>['solucion/'+file.path,file.solution])),'practica.json':JSON.stringify({project,observations:work.note,attempts:work.attempts},null,2)}),'application/zip');}
 describe(value:unknown):string{return JSON.stringify(value,null,2);}
 ownCode(path:string):string{return this.work()?.files[path]??'(archivo no creado)';}
 async importBackup(event:Event):Promise<void>{const input=event.target as HTMLInputElement,file=input.files?.[0];if(!file)return;try{this.message.set('Restaurados '+this.storage.importBackup(await file.text())+' proyectos.');}catch(error){this.error.set(error instanceof Error?error.message:String(error));}input.value='';}
}
