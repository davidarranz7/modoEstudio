import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(`src/app/data/${n}.questions.ts`,'utf8').match(/Question\[\] = (\[[\s\S]*\]);\s*$/)[1]);
const dw=read('dwcs'),other=read('despregamento');
const lines=['# Matriz de cobertura — ESTUDIO 17','','Auditoría estructural; no sustituye la revisión académica.','','| Asignatura | Unidad | Preguntas |','|---|---|---:|'];
for(const [name,qs] of [['DWCS',dw],['Despregamento',other]])for(const u of [...new Set(qs.map(q=>q.unit))])lines.push(`| ${name} | ${u} | ${qs.filter(q=>q.unit===u).length} |`);
lines.push('','## DWCS: cobertura por apartado','','| UD | Apartado | Preguntas |','|---|---|---:|');
for(const u of [1,2,3]){const m=new Map();for(const q of dw.filter(q=>q.unit===u)){if(!q.reference||!q.section||!Number.isInteger(q.sourcePage)||q.sourcePage<1)throw Error('Referencia incompleta: '+q.id);m.set(q.section,(m.get(q.section)||0)+1);}for(const [s,n] of m)lines.push(`| ${u} | ${s.replaceAll('|','/')} | ${n} |`);if(!existsSync(`public/apuntes/dwcs-ud${u}.pdf`))throw Error('Falta PDF');}
lines.push('','## Límites','','- PDF de algoritmos de la actividad 2.2 pendiente; no se inventan los algoritmos ausentes.','- Las guías son apuntes reelaborados, no transcripciones literales.','- La clasificación de prioridad se deriva de los apartados y las indicaciones facilitadas; el reparto 70/30 es configurable, no oficial.','- Las pruebas automáticas de proyectos no sustituyen la revisión de su rúbrica orientativa.');
for(const f of ['MATRIZ_COBERTURA.md','public/descargas/matriz-cobertura.md'])writeFileSync(f,lines.join('\n')+'\n');
console.log(`DWCS: ${dw.length}; Despregamento: ${other.length}; referencias completas.`);
