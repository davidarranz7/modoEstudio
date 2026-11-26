import type { PhpProjectStep } from './php-project';
import type { PhpResponse } from './php-runtime.service';

/** Evaluate behavior and form semantics, accepting equivalent HTML and relative URLs. */
export function evaluateProjectStep(step:PhpProjectStep,response:PhpResponse, peers:readonly PhpProjectStep[]=[]):string[] {
 const expected=step.expect;const failures:string[]=[];const base='https://estudio-lab.invalid'+step.url;
 const absolute=(value:string):string=>{try{return new URL(value,base).href;}catch{return value;}};
 if(response.exitCode!==0||response.stderr||response.truncated||response.diagnostics?.some(item=>['error','warning','notice'].includes(item.severity)))failures.push(response.stderr||response.diagnostics?.map(item=>item.message).join('\n')||'Error de ejecución PHP o salida truncada');
 if(expected.status!==undefined&&expected.status!==response.status)failures.push(`HTTP esperado ${expected.status}, obtenido ${response.status}`);
 for(const text of expected.bodyIncludes??[])if(!response.body.includes(text))failures.push('Falta en la salida: '+text);
 for(const text of expected.bodyExcludes??[])if(response.body.includes(text))failures.push('La salida no debe contener: '+text);
 const doc=new DOMParser().parseFromString(response.body,'text/html');doc.querySelectorAll('script,style').forEach(node=>node.remove());doc.querySelectorAll('td,th,tr,p,div,li,section,br,form,h1,h2,h3,h4').forEach(node=>node.append(' '));const text=(doc.body.textContent??'').replace(/\s+/g,' ').trim();
 for(const value of expected.textIncludes??[])if(!containsExpectedText(text,value))failures.push('Falta el texto: '+value);
 for(const value of expected.textExcludes??[])if(text.includes(value))failures.push('No debe aparecer el texto: '+value);
 if(expected.form){
  const form=expected.form;
  const uploads=new Set(peers.filter(peer=>absolute(peer.url)===absolute(form.action)).flatMap(peer=>(peer.uploads??[]).map(upload=>upload.field)));
  const found=Array.from(doc.forms).some(node=>{
   if((node.getAttribute('method')??'GET').toUpperCase()!==form.method||absolute(node.getAttribute('action')||step.url)!==absolute(form.action)||form.enctype&&node.enctype.toLowerCase()!==form.enctype.toLowerCase())return false;
   return form.fields.every(name=>Array.from(node.elements).some(field=>{
    if(!(field instanceof HTMLInputElement||field instanceof HTMLSelectElement||field instanceof HTMLTextAreaElement)||field.name!==name||field.matches(':disabled'))return false;
    if(field instanceof HTMLInputElement&&['button','reset','submit','image'].includes(field.type))return false;
    if(field instanceof HTMLSelectElement&&!Array.from(field.options).some(option=>!option.disabled&&!option.closest('optgroup[disabled]')))return false;
    if(uploads.has(name)&&(!(field instanceof HTMLInputElement)||field.type!=='file'))return false;
    return true;
   }));
  });
  if(!found)failures.push('Falta un formulario con método, destino y controles enviables habilitados: '+JSON.stringify(form));
 }
 if(expected.location!==undefined&&absolute(response.headers['location']?.[0]??'(ausente)')!==absolute(expected.location))failures.push('Location esperado '+expected.location+', obtenido '+(response.headers['location']?.[0]??'(ausente)'));
 for(const name of expected.cookieNames??[])if(!Object.hasOwn(response.cookies,name))failures.push('Falta cookie '+name);
 for(const name of expected.absentCookies??[])if(Object.hasOwn(response.cookies,name))failures.push('No se ha eliminado la cookie '+name);
 // A page printing every known numeric answer must not pass every input case.
 // These constraints come only from existing cases for the same endpoint.
 const ownFacts=(expected.textIncludes??[]).map(numericFact).filter((fact):fact is NumericFact=>!!fact);
 for(const own of ownFacts){
  const values=readFacts(text,own.prefix);
  const allowed=ownFacts.filter(fact=>fact.prefix.toLowerCase()===own.prefix.toLowerCase());
  if(values.some(value=>!allowed.some(fact=>sameNumber(value,fact.value))))failures.push('La salida incluye varios resultados incompatibles para '+own.prefix.trim()+'.');
  for(const peer of peers){
   if(peer.method!==step.method||new URL(peer.url,'https://estudio-lab.invalid').pathname!==new URL(step.url,'https://estudio-lab.invalid').pathname)continue;
   for(const value of peer.expect.textIncludes??[]){const fact=numericFact(value);if(fact&&fact.prefix.toLowerCase()===own.prefix.toLowerCase()&&!allowed.some(item=>sameNumber(item.value,fact.value))&&values.some(actual=>sameNumber(actual,fact.value)))failures.push('Se ha impreso también el resultado correspondiente a otro caso de entrada.');}
  }
 }
 return [...new Set(failures)];
}

