import {createServer} from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {chromium,chromeLaunchOptions} from './browser-test-support.mjs';
const root=resolve('public');
const server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(path!==root&&!path.startsWith(root+sep))throw Error('path');res.setHeader('Content-Type',extname(path)==='.js'?'text/javascript':extname(path)==='.wasm'?'application/wasm':'text/html');res.end(req.url==='/'?'<!doctype html><title>PHP reflection</title>':await readFile(path));}catch{res.writeHead(404);res.end('not found');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch(chromeLaunchOptions());
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);
 const catalog=await page.evaluate(async()=>{
  const worker=new Worker('/php-runtime/worker.js',{type:'module'});let id=0;
  const send=(action,payload)=>new Promise((resolve,reject)=>{const next=++id;const timer=setTimeout(()=>reject(Error('PHP reflection timed out')),45000);worker.onmessage=({data})=>{if(data.id!==next)return;clearTimeout(timer);data.error?reject(Error(data.error)):resolve(data.result);};worker.postMessage({id:next,action,...payload});});
  try{
   await send('open',{files:{'index.php':`<?php
$out=[];foreach(get_defined_functions()['internal'] as $name){$f=new ReflectionFunction($name);$params=[];foreach($f->getParameters() as $p){$row=['name'=>$p->getName(),'optional'=>$p->isOptional(),'variadic'=>$p->isVariadic(),'byReference'=>$p->isPassedByReference()];if($p->hasType())$row['type']=(string)$p->getType();if($p->isDefaultValueAvailable()){try{$row['default']=$p->isDefaultValueConstant()?$p->getDefaultValueConstantName():var_export($p->getDefaultValue(),true);}catch(Throwable $e){}}$params[]=$row;}$row=['name'=>$name,'params'=>$params];$t=$f->getReturnType();if(!$t&&$f->hasTentativeReturnType())$t=$f->getTentativeReturnType();if($t)$row['returnType']=(string)$t;$out[]=$row;}
foreach(array_chunk($out,80) as $i=>$chunk)file_put_contents('catalog'.$i.'.json',json_encode($chunk,JSON_INVALID_UTF8_SUBSTITUTE));
$constants=[];foreach(get_defined_constants(true) as $group=>$items){if($group==='user')continue;foreach($items as $name=>$value){$row=['name'=>$name,'type'=>get_debug_type($value)];if((is_scalar($value)||is_null($value))&&!(is_float($value)&&!is_finite($value)))$row['value']=$value;$constants[]=$row;}}
file_put_contents('constants.json',json_encode($constants,JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR));echo PHP_VERSION;`}});
   const response=await send('request',{request:{url:'/index.php'}});if(response.exitCode!==0)throw Error(response.stderr||response.body);
   return {version:response.body,functions:Object.entries(response.files).filter(([name])=>/^catalog\d+\.json$/.test(name)).flatMap(([,value])=>JSON.parse(value)).sort((a,b)=>a.name.localeCompare(b.name)),constants:JSON.parse(response.files['constants.json'])};
  }finally{worker.terminate();}
 });
 await writeFile('src/app/core/editor-php-runtime.json',JSON.stringify(catalog)+'\n');
 console.log(`PHP ${catalog.version}: ${catalog.functions.length} real available functions and ${catalog.constants.length} constants reflected.`);
}finally{await browser.close();server.close();}
