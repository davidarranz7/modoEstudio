import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {playwright,chromeLaunchOptions} from './browser-test-support.mjs';
import {serveWorkspace} from './workspace-test-server.mjs';
const source=await readFile('src/app/data/dwcs.questions.ts','utf8');
const questions=JSON.parse(source.match(/Question\[\] = (\[[\s\S]*\]);/)[1]);
const question=questions.find(question=>question.id==='DWCS-R17-U2-156');
assert(question);
const webkit=process.argv.includes('--webkit');
const predictionOnly=process.argv.includes('--prediction-only');
const server=await serveWorkspace(),browser=await(webkit?playwright.webkit:playwright.chromium).launch(webkit?{headless:true}:chromeLaunchOptions());
try{
 const page=await browser.newPage({...playwright.devices['iPhone 13']});
 const errors=[],runtimeRequests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(request.url().includes('/php-runtime/'))runtimeRequests.push(request.url());});
 await page.goto(server.url+'/inicio');
 await page.evaluate(q=>localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[q.id],pointer:0,selected:[],draft:'Mi explicación',revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,history:[],answers:[],files:{},config:{subjectId:'dwcs',units:[q.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:false,weakOnly:false,strict:false}})),question);
 await page.goto(server.url+'/estudiar');
 await page.locator('app-code-snippet .snippet-variable').first().waitFor();
 assert.equal((await page.locator('app-code-snippet .snippet-text').allTextContents()).join('\n').replace(/\s/g,''),question.code.replace(/\s/g,''),'Read-only formatting preserves the code');
 assert((await page.locator('app-code-snippet .snippet-line').count())>question.code.split('\n').length,'Compressed statements are displayed on separate lines');
 assert.equal(await page.locator('app-php-scratchpad,app-php-runner,[contenteditable=true],.expected-output-answer').count(),0,'No executable editor or output before answering');
 assert.equal(runtimeRequests.length,0,'Reading a prediction question does not load PHP');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Read-only source scrolls inside its own box');
 await mkdir('test-results',{recursive:true});
 await page.screenshot({path:`test-results/prediction-${webkit?'webkit':'chrome'}.png`,fullPage:true});
 await page.getByRole('button',{name:'Ver salida y explicación',exact:true}).click();
 await page.locator('.expected-output-answer').waitFor();
 assert.equal((await page.locator('.expected-output-answer pre').innerText()).trim(),question.expectedOutput.trim());
 assert.equal(await page.locator('.own-draft pre').innerText(),'Mi explicación');
 assert.equal(await page.locator('.rating-row button').count(),3,'Self-assessment remains available');
 await page.getByText('Experimentar con el código',{exact:true}).click();
 const editor=page.locator('app-php-scratchpad .cm-content[contenteditable=true]');await editor.waitFor();
 const actions=page.locator('app-php-runner .php-quick-actions');
 assert.equal(await actions.getByRole('button').count(),2,'Exactly two primary quick actions');
 for(const button of await actions.getByRole('button').all())assert((await button.boundingBox()).height>=45,'Touch action at least 45px');
 await editor.fill('<?php echo 2 + 3;');await actions.getByRole('button',{name:'Ejecutar',exact:true}).click();await page.locator('app-php-result pre').filter({hasText:/^5$/}).waitFor({timeout:45000});
 await actions.getByRole('button',{name:'Corregir',exact:true}).click();await page.getByText('✗ La salida no coincide',{exact:true}).waitFor();
 await editor.fill(question.code);await actions.getByRole('button',{name:'Corregir',exact:true}).click();await page.getByText('✓ La salida coincide',{exact:true}).waitFor();
 assert.equal(await page.locator('.own-draft pre').innerText(),'Mi explicación');
 assert.match(await page.locator('app-php-scratchpad app-php-runner').innerText(),/bool\(true\)/);
 assert((await editor.boundingBox()).y<(await actions.boundingBox()).y,'Actions follow the editor');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No page overflow');
 if(predictionOnly){
  await page.getByRole('button',{name:'Bien Lo tengo'}).click();
  await page.getByRole('button',{name:'Ver resultados',exact:true}).waitFor();
  const writing=questions.find(q=>q.kind==='code'&&q.codeTask==='write');assert(writing);
  await page.evaluate(q=>{const session=JSON.parse(localStorage.getItem('estudio-php-session-v1'));session.ids=[q.id];session.draft=q.starterCode??'';session.revealed=false;session.graded=false;session.lastGrade=null;session.files={};session.config.units=[q.unit];localStorage.setItem('estudio-php-session-v1',JSON.stringify(session));},writing);
  await page.goto(server.url+'/estudiar');await page.locator('.cm-content[contenteditable=true]').waitFor();
  await actions.getByRole('button',{name:'Ejecutar',exact:true}).waitFor();
  await page.evaluate(q=>{const session=JSON.parse(localStorage.getItem('estudio-php-session-v1'));session.ids=[q.id];session.config.strict=true;session.config.units=[q.unit];localStorage.setItem('estudio-php-session-v1',JSON.stringify(session));},question);
  await page.goto(server.url+'/estudiar');await page.locator('app-code-snippet').waitFor();
  assert.equal(await page.locator('app-php-scratchpad,app-php-runner,.expected-output-answer').count(),0,'Strict prediction keeps the solution hidden');
  await page.getByRole('button',{name:'Guardar respuesta y continuar',exact:true}).waitFor();
  assert.deepEqual(errors,[],'No browser errors');
  console.log(`${webkit?'WebKit':'Chrome'}: interpretación de isset con colores y fuente original, sin ejecución ni salida antes de responder; revisión y autoevaluación; PHP real 2+3=5 y comparación de salida; editor de escritura y examen estricto conservados.`);
 }else{
 const htmlQuestion=questions.find(q=>q.id==='DWCS-R17-U2-268');assert(htmlQuestion?.starterFiles);
 const files={
  'index.php':`<?php session_start();$_SESSION['n']=($_SESSION['n']??0)+1;setcookie('probe','ready',time()+3600,'/');require __DIR__.'/lib/value.php';?><link rel="stylesheet" href="style.css"><h1>PHP HTML real</h1><p id="included"><?=valor()?></p><p id="state"><?=$_SESSION['n'].'|'.($_COOKIE['probe']??'')?></p><form method="post" action="procesar.php"><label>Dato<input name="dato"></label><button>Enviar POST</button></form><a href="index.php?get=correcto">Navegar GET</a><p id="get"><?=$_GET['get']??''?></p>`,
  'procesar.php':`<?php session_start();require __DIR__.'/lib/value.php';?><h1>POST procesado</h1><p id="post"><?=$_POST['dato'].'|'.$_SESSION['n'].'|'.$_COOKIE['probe'].'|'.valor()?></p><a href="index.php?get=correcto">Navegar GET</a>`,
  'lib/value.php':'<?php function valor():string{return "include real";}',
  'style.css':'h1{color:rgb(21,67,113)}'
 };
 await page.evaluate(({q,files})=>localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[q.id],pointer:0,selected:[],draft:'',revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,history:[],answers:[],files,config:{subjectId:'dwcs',units:[q.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:false,weakOnly:false,strict:false}})),{q:htmlQuestion,files});
 await page.goto(server.url+'/estudiar');await page.locator('.cm-content[contenteditable=true]').waitFor();
 await actions.getByRole('button',{name:'Ejecutar',exact:true}).click();await page.locator('app-php-result .academic-runner-result').waitFor({timeout:45000});
 await page.getByRole('tab',{name:'Vista HTML',exact:true}).click();
 const frame=page.frameLocator('app-php-result iframe');await frame.getByRole('heading',{name:'PHP HTML real',exact:true}).waitFor();
 assert.equal(await frame.locator('#included').innerText(),'include real');assert.equal(await frame.locator('h1').evaluate(node=>getComputedStyle(node).color),'rgb(21, 67, 113)');
 assert.equal(await frame.locator('#state').innerText(),'1|');
 await frame.getByRole('textbox',{name:'Dato'}).fill('valor enviado');await frame.getByRole('button',{name:'Enviar POST',exact:true}).click();
 await frame.getByRole('heading',{name:'POST procesado',exact:true}).waitFor();assert.equal(await frame.locator('#post').innerText(),'valor enviado|1|ready|include real');
 await frame.getByRole('link',{name:'Navegar GET',exact:true}).click();await frame.getByRole('heading',{name:'PHP HTML real',exact:true}).waitFor();assert.equal(await frame.locator('#state').innerText(),'2|ready');assert.equal(await frame.locator('#get').innerText(),'correcto');
 await page.getByRole('tab',{name:'Salida',exact:true}).click();await actions.getByRole('button',{name:'Corregir',exact:true}).click();await page.getByText('Este ejercicio no tiene casos automáticos. Revisa la solución y sus requisitos.',{exact:true}).waitFor();
 assert.equal(await page.locator('.academic-runner-test').count(),0,'Manual exercise never invents passes');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'HTML result does not overflow the page');
 const strictQuestion=questions.find(q=>q.phpTests?.length);assert(strictQuestion);
 await page.evaluate(q=>localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[q.id],pointer:0,selected:[],draft:q.solution,revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,history:[],answers:[],files:q.starterFiles?{...q.starterFiles,[Object.keys(q.starterFiles)[0]]:q.solution}:{},config:{subjectId:'dwcs',units:[q.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:false,weakOnly:false,strict:true}})),strictQuestion);
 await page.goto(server.url+'/estudiar');await actions.getByRole('button',{name:'Ejecutar',exact:true}).waitFor();
 await page.getByText('La corrección estará disponible al terminar el examen.',{exact:true}).waitFor();
 assert(await actions.getByRole('button',{name:'Corregir',exact:true}).isDisabled(),'Strict correction stays deferred');
 await actions.getByRole('button',{name:'Ejecutar',exact:true}).click();await page.locator('.php-return-value').waitFor({timeout:45000});
 assert.equal(await page.locator('.academic-runner-test').count(),0,'Strict execution does not expose correction');
 console.log(`${webkit?'WebKit':'Chrome'}: 2 acciones de 45px debajo del editor; PHP 2+3=5, comparación correcta/incorrecta y respuesta preservada; HTML/CSS real, include, GET/POST, sesión/cookie, revisión manual sin falsos aprobados y ejecución con corrección diferida en examen.`);
 }
}finally{await browser.close();server.close();}