interface NumericFact{prefix:string;value:number;}
const escape=(value:string):string=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function numericFact(value:string):NumericFact|undefined{const match=value.match(/^(.{1,100}?[:=]\s*)([-+]?\d+(?:[.,]\d+)?)(?:\s*(?:€|EUR|%))?$/iu);return match?{prefix:match[1].replace(/\s+/g,' '),value:Number(match[2].replace(',','.'))}:undefined;}
function readFacts(text:string,prefix:string):number[]{return [...text.matchAll(new RegExp('(?:^|[^\\p{L}\\p{N}_])'+escape(prefix.trim()).replace(/\s+/g,'\\s*')+'\\s*([-+]?\\d+(?:[.,]\\d+)?)','giu'))].map(match=>Number(match[1].replace(',','.')));}
function sameNumber(left:number,right:number):boolean{return Math.abs(left-right)<=1e-9*Math.max(1,Math.abs(right));}
function containsExpectedText(text:string,value:string):boolean{const fact=numericFact(value);return fact?readFacts(text,fact.prefix).some(actual=>sameNumber(actual,fact.value)):text.includes(value);}

/** Lightweight lexical checks, never presented as proof of general PHP semantics. */
export function evaluateProjectStaticCheck(check:{file:string;pattern:string},files:Record<string,string>):string[]{
 const source=files[check.file]??'';const scanned=scanPhp(source);const pattern=new RegExp(check.pattern,'im');
 const docCheck=/@param|@return/.test(check.pattern);
 const passed=docCheck?scanned.docs.some(doc=>/^\s*(?:(?:public|protected|private|static|final|abstract)\s+)*function\b/.test(doc.after)&&pattern.test(doc.text+doc.after.slice(0,Math.max(0,doc.after.indexOf('{')+1)))):pattern.test(scanned.code);
 return passed?[]:['No se encuentra la estructura solicitada fuera de cadenas y comentarios en '+check.file+'.'];
}
function scanPhp(source:string):{code:string;docs:{text:string;after:string}[]}{
 let output='';let cursor=0;let php=!source.includes('<?');const docs:{text:string;after:string}[]=[];
 const blank=(value:string)=>value.replace(/[^\r\n]/g,' ');
 while(cursor<source.length){
  const rest=source.slice(cursor);
  if(!php){const tag=rest.match(/^<\?(?:php\b|=)?/i);if(tag){php=true;output+=blank(tag[0]);cursor+=tag[0].length;}else{output+=source[cursor]==='\n'?'\n':' ';cursor++;}continue;}
  if(rest.startsWith('?>')){php=false;output+='  ';cursor+=2;continue;}
  if(rest.startsWith('//')||rest.startsWith('#')){const end=source.indexOf('\n',cursor);const length=(end<0?source.length:end)-cursor;output+=blank(source.slice(cursor,cursor+length));cursor+=length;continue;}
  if(rest.startsWith('/*')){const end=source.indexOf('*/',cursor+2);const finish=end<0?source.length:end+2;const comment=source.slice(cursor,finish);if(rest.startsWith('/**'))docs.push({text:comment,after:source.slice(finish)});output+=blank(comment);cursor=finish;continue;}
  const quote=source[cursor];if(quote==='\''||quote==='"'||quote==='`'){let end=cursor+1;while(end<source.length){if(source[end]==='\\'){end+=2;continue;}if(source[end++]===quote)break;}output+=blank(source.slice(cursor,end));cursor=end;continue;}
  const heredoc=rest.match(/^<<<[ \t]*['"]?([A-Za-z_]\w*)['"]?[ \t]*\r?\n/);if(heredoc){const end=new RegExp('^[ \\t]*'+heredoc[1]+';?\\r?$','m').exec(rest.slice(heredoc[0].length));const finish=end?cursor+heredoc[0].length+end.index+end[0].length:source.length;output+=blank(source.slice(cursor,finish));cursor=finish;continue;}
  output+=source[cursor++];
 }
 return {code:output,docs};
}
