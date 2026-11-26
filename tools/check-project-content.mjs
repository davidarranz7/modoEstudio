import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

// Type imports disappear when transpiled, so this validates exactly the data shipped to Angular.
const source=readFileSync('src/app/data/php-projects.ts','utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {PHP_PROJECTS}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const bankSource=readFileSync('src/app/data/dwcs.questions.ts','utf8');
const bank=JSON.parse(bankSource.match(/Question\[\] = (\[[\s\S]*\]);/)[1]);
const ids=new Set();
let files=0, tests=0, requests=0, staticChecks=0;
for(const p of PHP_PROJECTS){
 assert(!ids.has(p.id),`Repeated project ID: ${p.id}`);ids.add(p.id);
 assert([2,3].includes(p.unit));
 assert(p.statement.includes('No es un enunciado ni un examen oficial'),p.id);
 assert(p.statement.includes('rúbrica es orientativa'),p.id);
 assert(p.context&&p.objective&&p.hints.length&&p.examples.length&&p.explanation.length,p.id);
 assert(p.requirements.length>=3,p.id);
 assert.equal(p.rubric.reduce((sum,row)=>sum+row.points,0),10,p.id+' rubric');
 const paths=new Set(p.files.map(f=>f.path));
 assert.equal(paths.size,p.files.length,p.id+' duplicate paths');
 assert(paths.has(p.entry),p.id+' missing entry');
 for(const f of p.files){
  assert(!f.path.startsWith('/')&&!f.path.split('/').includes('..'),p.id+' unsafe file path');
  assert(f.responsibility&&f.explanation&&f.solution,p.id+' incomplete file '+f.path);
  assert(['provided','complete','create'].includes(f.role));
  if(f.role==='provided')assert.equal(f.starter,f.solution,p.id+' provided file differs');
  if(f.path.endsWith('.json'))JSON.parse(f.solution);
  files++;
 }
 for(const reference of p.references){
  assert(bank.some(q=>q.unit===reference.unit&&q.section===reference.section),p.id+' unknown reference '+reference.section);
  assert(!Object.hasOwn(reference,'sourcePage'),p.id+' unverified page');
 }
 for(const t of p.tests){
  assert(t.label&&t.steps.length,p.id+' empty test');tests++;
  for(const s of t.steps){
   assert(['GET','POST'].includes(s.method),p.id+' method');
   const target=s.url.split('?')[0].replace(/^\//,'');
   assert(paths.has(target)||(p.generatedFiles??[]).includes(target),p.id+' request entry '+s.url);
   assert(s.expect&&Object.keys(s.expect).length,p.id+' no assertions');
   requests++;
  }
 }
 for(const check of p.staticChecks??[]){
  const f=p.files.find(f=>f.path===check.file); assert(f,p.id+' static file');
  assert(new RegExp(check.pattern).test(f.solution),p.id+' reference fails static check '+check.label);staticChecks++;
 }
}
assert.equal(PHP_PROJECTS.filter(p=>p.unit===2).length,10);
assert.equal(PHP_PROJECTS.filter(p=>p.unit===3).length,8);
if(process.argv[2]==='--json')writeFileSync(process.argv[3]??'.local-project-fixtures.json',JSON.stringify(PHP_PROJECTS,null,2));
console.log(`Project content verified: ${PHP_PROJECTS.length} projects (10 UD2, 8 UD3), ${files} files, ${tests} behavioral scenarios, ${requests} HTTP requests, ${staticChecks} static checks. Academic references match current DWCS sections. This command validates content structure; it does not execute PHP.`);
