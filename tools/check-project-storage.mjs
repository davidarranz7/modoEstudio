import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { build } from 'esbuild';
import { chromium, webkit, chromeLaunchOptions } from './browser-test-support.mjs';

const compiled=await build({
  stdin:{contents:"import {ProjectStorageService,safeProjectPath} from './src/app/core/project-storage.service'; import {projectZip} from './src/app/core/project-zip'; import {buildProjectTree,renameProjectPath,deleteProjectPath} from './src/app/core/project-files'; globalThis.storageTest={ProjectStorageService,safeProjectPath,projectZip,buildProjectTree,renameProjectPath,deleteProjectPath};",resolveDir:process.cwd(),loader:'ts'},
  bundle:true,write:false,format:'iife',platform:'browser',tsconfig:'tsconfig.app.json',
  plugins:[{name:'angular-state-only',setup(builder){
    builder.onResolve({filter:/^@angular\/core$/},()=>({path:'angular-test-state',namespace:'state'}));
    builder.onLoad({filter:/.*/,namespace:'state'},()=>({contents:'export const Injectable=()=>target=>target;export const signal=initial=>{let value=initial;const result=()=>value;result.set=next=>value=next;return result;};',loader:'js'}));
  }}]
});
const server=createServer((request,response)=>{
  response.setHeader('Content-Type',request.url==='/test.js'?'text/javascript':'text/html');
  response.end(request.url==='/test.js'?compiled.outputFiles[0].text:'<!doctype html><title>Project persistence test</title><script src="/test.js"></script>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const engine=process.argv.includes('--webkit')?webkit:chromium;
const browser=await engine.launch(engine===chromium?chromeLaunchOptions():{headless:true});
try{
  const context=await browser.newContext();const page=await context.newPage();
  await page.goto(origin);
  const results=await page.evaluate(async()=>{
    const {ProjectStorageService,safeProjectPath,projectZip,buildProjectTree,renameProjectPath,deleteProjectPath}=globalThis.storageTest;
    const checks=[];
    const check=(label,passed,actual)=>checks.push({label,passed:!!passed,...(!passed?{actual}:{})});
    const key='estudio-projects-v1';
    const make=(id,code,time)=>({id,files:{'index.php':code,'datos/generado.txt':'Creado por PHP'},folders:['empty'],activeFile:'index.php',tabs:['index.php'],note:'Observación conservada',attempts:[],updatedAt:time});
    const old=make('quota','<?php echo "antiguo";','2026-11-25T10:00:00.000Z');
    const latest=make('quota','<?php echo "último código";','2026-11-25T11:00:00.000Z');
    let service=new ProjectStorageService();
    service.save(old);
    check('IndexedDB real: guardar y esperar escritura', (await service.load('quota')).files['index.php']===old.files['index.php']);
    const originalSet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(name,value){if(name===key)throw new DOMException('Cuota simulada','QuotaExceededError');return originalSet.call(this,name,value);};
    try{
      service.save(latest);
      const loaded=await service.load('quota');
      check('Cuota localStorage: IndexedDB más reciente prevalece al cargar',loaded.files['index.php']===latest.files['index.php'],loaded);
      check('Cuota localStorage: exportación all evita recuperar diario obsoleto',(await service.all()).find(work=>work.id==='quota').files['index.php']===latest.files['index.php']);
      check('La prueba mantiene realmente un diario antiguo',JSON.parse(localStorage.getItem(key)).quota.updatedAt===old.updatedAt);
      check('La cuota produce un aviso visible',!!service.warning());
    }finally{Storage.prototype.setItem=originalSet;}
    service=new ProjectStorageService();
    check('Instancia nueva conserva código reciente pese al diario antiguo',(await service.load('quota')).files['index.php']===latest.files['index.php']);
    const journalLatest=make('quota','<?php echo "diario más reciente";','2026-11-25T12:00:00.000Z');
    const originalPut=IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put=function(){throw new DOMException('Fallo IDB simulado','QuotaExceededError');};
    try{
      service.save(journalLatest);
      const loaded=await service.load('quota');
      check('Fallo de escritura IDB: diario más reciente prevalece al cargar',loaded.files['index.php']===journalLatest.files['index.php'],loaded);
      check('Fallo de escritura IDB: all conserva la versión reciente',(await service.all()).find(work=>work.id==='quota').files['index.php']===journalLatest.files['index.php']);
      check('Fallo IDB produce un aviso',service.warning().includes('IndexedDB'));
    }finally{IDBObjectStore.prototype.put=originalPut;}
    const factoryOpen=IDBFactory.prototype.open;
    IDBFactory.prototype.open=function(){throw new DOMException('IDB denegado simulado','SecurityError');};
    try{
      const unavailable=new ProjectStorageService();
      check('Sin IndexedDB: recupera el diario real',(await unavailable.load('quota')).files['index.php']===journalLatest.files['index.php']);
      check('Sin IndexedDB: informa de la limitación',unavailable.warning().includes('IndexedDB'));
    }finally{IDBFactory.prototype.open=factoryOpen;}
    const cloned=make('clone','<?php echo "copia independiente";','2026-11-25T12:01:00.000Z');
    service.save(cloned);cloned.files['index.php']='Mutado después de guardar';
    check('Guardar captura una copia independiente antes de la cola',(await service.load('clone')).files['index.php']==='<?php echo "copia independiente";');
    check('Los TXT generados se conservan',(await service.load('clone')).files['datos/generado.txt']==='Creado por PHP');
    const validAttempt={date:'2026-11-25T10:00:00Z',mode:'practice',passed:1,total:2,details:[{label:'Paso válido',passed:true,detail:'Correcto'},null,{label:4,passed:true,detail:'inválido'}]};
    const malformed={...make('import-normalize','<?php echo "importado";','fecha inválida'),activeFile:{bad:true},tabs:['missing.php','index.php','index.php',4],folders:['empty','../outside','/absolute','with space','nested//bad',null],note:42,attempts:[validAttempt,{...validAttempt,passed:3,total:2},{...validAttempt,mode:'official'},{...validAttempt,date:123},null]};
    check('Importación acepta datos de proyecto normalizables',service.importBackup(JSON.stringify({schema:key,projects:[malformed]}))===1);
    const imported=await service.load('import-normalize');
    check('Importación repara activeFile corrupto',imported.activeFile==='index.php',imported.activeFile);
    check('Importación filtra pestañas inexistentes/duplicadas',JSON.stringify(imported.tabs)==='["index.php"]',imported.tabs);
    check('Importación filtra carpetas no seguras',JSON.stringify(imported.folders)==='["empty"]',imported.folders);
    check('Importación normaliza observación y fecha',imported.note===''&&Number.isFinite(Date.parse(imported.updatedAt)),imported);
    check('Importación filtra intentos y detalles corruptos',imported.attempts.length===1&&imported.attempts[0].details.length===1,imported.attempts);
    const invalidFiles=['../outside.php','/absolute.php','C:\\escape.php','a//b.php','a/./b.php','a/../b.php','https://host/index.php','with space.php','bad\n.php','a'.repeat(161)+'.php','script.js'];
    for(const path of invalidFiles){
      let rejected=false;
      try{service.importBackup(JSON.stringify({schema:key,projects:[{...make('reject', '',latest.updatedAt),files:{[path]:'bad'}}]}));}catch{rejected=true;}
      check('Importación rechaza ruta/extensión insegura: '+JSON.stringify(path),rejected);
    }
    const allowed=['index.php','lib/f.php','datos.json','.config.json','output/generated.txt','a'.repeat(160)];
    check('Rutas seguras válidas hasta 160 caracteres',allowed.every(safeProjectPath));
    check('Rutas inseguras rechazadas',invalidFiles.filter(path=>!path.endsWith('script.js')).every(path=>!safeProjectPath(path)));
    let rejected=false;
    try{service.importBackup(JSON.stringify({schema:key,projects:[make('atomic-first','conservar',latest.updatedAt),{...make('atomic-second','',latest.updatedAt),files:{'../bad.php':'bad'}}]}));}catch{rejected=true;}
    check('Importación inválida es atómica: ningún proyecto parcial',rejected&&await service.load('atomic-first')===undefined);
    const collision={...make('collision','<?php',latest.updatedAt),files:{'index.php':'<?php','lib.php':'<?php','lib.php/helper.php':'<?php'},folders:['index.php']};
    let collisionRejected=false;
    try{service.importBackup(JSON.stringify({schema:key,projects:[collision]}));}catch{collisionRejected=true;}
    check('Importación rechaza colisiones archivo/carpeta del sistema virtual',collisionRejected);
    let writes=0;const countingPut=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){writes++;return countingPut.apply(this,args);};
    try{
      for(let index=0;index<25;index++)service.save({...make('coalesced','<?php echo '+index+';','2026-11-26T10:00:00.000Z'),revision:index});
      check('Estado inmediato Guardando',service.saveState()==='saving');await service.flush();
      check('Ráfaga de25ediciones produce una sola escritura IDB',writes===1,writes);
      check('Último snapshot conservado y Guardado',(await service.load('coalesced')).files['index.php']==='<?php echo 24;'&&service.saveState()==='saved');
    }finally{IDBObjectStore.prototype.put=countingPut;}
    const editor={...make('editor-state','<?php echo 5;','2026-11-26T11:00:00.000Z'),editorState:{'index.php':{file:'ruta-incorrecta',selection:{anchor:9999,head:-4},scrollTop:48,scrollLeft:5,assistance:false,fontSize:18,documentHash:'13:abc123',state:{doc:'<?php echo 5;',history:{done:[{changes:[]}]}}},'missing.php':{file:'missing.php'}}};
    service.save(editor);const savedEditor=await service.load('editor-state');
    check('Editor conserva historial serializable y preferencias',savedEditor.editorState['index.php'].state.history.done.length===1&&savedEditor.editorState['index.php'].assistance===false);
    check('Editor conserva documentHash para validar historial tras recargar',savedEditor.editorState['index.php'].documentHash==='13:abc123');
    check('Editor normaliza ruta, selección y elimina snapshot inexistente',savedEditor.editorState['index.php'].file==='index.php'&&savedEditor.editorState['index.php'].selection.anchor===editor.files['index.php'].length&&savedEditor.editorState['index.php'].selection.head===0&&!savedEditor.editorState['missing.php']);
    const nested={...make('tree','<?php','2026-11-26T12:00:00.000Z'),files:{'index.php':'<?php','lib/functions.php':'<?php function demo(){}','lib/data/config.json':'{}'},folders:['empty','lib/empty'],activeFile:'lib/functions.php',tabs:['index.php','lib/functions.php'],editorState:{'lib/functions.php':{file:'lib/functions.php',selection:{anchor:6,head:6},scrollTop:20,scrollLeft:0,assistance:true,fontSize:14,state:{history:{done:[1]}}}}};
    const tree=buildProjectTree(nested.files,nested.folders);
    check('Árbol incluye carpetas implícitas y vacías',tree.some(node=>node.path==='empty'&&node.kind==='folder')&&tree.find(node=>node.path==='lib').children.some(node=>node.path==='lib/data'));
    const renamed=renameProjectPath(nested,'lib','includes',true);
    check('Renombrar carpeta mueve contenido, pestañas e historial',!!renamed.files['includes/functions.php']&&renamed.activeFile==='includes/functions.php'&&renamed.tabs.includes('includes/functions.php')&&renamed.editorState['includes/functions.php'].file==='includes/functions.php'&&renamed.editorState['includes/functions.php'].state.history.done[0]===1&&!renamed.files['lib/functions.php']);
    const removed=deleteProjectPath(renamed,'includes',true);
    check('Eliminar carpeta conserva archivos ajenos y limpia pestañas/historial',Object.keys(removed.files).join()==='index.php'&&removed.activeFile==='index.php'&&removed.tabs.join()==='index.php'&&!Object.keys(removed.editorState).length);
    const beforeRename=JSON.stringify(nested);let tooLong=false;try{renameProjectPath(nested,'lib','a'.repeat(150),true);}catch{tooLong=true;}
    check('Renombrado demasiado largo se rechaza antes de modificar el trabajo',tooLong&&JSON.stringify(nested)===beforeRename);
    const bothFailed=make('both-failed','<?php echo "último código en memoria";','2026-11-26T12:05:00.000Z');
    Storage.prototype.setItem=function(){throw new DOMException('Sin espacio','QuotaExceededError');};IDBObjectStore.prototype.put=function(){throw new DOMException('Sin espacio','QuotaExceededError');};
    try{service.save(bothFailed);await service.flush();check('Fallo de ambos soportes: estado Error y copia actual en memoria',service.saveState()==='error'&&(await service.load('both-failed')).files['index.php']===bothFailed.files['index.php']);}finally{Storage.prototype.setItem=originalSet;IDBObjectStore.prototype.put=originalPut;}
    await service.flush();check('Recuperación de cuota vuelve a guardar el último código',(await (new ProjectStorageService()).load('both-failed')).files['index.php']===bothFailed.files['index.php']);
    const rawCorrupt='{copia original que no debe desaparecer';localStorage.setItem(key,rawCorrupt);
    const corruptService=new ProjectStorageService();corruptService.save(make('corrupt-recovery','<?php echo 7;','2026-11-26T13:00:00.000Z'));await corruptService.flush();
    check('Copia corrupta conservada antes de reemplazar el diario',localStorage.getItem(key+'-unreadable-journal')===rawCorrupt);
    check('Recuperación conserva el nuevo código',(await corruptService.load('corrupt-recovery')).files['index.php']==='<?php echo 7;');
    return {checks,zip:Array.from(projectZip({'empty/':'','nested/empty/':'','index.php':'<?php echo "olá";\n','datos.json':'{"ok":true}'}))};
  });
  console.log(JSON.stringify(results.checks,null,2));
  assert.ok(results.checks.every(check=>check.passed),'Falló alguna comprobación de persistencia/importación; consultar resultados anteriores.');
  const second=await context.newPage();await second.goto(origin);
  await page.evaluate(async()=>{globalThis.tabStore=new storageTest.ProjectStorageService();const work={id:'two-tabs',files:{'index.php':'base'},folders:[],tabs:['index.php'],activeFile:'index.php',note:'',attempts:[],updatedAt:'2026-11-26T14:00:00.000Z'};tabStore.save(work);await tabStore.flush();globalThis.tabWork=await tabStore.load('two-tabs');});
  await second.evaluate(async()=>{globalThis.tabStore=new storageTest.ProjectStorageService();globalThis.tabWork=await tabStore.load('two-tabs');});
  await page.evaluate(async()=>{tabStore.save({...tabWork,files:{'index.php':'tab-A'},updatedAt:'2026-11-26T15:00:00.000Z'});await tabStore.flush();});
  const conflict=await second.evaluate(async()=>{tabStore.save({...tabWork,files:{'index.php':'tab-B'},updatedAt:'2026-11-26T16:00:00.000Z'});await tabStore.flush();const own=await tabStore.load('two-tabs');await tabStore.flush();return {state:tabStore.stateFor('two-tabs'),warning:tabStore.warning(),own:own.files['index.php'],backup:JSON.parse(localStorage.getItem('estudio-projects-v1-conflicts'))['two-tabs'].files['index.php']};});
  assert.equal(conflict.state,'error');assert.match(conflict.warning,/Otra pestaña/);assert.equal(conflict.own,'tab-B');assert.equal(conflict.backup,'tab-B');
  assert.equal(await page.evaluate(async()=>(await (new storageTest.ProjectStorageService()).load('two-tabs')).files['index.php']),'tab-A','Una segunda pestaña obsoleta no sobrescribe una revisión más reciente, aunque su fecha sea posterior');
  console.log('Concurrencia de dos pestañas reales: revisión protegida, conflicto visible y ambas copias conservadas.');await second.close();
  const exportedConflict=await page.evaluate(async()=>{
    const stale=new storageTest.ProjectStorageService();const base=await stale.load('two-tabs');
    const current=new storageTest.ProjectStorageService();await current.load('two-tabs');current.save({...base,files:{'index.php':'remote-current'},updatedAt:'2026-11-26T17:00:00.000Z'});await current.flush();
    stale.save({...base,files:{'index.php':'my-conflict'},updatedAt:'2026-11-26T18:00:00.000Z'});await stale.flush();
    let blob;const create=URL.createObjectURL;const click=HTMLAnchorElement.prototype.click;URL.createObjectURL=function(value){blob=value;return create.call(URL,value);};HTMLAnchorElement.prototype.click=function(){};
    try{await stale.exportBackup();const backup=JSON.parse(await blob.text());return {current:Object.values(backup.conflicts).some(work=>work.files['index.php']==='remote-current'),mine:Object.values(backup.conflicts).some(work=>work.files['index.php']==='my-conflict'),version:backup.version};}finally{URL.createObjectURL=create;HTMLAnchorElement.prototype.click=click;}
  });assert.ok(exportedConflict.current&&exportedConflict.mine&&exportedConflict.version===2,'La exportación contiene ambas versiones de un conflicto');
  const journalConflict=await page.evaluate(async()=>{
    const make=code=>({id:'journal-concurrent',files:{'index.php':code},folders:[],tabs:['index.php'],activeFile:'index.php',note:'',attempts:[],updatedAt:'2026-11-26T20:00:00.000Z'});
    const first=new storageTest.ProjectStorageService();first.save(make('base'));await first.flush();const a=await first.load('journal-concurrent');const second=new storageTest.ProjectStorageService();const b=await second.load('journal-concurrent');
    const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(){throw new DOMException('Quota','QuotaExceededError');};try{second.save({...b,files:{'index.php':'journal-latest'},updatedAt:'2026-11-26T21:00:00.000Z'});await second.flush();}finally{IDBObjectStore.prototype.put=put;}
    first.save({...a,files:{'index.php':'stale-later-clock'},updatedAt:'2026-11-26T22:00:00.000Z'});await first.flush();const recovered=await (new storageTest.ProjectStorageService()).load('journal-concurrent');return {state:first.stateFor('journal-concurrent'),code:recovered.files['index.php']};
  });assert.equal(journalConflict.state,'error');assert.equal(journalConflict.code,'journal-latest');console.log('Conflictos de diario durante fallo IDB y exportación de ambas versiones verificados.');
  await page.reload();
  const reloaded=await page.evaluate(async()=>{
    const service=new globalThis.storageTest.ProjectStorageService();
    const work=await service.load('quota');
    const clone=await service.load('clone');
    return {code:work.files['index.php'],txt:clone.files['datos/generado.txt']};
  });
  assert.equal(reloaded.code,'<?php echo "diario más reciente";');
  assert.equal(reloaded.txt,'Creado por PHP');
  const unzip=spawnSync('python',['-c',`import io,json,sys,zipfile
with zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read())) as z:
 assert z.testzip() is None
 assert z.getinfo('empty/').is_dir()
 assert z.getinfo('nested/empty/').is_dir()
 assert z.read('index.php').decode('utf-8') == '<?php echo "olá";\\n'
 assert json.loads(z.read('datos.json')) == {'ok': True}
 print('ZIP leído por Python zipfile: CRC válidos, dos carpetas vacías y archivos UTF-8 normales.')
`],{input:Buffer.from(results.zip),encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}});
  assert.equal(unzip.status,0,unzip.stderr);
  console.log(unzip.stdout.trim());
  console.log(`${engine===webkit?'WebKit':'Chromium'}: ${results.checks.length} comprobaciones con IndexedDB real; cuota/diario obsoleto, recuperación tras recargar, normalización e importación atómica verificadas.`);
}finally{await browser.close();server.close();server.closeAllConnections();}
