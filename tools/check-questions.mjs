import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const names = readdirSync('src/app/data').filter(name => name.endsWith('.questions.ts'));
const registry = readFileSync('src/app/core/questions.ts', 'utf8');
const subjectsSource = readFileSync('src/app/core/subjects.ts', 'utf8');
const subjectIds = new Set([...subjectsSource.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map(match => match[1]));
const ids = new Set();
const questions = [];
const kinds = new Set(['single', 'multi', 'short', 'develop', 'code', 'match', 'order']);
const codeTasks = new Set(['interpret', 'write']);
const counters = {};
for (const name of names) {
  if (!registry.includes(`../data/${name.slice(0, -3)}`)) throw Error(`Banco sin registrar: ${name}`);
  const source = readFileSync(join('src/app/data', name), 'utf8');
  const match = source.match(/export const [A-Z0-9_]+: Question\[\] = (\[[\s\S]*\]);\s*$/);
  if (!match) throw Error(`Formato de banco desconocido: ${name}`);
  const bank = JSON.parse(match[1]);
  for (const q of bank) {
    if (ids.has(q.id)) throw Error(`ID duplicado: ${q.id}`);
    ids.add(q.id);
    if (!subjectIds.has(q.subjectId) || (q.subjectId === 'despregamento' ? ![1, 2].includes(q.unit) : ![1, 2, 3].includes(q.unit)) || !kinds.has(q.kind)) throw Error(`Asignatura, unidad o modalidad no válida: ${q.id}`);
    if (!['medio', 'alto'].includes(q.level) || !['audio', 'temario'].includes(q.origin)) throw Error(`Dificultad o origen inválido: ${q.id}`);
    if (typeof q.prompt !== 'string' || q.prompt.trim().length < 18 || typeof q.solution !== 'string' || q.solution.trim().length < 3) throw Error(`Enunciado o solución insuficiente: ${q.id}`);
    if (!Array.isArray(q.options) || !Array.isArray(q.correct) || typeof q.code !== 'string') throw Error(`Campos mal formados: ${q.id}`);
    if (q.kind === 'match' && (!Array.isArray(q.pairs)||q.pairs.length<2)) throw Error(`Relación sin pares: ${q.id}`);
    if (q.kind === 'order' && (!Array.isArray(q.sequence)||q.sequence.length<3)) throw Error(`Ordenación incompleta: ${q.id}`);
    if (q.kind === 'code') {
      if (!codeTasks.has(q.codeTask)) throw Error(`Falta clasificar código como interpretar/escribir: ${q.id}`);
      if (['dwcs','despregamento'].includes(q.subjectId) && q.codeTask === 'write') {
        if (!q.scenario?.trim() || !q.exampleInput?.trim() || !q.exampleOutput?.trim()) throw Error(`Ejercicio de escribir PHP sin contexto y ejemplo de entrada/salida: ${q.id}`);
      }
      if (q.subjectId === 'dwcs' && q.codeTask === 'interpret') {
        if (!q.code.trim() || !q.expectedOutput?.trim()) throw Error(`Ejercicio de interpretar PHP sin código o resultado: ${q.id}`);
      }
    } else if (q.codeTask) throw Error(`Subtipo de código en otra modalidad: ${q.id}`);
    if (q.kind === 'single' || q.kind === 'multi') {
      if (q.options.length < 3 || q.options.length > 8 || q.correct.length < 1 || (q.kind === 'single' && q.correct.length !== 1) || (q.kind === 'multi' && q.correct.length < 2)) throw Error(`Número incorrecto de opciones/respuestas: ${q.id}`);
      if (q.options.some(o => typeof o !== 'string' || !o.trim()) || new Set(q.options.map(o => o.trim())).size !== q.options.length) throw Error(`Opción vacía o duplicada: ${q.id}`);
      if (q.correct.some(i => !Number.isInteger(i) || i < 0 || i >= q.options.length) || new Set(q.correct).size !== q.correct.length) throw Error(`Índices de respuestas no válidos: ${q.id}`);
    } else if (q.options.length || q.correct.length) throw Error(`Las respuestas abiertas no deben tener opciones: ${q.id}`);
    if (['dwcs','despregamento'].includes(q.subjectId) && q.kind === 'develop' && !q.scenario?.trim()) throw Error(`Desarrollo sin contexto suficiente: ${q.id}`);
    if (q.image && new Set(['arrays-diagrama.png','cliente-web.png']).has(q.image)) throw Error(`Imagen de tema incorrecto asignada a ${q.id}: ${q.image}`);
    if (q.image) {
      const imagePath = join('public/temario', q.image);
      if (!existsSync(imagePath) || statSync(imagePath).size === 0) throw Error(`Imagen no disponible: ${q.id}, ${q.image}`);
    }
    counters[q.unit] ??= {};
    const key = q.kind === 'code' ? `code-${q.codeTask}` : q.kind;
    counters[q.unit][key] = (counters[q.unit][key] ?? 0) + 1;
    questions.push(q);
  }
}
if (!questions.length) throw Error('Banco vacío');
if (!questions.some(q => q.origin === 'audio' && q.kind === 'code' && q.unit === 2)) throw Error('Faltan ejercicios de programación destacados por profesora');
if (!questions.some(q => q.origin === 'audio' && q.unit === 3)) throw Error('Faltan indicaciones de la grabación sobre HTTP y autenticación');
console.log(`Banco verificado: ${questions.length} preguntas, ${names.length} archivos de banco y ${subjectIds.size} asignatura(s).`);
for (const [unit, modes] of Object.entries(counters)) {
  console.log(`Tema ${unit}: ${Object.values(modes).reduce((a, b) => a + b, 0)} preguntas; ${Object.entries(modes).map(([name,count]) => `${name} ${count}`).join('; ')}`);
}
console.log(`Imágenes: ${questions.filter(q => q.image).length}; actividades: ${questions.filter(q => q.activity).length}; destacadas del audio: ${questions.filter(q => q.origin === 'audio').length}.`);
