import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { build } from 'esbuild';
import { chromium, webkit, chromeLaunchOptions } from './browser-test-support.mjs';

const compiled=await build({
  stdin:{contents:"import {ProjectStorageService,safeProjectPath} from './src/app/core/project-storage.service'; import {projectZip} from './src/app/core/project-zip'; globalThis.storageTest={ProjectStorageService,safeProjectPath,projectZip};",resolveDir:process.cwd(),loader:'ts'},
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
  const page=await browser.newPage();
  await page.goto(origin);
  const results=await page.evaluate(async()=>{
    const {ProjectStorageService,safeProjectPath,projectZip}=globalThis.storageTest;
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
    return {checks,zip:Array.from(projectZip({'empty/':'','nested/empty/':'','index.php':'<?php echo "olá";\n','datos.json':'{"ok":true}'}))};
  });
  console.log(JSON.stringify(results.checks,null,2));
  assert.ok(results.checks.every(check=>check.passed),'Falló alguna comprobación de persistencia/importación; consultar resultados anteriores.');
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
