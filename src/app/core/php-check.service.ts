import { Injectable } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import type { PhpProject } from './php-project';
import { PhpRuntimeService } from './php-runtime.service';
import { evaluateProjectStaticCheck, evaluateProjectStep } from './project-evaluation';

export interface ProjectCheckResult{label:string;passed:boolean;detail:string;}
export interface ProjectCheckOptions{onProgress?:(results:ProjectCheckResult[])=>void;isCancelled?:()=>boolean;}
/** A separate interpreter prevents correction scenarios from changing the student's preview session. */
@Injectable()
export class PhpCheckService implements OnDestroy{
 private readonly runtime=new PhpRuntimeService();private generation=0;
 cancel():void{this.generation++;this.runtime.cancel();}
 ngOnDestroy():void{this.cancel();}
 async check(project:PhpProject,files:Record<string,string>,options:ProjectCheckOptions={}):Promise<ProjectCheckResult[]>{
  const generation=++this.generation;const snapshot=structuredClone(files);const results:ProjectCheckResult[]=[];
  const ensureCurrent=()=>{if(generation!==this.generation||options.isCancelled?.())throw Error('Comprobación cancelada.');};
  const append=(result:ProjectCheckResult)=>{results.push(result);options.onProgress?.([...results]);};
  try{
   for(const file of project.files)append({label:'Archivo '+file.path,passed:Object.hasOwn(snapshot,file.path),detail:Object.hasOwn(snapshot,file.path)?'Existe en el sistema de archivos compartido.':'Falta el archivo requerido.'});
   const peers=project.tests.flatMap(test=>test.steps);
   for(const test of project.tests){
    ensureCurrent();await this.runtime.open(snapshot);let passed=true;const details:string[]=[];
    for(const step of test.steps){
     ensureCurrent();const body:Record<string,string|string[]|File>={...step.body};for(const upload of step.uploads??[])body[upload.field]=new File([upload.content],upload.name,{type:upload.type??'text/plain'});
     const response=await this.runtime.request({url:step.url,method:step.method,body:step.method==='POST'?body:undefined});ensureCurrent();const failures=evaluateProjectStep(step,response,peers);passed=passed&&!failures.length;
     details.push(`${step.method} ${step.url}\nEntrada: ${JSON.stringify(step.body??{})}${step.uploads?.length?' · Archivos: '+step.uploads.map(upload=>upload.name).join(', '):''}\nEsperado: ${JSON.stringify(step.expect)}\nObtenido: HTTP ${response.status}; Location ${response.headers['location']?.[0]??'—'}; cookies ${JSON.stringify(response.cookies)}\n${failures.length?failures.join('\n'):'Comportamiento comprobado.'}\nSalida: ${response.body.slice(0,2500)}`);
    }
    append({label:(test.additional?'Prueba adicional · ':'Prueba pública · ')+test.label,passed,detail:details.join('\n\n')});
   }
   for(const check of project.staticChecks??[]){ensureCurrent();const failures=evaluateProjectStaticCheck(check,snapshot);append({label:'Análisis estático · '+check.label,passed:!failures.length,detail:failures.length?failures.join('\n'):'Estructura localizada mediante análisis léxico. No acredita por sí sola el comportamiento.'});}
   return results;
  }finally{if(generation===this.generation)this.runtime.cancel();}
 }
}
