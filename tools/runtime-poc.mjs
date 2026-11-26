import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {chromium,webkit,chromeLaunchOptions} from './browser-test-support.mjs';
const root=resolve('public');
const server=createServer(async(req,res)=>{
 try {const path=resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!path.startsWith(root))throw Error('path');
 const body=req.url==='/'?Buffer.from('<!doctype html><title>PHP WASM verification</title>'):await readFile(path);
 res.setHeader('Content-Type',({'.js':'text/javascript','.wasm':'application/wasm','.html':'text/html'})[extname(path)]??'text/html');res.end(body);
 }catch{res.writeHead(404);res.end('not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=process.argv.includes('--webkit')?await webkit.launch({headless:true}):await chromium.launch(chromeLaunchOptions());
try {
 const page=await browser.newPage();page.on('console',msg=>console.log('browser',msg.type(),msg.text()));page.on('pageerror',e=>console.error('pageerror',e));
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 const result=await page.evaluate(async()=>{
  const worker=new Worker('/php-runtime/worker.js',{type:'module'});let seq=0;const checks=[];
  const send=(action,data)=>new Promise((resolve,reject)=>{const id=++seq;const t=setTimeout(()=>reject(Error('timeout')),45000);worker.onmessage=({data})=>{if(data.id===id){clearTimeout(t);data.error?reject(Error(data.error)):resolve(data.result)}};worker.onerror=e=>reject(Error(e.message));worker.postMessage({id,action,...data});});
  const open=files=>send('open',{files}),request=input=>send('request',{request:input});
  const check=(name,ok,actual)=>{checks.push({name,passed:!!ok,...(!ok?{actual}: {})});};
  try{
   await open({'index.php':`<?php echo json_encode(['version'=>PHP_VERSION,'memory'=>ini_get('memory_limit'),'bridge'=>array_values(preg_grep('/^(js_|post_message|wasm)/',get_defined_functions()['internal']))]);`});
   let run=await request({url:'/index.php'});const info=JSON.parse(run.body);check('PHP 8.2 real',info.version.startsWith('8.2.'),run);check('64M PHP limit',info.memory==='64M',info);check('No PHP JS bridge',info.bridge.length===0,info);
   await open({'index.php':`<?php $a=trim(fgets(STDIN));$b=fscanf(STDIN,'%d %d');echo json_encode([$a,$b]);`});
   run=await request({url:'/index.php',stdin:'hola\n4 9\n'});check('fgets + fscanf STDIN',run.body==='["hola",[4,9]]',run);
   await open({'index.php':`<?php function valor(int $i){return [null,true,false,[],['x'=>[1,2.5]],0.1+0.2][$i];}echo json_encode(array_map('valor',range(0,5)));`});
   run=await request({url:'/index.php'});const typed=JSON.parse(run.body);check('Typed PHP null booleans arrays and decimals',typed[0]===null&&typed[1]===true&&typed[2]===false&&Array.isArray(typed[3])&&typed[4].x[1]===2.5&&Math.abs(typed[5]-0.3)<1e-8,run);
   await open({'index.php':`<?php require_once __DIR__.'/lib/f.php';require_once __DIR__.'/lib/f.php';include 'data.php';include_once 'data.php';echo sumar($n,3), '|', basename(__FILE__);file_put_contents('resultado.json',json_encode(['ok'=>true]));`,'lib/f.php':'<?php function sumar(int $a,int $b):int{return $a+$b;}','data.php':'<?php $n=7;'});
   run=await request({url:'/index.php'});check('Multifile include require once DIR FILE relative paths',run.body==='10|index.php',run);check('JSON virtual write',run.files['resultado.json']==='{"ok":true}',run);
   await open({'index.php':`<?php echo json_encode([$_GET,$_POST,$_SERVER['REQUEST_METHOD']]);`});
   run=await request({url:'/index.php?a=uno',method:'POST',body:{x:'dos',list:['a','b']}});check('GET POST array + REQUEST_METHOD',run.body==='[{"a":"uno"},{"x":"dos","list":["a","b"]},"POST"]',run);
   await open({'index.php':`<?php session_start();$_SESSION['n']=($_SESSION['n']??0)+1;setcookie('idioma','gl',time()+3600,'/');echo $_SESSION['n'].'|'.($_COOKIE['idioma']??'');`,'delete.php':`<?php session_start();unset($_SESSION['n']);setcookie('idioma','',time()-3600,'/');header('Location: /index.php');`});
   run=await request({url:'/index.php'});check('Session + cookie created',run.body==='1|'&&!!run.cookies.PHPSESSID&&run.cookies.idioma==='gl',run);
   run=await request({url:'/index.php'});check('Session + cookie persist',run.body==='2|gl'&&Object.values(run.session).some(x=>x.includes('n|i:2;')),run);
   run=await request({url:'/delete.php'});check('Cookie removal + redirect headers',run.status===302&&run.headers.location?.[0]==='/index.php'&&!run.cookies.idioma,run);
   run=await request({url:'/index.php'});check('Session unset',run.body==='1|',run);
   await open({'index.php':`<?php $hash=password_hash('estudio123',PASSWORD_BCRYPT,['cost'=>10]);echo json_encode(['hash'=>$hash,'valid'=>password_verify('estudio123',$hash),'invalid'=>password_verify('incorrecta',$hash)]);`});
   run=await request({url:'/index.php'});const password=JSON.parse(run.body);check('Real bcrypt password_verify',password.valid===true&&password.invalid===false,password);
   await open({'index.php':`<?php $file=$_FILES['archivo'];move_uploaded_file($file['tmp_name'],__DIR__.'/subido.txt');echo $file['name'].'|'.file_get_contents('subido.txt');`});
   run=await request({url:'/index.php',method:'POST',body:{archivo:new File(['contenido'],'ejemplo.txt',{type:'text/plain'})}});check('Multipart upload + move_uploaded_file',run.body==='ejemplo.txt|contenido',run);
   await open({'index.php':'<?php echo ;'});run=await request({url:'/index.php'});check('Syntax error detected',run.exitCode!==0&&/Parse error/.test(run.stderr+run.body),run);
   await open({'index.php':'<?php funcion_inexistente();'});run=await request({url:'/index.php'});check('Runtime error detected',run.exitCode!==0&&/undefined function/.test(run.stderr+run.body),run);
   await open({'index.php':`<?php echo json_encode([function_exists('system'),function_exists('js_eval'),function_exists('post_message_to_js'),function_exists('curl_exec'),ini_get('allow_url_fopen'),@file_get_contents('/internal/shared/php.ini')]);`});
   run=await request({url:'/index.php'});check('Network/host bridge/engine ini unavailable',run.body==='[false,false,false,false,"0",false]',run);
   await open({'index.php':`<?php echo isset($_COOKIE['idioma'])?'leak':'isolated';`});run=await request({url:'/index.php'});check('Project reset isolates FS cookies sessions',run.body==='isolated'&&!Object.keys(run.session).length&&!Object.keys(run.cookies).length,run);
   await open({'index.php':`<?php file_put_contents('/tmp/.estudio-bootstrap.php','<?php echo "INJECTED";');ini_set('memory_limit','96M');echo 'changed';`});await request({url:'/index.php'});
   await open({'index.php':`<?php echo 'clean|'.ini_get('memory_limit');`});run=await request({url:'/index.php'});check('Project reset removes tampered prepend and request ini changes',run.body==='clean|64M',run);
   await open({'index.php':`<?php unlink('/tmp/.estudio-bootstrap.php');mkdir('/tmp/.estudio-bootstrap.php');echo 'directory';`});await request({url:'/index.php'});
   await open({'index.php':`<?php echo 'restored';`});run=await request({url:'/index.php'});check('Project reset replaces directory at trusted prepend path',run.body==='restored',run);
   await open({'index.php':`<?php unlink('/tmp/.estudio-bootstrap.php');symlink('/tmp/sessions','/tmp/.estudio-bootstrap.php');echo 'symlink';`});await request({url:'/index.php'});
   await open({'index.php':`<?php echo 'unlinked';`});run=await request({url:'/index.php'});check('Project reset unlinks tampered prepend symlink',run.body==='unlinked',run);
   await open({'index.php':`<?php for($i=0;$i<10000;$i++)echo str_repeat('x',100);`});run=await request({url:'/index.php'});check('Output limit detected',run.truncated||run.exitCode!==0||/Límite de salida/.test(run.stderr),{length:run.body.length,stderr:run.stderr,exitCode:run.exitCode});
  }finally{worker.terminate();}
  const endless=new Worker('/php-runtime/worker.js',{type:'module'});
  await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('init timeout')),45000);endless.onmessage=()=>{clearTimeout(t);resolve()};endless.postMessage({id:1,action:'open',files:{'index.php':'<?php while(true){}'}})});
  endless.postMessage({id:2,action:'request',request:{url:'/index.php'}});
  const before=performance.now();await new Promise(resolve=>setTimeout(resolve,100));endless.terminate();check('Infinite loop cancellable without blocking UI',performance.now()-before<1500,performance.now()-before);
  return checks;
 });console.log(JSON.stringify(result,null,2));if(result.some(check=>!check.passed))process.exitCode=1;
 if(process.argv.includes('--bank')){
  const source=await readFile('src/app/data/dwcs.questions.ts','utf8');const questions=JSON.parse(source.match(/Question\[\] = (\[[\s\S]*\]);/)[1]);
  const bankResult=await page.evaluate(async(questions)=>{
   const worker=new Worker('/php-runtime/worker.js',{type:'module'});let sequence=0;const results=[];let functionCases=0;
   const send=(action,payload)=>new Promise((resolve,reject)=>{const id=++sequence;const timer=setTimeout(()=>reject(Error('timeout')),45000);worker.onmessage=({data})=>{if(data.id!==id)return;clearTimeout(timer);data.error?reject(Error(data.error)):resolve(data.result);};worker.postMessage({id,action,...payload});});
   const same=(a,b)=>{if(typeof a==='number'&&typeof b==='number')return Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b));if(a===b)return true;if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]));if(a&&b&&typeof a==='object'&&typeof b==='object')return Object.keys(a).length===Object.keys(b).length&&Object.keys(b).every(k=>Object.hasOwn(a,k)&&same(a[k],b[k]));return false;};
   try{for(const q of questions){
    if(q.codeTask==='interpret'){
     await send('open',{files:{'index.php':q.code}});const run=await send('request',{request:{url:'/index.php'}});
     const passed=run.exitCode===0&&!run.stderr&&run.body.replace(/\n+$/,'')===q.expectedOutput.replace(/\n+$/,'');
     results.push({id:q.id,type:'interpretation',passed,...(!passed?{expected:q.expectedOutput,actual:run.body,stderr:run.stderr}:{})});
    }
    if(q.phpTests?.length){
     const harness=`<?php $tests=json_decode(file_get_contents(__DIR__.'/tests.json'),true);ob_start();require __DIR__.'/solution.php';$initial=ob_get_clean();$cases=[];foreach($tests as $test){ob_start();$actual=call_user_func_array($test['functionName'],$test['args']);$printed=ob_get_clean();$cases[]=['actual'=>($test['mode']??'return')==='output'?$printed:$actual,'printed'=>$printed];}echo json_encode(['initial'=>$initial,'cases'=>$cases]);`;
     await send('open',{files:{'index.php':harness,'solution.php':q.solution,'tests.json':JSON.stringify(q.phpTests)}});const run=await send('request',{request:{url:'/index.php'}});
     let passed=false;try{const parsed=JSON.parse(run.body);passed=run.exitCode===0&&!run.stderr&&!parsed.initial&&parsed.cases.length===q.phpTests.length&&q.phpTests.every((test,i)=>same(parsed.cases[i].actual,test.expected));functionCases+=q.phpTests.length;}catch{}
     results.push({id:q.id,type:'function',passed,...(!passed?{actual:run.body,stderr:run.stderr}:{})});
    }
   }}finally{worker.terminate();}
   return{interpretations:results.filter(x=>x.type==='interpretation').length,functions:results.filter(x=>x.type==='function').length,functionCases,failures:results.filter(x=>!x.passed)};
  },questions);console.log(JSON.stringify(bankResult,null,2));if(bankResult.failures.length)process.exitCode=1;
 }
 if(process.argv.includes('--projects')){
  const projects=JSON.parse(await readFile('.local-project-fixtures.json','utf8'));
  const projectResults=await page.evaluate(async(projects)=>{
   const worker=new Worker('/php-runtime/worker.js',{type:'module'});let sequence=0;const result=[];
   const send=(action,payload)=>new Promise((resolve,reject)=>{const id=++sequence;const timer=setTimeout(()=>reject(Error('timeout')),45000);worker.onmessage=({data})=>{if(data.id!==id)return;clearTimeout(timer);data.error?reject(Error(data.error)):resolve(data.result);};worker.postMessage({id,action,...payload});});
   try{for(const project of projects){
    for(const test of project.tests){
     await send('open',{files:Object.fromEntries(project.files.map(file=>[file.path,file.solution]))});
     for(const [index,step] of test.steps.entries()){
      const body={...step.body};
      for(const upload of step.uploads??[])body[upload.field]=new File([upload.content],upload.name,{type:upload.type??'text/plain'});
      const response=await send('request',{request:{url:step.url,method:step.method,...(step.body||step.uploads?{body}:{})}}),expect=step.expect;
      const errors=[];
      if(response.exitCode!==0)errors.push('exit='+response.exitCode+' '+response.stderr+' '+response.body);
      if(expect.status!==undefined&&expect.status!==response.status)errors.push('status '+response.status+' expected '+expect.status);
      for(const value of expect.bodyIncludes??[])if(!response.body.includes(value))errors.push('missing '+value+' from '+response.body);
      for(const value of expect.bodyExcludes??[])if(response.body.includes(value))errors.push('unexpected '+value);
      if(expect.location!==undefined&&response.headers.location?.[0]!==expect.location)errors.push('location '+response.headers.location?.[0]);
      for(const name of expect.cookieNames??[])if(!Object.hasOwn(response.cookies,name))errors.push('missing cookie '+name);
      for(const name of expect.absentCookies??[])if(Object.hasOwn(response.cookies,name))errors.push('remaining cookie '+name);
      result.push({project:project.id,test:test.id,step:index+1,passed:!errors.length,...(errors.length?{errors}:{})});
     }
    }
   }}finally{worker.terminate();}return result;
  },projects);
  console.log(JSON.stringify({projectRequests:projectResults.length,passed:projectResults.filter(x=>x.passed).length,failures:projectResults.filter(x=>!x.passed)},null,2));
  if(projectResults.some(x=>!x.passed))process.exitCode=1;
 }
}finally{await browser.close();server.close();}
