import { Injectable, signal } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import type { EditorSnapshot } from './editor-state';

export interface ProjectAttempt {date:string;mode:'practice'|'exam';passed:number;total:number;details:{label:string;passed:boolean;detail:string}[];}
export interface ProjectWork {
 id:string;files:Record<string,string>;folders:string[];activeFile:string;tabs:string[];note:string;attempts:ProjectAttempt[];updatedAt:string;
 editorState?:Record<string,EditorSnapshot>;revision?:number;storageRevision?:string;
}
export type ProjectSaveState='idle'|'saving'|'saved'|'error';
const backupKey='estudio-projects-v1';
const recoveryKey=backupKey+'-unreadable-journal';
const stamp=(work:ProjectWork):number=>Number.isFinite(Date.parse(work.updatedAt))?Date.parse(work.updatedAt):0;
const newer=(left:ProjectWork,right:ProjectWork):boolean=>stamp(left)>stamp(right)||(stamp(left)===stamp(right)&&(left.revision??0)>=(right.revision??0));
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const positive=(value:unknown,fallback=0):number=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,value):fallback;
const version=(work:ProjectWork|undefined):string=>work?.storageRevision??(work?JSON.stringify([work.updatedAt,work.revision??0,work.files]):'(missing)');
type Snapshot={work:ProjectWork;sequence:number};

