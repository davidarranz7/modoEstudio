import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import {build} from 'esbuild';
import {playwright,chromeLaunchOptions} from './browser-test-support.mjs';

const compiled=await build({stdin:{contents:"export {PhpCheckService} from './src/app/core/php-check.service';export {evaluateProjectStep,evaluateProjectStaticCheck} from './src/app/core/project-evaluation';export {PHP_PROJECTS} from './src/app/data/php-projects';",resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'browser',tsconfig:'tsconfig.app.json',plugins:[{name:'angular-state-only',setup(builder){builder.onResolve({filter:/^@angular\/core$/},()=>({path:'state',namespace:'state'}));builder.onLoad({filter:/.*/,namespace:'state'},()=>({contents:'export const Injectable=()=>target=>target;export const signal=value=>{const getter=()=>value;getter.set=next=>value=next;getter.update=fn=>value=fn(value);return getter;};',loader:'js'}));}}]});
const root=resolve('public');
const server=createServer(async(request,response)=>{try{if(request.url==='/check.js'){response.setHeader('Content-Type','text/javascript');return response.end(compiled.outputFiles[0].text);}const path=resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://local').pathname));if(path!==root&&!path.startsWith(root+sep))throw Error('path');response.setHeader('Content-Type',({'.js':'text/javascript','.wasm':'application/wasm'})[extname(path)]??'text/html');response.end(request.url==='/'?'<!doctype html><title>Technical evaluator tests</title>':await readFile(path));}catch{response.writeHead(404);response.end('not found');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const engine=process.argv.includes('--webkit')?'webkit':'chromium';
const browser=await playwright[engine].launch(engine==='chromium'?chromeLaunchOptions():{headless:true});
try{
 const page=await browser.newPage();await page.exposeFunction('progress',value=>console.log(value));await page.goto('http://127.0.0.1:'+server.address().port);
 const result=await page.evaluate(async()=>{
  const {PhpCheckService,evaluateProjectStep,evaluateProjectStaticCheck,PHP_PROJECTS}=await import('/check.js');const fixtures=[];
  const expect=(label,passed,actual)=>fixtures.push({label,passed:!!passed,...(!passed?{actual}:{})});
  const response=body=>({body,stdout:body,stderr:'',exitCode:0,status:200,headers:{},cookies:{},session:{},files:{},elapsedMs:1,requestHeaders:{}});
  const form=PHP_PROJECTS.find(project=>project.id==='ud2-reserva-deportiva').tests.find(test=>test.id==='form').steps[0];
  const header='Natación Pádel Yoga';
  for(const [label,controls] of [
   ['named divs','<div name="nombre"></div><div name="actividad"></div><div name="sesiones"></div>'],
   ['disabled controls','<input name="nombre" disabled><input name="actividad" disabled><input name="sesiones" disabled>'],
   ['disabled fieldset','<fieldset disabled><input name="nombre"><input name="actividad"><input name="sesiones"></fieldset>'],
   ['only submit controls','<input name="nombre" type="submit"><input name="actividad" type="button"><input name="sesiones" type="reset">']
  ])expect('Reject '+label,evaluateProjectStep(form,response(header+'<form method="POST" action="procesar.php">'+controls+'</form>')).length>0);
  expect('Accept equivalent enabled form',!evaluateProjectStep(form,response(header+"<form method='post' action='./procesar.php'><input name='nombre'><select name='actividad'><option>Yoga</option></select><input name='sesiones'></form>")).length);
  expect('Accept controls associated outside form',!evaluateProjectStep(form,response(header+'<form id="booking" method="post" action="procesar.php"></form><input form="booking" name="nombre"><input form="booking" name="actividad"><input form="booking" name="sesiones">')).length);
  const upload=PHP_PROJECTS.find(project=>project.id==='ud2-subida-texto');const uploadForm=upload.tests.find(test=>test.id==='form').steps[0];const uploadPeers=upload.tests.flatMap(test=>test.steps);
  expect('Reject text input replacing the existing uploaded field',evaluateProjectStep(uploadForm,response('<form method="post" action="procesar.php" enctype="multipart/form-data"><input type="text" name="entrega"></form>'),uploadPeers).length>0);
  expect('Accept multipart with file plus ordinary text controls',!evaluateProjectStep(uploadForm,response('<form method="post" action="procesar.php" enctype="multipart/form-data"><input type="file" name="entrega"><input name="observacion"></form>'),uploadPeers).length);
  const sports=PHP_PROJECTS.find(project=>project.id==='ud2-reserva-deportiva');const amount=sports.tests.find(test=>test.id==='paddle').steps[0];const peers=sports.tests.flatMap(test=>test.steps);
  const all='Total: 24.00 Total: 81.00 Total: 68.00';expect('Reject printing all known numeric answers',evaluateProjectStep(amount,response(all),peers).length>0);
  expect('Accept equivalent comma decimal',!evaluateProjectStep(amount,response('Total: 81,00'),peers).length);
  expect('Reject warning despite exit zero',evaluateProjectStep(amount,{...response('Total: 81.00'),diagnostics:[{severity:'warning',kind:'warning',message:'Warning',explanation:'Warning'}]},peers).length>0);
  for(const body of ['<?php // password_verify($p,$h)\necho 1;','<?php echo "password_verify(";','<?php $s=<<<TXT\npassword_verify(\nTXT;\necho 1;'])expect('Reject static match in trivia '+body.slice(0,30),evaluateProjectStaticCheck({file:'f.php',pattern:'password_verify\\s*\\('},{'f.php':body}).length>0);
  expect('Accept actual PHP call',!evaluateProjectStaticCheck({file:'f.php',pattern:'password_verify\\s*\\('},{'f.php':'<?php $ok=password_verify($p,$hash);'}).length);
  expect('Reject fake PHPDoc string',evaluateProjectStaticCheck({file:'f.php',pattern:'@param[\\s\\S]*?@return'},{'f.php':'<?php $fake="/** @param int $a @return int */ function suma() {}";'}).length>0);
  expect('Accept actual PHPDoc next to function',!evaluateProjectStaticCheck({file:'f.php',pattern:'@param[\\s\\S]*?@return'},{'f.php':'<?php /** @param int $a\n * @return int */\nfunction suma(int $a): int {return $a;}'}).length);
  const reference=[];const service=new PhpCheckService();
  for(const project of PHP_PROJECTS){const files=Object.fromEntries(project.files.map(file=>[file.path,file.solution]));const results=await service.check(project,files);const failed=results.filter(result=>!result.passed);reference.push({id:project.id,total:results.length,failed});await window.progress(project.id+': '+(results.length-failed.length)+'/'+results.length+' checks');}
  const hardened=[];
  const files=Object.fromEntries(sports.files.map(file=>[file.path,file.solution]));files['procesar.php']='<?php echo '+JSON.stringify(all)+';';
  const bad=await service.check(sports,files);hardened.push({label:'Real PHP prints literal known answers',rejected:bad.some(result=>!result.passed)});
  service.cancel();return {fixtures,reference,hardened,scenarios:PHP_PROJECTS.reduce((sum,project)=>sum+project.tests.length,0),requests:PHP_PROJECTS.reduce((sum,project)=>sum+project.tests.reduce((count,test)=>count+test.steps.length,0),0)};
 });
 console.log(JSON.stringify({engine,fixtures:result.fixtures,referenceFailures:result.reference.filter(project=>project.failed.length),hardened:result.hardened,scenarios:result.scenarios,requests:result.requests},null,2));
 assert.ok(result.fixtures.every(fixture=>fixture.passed));assert.ok(result.reference.every(project=>!project.failed.length),'Existing reference projects must keep passing');assert.ok(result.hardened.every(fixture=>fixture.rejected));
}finally{await browser.close();server.close();server.closeAllConnections();}
