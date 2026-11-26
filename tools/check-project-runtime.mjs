import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import ts from 'typescript';

import {playwright,chromeLaunchOptions} from './browser-test-support.mjs';
const source=await readFile('src/app/data/php-projects.ts','utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {PHP_PROJECTS}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const root=resolve('public');
const server=createServer(async(req,res)=>{
 try {
  const path=resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(path!==root&&!path.startsWith(root+sep))throw Error('path outside public');
  const content=req.url==='/'?Buffer.from('<!doctype html><title>ESTUDIO project verification</title>'):await readFile(path);
  res.setHeader('Content-Type',({'.js':'text/javascript','.wasm':'application/wasm','.html':'text/html'})[extname(path)]??'text/plain');res.end(content);
 }catch{res.writeHead(404);res.end('not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const engine=process.argv.includes('--webkit')?'webkit':'chromium';
const launch=engine==='chromium'?chromeLaunchOptions():{headless:true};
let browser;
try {
 browser=await playwright[engine].launch(launch);
 const page=await browser.newPage();
 await page.exposeFunction('projectProgress',message=>console.log(message));
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 const result=await page.evaluate(async projects=>{
  const worker=new Worker('/php-runtime/worker.js',{type:'module'});let sequence=0;
  const send=(action,payload)=>new Promise((resolve,reject)=>{
   const id=++sequence,timer=setTimeout(()=>{worker.terminate();reject(Error('PHP worker timed out'));},45000);
   worker.onmessage=({data})=>{if(data.id!==id)return;clearTimeout(timer);data.error?reject(Error(data.error)):resolve(data.result);};
   worker.onerror=e=>{clearTimeout(timer);reject(Error(e.message));};worker.postMessage({id,action,...payload});
  });
  const evaluateResponse=(response,expected,requestUrl)=>{
   const problems=[];
   const parsed=new DOMParser().parseFromString(response.body,'text/html');
   parsed.querySelectorAll('script,style').forEach(node=>node.remove());
   const text=(parsed.body.textContent??'').replace(/\s+/g,' ').trim();
   const normalize=location=>new URL(location,'https://estudio-lab.invalid'+requestUrl).href;
   if(response.exitCode!==0)problems.push('PHP exit '+response.exitCode);
   if(response.stderr)problems.push('PHP error: '+response.stderr);
   if(response.truncated)problems.push('Truncated output');
   if(expected.status!==undefined&&response.status!==expected.status)problems.push(`Status ${response.status}, expected ${expected.status}`);
   for(const text of expected.bodyIncludes??[])if(!response.body.includes(text))problems.push('Missing: '+text);
   for(const text of expected.bodyExcludes??[])if(response.body.includes(text))problems.push('Unexpected: '+text);
   for(const expectedText of expected.textIncludes??[])if(!text.includes(expectedText))problems.push('Missing rendered text: '+expectedText);
   for(const forbiddenText of expected.textExcludes??[])if(text.includes(forbiddenText))problems.push('Unexpected rendered text: '+forbiddenText);
   if(expected.form){
    const form=expected.form;
    const matches=Array.from(parsed.forms).some(element=>
     (element.getAttribute('method')??'GET').toUpperCase()===form.method &&
     normalize(element.getAttribute('action')||requestUrl)===normalize(form.action) &&
     form.fields.every(name=>Array.from(element.elements).some(field=>field.getAttribute('name')===name)) &&
     (!form.enctype||(element.getAttribute('enctype')??'application/x-www-form-urlencoded').toLowerCase()===form.enctype.toLowerCase())
    );
    if(!matches)problems.push('No form matches method, target and field names: '+JSON.stringify(form));
   }
   if(expected.location!==undefined&&(!response.headers.location?.[0]||normalize(response.headers.location[0])!==normalize(expected.location)))problems.push('Location: '+response.headers.location?.[0]+', expected '+expected.location);
   for(const name of expected.cookieNames??[])if(!Object.hasOwn(response.cookies,name))problems.push('Cookie missing: '+name);
   for(const name of expected.absentCookies??[])if(Object.hasOwn(response.cookies,name))problems.push('Cookie still present: '+name);
   return problems;
  };
  async function scenario(files,test){
   await send('open',{files});const outcomes=[];
   for(const step of test.steps){
    const body={...(step.body??{})};
    for(const upload of step.uploads??[])body[upload.field]=new File([upload.content],upload.name,{type:upload.type??'application/octet-stream'});
    const response=await send('request',{request:{method:step.method,url:step.url,...(Object.keys(body).length?{body}:{})}});
    const problems=evaluateResponse(response,step.expect,step.url);
    outcomes.push({url:step.url,passed:problems.length===0,...(problems.length?{problems,body:response.body.slice(0,1500)}:{})});
   }
   return {id:test.id,label:test.label,passed:outcomes.every(x=>x.passed),requests:outcomes};
  }
  const results=[];
  try {
   for(const project of projects){
    const files=Object.fromEntries(project.files.map(file=>[file.path,file.solution]));
    const tests=[];
    for(const test of project.tests)tests.push(await scenario(files,test));
    const starterFiles=Object.fromEntries(project.files.filter(file=>file.role!=='create').map(file=>[file.path,file.starter]));
    let starterFailure=null;
    for(const test of project.tests){
     const outcome=await scenario(starterFiles,test);
     if(!outcome.passed){starterFailure=outcome.id;break;}
    }
    results.push({id:project.id,passed:tests.every(t=>t.passed),tests,starterRejected:starterFailure!==null,starterFailure});
    await window.projectProgress(`${project.id}: ${tests.filter(t=>t.passed).length}/${tests.length} reference scenarios; incomplete starter ${starterFailure?'rejected':'NOT rejected'}`);
   }
   // Realistic logic defects, rather than replacing the answer with an obviously wrong stub.
   const mutations=[
    {id:'ud2-reserva-deportiva',file:'funciones.php',from:'$sesiones >= 8 ? 0.15',to:'$sesiones > 8 ? 0.15',test:'yoga',label:'Wrong discount boundary at eight sessions'},
    {id:'ud3-login-json',file:'validar.php',from:"!password_verify($password,$usuario['password'])",to:'false',test:'wrong',label:'Password verification bypass'},
    {id:'ud3-roles',file:'admin.php',from:"if(($_SESSION['rol']??'')!=='admin')",to:'if(false)',test:'user',label:'Authorization bypass'}
   ];
   const mutationResults=[];
   for(const mutation of mutations){
    const project=projects.find(p=>p.id===mutation.id);
    const files=Object.fromEntries(project.files.map(file=>[file.path,file.solution]));
    if(!files[mutation.file].includes(mutation.from))throw Error('Mutation did not apply: '+mutation.label);
    files[mutation.file]=files[mutation.file].replace(mutation.from,mutation.to);
    const outcome=await scenario(files,project.tests.find(t=>t.id===mutation.test));
    mutationResults.push({label:mutation.label,rejected:!outcome.passed,outcome});
   }
   const equivalent=[];
   {
    const project=projects.find(p=>p.id==='ud2-reserva-deportiva');
    const files=Object.fromEntries(project.files.map(file=>[file.path,file.solution]));
    files['index.php']=files['index.php'].replace('method="post"',"method='POST'").replace('action="procesar.php"',"action='./procesar.php'");
    const outcome=await scenario(files,project.tests.find(t=>t.id==='form'));
    equivalent.push({label:'Equivalent form attributes: uppercase method, single quotes, relative action',passed:outcome.passed,outcome});
   }
   {
    const project=projects.find(p=>p.id==='ud3-login-json');
    const files=Object.fromEntries(project.files.map(file=>[file.path,file.solution]));
    files['validar.php']=files['validar.php'].replace('Location: privada.php','Location: /privada.php');
    const outcome=await scenario(files,project.tests.find(t=>t.id==='valid'));
    equivalent.push({label:'Equivalent redirect with root-relative path',passed:outcome.passed,outcome});
   }
   return {projects:results,mutations:mutationResults,equivalent};
  } finally {worker.terminate();}
 },PHP_PROJECTS);
 const summary={engine,date:new Date().toISOString(),projectCount:result.projects.length,scenarios:result.projects.reduce((sum,p)=>sum+p.tests.length,0),requests:result.projects.reduce((sum,p)=>sum+p.tests.reduce((n,t)=>n+t.requests.length,0),0),referenceFailures:result.projects.flatMap(p=>p.tests.filter(t=>!t.passed).map(t=>({project:p.id,...t}))),incompleteStartersRejected:result.projects.filter(p=>p.starterRejected).length,...result};
 await writeFile(`.local-project-runtime-${engine}.json`,JSON.stringify(summary,null,2));
 console.log(JSON.stringify({engine,projects:summary.projectCount,scenarios:summary.scenarios,requests:summary.requests,incompleteStartersRejected:summary.incompleteStartersRejected,referenceFailures:summary.referenceFailures,mutations:result.mutations.map(m=>({label:m.label,rejected:m.rejected})),equivalent:result.equivalent.map(m=>({label:m.label,passed:m.passed}))},null,2));
 assert(summary.referenceFailures.length===0,'Reference PHP project solutions must pass all behavioral scenarios.');
 assert.equal(summary.incompleteStartersRejected,PHP_PROJECTS.length,'Every incomplete project must fail an actual execution check.');
 assert(result.mutations.every(m=>m.rejected),'Realistic wrong solutions must be rejected.');
 assert(result.equivalent.every(m=>m.passed),'Equivalent correct implementations must be accepted.');
} finally {await browser?.close();await new Promise(r=>server.close(r));}
