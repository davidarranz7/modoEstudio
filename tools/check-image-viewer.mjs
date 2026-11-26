import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { playwright, chromeLaunchOptions } from './browser-test-support.mjs';

const root=resolve('dist/modo-estudio/browser');
const server=createServer(async(request,response)=>{
  try{
    let path=resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://local').pathname));
    if(path!==root&&!path.startsWith(root+sep))throw Error('Ruta inválida');
    if(!extname(path))path=resolve(root,'index.html');
    response.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.wasm':'application/wasm'})[extname(path)]??'text/html');
    response.end(await readFile(path));
  }catch{response.writeHead(404);response.end('not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const webkit=process.argv.includes('--webkit');
const name=webkit?'webkit':'chromium';
const browser=await (webkit?playwright.webkit:playwright.chromium).launch(webkit?{headless:true}:chromeLaunchOptions());
await mkdir('test-results',{recursive:true});
try{
  const context=await browser.newContext({...playwright.devices['iPhone 13']});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const noPageOverflow=async()=>{
    const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(metrics.scroll<=metrics.width+1,JSON.stringify(metrics));
  };
  const verifyViewer=async(trigger,label)=>{
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog=page.getByRole('dialog',{name:'Imagen ampliada del temario'});
    await dialog.waitFor();
    await page.waitForFunction(()=>document.querySelector('dialog img')?.naturalWidth>0);
    assert.equal(await dialog.evaluate(element=>element instanceof HTMLDialogElement&&element.open&&element.matches(':modal')),true);
    assert.equal(await dialog.evaluate(element=>element.contains(document.activeElement)),true,'El foco inicial entra en el diálogo');
    await dialog.getByRole('button',{name:'Ampliar imagen',exact:true}).click({clickCount:1});
    await page.waitForFunction(()=>document.querySelector('.image-dialog-tools span')?.textContent?.trim()==='150 %');
    for(let i=0;i<8;i++)await dialog.getByRole('button',{name:'Ampliar imagen',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.image-dialog-tools span')?.textContent?.trim()==='400 %');
    const imageMetrics=await dialog.locator('.image-dialog-body').evaluate(element=>({scroll:element.scrollWidth,width:element.clientWidth}));
    assert.ok(imageMetrics.scroll>imageMetrics.width,'La imagen ampliada se desplaza dentro del visor');
    await noPageOverflow();
    for(let i=0;i<8;i++)await dialog.getByRole('button',{name:'Reducir imagen',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.image-dialog-tools span')?.textContent?.trim()==='100 %');
    // Native modal dialogs make the rest of the document inert. Browser chrome may
    // receive Tab focus, but no background page control may become active.
    for(const key of ['Tab','Tab','Tab','Tab','Shift+Tab','Shift+Tab']){
      await page.keyboard.press(key);
      const focus=await dialog.evaluate(element=>({inside:element.contains(document.activeElement),body:document.activeElement===document.body,tag:document.activeElement?.tagName}));
      assert.ok(focus.inside||focus.body,'Tab alcanzó un control de fondo: '+JSON.stringify(focus));
    }
    await dialog.getByRole('button',{name:'Cerrar ×',exact:true}).focus();
    await trigger.evaluate(element=>element.focus());
    assert.equal(await dialog.evaluate(element=>element.contains(document.activeElement)),true,'El fondo inerte no admite foco programático');
    await page.screenshot({path:`test-results/image-viewer-${name}-${label}.png`});
    await page.keyboard.press('Escape');
    await dialog.waitFor({state:'detached'});
    assert.equal(await trigger.evaluate(element=>document.activeElement===element),true,'Escape devuelve el foco al botón original');
    await page.keyboard.press('Enter');
    await dialog.waitFor();
    await dialog.getByRole('button',{name:'Cerrar ×',exact:true}).click();
    await dialog.waitFor({state:'detached'});
    assert.equal(await trigger.evaluate(element=>document.activeElement===element),true,'Cerrar devuelve el foco al botón original');
    await noPageOverflow();
  };
  await page.goto(base+'/preguntas?asignatura=dwcs&tema=1');
  await page.getByLabel(/^Modalidad/).selectOption('image');
  const bankTrigger=page.getByRole('button',{name:'Ampliar imagen del ejercicio',exact:true}).first();
  await bankTrigger.waitFor();
  await verifyViewer(bankTrigger,'banco');
  const bank=JSON.parse((await readFile('src/app/data/dwcs.questions.ts','utf8')).match(/Question\[\] = (\[[\s\S]*\]);\s*$/)[1]);
  const question=bank.find(question=>!!question.image);
  await page.evaluate(question=>{
    localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[question.id],pointer:0,selected:[],matched:{},ordered:[],draft:'',revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,files:{},hintLevel:0,history:[],answers:[],startedAt:new Date().toISOString(),config:{subjectId:'dwcs',units:[question.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:true,weakOnly:false,strict:false}}));
  },question);
  await page.goto(base+'/estudiar');
  await verifyViewer(page.getByRole('button',{name:'Ampliar imagen del temario',exact:true}),'estudio');
  await page.goto(base+'/ajustes');
  await page.getByRole('button',{name:'Modo oscuro',exact:true}).click();
  await page.locator('.app-shell.dark').waitFor();
  await page.goto(base+'/laboratorio');
  await page.getByRole('heading',{name:'Aplicaciones PHP completas'}).waitFor();
  await noPageOverflow();
  assert.equal(await page.locator('.app-shell').evaluate(element=>getComputedStyle(element).getPropertyValue('--bg').trim()),'#10141b');
  await page.screenshot({path:`test-results/laboratory-dark-${name}-lista.png`});
  await page.getByRole('button',{name:/Reserva de actividades deportivas/}).click();
  await page.getByRole('button',{name:'Archivos',exact:true}).click();
  await page.getByRole('textbox',{name:'Código del archivo index.php'}).waitFor();
  await page.getByRole('textbox',{name:'Código del archivo index.php'}).scrollIntoViewIfNeeded();
  await noPageOverflow();
  await page.screenshot({path:`test-results/laboratory-dark-${name}-editor.png`});
  assert.deepEqual(errors,[]);
  console.log(`${name}: visor real <dialog> en banco y estudio, zoom100–400 %, desplazamiento interior, fondo inerte, teclado/Escape/Cerrar y restauración del foco verificados. Laboratorio oscuro conserva los tokens y no desborda la página. Capturas guardadas.`);
  await context.close();
}finally{await browser.close();server.close();server.closeAllConnections();}
