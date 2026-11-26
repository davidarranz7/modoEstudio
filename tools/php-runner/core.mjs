import {readFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
const harness=readFileSync(new URL('./harness.php',import.meta.url),'utf8').replace(/^<\?php\s*/,'');
export const PHP_IMAGE='php:8.2-cli';
const validName=/^[A-Za-z0-9_-]+\.(php|json|txt)$/;
export function validatePayload(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||!raw.files||typeof raw.files!=='object'||Array.isArray(raw.files))throw Error('Faltan los archivos.');
 const entries=Object.entries(raw.files);
 if(!entries.length||entries.length>8||entries.some(([n,c])=>!validName.test(n)||typeof c!=='string'||c.length>24000))throw Error('Se permiten hasta 8 archivos .php, .json o .txt de 24.000 caracteres.');
 if(!validName.test(raw.entry??'')||!String(raw.entry).endsWith('.php')||!Object.hasOwn(raw.files,raw.entry))throw Error('Archivo PHP de entrada no válido.');
 if(typeof raw.stdin!=='string'||raw.stdin.length>8000)throw Error('Entrada estándar inválida o demasiado larga.');
 const tests=raw.tests??[];
 if(!Array.isArray(tests)||tests.length>16||tests.some(t=>!t||typeof t.label!=='string'||t.label.length>160||!/^[a-zA-Z_]\w*$/.test(t.functionName??'')||!Array.isArray(t.args)||!Object.hasOwn(t,'expected')||!['return','output'].includes(t.mode??'return')))throw Error('Casos de prueba inválidos.');
 return {files:Object.fromEntries(entries),entry:raw.entry,stdin:raw.stdin,tests:tests.map(t=>({...t,mode:t.mode??'return'}))};
}
export function encodePayload(payload){return JSON.stringify({files:payload.files,entry:payload.entry,tests:payload.tests.map(({functionName,args,mode})=>({functionName,args,mode}))})+'\n'+payload.stdin;}
export function sameValue(a,b){
 if(typeof a==='number'&&typeof b==='number')return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b));
 if(a===b)return true;
 if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>sameValue(v,b[i]));
 if(a&&b&&typeof a==='object'&&typeof b==='object')return Object.keys(a).length===Object.keys(b).length&&Object.keys(b).every(k=>Object.hasOwn(a,k)&&sameValue(a[k],b[k]));
 return false;
}
export function decodeResult(payload,result){
 if(!payload.tests.length||result.exitCode!==0||result.timedOut||result.truncated)return result;
 try{
  const parsed=JSON.parse(result.stdout); if(!Array.isArray(parsed.cases)||parsed.cases.length!==payload.tests.length)throw Error('Resultados incompletos');
  return {...result,stdout:parsed.initialOutput??'',tests:payload.tests.map((t,i)=>{const c=parsed.cases[i];return {label:t.label,expected:t.expected,actual:c.actual,printed:c.printed,error:c.error,passed:!c.error&&sameValue(c.actual,t.expected)&&(t.mode!=='return'||(!c.printed&&!parsed.initialOutput))};})};
 }catch{return {...result,diagnostic:'El programa no devolvió resultados de prueba válidos. Revisa errores, salida previa o llamadas a exit().'};}
}
const phpFlags=['-d','display_errors=stderr','-d','log_errors=0','-d','memory_limit=64M','-d','max_execution_time=3','-d','allow_url_fopen=0','-d','allow_url_include=0','-d','disable_functions=exec,passthru,shell_exec,system,proc_open,popen,pcntl_exec,dl','-r',harness];
export function runInDocker(payload){
 const name='estudio-php-'+randomUUID();
 const args=['run','--rm','--pull=never','--name',name,'-i','--network','none','--read-only','--tmpfs','/tmp:rw,nosuid,nodev,noexec,size=24m,mode=1777','--cap-drop','ALL','--security-opt','no-new-privileges','--pids-limit','48','--memory','128m','--cpus','0.5','--user','65534:65534','--workdir','/tmp',PHP_IMAGE,'php',...phpFlags];
 return new Promise(resolve=>{
  let stdout='',stderr='',size=0,timedOut=false,truncated=false,done=false;
  const child=spawn('docker',args,{windowsHide:true,stdio:['pipe','pipe','pipe']});
  const cleanup=()=>{const c=spawn('docker',['rm','-f',name],{windowsHide:true,stdio:'ignore'});c.on('error',()=>{});c.unref();};
  const stop=()=>{child.kill();cleanup();};
  const timer=setTimeout(()=>{timedOut=true;stop();finish(null);},10000);
  function finish(code,diagnostic){if(done)return;done=true;clearTimeout(timer);if(timedOut||truncated)cleanup();resolve(decodeResult(payload,{stdout,stderr,exitCode:code,timedOut,truncated,diagnostic}));}
  function collect(chunk,which){size+=chunk.length;if(size>65536){truncated=true;stop();finish(null);return;}if(which==='out')stdout+=chunk.toString();else stderr+=chunk.toString();}
  child.stdout.on('data',c=>collect(c,'out'));child.stderr.on('data',c=>collect(c,'err'));
  child.on('error',e=>finish(null,'No se pudo iniciar Docker: '+e.message));
  child.on('close',code=>finish(code,code===125?'Docker no disponible o imagen php:8.2-cli ausente. Revisa Docker Desktop y ejecuta docker pull php:8.2-cli.':undefined));
  child.stdin.on('error',()=>{});child.stdin.end(encodePayload(payload));
 });
}
// Only for trusted bank fixtures during development. Never called by the HTTP endpoint.
export function fixtureHarness(){return harness;}
