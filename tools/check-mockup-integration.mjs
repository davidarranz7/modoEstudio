import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir,readFile,stat} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import ts from 'typescript';
import {chromium,webkit,devices,chromeLaunchOptions} from './browser-test-support.mjs';

// Only ephemeral browser storage is changed. Academic source files are read, never edited.
const root=resolve('dist/modo-estudio/browser');
const bankSource=await readFile('src/app/data/dwcs.questions.ts','utf8');
const questions=JSON.parse(bankSource.match(/Question\[\] = (\[[\s\S]*\]);/)[1]);
const quick=questions.find(question=>question.codeTask==='write'&&question.phpTests?.length);
assert(quick,'An existing executable quick exercise is required');
const projectSource=await readFile('src/app/data/php-projects.ts','utf8');
const projectJs=ts.transpileModule(projectSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {PHP_PROJECTS}=await import('data:text/javascript;base64,'+Buffer.from(projectJs).toString('base64'));
const project=PHP_PROJECTS[0];
const server=createServer(async(request,response)=>{
 try{
  let path=resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://local').pathname));
  if(path!==root&&!path.startsWith(root+sep))throw Error('Path outside production build');
  if(!extname(path))path=resolve(root,'index.html');
  response.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.json':'application/json','.woff2':'font/woff2','.webmanifest':'application/manifest+json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[extname(path)]??'text/html');
  response.end(await readFile(path));
 }catch{response.writeHead(404);response.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port,engine=process.argv.includes('--webkit')?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'?{headless:true}:chromeLaunchOptions());
await mkdir('test-results',{recursive:true});
const screenshots=[];
let stage='opening';
try{
 const context=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:1,serviceWorkers:'allow',reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[],consoleEvents=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(['error','warning'].includes(message.type()))consoleEvents.push({type:message.type(),text:message.text()});});
 const screenshot=async label=>{await page.evaluate(async()=>{await document.fonts.ready;});const path='test-results/mockup-'+engine+'-'+label+'.png';await page.screenshot({path,fullPage:true,animations:'disabled'});screenshots.push(path);};
 const setTheme=async theme=>{await page.evaluate(theme=>{const state=JSON.parse(localStorage.getItem('estudio-php-v1')??'{}');localStorage.setItem('estudio-php-v1',JSON.stringify({records:{},results:[],reports:{},...state,theme}));},theme);await page.reload();await page.waitForFunction(theme=>!!document.querySelector('.app-shell.dark')===(theme==='dark'),theme);};
 const checkLayout=async(label,host='app-code-workspace')=>{
  const layout=await page.evaluate(selector=>{const editor=document.querySelector(selector+' .cm-workspace'),main=document.querySelector('.programming-workspace'),actions=main?.querySelector('.workspace-command-bar,.workspace-primary-actions');return{width:innerWidth,scrollWidth:document.documentElement.scrollWidth,editorBackground:editor?getComputedStyle(editor).backgroundColor:null,workspacePosition:main?getComputedStyle(main).position:null,actionPosition:actions?getComputedStyle(actions).position:null,toolbars:[...document.querySelectorAll(selector+' .cm-tools,'+selector+' .cm-symbols,'+selector+' .cm-status')].filter(element=>element.getClientRects().length&&getComputedStyle(element).display!=='none'&&getComputedStyle(element).visibility!=='hidden').length};},host);
  assert(layout.scrollWidth<=layout.width+1,label+': page must not overflow horizontally '+JSON.stringify(layout));
  assert.equal(layout.editorBackground,'rgb(21, 26, 35)',label+': editor must retain the mockup dark surface');
  assert.equal(layout.toolbars,0,label+': editor tools/symbols/status must not occupy permanent rows');
  if(layout.workspacePosition!==null)assert.notEqual(layout.workspacePosition,'fixed',label+': laboratory must follow normal page flow');
  if(layout.actionPosition!==null)assert(!['fixed','sticky'].includes(layout.actionPosition),label+': actions must follow the editor without a fixed footer');
  return layout;
 };
 const assertTouchable=async(button,label)=>{await button.scrollIntoViewIfNeeded();const box=await button.boundingBox();assert(box,label+' missing');const clear=await button.evaluate(element=>{const box=element.getBoundingClientRect(),hit=document.elementFromPoint(box.left+box.width/2,box.top+box.height/2);return !!hit&&(hit===element||element.contains(hit));});assert(clear,label+' covered by another element');};
 const fillEditor=async(code,filename)=>{const editor=page.getByRole('textbox',{name:'Código del archivo '+filename});await editor.waitFor();await editor.fill(code);return editor;};
 const resultTab=(container,name)=>container.getByRole('tab',{name,exact:true}).or(container.getByRole('button',{name,exact:true}));
 const seedQuick=async code=>{
  await page.evaluate(({question,code})=>{const files=question.starterFiles?{...question.starterFiles,[Object.keys(question.starterFiles).find(path=>path.endsWith('.php'))??'solucion.php']:code}:{};localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[question.id],pointer:0,selected:[],draft:code,files,revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,history:[],answers:[],config:{subjectId:'dwcs',units:[question.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:false,weakOnly:false,strict:false}}));},{question:quick,code});
  await page.goto(base+'/estudiar');await page.locator('app-code-workspace .cm-content').waitFor();
 };
 await page.goto(base+'/inicio');await setTheme('light');
 stage='quick';console.log(engine+': quick visual flow');
 await seedQuick('<?php\n');
 const quickHost=page.locator('app-php-runner');
 assert.equal(await quickHost.getByRole('button',{name:'Ejecutar',exact:true}).count(),1,'One quick execute action');
 assert.equal(await quickHost.getByRole('button',{name:'Corregir',exact:true}).count(),1,'One quick correction action');
 const quickFile=quick.starterFiles?Object.keys(quick.starterFiles).find(path=>path.endsWith('.php'))??'solucion.php':'solucion.php';
 const quickEditor=await fillEditor('<?php\n',quickFile);await quickEditor.pressSequentially('move_');
 const completion=page.getByRole('option',{name:/move_uploaded_file/});await completion.waitFor();await screenshot('quick-completion-light-390');await completion.tap();
 assert((await page.locator('app-code-workspace .cm-content').innerText()).includes('move_uploaded_file()'),'Touch must insert the actual completion');
 await page.locator('.cm-tooltip').filter({hasText:/move_uploaded_file\(string/}).first().waitFor();
 await screenshot('quick-signature-light-390');
 await fillEditor('<?php echo 2+3;',quickFile);await quickHost.getByRole('button',{name:'Ejecutar',exact:true}).click();await resultTab(quickHost,'Salida').click();
 await quickHost.locator('pre').filter({hasText:/^5$/}).first().waitFor({timeout:45000});
 const quickLight=await checkLayout('Quick light 390');await screenshot('quick-output-light-390');
 await fillEditor('<?php echo "<h1>Vista PHP</h1><p>5</p>";',quickFile);await quickHost.getByRole('button',{name:'Ejecutar',exact:true}).click();
 await resultTab(quickHost,/^Vista\s*HTML$/i).click();
 await quickHost.frameLocator('iframe').getByRole('heading',{name:'Vista PHP',exact:true}).waitFor({timeout:45000});
 await screenshot('quick-html-light-390');
 await fillEditor(quick.solution,quickFile);await quickHost.getByRole('button',{name:'Corregir',exact:true}).click();
 await quickHost.getByText(new RegExp(quick.phpTests.length+'\\s*(?:/|de)\\s*'+quick.phpTests.length)).first().waitFor({timeout:45000});
 await page.setViewportSize({width:430,height:932});await setTheme('dark');
 await page.locator('app-code-workspace .cm-content').waitFor();const quickDark=await checkLayout('Quick dark 430');await screenshot('quick-dark-430');
 stage='laboratory';console.log(engine+': laboratory files and persistence');

 // A normal student workspace inside an existing practice; no practice definition is changed.
 const files={...Object.fromEntries(project.files.map(file=>[file.path,file.solution])),[project.entry]:'<!doctype html><html><head><link rel="stylesheet" href="css/mockup.css"></head><body><h1 id="smoke-title">Formulario PHP</h1><form method="post" action="procesar.php"><label>Número <input name="numero" type="number" value="21"></label><button>Calcular</button></form></body></html>','procesar.php':'<?php require_once __DIR__."/funciones.php";$numero=filter_var($_POST["numero"]??null,FILTER_VALIDATE_INT);echo "<h1>Resultado: ".duplicar((int)$numero)."</h1>";','funciones.php':'<?php function duplicar(int $numero):int{return $numero*2;}','css/mockup.css':'#smoke-title{color:rgb(40,90,160)}'};
 await page.goto(base+'/laboratorio');await setTheme('light');await page.evaluate(({project,files})=>{localStorage.setItem('estudio-projects-v1',JSON.stringify({[project.id]:{id:project.id,files,folders:['css'],activeFile:project.entry,tabs:[project.entry,'procesar.php','funciones.php'],note:'Prueba efímera de integración visual',attempts:[],updatedAt:new Date().toISOString()}}));},{project,files});
 const openLab=async()=>{await page.getByRole('button',{name:new RegExp(project.title)}).click();const code=page.getByRole('button',{name:'Código',exact:true});if(await code.count())await code.click();else{const open=page.getByRole('button',{name:'Abrir archivos',exact:true});if(await open.count())await open.click();}await page.locator('app-code-workspace .cm-content').waitFor();};
 await openLab();
 const lab=page.locator('main.programming-workspace');
 const fileTab=filename=>page.locator('app-code-workspace').getByRole('button',{name:filename,exact:true});
 await fileTab('funciones.php').click();await page.getByRole('textbox',{name:'Código del archivo funciones.php'}).waitFor();await page.waitForFunction(()=>document.querySelector('.cm-content[aria-label="Código del archivo funciones.php"]')?.textContent?.includes('duplicar'));
 await fileTab(project.entry).click();
 const add=page.getByRole('button',{name:/^(?:Nuevo archivo|Añadir archivo|\+ Archivo)$/i});await add.first().click();
 const dialog=page.getByRole('dialog',{name:'Nuevo archivo',exact:true});await dialog.getByRole('textbox').fill('notas.txt');await dialog.getByRole('button',{name:'Crear archivo',exact:true}).click();
 const note='Guardado desde la interfaz de la maqueta.';await fillEditor(note,'notas.txt');
 await page.waitForFunction(({id,note})=>JSON.parse(localStorage.getItem('estudio-projects-v1')??'{}')[id]?.files['notas.txt']===note,{id:project.id,note});
 await page.reload();await openLab();if(await fileTab('notas.txt').count())await fileTab('notas.txt').click();assert.equal(await page.getByRole('textbox',{name:'Código del archivo notas.txt'}).innerText(),note,'Code survives a reload');
 await fileTab(project.entry).click();
 const execute=lab.getByRole('button',{name:'Ejecutar',exact:true});await assertTouchable(execute,'Laboratory execute');await execute.click();
 await resultTab(lab,/^(?:Vista\s*HTML|Vista previa)$/i).click();const frame=lab.frameLocator('iframe');await frame.getByRole('heading',{name:'Formulario PHP',exact:true}).waitFor({timeout:45000});
 assert.equal(await frame.getByRole('heading',{name:'Formulario PHP',exact:true}).evaluate(element=>getComputedStyle(element).color),'rgb(40, 90, 160)','Local CSS renders through the virtual HTTP resolver');
 stage='laboratory-post';console.log(engine+': real POST/include');await frame.getByLabel('Número').fill('21');
 if(process.argv.includes('--diagnose-post')){
  await page.evaluate(()=>{window.__mockupParentMessages=[];window.addEventListener('message',event=>{const iframe=document.querySelector('main.programming-workspace iframe'),source=iframe?.getAttribute('srcdoc')??'',token=source.match(/token:("[^"]+")/)?.[1];window.__mockupParentMessages.push({url:event.data?.url,method:event.data?.method,token:event.data?.token,sourceEqualsIframe:event.source===iframe?.contentWindow,tokenMatchesSrcdoc:!!token&&JSON.parse(token)===event.data?.token,executeDisabled:document.querySelector('.workspace-execute')?.disabled});});});
  await frame.locator('body').evaluate(()=>{window.__mockupInputEvents=[];document.addEventListener('click',event=>window.__mockupInputEvents.push({type:'click',target:event.target.tagName,text:event.target.textContent}),true);document.addEventListener('submit',event=>{const row={type:'submit',target:event.target.tagName,defaultPrevented:event.defaultPrevented};window.__mockupInputEvents.push(row);queueMicrotask(()=>row.defaultPrevented=event.defaultPrevented);},true);});
  console.log('Before click:',JSON.stringify(await frame.locator('body').evaluate(()=>{const form=document.querySelector('form'),button=document.querySelector('button'),input=document.querySelector('input');let formData;try{formData=[...new FormData(form,button).entries()];}catch(error){formData={error:error.message};}const rect=button.getBoundingClientRect();return{valid:form.checkValidity(),value:input.value,formData,button:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},viewport:{innerWidth,innerHeight,scrollX,scrollY,visual:visualViewport?{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale,top:visualViewport.offsetTop}:null},bridgeToken:document.querySelector('script')?.textContent?.match(/token:("[^"]+")/)?.[1]};}),null,2));
 }
 await frame.getByRole('button',{name:'Calcular',exact:true}).click();
 if(process.argv.includes('--diagnose-post')){
  await page.waitForTimeout(400);
  console.log('After click:',JSON.stringify({parent:await page.evaluate(()=>window.__mockupParentMessages),frame:await frame.locator('body').evaluate(()=>({events:window.__mockupInputEvents,body:document.body.innerText})).catch(error=>({error:error.message})),pageErrors:errors,console:consoleEvents,http:await page.locator('.lab-inspector summary').allTextContents()},null,2));
  throw Object.assign(Error('Diagnostic probe finished without another submission.'),{diagnosticOnly:true});
 }
 // The old iframe is replaced after the parent receives the asynchronous message.
 // Observe that transition before resolving a new FrameLocator (Chromium can keep
 // a wait in the detached old frame if it starts immediately after the click).
 await page.waitForFunction(()=>[...document.querySelectorAll('.lab-inspector summary')].some(summary=>summary.textContent?.includes('POST /procesar.php')),undefined,{timeout:15000});
 await page.waitForFunction(()=>{const button=document.querySelector('.workspace-execute'),frame=document.querySelector('main.programming-workspace iframe');return button&&!button.disabled&&frame?.getAttribute('srcdoc')?.includes('Resultado: 42');},undefined,{timeout:15000});
 await lab.frameLocator('iframe').getByRole('heading',{name:'Resultado: 42',exact:true}).waitFor({timeout:15000});
 await page.setViewportSize({width:390,height:844});const labLight=await checkLayout('Laboratory light 390');await screenshot('lab-post-light-390');
 await page.setViewportSize({width:430,height:932});await setTheme('dark');await openLab();if(await fileTab(project.entry).count())await fileTab(project.entry).click();const labDark=await checkLayout('Laboratory dark 430');await assertTouchable(lab.getByRole('button',{name:'Ejecutar',exact:true}),'Dark laboratory execute');await screenshot('lab-dark-430');
 if(process.argv.includes('--desktop')){await page.setViewportSize({width:1280,height:900});await checkLayout('Laboratory desktop');await screenshot('lab-dark-desktop');}
 assert.deepEqual(errors,[],'No browser/Angular errors');
 console.log(JSON.stringify({engine,build:(await stat(resolve(root,'index.html'))).mtime.toISOString(),quick:{completion:true,signature:true,actualOutput5:true,htmlPreview:true,correction:true},laboratory:{fileTabs:true,createFile:true,reloadPersistence:true,realPostInclude42:true,localCss:true},layouts:{quickLight,quickDark,labLight,labDark},screenshots,physicalIphone:false},null,2));
}catch(error){if(error.diagnosticOnly)console.log(error.message);else{console.log('Smoke failed at '+stage);for(const page of browser.contexts().flatMap(context=>context.pages())){console.log((await page.locator('body').innerText().catch(()=>'' )).slice(-5000));console.log('HTTP summaries:',await page.locator('.lab-inspector summary').allTextContents());for(const frame of page.frames().slice(1))console.log('Iframe:',await frame.locator('body').innerText().catch(()=>''));await page.screenshot({path:'test-results/mockup-'+engine+'-failure.png',fullPage:true}).catch(()=>{});}throw error;}}finally{await browser.close();server.close();}
