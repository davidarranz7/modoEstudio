import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {playwright,chromeLaunchOptions} from './browser-test-support.mjs';
import {serveWorkspace} from './workspace-test-server.mjs';

const source=await readFile('src/app/data/dwcs.questions.ts','utf8');
const questions=JSON.parse(source.match(/Question\[\] = (\[[\s\S]*\]);/)[1]);
const webkit=process.argv.includes('--webkit'),name=webkit?'webkit':'chrome';
const server=await serveWorkspace(),browser=await(webkit?playwright.webkit:playwright.chromium).launch(webkit?{headless:true}:chromeLaunchOptions());
try{
 const page=await browser.newPage({...playwright.devices['iPhone 13'],serviceWorkers:'block'}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(server.url+'/inicio');
 const open=async(question,files={},strict=false)=>{
  await page.evaluate(({q,files,strict})=>localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[q.id],pointer:0,selected:[],draft:'',revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,history:[],answers:[],files,config:{subjectId:'dwcs',units:[q.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:false,weakOnly:false,strict}})),{q:question,files,strict});
  await page.goto(server.url+'/estudiar');await page.locator('.cm-content[contenteditable=true]').waitFor();
 };
 const editor=page.locator('.cm-content[contenteditable=true]'),actions=page.locator('app-php-runner .php-quick-actions');
 const fixes=questions.filter(q=>q.format==='fix-code'&&q.starterFiles);
 assert.equal(fixes.length,6);
 for(const q of fixes){
  await open(q);
  assert.match(await editor.innerText(),/\{\n    /,`${q.id}: initial source has real line breaks and indentation`);
  assert.equal(await page.locator('app-code-workspace .cm-scroller').evaluate(element=>element.scrollWidth>element.clientWidth),false,`${q.id}: no horizontal scroll for the initial code`);
 }
 const q=fixes.find(q=>q.id==='DWCS-R17-U2-262');
 await open(q,q.starterFiles);
 assert.match(await editor.innerText(),/\{\n    echo \$price \* \$qty;\n\}/,'Existing untouched templates are also readable');
 await page.getByText('Valor devuelto esperado',{exact:true}).waitFor();
 await page.getByText('La función debe devolver este valor con return. No necesita imprimirlo.',{exact:true}).waitFor();
 await mkdir('test-results',{recursive:true});
 await page.locator('app-code-workspace').screenshot({path:`test-results/fix-code-${name}.png`});
 await actions.getByRole('button',{name:'Ejecutar',exact:true}).click();
 await page.locator('.php-printed-output').filter({hasText:/^15$/}).waitFor({timeout:45000});
 assert.equal(await page.locator('.php-return-value').count(),0,'Echo in a float-returning function is not presented as a successful return');
 await actions.getByRole('button',{name:'Corregir',exact:true}).click();
 await page.getByText('Comprobación finalizada · 0 / 1 pruebas superadas',{exact:true}).waitFor({timeout:45000});
 const corrected='<?php\nfunction total(float $price, int $qty): float {\n    return $qty * $price;\n}';
 await editor.fill(corrected);await actions.getByRole('button',{name:'Ejecutar',exact:true}).click();
 await page.locator('.php-return-value').filter({hasText:/^15$/}).waitFor({timeout:45000});
 await page.locator('.php-no-printed-output').waitFor();
 assert.equal(await page.locator('.academic-runner-test').count(),0,'Execution does not grade the exercise');
 await actions.getByRole('button',{name:'Corregir',exact:true}).click();
 await page.getByText('Comprobación finalizada · 1 / 1 pruebas superadas',{exact:true}).waitFor({timeout:45000});
 await editor.fill(corrected.replace('return $qty * $price;','echo 15; return $qty * $price;'));
 await actions.getByRole('button',{name:'Corregir',exact:true}).click();
 await page.getByText('Comprobación finalizada · 0 / 1 pruebas superadas',{exact:true}).waitFor({timeout:45000});
 const draft='<?php function total(float $price,int $qty):float { return 42; } // Mi borrador';
 await open(q,{'solucion.php':draft});
 assert.equal(await editor.innerText(),draft,'Saved student code is never reformatted');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('estudio-php-session-v1')).files['solucion.php']),draft);
 await open(q,{'solucion.php':corrected},true);
 assert(await actions.getByRole('button',{name:'Corregir',exact:true}).isDisabled());
 await actions.getByRole('button',{name:'Ejecutar',exact:true}).click();
 await page.locator('.php-return-value').filter({hasText:/^15$/}).waitFor({timeout:45000});
 assert.equal(await page.locator('.academic-runner-test').count(),0,'Strict execution does not expose correction');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);
 console.log(`${name}: seis plantillas formateadas sin desplazamiento horizontal; retorno y echo separados; corrección real acepta return y rechaza echo; borrador y examen estricto conservados.`);
}finally{await browser.close();server.close();}