/** Additive migration: retain the v1 database/store and all original work records. */
@Injectable({providedIn:'root'})
export class ProjectStorageService implements OnDestroy {
 readonly warning=signal('');readonly saveState=signal<ProjectSaveState>('idle');readonly savedAt=signal('');
 private readonly states=signal<Record<string,ProjectSaveState>>({});
 private database?:Promise<IDBDatabase>;private timer?:ReturnType<typeof setTimeout>;private flushing?:Promise<void>;private sequence=0;
 private readonly latest=new Map<string,Snapshot>();private readonly pending=new Map<string,Snapshot>();private readonly failed=new Map<string,Snapshot>();private readonly repair=new Map<string,Snapshot>();
 private readonly databaseBases=new Map<string,string>();private readonly journalBases=new Map<string,string>();private readonly conflicts=new Map<string,ProjectWork>();private readonly importing=new Set<string>();
 private readonly recoveryId=globalThis.crypto?.randomUUID?.()??Date.now()+'-'+Math.random();
 private readonly pageHide=()=>{for(const {work} of [...this.failed.values(),...this.pending.values()])this.rememberConflict({...work,storageRevision:this.databaseBases.get(work.id)??work.storageRevision},'pendiente-'+this.recoveryId);void this.flush();};
 private readonly visibility=()=>{if(document.visibilityState==='hidden')this.pageHide();};
 constructor(){if(typeof window!=='undefined')window.addEventListener('pagehide',this.pageHide);if(typeof document!=='undefined')document.addEventListener('visibilitychange',this.visibility);}
 stateFor(id:string):ProjectSaveState{return this.states()[id]??'idle';}
 private state(id:string,state:ProjectSaveState):void{this.states.set({...this.states(),[id]:state});this.saveState.set(state);}
 private db():Promise<IDBDatabase>{
  if(!this.database)this.database=new Promise<IDBDatabase>((resolve,reject)=>{
   const request=indexedDB.open('estudio-php-projects',1);
   request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('projects'))request.result.createObjectStore('projects',{keyPath:'id'});};
   request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();this.database=undefined;};resolve(db);};
   request.onerror=()=>reject(request.error??Error('No se pudo abrir IndexedDB.'));request.onblocked=()=>reject(Error('Otra pestaña mantiene bloqueada la base de proyectos.'));
  }).catch(error=>{this.database=undefined;throw error;});
  return this.database;
 }
 private readJournal():Record<string,ProjectWork>{
  const raw=localStorage.getItem(backupKey);if(!raw)return {};const parsed:unknown=JSON.parse(raw);if(!object(parsed))throw Error('Copia inmediata ilegible');
  const result:Record<string,ProjectWork>={};for(const [id,value] of Object.entries(parsed)){try{const work=normalizeProjectWork(value);if(work.id===id)result[id]=work;}catch{/* Preserve invalid original entries when writing. */}}return result;
 }
 private writeJournal(works:ProjectWork[],checkBase=false):Set<string>|undefined{
  if(!works.length)return new Set();
  try{
   let saved:Record<string,unknown>={};const raw=localStorage.getItem(backupKey);
   if(raw){try{const parsed:unknown=JSON.parse(raw);if(!object(parsed))throw Error('Copia corrupta');saved=parsed;}catch{
    // Backup first. If storage is full, preserve the sole corrupt original.
    this.preserveUnreadable(raw);
   }}
   const accepted=new Set<string>();
   for(const work of works){let previous:ProjectWork|undefined;try{previous=normalizeProjectWork(saved[work.id]);}catch{}if(checkBase&&version(previous)!==(this.journalBases.get(work.id)??'(missing)'))continue;if(!previous||newer(work,previous)){saved[work.id]=work;accepted.add(work.id);}}
   localStorage.setItem(backupKey,JSON.stringify(saved));for(const work of works)if(accepted.has(work.id))this.journalBases.set(work.id,version(work));return accepted;
  }catch{return undefined;}
 }
 save(work:ProjectWork):void{
  let copy:ProjectWork;try{copy=normalizeProjectWork(structuredClone(work));}catch(error){this.warning.set(error instanceof Error?error.message:'Proyecto no válido; no se ha sobrescrito la copia anterior.');this.state(work.id,'error');return;}
  const entry={work:copy,sequence:++this.sequence};this.latest.set(copy.id,entry);this.pending.set(copy.id,entry);this.failed.delete(copy.id);this.state(copy.id,'saving');
  if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(()=>{this.timer=undefined;void this.flush();},220);
 }
 /** Coalesce bursts of edits; load/export/navigation can explicitly await durability. */
 async flush():Promise<void>{
  if(this.timer){clearTimeout(this.timer);this.timer=undefined;}if(this.flushing){await this.flushing;if(this.pending.size)await this.flush();return;}
  const batch=new Map([...this.repair,...this.failed,...this.pending]);this.pending.clear();this.failed.clear();this.repair.clear();if(!batch.size)return;
  this.flushing=this.persist(batch);try{await this.flushing;}finally{this.flushing=undefined;}if(this.pending.size)await this.flush();
 }
 private async persist(batch:Map<string,Snapshot>):Promise<void>{
  let db:IDBDatabase|undefined;try{db=await this.db();}catch{}let databaseFailed=false;let journalFailed=false;let conflicted=false;
  for(const [id,entry] of batch){
   let databaseSaved=false;let conflict=false;const copy={...entry.work,storageRevision:globalThis.crypto?.randomUUID?.()??Date.now()+'-'+Math.random()};
   try{const current=this.readJournal()[id];const base=this.journalBases.get(id)??entry.work.storageRevision??'(missing)';if(!this.importing.has(id)&&current&&version(current)!==base){conflict=true;this.rememberConflict(current,'version-guardada');}}catch{/* An unreadable journal is preserved separately before repair. */}
   if(db&&!conflict)try{databaseSaved=await new Promise<boolean>((resolve,reject)=>{
    const tx=db!.transaction('projects','readwrite');const store=tx.objectStore('projects');const request=store.get(id);
    request.onsuccess=()=>{try{let previous:ProjectWork|undefined;try{previous=normalizeProjectWork(request.result);}catch{}const base=this.databaseBases.get(id)??entry.work.storageRevision??'(missing)';if(!this.importing.has(id)&&version(previous)!==base){conflict=true;if(previous)this.rememberConflict(previous,'version-guardada');return;}if(this.importing.has(id)&&previous)this.rememberConflict(previous,'antes-importar');store.put(copy);}catch(error){tx.abort();reject(error);}};
    tx.oncomplete=()=>resolve(!conflict);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error??Error('Escritura cancelada.'));
   });}catch{databaseFailed=true;}
   if(databaseSaved)this.databaseBases.set(id,version(copy));
   const journal=conflict?undefined:this.writeJournal([copy],!databaseSaved&&!this.importing.has(id));const journalSaved=!!journal?.has(id);journalFailed=journalFailed||!journalSaved;
   if(!databaseSaved&&!journalSaved&&journal!==undefined)conflict=true;
   this.importing.delete(id);
   if(conflict){conflicted=true;this.rememberConflict(entry.work);}
   if(this.latest.get(id)?.sequence!==entry.sequence)continue;
   if(!conflict&&(databaseSaved||journalSaved)){this.latest.set(id,{...entry,work:copy});this.conflicts.delete(id);if(!databaseSaved||!journalSaved)this.repair.set(id,{...entry,work:copy});this.state(id,'saved');this.savedAt.set(new Date().toISOString());}else{this.failed.set(id,entry);this.state(id,'error');}
  }
  if(conflicted)this.warning.set('Otra pestaña ha guardado una versión diferente. No se ha sobrescrito. Tu copia sigue en memoria y en el respaldo de conflictos; exporta los proyectos antes de cerrar.');
  else if(!db||databaseFailed)this.warning.set(!journalFailed?'No se pudo guardar en IndexedDB. Tu código queda en la copia local; descarga un respaldo.':'No se ha podido guardar en IndexedDB ni en la copia local. El código sigue en esta pantalla; descarga el proyecto.');
  else if([...batch.keys()].some(id=>this.stateFor(id)==='error'))this.warning.set('No se ha podido guardar el último código. Se conserva en memoria; descarga una copia antes de cerrar.');
  else if(journalFailed)this.warning.set('No se pudo guardar la copia inmediata; el código está guardado en IndexedDB. Descarga un respaldo si el aviso persiste.');else this.warning.set('');
 }
 private rememberConflict(work:ProjectWork,suffix=''):void{
  const id=work.id+(suffix?':'+suffix:'');this.conflicts.set(id,structuredClone(work));
  try{const raw=JSON.parse(localStorage.getItem(backupKey+'-conflicts')??'{}') as Record<string,ProjectWork>;raw[id]=work;localStorage.setItem(backupKey+'-conflicts',JSON.stringify(raw));}catch{/* The in-memory copy remains exportable, including when storage is full. */}
 }
 private preserveUnreadable(raw:string):void{const previous=localStorage.getItem(recoveryKey);if(previous===raw)return;if(previous!==null)localStorage.setItem(recoveryKey+'-'+(globalThis.crypto?.randomUUID?.()??Date.now()),previous);localStorage.setItem(recoveryKey,raw);}
 async load(id:string):Promise<ProjectWork|undefined>{
  await this.flush();let result:ProjectWork|undefined;
  try{result=this.readJournal()[id];this.journalBases.set(id,version(result));}catch{this.warning.set('La copia inmediata contiene datos ilegibles. Se conserva y se intentará recuperar IndexedDB.');}
  try{const db=await this.db();const raw=await new Promise<unknown>((resolve,reject)=>{const request=db.transaction('projects').objectStore('projects').get(id);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});const stored=raw===undefined?undefined:normalizeProjectWork(raw);if(!this.conflicts.has(id))this.databaseBases.set(id,version(stored));if(stored&&(!result||newer(stored,result)))result=stored;}catch{this.warning.set('IndexedDB no está disponible. Conserva una copia descargada del proyecto.');}
  const memory=this.latest.get(id);if(memory&&(!result||this.failed.has(id)||newer(memory.work,result)))result=memory.work;
  return result?structuredClone(result):undefined;
 }
 async all():Promise<ProjectWork[]>{
  await this.flush();const merged=new Map<string,ProjectWork>();try{for(const work of Object.values(this.readJournal()))merged.set(work.id,work);}catch{}
  try{const db=await this.db();const values=await new Promise<unknown[]>((resolve,reject)=>{const request=db.transaction('projects').objectStore('projects').getAll();request.onsuccess=()=>resolve(request.result as unknown[]);request.onerror=()=>reject(request.error);});for(const value of values){try{const work=normalizeProjectWork(value),previous=merged.get(work.id);if(!previous||newer(work,previous))merged.set(work.id,work);}catch{}}}catch{}
  for(const [id,{work}] of this.latest){const previous=merged.get(id);if(!previous||this.failed.has(id)||newer(work,previous))merged.set(id,work);}return structuredClone([...merged.values()]);
 }
 async exportBackup():Promise<void>{
  const projects=await this.all();let unreadableJournal:string|undefined;try{unreadableJournal=localStorage.getItem(recoveryKey)??undefined;const raw=localStorage.getItem(backupKey);if(raw)try{JSON.parse(raw);}catch{unreadableJournal=raw;}}catch{}
  let conflicts:Record<string,ProjectWork>={};try{conflicts=JSON.parse(localStorage.getItem(backupKey+'-conflicts')??'{}') as Record<string,ProjectWork>;}catch{}for(const [id,work] of this.conflicts)conflicts[id]=work;
  const unreadableJournals:string[]=[];try{for(let index=0;index<localStorage.length;index++){const key=localStorage.key(index);if(key?.startsWith(recoveryKey)){const value=localStorage.getItem(key);if(value!==null)unreadableJournals.push(value);}}}catch{}
  download('estudio-proyectos.json',JSON.stringify({schema:backupKey,version:2,exportedAt:new Date().toISOString(),projects,conflicts,unreadableJournal,unreadableJournals},null,2),'application/json');
 }
 importBackup(text:string):number{
  const data:unknown=JSON.parse(text);if(!object(data)||data['schema']!==backupKey||!Array.isArray(data['projects']))throw Error('Copia de proyectos no válida.');
  const valid=data['projects'].map(value=>normalizeProjectWork(value,true));const recoveries=object(data['conflicts'])?Object.entries(data['conflicts']).map(([key,value])=>({key,work:normalizeProjectWork(value,true)})):[];
  const ids=new Set<string>();for(const work of valid){if(ids.has(work.id))throw Error('La copia repite un proyecto. No se ha importado ningún dato.');ids.add(work.id);}
  for(const {key,work} of recoveries)this.rememberConflict(work,'importado-'+key.replace(/[^\w:-]/g,'_'));
  try{if(typeof data['unreadableJournal']==='string')this.preserveUnreadable(data['unreadableJournal']);if(Array.isArray(data['unreadableJournals']))for(const raw of data['unreadableJournals'])if(typeof raw==='string')this.preserveUnreadable(raw);}catch{this.warning.set('No se ha podido guardar toda la información de recuperación. Conserva el archivo de respaldo original.');}
  for(const work of valid){this.importing.add(work.id);this.save(work);}return valid.length;
 }
 ngOnDestroy():void{this.pageHide();if(typeof window!=='undefined')window.removeEventListener('pagehide',this.pageHide);if(typeof document!=='undefined')document.removeEventListener('visibilitychange',this.visibility);}
}

