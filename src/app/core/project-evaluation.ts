import type { PhpProjectStep } from './php-project';
import type { PhpResponse } from './php-runtime.service';

/** Evaluate behavior and form semantics, accepting equivalent HTML and relative URLs. */
export function evaluateProjectStep(step:PhpProjectStep,response:PhpResponse):string[] {
 const expected=step.expect;const failures:string[]=[];const base='https://estudio-lab.invalid'+step.url;
 const absolute=(value:string):string=>{try{return new URL(value,base).href;}catch{return value;}};
 if(response.exitCode!==0||response.stderr||response.truncated)failures.push(response.stderr||'Error de ejecución PHP o salida truncada');
 if(expected.status!==undefined&&expected.status!==response.status)failures.push(`HTTP esperado ${expected.status}, obtenido ${response.status}`);
 for(const text of expected.bodyIncludes??[])if(!response.body.includes(text))failures.push('Falta en la salida: '+text);
 for(const text of expected.bodyExcludes??[])if(response.body.includes(text))failures.push('La salida no debe contener: '+text);
 const doc=new DOMParser().parseFromString(response.body,'text/html');doc.querySelectorAll('script,style').forEach(node=>node.remove());const text=(doc.body.textContent??'').replace(/\s+/g,' ').trim();
 for(const value of expected.textIncludes??[])if(!text.includes(value))failures.push('Falta el texto: '+value);
 for(const value of expected.textExcludes??[])if(text.includes(value))failures.push('No debe aparecer el texto: '+value);
 if(expected.form){const form=expected.form;const found=Array.from(doc.querySelectorAll('form')).some(node=>(node.getAttribute('method')??'GET').toUpperCase()===form.method&&absolute(node.getAttribute('action')||step.url)===absolute(form.action)&&(!form.enctype||(node.getAttribute('enctype')??'application/x-www-form-urlencoded').toLowerCase()===form.enctype.toLowerCase())&&form.fields.every(name=>Array.from(node.querySelectorAll('[name]')).some(field=>field.getAttribute('name')===name)));if(!found)failures.push('Falta un formulario con el método, destino y campos solicitados: '+JSON.stringify(form));}
 if(expected.location!==undefined&&absolute(response.headers['location']?.[0]??'(ausente)')!==absolute(expected.location))failures.push('Location esperado '+expected.location+', obtenido '+(response.headers['location']?.[0]??'(ausente)'));
 for(const name of expected.cookieNames??[])if(!Object.hasOwn(response.cookies,name))failures.push('Falta cookie '+name);
 for(const name of expected.absentCookies??[])if(Object.hasOwn(response.cookies,name))failures.push('No se ha eliminado la cookie '+name);
 return failures;
}
