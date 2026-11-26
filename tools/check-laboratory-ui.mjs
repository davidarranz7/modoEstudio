import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import ts from 'typescript';
import {playwright,chromeLaunchOptions} from './browser-test-support.mjs';
import {serveWorkspace} from './workspace-test-server.mjs';

const compiled=ts.transpileModule(await readFile('src/app/data/php-projects.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {PHP_PROJECTS}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const webkit=process.argv.includes('--webkit'),engine=webkit?'webkit':'chromium';
const server=await serveWorkspace();const browser=await (webkit?playwright.webkit:playwright.chromium).launch(webkit?{headless:true}:chromeLaunchOptions());
await mkdir('test-results',{recursive:true});let context,page;const errors=[];
try{
 const editor=()=>page.locator('.cm-content[contenteditable=true]');
 const commands=()=>page.locator('.workspace-command-bar');
 const resultTabs=()=>page.locator('.workspace-result-tabs');
 const frame=()=>page.frameLocator('iframe');
 const waitSource=async(id,path,expected)=>page.waitForFunction(({id,path,expected})=>JSON.parse(localStorage.getItem('estudio-projects-v1')??'{}')[id]?.files[path]===expected,{id,path,expected});
 const assertCode=async(expected)=>{await page.waitForFunction(expected=>document.querySelector('.cm-content[contenteditable=true]')?.innerText===expected,expected);assert.equal(await editor().innerText(),expected);};
 const openCode=async()=>{await page.getByRole('button',{name:'Código',exact:true}).click();await editor().waitFor();};
 const openFixture=async(project,files)=>{
  await context?.close();context=await browser.newContext({...playwright.devices['iPhone 13']});page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(server.url+'/laboratorio');await page.getByRole('heading',{name:'Aplicaciones PHP completas'}).waitFor();assert.equal(await page.locator('.lab-project-card').count(),18);
  await page.evaluate(({project,files})=>localStorage.setItem('estudio-projects-v1',JSON.stringify({[project.id]:{id:project.id,files,folders:[],activeFile:project.entry,tabs:[project.entry],note:'Nota de prueba',attempts:[],updatedAt:new Date().toISOString()}})),{project,files});
  await page.reload();await page.getByRole('button',{name:new RegExp(project.title)}).click();await openCode();
 };
 const selectEditorRange=async(lineIndex,start,end)=>{
  await editor().evaluate((content,{lineIndex,start,end})=>{
   content.focus();const line=content.querySelectorAll('.cm-line')[lineIndex];const walker=document.createTreeWalker(line,NodeFilter.SHOW_TEXT);const nodes=[];let node;while(node=walker.nextNode())nodes.push(node);
   const point=offset=>{for(const node of nodes){if(offset<=node.textContent.length)return [node,offset];offset-=node.textContent.length;}throw Error('Editor selection offset outside line');};
   const [from,fromOffset]=point(start),[to,toOffset]=point(end);const range=document.createRange();range.setStart(from,fromOffset);range.setEnd(to,toOffset);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);document.dispatchEvent(new Event('selectionchange'));
  },{lineIndex,start,end});
 };
 const download=async(label)=>{
  await page.getByRole('button',{name:'Opciones del proyecto',exact:true}).click();const event=page.waitForEvent('download');await page.getByRole('button',{name:label,exact:true}).click();const file=await event;const bytes=await readFile(await file.path());assert.equal(bytes.readUInt32LE(0),0x04034b50,'ZIP contains ordinary local file headers');return {file,bytes};
 };

 const sports=PHP_PROJECTS.find(project=>project.id==='ud2-reserva-deportiva');
 await openFixture(sports,Object.fromEntries(sports.files.map(file=>[file.path,file.starter])));
 const initial='<?php\n$valor = 1;\necho $valor;',replaced='<?php\n$ = 1;\necho $valor;';await editor().fill(initial);await waitSource(sports.id,'index.php',initial);
 await selectEditorRange(1,0,6);
 await page.waitForFunction(id=>{const selection=JSON.parse(localStorage.getItem('estudio-projects-v1')??'{}')[id]?.editorState?.['index.php']?.selection;return selection?.anchor===6&&selection?.head===12;},sports.id);
 await page.locator('.editor-symbols').getByRole('button',{name:'$',exact:true}).click();await assertCode(replaced);
 await page.getByRole('button',{name:'Deshacer',exact:true}).click();await assertCode(initial);await page.getByRole('button',{name:'Rehacer',exact:true}).click();await assertCode(replaced);
 await selectEditorRange(0,0,0);await page.waitForFunction(id=>JSON.parse(localStorage.getItem('estudio-projects-v1')??'{}')[id]?.editorState?.['index.php']?.selection?.head===0,sports.id);
 await page.locator('.editor-symbols').getByRole('button',{name:'Tab',exact:true}).click();await assertCode('    '+replaced);await waitSource(sports.id,'index.php','    '+replaced);await page.getByRole('button',{name:'Deshacer',exact:true}).click();await assertCode(replaced);await waitSource(sports.id,'index.php',replaced);
 await page.reload();await page.getByRole('button',{name:new RegExp(sports.title)}).click();await openCode();await assertCode(replaced);

 await openFixture(sports,Object.fromEntries(sports.files.map(file=>[file.path,file.solution])));
 await commands().getByRole('button',{name:'Ejecutar',exact:true}).click();await frame().getByRole('heading',{name:'Reserva deportiva'}).waitFor({timeout:45000});
 await frame().getByLabel('Nombre').fill('Ana');await frame().getByLabel('Actividad').selectOption('Pádel');await frame().getByLabel('Sesiones').fill('5');await frame().getByRole('button',{name:'Reservar'}).click();await frame().getByText(/81[.,]00/).waitFor();
 await resultTabs().getByRole('button',{name:'HTTP',exact:true}).click();assert.match(await page.locator('.lab-inspector').last().innerText(),/POST.*procesar.php/s);assert.match(await page.locator('.lab-inspector').last().innerText(),/application\/x-www-form-urlencoded/);
 await commands().getByRole('button',{name:'Corregir',exact:true}).click();await page.getByText('Comprobaciones terminadas.',{exact:false}).waitFor({timeout:45000});assert.equal(await page.locator('.lab-feedback[data-ok="false"]').count(),0,'Reference solution passes the existing UI checks');assert.equal(await page.locator('.lab-feedback').count(),sports.files.length+sports.tests.length+(sports.staticChecks?.length??0));
 const codeZip=await download('Descargar mi código ZIP');assert.equal(codeZip.file.suggestedFilename(),sports.id+'.zip');assert.ok(codeZip.bytes.includes(Buffer.from('funciones.php')));
 const fullZip=await download('Descargar práctica completa ZIP');for(const path of ['inicial/funciones.php','solucion/funciones.php','mi-codigo/funciones.php','practica.json'])assert.ok(fullZip.bytes.includes(Buffer.from(path)),path);
 await page.screenshot({path:`test-results/laboratory-${engine}.png`});

 await page.getByRole('button',{name:'Enunciado',exact:true}).click();await page.getByRole('button',{name:'Simular prueba práctica',exact:true}).click();
 await commands().getByRole('button',{name:'Entregar y corregir',exact:true}).waitFor();await page.getByRole('button',{name:'Solución',exact:true}).waitFor({state:'detached'});
 assert.equal(await page.getByRole('button',{name:'Solución',exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'Mostrar siguiente pista',exact:true}).count(),0);
 assert.equal(await page.getByRole('heading',{name:'Solución razonada por archivos',includeHidden:true}).count(),0,'The reference-solution panel must be absent from the DOM during an unsubmitted exam');
 assert.equal(await commands().getByRole('button',{name:'Corregir',exact:true}).count(),0);await commands().getByRole('button',{name:'Entregar y corregir',exact:true}).click();await page.getByRole('button',{name:'Solución',exact:true}).waitFor({timeout:45000});assert.equal(await page.locator('.lab-feedback[data-ok="false"]').count(),0);

 const visits=PHP_PROJECTS.find(project=>project.id==='ud3-contador-cookie');await openFixture(visits,Object.fromEntries(visits.files.map(file=>[file.path,file.solution])));
 await commands().getByRole('button',{name:'Ejecutar',exact:true}).click();await frame().getByRole('heading',{name:'Visitas: 1'}).waitFor({timeout:45000});await page.getByRole('button',{name:'Ir',exact:true}).click();await frame().getByRole('heading',{name:'Visitas: 2'}).waitFor();await resultTabs().getByRole('button',{name:'HTTP',exact:true}).click();assert.match(await page.locator('.lab-inspector').last().innerText(),/cookie.*visitas=1/s);

 const upload=PHP_PROJECTS.find(project=>project.id==='ud2-subida-texto');await openFixture(upload,Object.fromEntries(upload.files.map(file=>[file.path,file.solution])));
 await commands().getByRole('button',{name:'Ejecutar',exact:true}).click();await frame().locator('input[type=file]').waitFor({timeout:45000});await frame().locator('input[type=file]').setInputFiles({name:'notas.txt',mimeType:'text/plain',buffer:Buffer.from('Archivo desde la interfaz')});await frame().getByRole('button',{name:'Subir'}).click();await frame().getByText('Entrega guardada').waitFor();await waitSource(upload.id,'entregas/entrega.txt','Archivo desde la interfaz');
 await openCode();await page.getByRole('button',{name:'Archivos',exact:true}).click();await page.locator('.workspace-file-open').filter({hasText:'entrega.txt'}).click();await assertCode('Archivo desde la interfaz');await page.waitForFunction(id=>JSON.parse(localStorage.getItem('estudio-projects-v1')??'{}')[id]?.activeFile==='entregas/entrega.txt',upload.id);
 await page.reload();await page.getByRole('button',{name:new RegExp(upload.title)}).click();await openCode();await page.getByRole('textbox',{name:'Código del archivo entregas/entrega.txt',exact:true}).waitFor();await assertCode('Archivo desde la interfaz');
 const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(metrics.scroll<=metrics.width+1,'No horizontal overflow of the mobile page');assert.deepEqual(errors,[],'No browser errors');
 console.log(JSON.stringify({engine,projects:18,editorCursor:true,tabAtCursor:true,undoRedo:true,autosave:true,realFormPost:true,httpInspector:true,behaviorChecks:true,codeZip:true,completePracticeZip:true,examSolutionAbsentFromDom:true,cookies:true,realUpload:true,generatedFilesSavedAfterReload:true,mobileOverflow:false},null,2));
}catch(error){if(page){console.log('Page:',(await page.locator('body').innerText()).slice(-7000));console.log('Saved workspace:',await page.evaluate(()=>Object.fromEntries(Object.entries(JSON.parse(localStorage.getItem('estudio-projects-v1')??'{}')).map(([id,work])=>[id,{activeFile:work.activeFile,files:work.files,editorState:work.editorState}]))));for(const frame of page.frames().slice(1))console.log('Preview:',await frame.locator('body').innerText().catch(()=>''));await page.screenshot({path:`test-results/laboratory-${engine}-failure.png`,fullPage:true}).catch(()=>{});}throw error;}finally{await browser.close();server.close();}
