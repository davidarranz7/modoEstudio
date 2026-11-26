import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import ts from 'typescript';
import {chromium,webkit,devices,chromeLaunchOptions} from './browser-test-support.mjs';
const root=resolve('dist/modo-estudio/browser');
const source=await readFile('src/app/data/php-projects.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {PHP_PROJECTS}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const project=PHP_PROJECTS[0];
let serverStopped=false;
const server=createServer(async(req,res)=>{try{let path=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(path!==root&&!path.startsWith(root+sep))throw Error('path');if(!extname(path))path=resolve(root,'index.html');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.json':'application/json','.woff2':'font/woff2','.png':'image/png','.webmanifest':'application/manifest+json'})[extname(path)]??'text/html');res.setHeader('Service-Worker-Allowed','/');res.end(await readFile(path));}catch{res.writeHead(404);res.end('not found');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port,engine=process.argv.includes('--webkit')?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'?{headless:true}:chromeLaunchOptions());
try{
 const context=await browser.newContext({...devices['iPhone 13'],serviceWorkers:'allow'}),page=await context.newPage();
 await page.goto(base+'/laboratorio');
 await page.evaluate(project=>{const files=Object.fromEntries(project.files.map(file=>[file.path,file.solution]));files[project.entry]='<?php echo "EDITOR_ONLINE|".PHP_VERSION;';localStorage.setItem('estudio-projects-v1',JSON.stringify({[project.id]:{id:project.id,files,folders:[],activeFile:project.entry,tabs:[project.entry],note:'Prueba efímera offline',attempts:[],updatedAt:new Date().toISOString()}}));},project);
 const openEditor=async()=>{await page.getByRole('button',{name:new RegExp(project.title)}).click();const open=page.getByRole('button',{name:'Abrir archivos',exact:true});if(await open.count())await open.click();await page.locator('app-code-workspace .cm-content').waitFor({timeout:45000});};
 await openEditor();await page.locator('.workspace-command-bar').getByRole('button',{name:'Ejecutar',exact:true}).click();await page.frameLocator('iframe').locator('body').getByText(/^EDITOR_ONLINE\|8\.2\./).waitFor({timeout:45000});
 await page.evaluate(async()=>{await navigator.serviceWorker.register('/ngsw-worker.js');await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('SW installation timed out')),45000))]);});
 await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await openEditor();
 // The controlled page warms the lazy interpreter resources before disconnecting.
 await page.locator('.workspace-command-bar').getByRole('button',{name:'Ejecutar',exact:true}).click();await page.frameLocator('iframe').locator('body').getByText(/^EDITOR_ONLINE\|8\.2\./).waitFor({timeout:45000});
 const cached=await page.evaluate(async()=>{const urls=[];for(const key of await caches.keys())for(const request of await(await caches.open(key)).keys())urls.push(new URL(request.url).pathname);return urls;});
 assert(cached.includes('/php-runtime/php_8_2.wasm'),'PHP binary must be cached before offline use');
 assert(cached.some(path=>path.endsWith('.js')),'Application/editor chunks must be cached');
 if(engine==='webkit'){
  await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});serverStopped=true;
 }else await context.setOffline(true);
 await page.reload();await openEditor();
 const editor=page.getByRole('textbox',{name:'Código del archivo '+project.entry});await editor.fill('<?php\n');await editor.pressSequentially('move_');
 const option=page.getByRole('option',{name:/move_uploaded_file/});await option.waitFor();
 try{await option.tap({timeout:5000});}catch(error){console.log(JSON.stringify(await page.evaluate(()=>{const option=document.querySelector('.cm-tooltip-autocomplete [role=option]'),tooltip=document.querySelector('.cm-tooltip-autocomplete'),editor=document.querySelector('.cm-editor');const box=element=>element?{x:element.getBoundingClientRect().x,y:element.getBoundingClientRect().y,width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height}:null;return{viewport:{width:innerWidth,height:innerHeight,visual:visualViewport?{width:visualViewport.width,height:visualViewport.height,top:visualViewport.offsetTop}:null},option:box(option),tooltip:box(tooltip),editor:box(editor)};}),null,2));throw error;}
 assert((await page.locator('.cm-content').innerText()).includes('move_uploaded_file()'),'Completion must work without origin network');
 await editor.fill('<?php echo "EDITOR_OFFLINE|".PHP_VERSION;');
 await page.locator('.workspace-command-bar').getByRole('button',{name:'Ejecutar',exact:true}).click();
 await page.frameLocator('iframe').locator('body').getByText(/^EDITOR_OFFLINE\|8\.2\./).waitFor({timeout:45000});
 console.log(JSON.stringify({engine,productionReloadOffline:true,offlineMethod:engine==='webkit'?'real origin server stopped':'browser offline',codeMirrorLoadedOffline:true,touchCompletionOffline:'move_uploaded_file()',newPhpWorkerOffline:true,physicalIphone:false},null,2));
}finally{await browser.close();if(!serverStopped)server.close();}
