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
 const page=await browser.newPage({serviceWorkers:'block'});await page.goto(base+'/inicio');
 const run=async(q,draft,check,fullscreen=false)=>{
  await page.evaluate(({q,draft})=>{
   const files=q.starterFiles?{...q.starterFiles,[Object.keys(q.starterFiles).find(name=>name.endsWith('.php'))??'solucion.php']:draft}:{};
   localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[q.id],pointer:0,selected:[],draft,revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,history:[],answers:[],files,config:{subjectId:'dwcs',units:[q.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:false,weakOnly:false,strict:false}}));
  },{q,draft});
  await page.goto(base+'/estudiar');
  if(fullscreen){
   await page.locator('app-code-workspace .cm-content').waitFor();
   await page.getByRole('button',{name:'Opciones del editor',exact:true}).click();
   await page.getByRole('button',{name:'Ampliar editor',exact:true}).click();
   await page.locator('app-code-workspace .editor-expanded').waitFor();
   await page.locator('app-code-workspace').getByRole('button',{name:check?'Corregir':'Ejecutar',exact:true}).click();
   await page.waitForFunction(()=>!document.querySelector('app-code-workspace .editor-expanded'));
  }else await page.locator('app-php-runner .php-quick-actions').getByRole('button',{name:check?'Corregir':'Ejecutar',exact:true}).click();
  await page.waitForFunction(()=>{const root=document.querySelector('app-php-runner');return root&&(root.querySelector('.academic-runner-result')||root.querySelector('[role="alert"]'));},null,{timeout:45000});
  const error=await page.locator('app-php-runner [role="alert"]').allTextContents();assert(!error.length,q.id+': '+error.join(''));
  const rows=await page.locator('.academic-runner-test').allTextContents();const stdout=(await page.locator('.academic-runner-result').allTextContents()).join('\n');
  return {rows,stdout};
 };
 if(process.argv.includes('--manual-only')){
  const manual=questions.find(question=>question.consoleInput?.includes('30.48'));
  assert(manual&&!manual.phpTests?.length,'Manual fixture missing');
  await run(manual,manual.solution,false,true);
  await page.getByRole('button',{name:'Opciones del editor',exact:true}).click();
  await page.getByRole('button',{name:'Ampliar editor',exact:true}).click();
  await page.locator('app-code-workspace').getByRole('button',{name:'Corregir',exact:true}).click();
  await page.getByText('Este ejercicio no tiene casos automáticos. Revisa la solución y sus requisitos.',{exact:true}).waitFor();
  assert.equal(await page.locator('app-code-workspace .editor-expanded').count(),0,'Manual correction exits expanded editor');
  assert.equal(await page.locator('.academic-runner-test').count(),0,'Manual review never invents test results');
  assert((await page.locator('.academic-runner-result').innerText()).includes('12.00'),'Manual review preserves previous real output');
  console.log('Manual quick correction: explanatory status shown, fullscreen closed, previous execution kept, no automatic pass invented.');
 }else{
 let cases=0;
 const references=questions.filter(q=>q.phpTests?.length).slice(0,process.argv.includes('--focal')?1:undefined);
 for(const q of references){
  const result=await run(q,q.solution,true);
  assert.equal(result.rows.length,q.phpTests.length,q.id+' missing cases');
  assert(result.rows.every(row=>row.startsWith('✓')),q.id+': '+result.rows.join('\n'));cases+=result.rows.length;
 }
 const q=questions.find(q=>q.phpTests?.length);
 const wrong=await run(q,'<?php function inches(float $cm):float{return $cm*2.54;}',true);
 assert(wrong.rows.some(row=>row.startsWith('✗')),'Wrong solution passed');
 const syntax=await run(q,'<?php function inches( {',true);assert(syntax.rows.some(row=>row.startsWith('✗')&&/ParseError|syntax error|sintaxis/.test(row)),'Syntax error hidden');
 const forged=await run(q,`<?php while(ob_get_level()>1)ob_end_clean();echo json_encode(['initialOutput'=>'','cases'=>[['actual'=>100,'printed'=>'','error'=>null],['actual'=>1,'printed'=>'','error'=>null],['actual'=>0,'printed'=>'','error'=>null]]]);exit;`,true);assert(forged.rows.every(row=>row.startsWith('✗')),'Forged stdout JSON accepted');
 const expandedCheck=await run(q,q.solution,true,true);assert(expandedCheck.rows.every(row=>row.startsWith('✓')),'Expanded quick check failed');
 const expandedExecute=await run(q,q.solution,false,true);assert(expandedExecute.stdout.includes('El programa no ha escrito nada'),'Expanded quick execute must show real empty stdout');
 await page.locator('app-code-workspace .cm-content').fill('<?php echo "versión nueva";');await page.getByText('El resultado corresponde a una versión anterior del código.',{exact:true}).waitFor();
 const warning=await run(q,'<?php trigger_error("Aviso de prueba",E_USER_WARNING);echo "OK";',false);assert(warning.stdout.includes('con avisos')&&warning.stdout.includes('Aviso de prueba'),'Warning incorrectly shown as clean execution');
 const consoleQuestion=questions.find(q=>q.consoleInput?.includes('30.48'));
 if(consoleQuestion){const output=await run(consoleQuestion,consoleQuestion.solution,false);assert(output.stdout.includes('12.00')&&output.stdout.includes('1.00'),'Real console conversion incorrect');}
 console.log(`Quick exercise UI passed: ${references.length} reference solutions, ${cases} real function test cases; wrong implementation, syntax error and forged protocol rejected; fullscreen execute/check, stale result, warning and STDIN conversion verified.`);
 }
}finally{await browser.close();staticServer?.close();}
