import assert from 'node:assert/strict';
import { writeFileSync, unlinkSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import '@angular/compiler';
import { createEnvironmentInjector, runInInjectionContext, signal } from '@angular/core';

const bundle = resolve('tools/.check-study.bundle.mjs');
class MemoryStorage {
  items=new Map();
  fail=false;
  getItem(key){return this.items.get(key)??null;}
  setItem(key,value){if(this.fail)throw new Error('Quota exceeded');this.items.set(key,value);}
  removeItem(key){this.items.delete(key);}
}
globalThis.localStorage=new MemoryStorage();
try {
  const result=await build({stdin:{contents:"export {StudyService} from './src/app/core/study.service'; export {CatalogService} from './src/app/core/catalog.service';",resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'node',packages:'external',tsconfig:'tsconfig.app.json'});
  writeFileSync(bundle,result.outputFiles[0].text);
  const {StudyService,CatalogService}=await import(pathToFileURL(bundle).href);
  const questions=JSON.parse(readFileSync('src/app/data/dwcs.questions.ts','utf8').match(/Question\[\] = (\[[\s\S]*\]);\s*$/)[1]);
  const injector=createEnvironmentInjector([{provide:CatalogService,useValue:{entries:signal(questions)}}]);
  const create=()=>runInInjectionContext(injector,()=>new StudyService());
  const legacy={seen:3,good:1,bad:2,medium:0,lastGrade:'bad',starred:true,note:'Conservar',lastDate:'2025-01-01',lastDraft:'Código anterior'};
  const historical={id:'historico',subjectId:'dwcs',answers:[{questionId:'pregunta-anterior'}],config:{},total:1,good:0,bad:1,medium:0};
  localStorage.setItem('estudio-php-v1',JSON.stringify({records:{'dwcs-id-antiguo':legacy,'despregamento-id-antiguo':legacy},results:[historical],reports:{'dwcs-id-antiguo':{reason:'otro',comment:'Conservar',reasons:['otro']}}}));
  localStorage.setItem('estudio-simulacro-preferencias-v1','{inválido');
  let service=create();
  assert.deepEqual(service.record('dwcs-id-antiguo'),legacy);
  assert.deepEqual(service.record('despregamento-id-antiguo'),legacy);
  assert.equal(service.results()[0].id,'historico');
  assert.ok(service.reports()['dwcs-id-antiguo']);
  const question=questions.find(question=>question.codeTask==='write');
  const config={...service.filters(),units:[question.unit],mode:'mixed',section:'all',count:10};
  assert.ok(service.start([question.id,question.id],config));
  assert.equal(service.session().ids.length,1);
  service.write('<?php echo "borrador sin corregir";');
  service.writeFile('index.php','<?php echo "archivo persistente";',{ 'index.php':'<?php' });
  service.abandon();
  service=create();
  assert.ok(service.start([question.id],config));
  assert.equal(service.session().files['index.php'],'<?php echo "archivo persistente";');
  assert.ok(service.session().draft.includes('archivo persistente'));
  service.abandon();
  const recordQuestion=questions[0];
  service.saveNote(recordQuestion.id,'Nota original');
  assert.equal(service.matches(recordQuestion,{...config,units:[recordQuestion.unit],section:'Otro apartado'}),false);
  service.records.set({...service.records(),[recordQuestion.id]:{...legacy,starred:false}});
  assert.equal(service.matches(recordQuestion,{...config,units:[recordQuestion.unit],pendingOnly:true}),false);
  service.toggleStar(recordQuestion.id);
  assert.equal(service.matches(recordQuestion,{...config,units:[recordQuestion.unit],pendingOnly:true}),true);
  const exported={schema:'estudio-php-v1',records:service.records(),results:service.results(),reports:service.reports(),drafts:service.drafts()};
  service.importFile(JSON.stringify(exported));
  assert.equal(service.results()[0].id,'historico');
  assert.deepEqual(service.record('despregamento-id-antiguo'),legacy);
  assert.ok(service.drafts()[question.id].files['index.php']);
  const corrupt='{conservar original corrupto';
  localStorage.setItem('estudio-php-v1',corrupt);
  service=create();
  service.toggleTheme();
  assert.equal(localStorage.getItem('estudio-php-v1'),corrupt,'No sobrescribir progreso que no se pudo leer');
  assert.ok(service.storageError());
  service.importFile(JSON.stringify(exported));
  localStorage.fail=true;
  service.saveNote(question.id,'No perder silenciosamente');
  assert.ok(service.storageError().includes('guardar'));
  localStorage.fail=false;
  injector.destroy();
  console.log('Persistencia verificada: historial e IDs antiguos, datos de otra asignatura, borradores y archivos sin corregir, importación, filtros, IDs duplicados, datos corruptos y aviso de cuota.');
}finally{try{unlinkSync(bundle);}catch{}}
