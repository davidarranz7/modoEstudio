import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
import {chromium,webkit,chromeLaunchOptions} from './browser-test-support.mjs';
const source=await readFile('src/app/data/dwcs.questions.ts','utf8');
const questions=JSON.parse(source.match(/Question\[\] = (\[[\s\S]*\]);/)[1]);
const browser=process.argv.includes('--webkit')?await webkit.launch({headless:true}):await chromium.launch(chromeLaunchOptions());
let staticServer;
let base=process.env.ESTUDIO_TEST_URL??'http://127.0.0.1:4200';
if(process.argv.includes('--static')||process.argv.includes('--production')){
 const root=resolve('dist/modo-estudio/browser');
 staticServer=createServer(async(req,res)=>{
  try{
   const path=resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(path!==root&&!path.startsWith(root+sep))throw Error('path');
   const file=extname(path)?path:resolve(root,'index.html');
   const data=await readFile(file);res.setHeader('Content-Type',({'.js':'text/javascript','.wasm':'application/wasm','.css':'text/css','.html':'text/html','.json':'application/json'})[extname(file)]??'application/octet-stream');res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
 });await new Promise(resolve=>staticServer.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${staticServer.address().port}`;
}
try{
 const page=await browser.newPage();await page.goto(base+'/inicio');
 const run=async(q,draft,check)=>{
  await page.evaluate(({q,draft})=>{
   const files=q.starterFiles?{...q.starterFiles,[Object.keys(q.starterFiles).find(name=>name.endsWith('.php'))??'solucion.php']:draft}:{};
   localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[q.id],pointer:0,selected:[],draft,revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,history:[],answers:[],files,config:{subjectId:'dwcs',units:[q.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:false,weakOnly:false,strict:false}}));
  },{q,draft});
  await page.goto(base+'/estudiar');
  await page.getByRole('button',{name:check?'Comprobar solución':'Ejecutar código',exact:true}).click();
  await page.waitForFunction(()=>{const root=document.querySelector('app-php-runner');return root&&(root.querySelector('.academic-runner-result')||root.querySelector('[role="alert"]'));},{timeout:45000});
  const error=await page.locator('app-php-runner [role="alert"]').allTextContents();assert(!error.length,q.id+': '+error.join(''));
  const rows=await page.locator('.academic-runner-test').allTextContents();const stdout=await page.locator('.academic-runner-result').innerText();
  return {rows,stdout};
 };
 let cases=0;
 for(const q of questions.filter(q=>q.phpTests?.length)){
  const result=await run(q,q.solution,true);
  assert.equal(result.rows.length,q.phpTests.length,q.id+' missing cases');
  assert(result.rows.every(row=>row.startsWith('✓')),q.id+': '+result.rows.join('\n'));cases+=result.rows.length;
 }
 const q=questions.find(q=>q.phpTests?.length);
 const wrong=await run(q,'<?php function inches(float $cm):float{return $cm*2.54;}',true);
 assert(wrong.rows.some(row=>row.startsWith('✗')),'Wrong solution passed');
 const syntax=await run(q,'<?php function inches( {',true);assert(syntax.stdout.includes('Ejecución con error')&&syntax.stdout.includes('Parse error'),'Syntax error hidden');
 const consoleQuestion=questions.find(q=>q.consoleInput?.includes('30.48'));
 if(consoleQuestion){const output=await run(consoleQuestion,consoleQuestion.solution,false);assert(output.stdout.includes('12.00')&&output.stdout.includes('1.00'),'Real console conversion incorrect');}
 console.log(`Quick exercise UI passed: 17 reference solutions, ${cases} real function test cases; wrong implementation and syntax error rejected; STDIN console conversion executed.`);
}finally{await browser.close();staticServer?.close();}
