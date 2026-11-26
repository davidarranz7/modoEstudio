import { Injectable, signal } from '@angular/core';

export interface ProjectAttempt {date:string;mode:'practice'|'exam';passed:number;total:number;details:{label:string;passed:boolean;detail:string}[];}
export interface ProjectWork {id:string;files:Record<string,string>;folders:string[];activeFile:string;tabs:string[];note:string;attempts:ProjectAttempt[];updatedAt:string;}
const backupKey='estudio-projects-v1';
@Injectable({providedIn:'root'})
export class ProjectStorageService {
 readonly warning=signal(''); private database?:Promise<IDBDatabase>; private queue=Promise.resolve();
 private db():Promise<IDBDatabase>{return this.database??=new Promise((resolve,reject)=>{const request=indexedDB.open('estudio-php-projects',1);request.onupgradeneeded=()=>request.result.createObjectStore('projects',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
 async load(id:string):Promise<ProjectWork|undefined>{
  await this.queue;let journal:ProjectWork|undefined;
  try{journal=(JSON.parse(localStorage.getItem(backupKey)??'{}') as Record<string,ProjectWork>)[id];}catch{/* IndexedDB remains available. */}
  try{const db=await this.db();const stored=await new Promise<ProjectWork|undefined>((resolve,reject)=>{const request=db.transaction('projects').objectStore('projects').get(id);request.onsuccess=()=>resolve(request.result as ProjectWork|undefined);request.onerror=()=>reject(request.error);});return stored&&(!journal||stored.updatedAt>journal.updatedAt)?stored:journal??stored;}catch{this.warning.set('IndexedDB no está disponible. Conserva una copia descargada del proyecto.');return journal;}
 }
 save(work:ProjectWork):void {
  const copy=structuredClone(work);
  try{const saved=JSON.parse(localStorage.getItem(backupKey)??'{}') as Record<string,ProjectWork>;saved[work.id]=copy;localStorage.setItem(backupKey,JSON.stringify(saved));}catch{this.warning.set('No se pudo guardar la copia inmediata. Descarga el proyecto si el aviso persiste.');}
  this.queue=this.queue.then(async()=>{const db=await this.db();await new Promise<void>((resolve,reject)=>{const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(copy);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}).catch(()=>{this.warning.set('No se pudo guardar en IndexedDB. Conserva una copia descargada.');});
 }
 async all():Promise<ProjectWork[]>{await this.queue;let stored:ProjectWork[]=[];try{const db=await this.db();stored=await new Promise((resolve,reject)=>{const req=db.transaction('projects').objectStore('projects').getAll();req.onsuccess=()=>resolve(req.result as ProjectWork[]);req.onerror=()=>reject(req.error);});}catch{/* Read journal below. */}const merged=new Map(stored.map(x=>[x.id,x]));try{for(const work of Object.values(JSON.parse(localStorage.getItem(backupKey)??'{}') as Record<string,ProjectWork>)){const previous=merged.get(work.id);if(!previous||work.updatedAt>=previous.updatedAt)merged.set(work.id,work);}}catch{/* Keep database copy. */}return [...merged.values()];}
 async exportBackup():Promise<void>{download('estudio-proyectos.json',JSON.stringify({schema:backupKey,exportedAt:new Date().toISOString(),projects:await this.all()},null,2),'application/json');}
 importBackup(text:string):number {
  const data=JSON.parse(text) as {schema?:string;projects?:ProjectWork[]};if(data.schema!==backupKey||!Array.isArray(data.projects))throw Error('Copia de proyectos no válida.');const valid:ProjectWork[]=[];
  for(const work of data.projects){
   if(!work||typeof work.id!=='string'||!/^[-\w]+$/.test(work.id)||!work.files||typeof work.files!=='object'||Array.isArray(work.files)||Object.entries(work.files).some(([path,value])=>!safeProjectPath(path)||! /\.(php|html|css|json|txt)$/i.test(path)||typeof value!=='string'))throw Error('La copia contiene archivos no válidos.');
   const activeFile=typeof work.activeFile==='string'&&Object.hasOwn(work.files,work.activeFile)?work.activeFile:Object.keys(work.files)[0]??'';
   const attempts=Array.isArray(work.attempts)?work.attempts.filter(x=>x&&typeof x.date==='string'&&['practice','exam'].includes(x.mode)&&Number.isInteger(x.passed)&&Number.isInteger(x.total)&&x.passed>=0&&x.total>=x.passed&&Array.isArray(x.details)).map(x=>({...x,details:x.details.filter(d=>d&&typeof d.label==='string'&&typeof d.passed==='boolean'&&typeof d.detail==='string')})):[];
   const folders=Array.isArray(work.folders)?work.folders.filter(x=>safeProjectPath(x)&&safeProjectPath(x+'/.estudio-folder.txt')):[];
   if(projectPathConflict(work.files,folders))throw Error('La copia utiliza la misma ruta como archivo y carpeta.');
   valid.push({id:work.id,files:work.files,activeFile,folders,tabs:Array.isArray(work.tabs)?[...new Set(work.tabs.filter(x=>typeof x==='string'&&Object.hasOwn(work.files,x)))]:activeFile?[activeFile]:[],attempts,note:typeof work.note==='string'?work.note:'',updatedAt:typeof work.updatedAt==='string'&&!Number.isNaN(Date.parse(work.updatedAt))?new Date(work.updatedAt).toISOString():new Date().toISOString()});
  }
  for(const work of valid)this.save(work);return valid.length;
 }
}
export function safeProjectPath(path:string):boolean {return typeof path==='string'&&path.length>0&&path.length<=160&&!path.startsWith('/')&&!path.includes('\\')&&!path.split('/').some(part=>!part||part==='.'||part==='..'||!/^[-\w.]+$/.test(part));}
export function projectPathConflict(files:Record<string,string>,folders:string[]):boolean {const names=new Set(Object.keys(files));for(const path of [...names,...folders]){const parts=path.split('/');for(let end=1;end<parts.length;end++)if(names.has(parts.slice(0,end).join('/')))return true;}return folders.some(folder=>names.has(folder));}
export function download(filename:string,data:BlobPart,type:string):void {const url=URL.createObjectURL(new Blob([data],{type}));const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