export function normalizeProjectWork(value:unknown,imported=false):ProjectWork{
 if(!object(value)||typeof value['id']!=='string'||!/^[-\w]+$/.test(value['id'])||!object(value['files']))throw Error('La copia contiene un proyecto no válido.');
 const files:Record<string,string>={};for(const [path,content] of Object.entries(value['files'])){if(!safeProjectPath(path)||! /\.(php|html|css|json|txt)$/i.test(path)||typeof content!=='string')throw Error('La copia contiene archivos no válidos.');files[path]=content;}
 const folders=Array.isArray(value['folders'])?[...new Set(value['folders'].filter((path):path is string=>safeProjectPath(path)&&safeProjectPath(path+'/.estudio-folder.txt')))]:[];if(projectPathConflict(files,folders))throw Error('La copia utiliza la misma ruta como archivo y carpeta.');
 const activeFile=typeof value['activeFile']==='string'&&Object.hasOwn(files,value['activeFile'])?value['activeFile']:Object.keys(files)[0]??'';
 const tabs=Array.isArray(value['tabs'])?[...new Set(value['tabs'].filter((path):path is string=>typeof path==='string'&&Object.hasOwn(files,path)))]:activeFile?[activeFile]:[];
 const attempts:ProjectAttempt[]=Array.isArray(value['attempts'])?value['attempts'].filter((attempt):attempt is ProjectAttempt=>object(attempt)&&typeof attempt['date']==='string'&&['practice','exam'].includes(String(attempt['mode']))&&Number.isInteger(attempt['passed'])&&Number.isInteger(attempt['total'])&&Number(attempt['passed'])>=0&&Number(attempt['total'])>=Number(attempt['passed'])&&Array.isArray(attempt['details'])).map(attempt=>({...attempt,details:attempt.details.filter(detail=>detail&&typeof detail.label==='string'&&typeof detail.passed==='boolean'&&typeof detail.detail==='string')})):[];
 const editorState:Record<string,EditorSnapshot>={};if(object(value['editorState']))for(const [path,snapshot] of Object.entries(value['editorState'])){
  if(!Object.hasOwn(files,path)||!object(snapshot))continue;const selection=object(snapshot['selection'])?snapshot['selection']:{};const state=snapshot['state'];const usable=object(state)&&(state['doc']===undefined||state['doc']===files[path])?structuredClone(state):undefined;
  const documentHash=typeof snapshot['documentHash']==='string'&&/^\d+:[a-f0-9]{1,16}$/i.test(snapshot['documentHash'])?snapshot['documentHash']:undefined;
  editorState[path]={file:path,selection:{anchor:Math.trunc(Math.min(files[path].length,positive(selection['anchor']))),head:Math.trunc(Math.min(files[path].length,positive(selection['head'])))},scrollTop:positive(snapshot['scrollTop']),scrollLeft:positive(snapshot['scrollLeft']),assistance:snapshot['assistance']!==false,fontSize:Math.max(12,Math.min(24,positive(snapshot['fontSize'],14))),...(documentHash?{documentHash}:{}),...(usable?{state:usable}:{})};
 }
 const date=value['updatedAt'];const updatedAt=typeof date==='string'&&Number.isFinite(Date.parse(date))?new Date(date).toISOString():imported?new Date().toISOString():'1970-01-01T00:00:00.000Z';
 return {id:value['id'],files,folders,activeFile,tabs,note:typeof value['note']==='string'?value['note']:'',attempts,updatedAt,...(Object.keys(editorState).length?{editorState}:{}),...(typeof value['revision']==='number'&&Number.isSafeInteger(value['revision'])&&value['revision']>=0?{revision:value['revision']}:{}),...(typeof value['storageRevision']==='string'?{storageRevision:value['storageRevision']}:{})};
}
export function safeProjectPath(path:unknown):path is string{return typeof path==='string'&&path.length>0&&path.length<=160&&!path.startsWith('/')&&!path.includes('\\')&&!path.split('/').some(part=>!part||part==='.'||part==='..'||!/^[-\w.]+$/.test(part));}
export function projectPathConflict(files:Record<string,string>,folders:string[]):boolean{const names=new Set(Object.keys(files));for(const path of [...names,...folders]){const parts=path.split('/');for(let end=1;end<parts.length;end++)if(names.has(parts.slice(0,end).join('/')))return true;}return folders.some(folder=>names.has(folder));}
export function download(filename:string,data:BlobPart,type:string):void{const url=URL.createObjectURL(new Blob([data],{type}));const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
