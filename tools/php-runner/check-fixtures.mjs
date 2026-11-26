import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fixtureHarness,encodePayload,decodeResult,validatePayload} from './core.mjs';
// The local PHP CLI runs only the audited reference solutions bundled in the bank, never user-submitted code.
const raw=readFileSync('src/app/data/dwcs.questions.ts','utf8');
const qs=JSON.parse(raw.match(/Question\[\] = (\[[\s\S]*\]);/)[1]);
let interpreted=0,functions=0,cases=0;
for(const q of qs){
 if(q.codeTask==='interpret'){
  const x=spawnSync('php',[],{input:q.code,encoding:'utf8',timeout:4000,maxBuffer:65536});
  if(x.error||x.status!==0||x.stderr||x.stdout.replace(/\n+$/,'')!==q.expectedOutput.replace(/\n+$/,''))throw Error(`${q.id} salida inesperada: ${x.stdout} ${x.stderr}`);
  interpreted++;
 }
 if(q.phpTests?.length){
  const dir=mkdtempSync(join(tmpdir(),'estudio-fixture-'));
  try{
   const payload=validatePayload({files:{'solucion.php':q.solution},entry:'solucion.php',stdin:'',tests:q.phpTests});
   const harness=fixtureHarness().replace("'/tmp/estudio'",JSON.stringify(join(dir,'code').replaceAll('\\','/')));
   const x=spawnSync('php',['-d','display_errors=stderr','-r',harness],{input:encodePayload(payload),encoding:'utf8',timeout:4000,maxBuffer:65536});
   if(x.error||x.stderr||x.status!==0)throw Error(`${q.id}: ${x.stderr}`);
   const result=decodeResult(payload,{stdout:x.stdout,stderr:x.stderr,exitCode:x.status});
   if(!result.tests||result.tests.some(t=>!t.passed))throw Error(`${q.id}: ${JSON.stringify(result)}`);
   functions++;cases+=result.tests.length;
  }finally{rmSync(dir,{recursive:true,force:true});}
 }
}
console.log(`PHP CLI verificado: ${interpreted} interpretaciones y ${cases} pruebas de funciones en ${functions} ejercicios. Solo soluciones de referencia; no prueba el motor Docker.`);
