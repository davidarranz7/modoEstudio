import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { chromium, webkit, devices, chromeLaunchOptions } from './browser-test-support.mjs';

let base=process.env.ESTUDIO_TEST_URL??'http://127.0.0.1:4200';
let server;
if(process.argv.includes('--production')){
 const root=resolve('dist/modo-estudio/browser');
 server=createServer(async(request,response)=>{
  try{
   const pathname=new URL(request.url,'http://localhost').pathname;
   let path=resolve(root,'.'+decodeURIComponent(pathname));
   if(!path.startsWith(root+sep)&&path!==root)throw Error('Ruta fuera del proyecto');
   if(!extname(path))path=resolve(root,'index.html');
   const body=await readFile(path);
   response.setHeader('Content-Type',({'.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.css':'text/css','.woff2':'font/woff2','.wasm':'application/wasm','.pdf':'application/pdf','.png':'image/png','.jpg':'image/jpeg'})[extname(path)]??'text/html');
   response.end(body);
  }catch{response.writeHead(404);response.end('not found');}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base='http://127.0.0.1:'+server.address().port;
}
const output='test-results';
await mkdir(output,{recursive:true});
const engines=process.argv.includes('--webkit')?[['webkit',webkit]]:[['chromium',chromium]];
for(const [name,engine] of engines){
  const browser=await engine.launch(name==='chromium'?chromeLaunchOptions():{headless:true});
  try{
    const context=await browser.newContext({...devices['iPhone 13']});
    const page=await context.newPage();
    const errors=[];
    const expectCounter=async text=>{await page.waitForFunction(expected=>document.querySelector('.simple-bank-counter')?.textContent?.trim()===expected,text);assert.equal(await page.locator('.simple-bank-counter').innerText(),text);};
    const external=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{if(!request.url().startsWith(base)&&!request.url().startsWith('data:')&&!request.url().startsWith('blob:'))external.push(request.url());});
    for(const [route,label] of [['/inicio','inicio'],['/preguntas?asignatura=dwcs&tema=1','banco'],['/examenes','examenes'],['/ajustes','ajustes']]){
      await page.goto(base+route);
      await page.locator('app-root').waitFor();
      await page.waitForTimeout(200);
      const metrics=await page.evaluate(async()=>{
        await document.fonts.load('400 16px "DM Sans"');
        await document.fonts.load('400 16px "JetBrains Mono"');
        return {width:innerWidth,body:document.documentElement.scrollWidth,dm:document.fonts.check('400 16px "DM Sans"'),mono:document.fonts.check('400 16px "JetBrains Mono"')};
      });
      assert.ok(metrics.body<=metrics.width+1,`${name} ${route}: desbordamiento horizontal ${JSON.stringify(metrics)}`);
      assert.ok(metrics.dm&&metrics.mono,`${name} ${route}: fuentes locales disponibles`);
      await page.screenshot({path:`${output}/mobile-${name}-${label}.png`,fullPage:true});
    }
    await page.goto(base+'/preguntas?asignatura=dwcs&tema=1');
    await page.getByLabel(/^Prioridad/).waitFor();
    await expectCounter('114 resultados');
    await page.getByLabel(/^Prioridad/).selectOption('high');
    await expectCounter('50 resultados');
    await page.getByLabel(/^Prioridad/).selectOption('normal');
    await expectCounter('64 resultados');
    await page.getByLabel(/^Prioridad/).selectOption('all');
    await page.getByLabel('Buscar preguntas',{exact:true}).fill('Ray Tomlinson');
    await expectCounter('1 resultados');
    await page.getByLabel('Buscar preguntas',{exact:true}).fill('');
    await expectCounter('114 resultados');
    const section=await page.getByLabel(/^Apartado/).locator('option').nth(1).getAttribute('value');
    await page.getByLabel(/^Apartado/).selectOption(section);
    await page.waitForFunction(()=>document.querySelector('.simple-bank-counter')?.textContent?.trim()!=='114 resultados');
    const count=Number((await page.locator('.simple-bank-counter').innerText()).split(' ')[0]);
    assert.ok(count>0&&count<114);
    await page.getByRole('button',{name:'Ver respuesta y explicación'}).first().click();
    await page.locator('.bank-answer').first().waitFor();
    assert.ok(await page.locator('.bank-answer').first().isVisible());
    assert.ok(await page.locator('app-question-source').first().isVisible());
    await page.goto(base+'/preguntas?asignatura=despregamento&tema=1');
    await expectCounter('53 resultados');
    assert.equal(await page.getByLabel(/^Prioridad/).count(),0);
    await page.goto(base+'/examenes');
    await page.getByLabel(/^Preparación/).selectOption('exam');
    await page.getByLabel(/^Contenidos destacados/).selectOption('85');
    await page.waitForFunction(()=>{
      const stored=JSON.parse(localStorage.getItem('estudio-simulacro-preferencias-v1')??'{}');
      return stored.preparation==='exam'&&stored.priorityShare===85;
    });
    await page.reload();
    await page.waitForFunction(()=>document.querySelector('.exam-history-page select')?.value==='exam');
    assert.equal(await page.getByLabel(/^Preparación/).inputValue(),'exam');
    assert.equal(await page.getByLabel(/^Contenidos destacados/).inputValue(),'85');
    if(process.argv.includes('--offline')){
      await page.goto(base+'/inicio');
      await page.evaluate(async()=>{
        if(!('serviceWorker' in navigator))throw Error('Service Worker no disponible');
        await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Service Worker no se activó en 45 s')),45000))]);
      });
      await page.reload();
      await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
      const cachedUrls=()=>page.evaluate(async()=>{
        const urls=[];
        for(const key of await caches.keys())for(const request of await (await caches.open(key)).keys())urls.push(new URL(request.url).pathname);
        return urls;
      });
      const firstInstall=await cachedUrls();
      assert.ok(!firstInstall.includes('/php-runtime/php_8_2.wasm'),'PHP no se descarga durante la instalación inicial');
      assert.ok(!firstInstall.includes('/apuntes/dwcs-ud1.pdf'),'PDF no se descarga durante la instalación inicial');
      assert.ok(firstInstall.includes('/fonts/dm-sans-latin-wght-normal.woff2'));
      const php=()=>page.evaluate(async()=>{
        const worker=new Worker('/php-runtime/worker.js',{type:'module'});
        let sequence=0;
        const send=(action,payload)=>new Promise((resolve,reject)=>{
          const id=++sequence;
          const timer=setTimeout(()=>reject(Error('PHP no responde en 45 s')),45000);
          worker.onmessage=({data})=>{if(data.id!==id)return;clearTimeout(timer);data.error?reject(Error(data.error)):resolve(data.result);};
          worker.onerror=event=>{clearTimeout(timer);reject(Error(event.message));};
          worker.postMessage({id,action,...payload});
        });
        try{
          await send('open',{files:{'index.php':'<?php echo "ESTUDIO_OFFLINE|".PHP_VERSION;'}});
          return await send('request',{request:{url:'/index.php'}});
        }finally{worker.terminate();}
      });
      const onlineRun=await php();
      assert.match(onlineRun.body,/^ESTUDIO_OFFLINE\|8\.2\./);
      await page.evaluate(async()=>{
        const response=await fetch('/apuntes/dwcs-ud1.pdf');
        if(!response.ok||(await response.text()).slice(0,4)!=='%PDF')throw Error('No se descargó el PDF real');
      });
      const prepared=await cachedUrls();
      assert.ok(prepared.includes('/php-runtime/php_8_2.wasm'));
      assert.ok(prepared.includes('/apuntes/dwcs-ud1.pdf'));
      if(name==='webkit'){
        // Playwright #42775: setOffline() prevents WebKit from serving even literal SW responses.
        // Stop the real origin instead; no application resource can reach its server.
        if(!server)throw Error('La prueba offline WebKit requiere --production para detener el origen local.');
        await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});
        console.log('webkit: servidor origen detenido realmente para comprobar caché offline, evitando el fallo de emulación Playwright #42775.');
      }else await context.setOffline(true);
      const offlineRun=await php();
      assert.equal(offlineRun.body,onlineRun.body);
      const offlineAssets=await page.evaluate(async()=>{
        await document.fonts.load('400 16px "DM Sans"');
        await document.fonts.load('400 16px "JetBrains Mono"');
        const pdf=await fetch('/apuntes/dwcs-ud1.pdf');
        const picture=await fetch('/temario/dwcs-r17-u1-02.png');
        return {pdf:(await pdf.text()).slice(0,4),picture:picture.ok,dm:document.fonts.check('400 16px "DM Sans"'),mono:document.fonts.check('400 16px "JetBrains Mono"')};
      });
      assert.equal(offlineAssets.pdf,'%PDF');
      assert.ok(offlineAssets.picture&&offlineAssets.dm&&offlineAssets.mono);
      console.log(`${name}: Worker PHP nuevo, PDF, imágenes y fuentes consultados sin conexión en la aplicación activa.`);
      await page.reload();
      await page.getByRole('heading',{name:'Buenas noches'}).or(page.getByRole('heading',{name:'Buenos días'})).or(page.getByRole('heading',{name:'Buenas tardes'})).waitFor();
      await page.goto(base+'/preguntas?asignatura=dwcs&tema=1');
      await expectCounter('114 resultados');
      await context.setOffline(false);
      console.log(`${name}: PWA de producción verificada sin red tras preparar recursos: recarga, banco, imágenes, dos fuentes, PDF original y PHP 8.2 real en Worker nuevo. Primera instalación sin descargar PDF ni WASM.`);
    }
    assert.deepEqual(errors,[],`${name}: errores Angular/navegador`);
    assert.deepEqual(external,[],`${name}: recursos externos inesperados`);
    console.log(`${name} iPhone 13 emulado: navegación móvil, ancho de página, dos fuentes locales, banco 114/53, filtros 50/64/apartado/búsqueda, solución/referencias y preferencias persistentes verificados; sin peticiones externas ni errores de página.`);
    await context.close();
  }finally{await browser.close();server?.close();}
}
