import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const loadTypeScript = async (path, replacements = {}) => {
  let source = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  for (const [from, to] of Object.entries(replacements)) source = source.replace(from, to);
  const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  return { url, exports: await import(url) };
};
const metadata = await loadTypeScript('src/app/core/exam-priority.ts');
const { selectQuestions } = (await loadTypeScript('src/app/core/question-selection.ts', { "'./exam-priority'": JSON.stringify(metadata.url) })).exports;
const { questionMetadata } = metadata.exports;
const bank = name => JSON.parse(readFileSync(`src/app/data/${name}.questions.ts`, 'utf8').match(/Question\[\] = (\[[\s\S]*\]);\s*$/)[1]);
const dwcs = bank('dwcs');
const other = bank('despregamento');
const seeded = seed => () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const random = seeded(20261125);
const options = { preparation: 'exam', priorityShare: 70, random, now: Date.parse('2026-11-25T12:00:00Z') };
assert.equal(dwcs.length, 545);
assert.equal(other.length, 181);
let sessions = 0;
for (const unit of [1,2,3]) {
  const pool = dwcs.filter(question => question.unit === unit);
  assert.ok(pool.some(question => questionMetadata(question).priority === 'high'));
  assert.ok(pool.some(question => questionMetadata(question).priority === 'normal'));
  const seen = new Set();
  for (let trial = 0; trial < 500; trial++) {
    const selected = selectQuestions(pool, 10, {}, options);
    assert.equal(selected.length, 10);
    assert.equal(new Set(selected.map(question => question.id)).size, 10);
    assert.equal(selected.filter(question => questionMetadata(question).priority === 'high').length, 7);
    selected.forEach(question => seen.add(question.id));
    sessions++;
  }
  assert.equal(seen.size, pool.length, `Todos los contenidos de UD${unit} conservan acceso a la rotación`);
  for (const highOnly of [true,false]) {
    const category = pool.filter(question => questionMetadata(question).teacherHighlighted === highOnly);
    assert.equal(selectQuestions(category, 30, {}, options).length, Math.min(30,category.length));
  }
}
assert.equal(selectQuestions([...dwcs, dwcs[0]], 0, {}, options).length, 545);
const singles=Array.from({length:500},()=>selectQuestions(dwcs,1,{},options)[0]);
assert.ok(singles.some(question=>questionMetadata(question).teacherHighlighted));
assert.ok(singles.some(question=>!questionMetadata(question).teacherHighlighted));
assert.deepEqual(selectQuestions(other, 10, {}, {...options, random:seeded(123)}), selectQuestions(other, 10, {}, {preparation:'general',random:seeded(123)}));
const [example] = dwcs.filter(question => questionMetadata(question).teacherHighlighted);
const sameSection = dwcs.filter(question => question.unit === example.unit && question.section === example.section).slice(0,3);
assert.ok(sameSection.length >= 2);
const bad = sameSection[0];
const strong = sameSection[1];
const records = Object.fromEntries(sameSection.map(question => [question.id,{seen:10,good:10,bad:0,medium:0,lastGrade:'good',starred:false,lastDate:'2026-11-25T11:00:00Z'}]));
records[bad.id] = {...records[bad.id],good:0,bad:10,lastGrade:'bad',starred:true};
const occurrences = Object.fromEntries(sameSection.map(question => [question.id,0]));
for (let trial=0;trial<1500;trial++) occurrences[selectQuestions(sameSection,1,records,options)[0].id]++;
assert.ok(occurrences[bad.id] > occurrences[strong.id] * 3, 'Los fallos repetidos y pendientes aumentan la necesidad de repaso');
assert.ok(occurrences[strong.id] > 0, 'Las preguntas dominadas conservan una probabilidad positiva');
const scarce = [...dwcs.filter(question => questionMetadata(question).teacherHighlighted).slice(0,2), ...dwcs.filter(question => !questionMetadata(question).teacherHighlighted).slice(0,20)];
assert.equal(selectQuestions(scarce,10,{},options).filter(question => questionMetadata(question).teacherHighlighted).length,2);
for(const share of [10,50,70,85,90,0,100,NaN]) {
  const selected=selectQuestions(dwcs,10,{}, {...options,priorityShare:share});
  assert.ok(selected.some(question=>questionMetadata(question).teacherHighlighted));
  assert.ok(selected.some(question=>!questionMetadata(question).teacherHighlighted));
}
console.log(`Selección verificada: ${sessions} sesiones 70/30 sin repeticiones; cobertura completa, categorías insuficientes, adaptación al repaso y conservación del modo general.`);
for(const unit of [1,2,3]) {
  const pool=dwcs.filter(question=>question.unit===unit);
  console.log(`UD${unit}: ${pool.filter(question=>questionMetadata(question).teacherHighlighted).length} destacadas; ${pool.filter(question=>!questionMetadata(question).teacherHighlighted).length} del resto; metadatos separados del banco.`);
}
