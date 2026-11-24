import { Injectable, computed, signal } from '@angular/core';
import { QUESTIONS, Question } from './questions';
import { findSubject } from './subjects';

export type ReviewState = 'pendiente' | 'corregida' | 'descartada';
export interface Revision { id: string; at: string; questionId: string; before: Question | null; after: Question | null; }
export interface ImportCandidate { id: string; kind: 'nuevo' | 'modificado' | 'sin-cambios'; before: Question | null; after: Question; }
const STORAGE_KEY = 'estudio-catalogo-v2';

function validateQuestion(value: unknown): Question {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Cada pregunta debe ser un objeto.');
  const q = value as Question;
  if (!/^[a-zA-Z0-9_-]{3,100}$/.test(q.id ?? '')) throw new Error('Identificador de pregunta no válido.');
  const subject = findSubject(q.subjectId);
  if (!subject || !subject.themes.some(t => t.id === q.unit)) throw new Error(`Asignatura o unidad desconocida: ${q.id}`);
  if (!['single','multi','short','develop','code','match','order'].includes(q.kind)) throw new Error(`Tipo de pregunta desconocido: ${q.id}`);
  if (!['medio','alto'].includes(q.level) || !['temario','audio'].includes(q.origin)) throw new Error(`Dificultad u origen incorrectos: ${q.id}`);
  if (typeof q.prompt !== 'string' || q.prompt.trim().length < 18 || q.prompt.length > 16000 || typeof q.solution !== 'string' || q.solution.trim().length < 3 || q.solution.length > 30000) throw new Error(`Enunciado o respuesta incompletos: ${q.id}`);
  if (!Array.isArray(q.options) || !q.options.every(option => typeof option === 'string') || !Array.isArray(q.correct)) throw new Error(`Opciones incorrectas: ${q.id}`);
  if (['single','multi'].includes(q.kind) && (q.options.length < 2 || !q.correct.length || q.correct.some(index => !Number.isInteger(index) || index < 0 || index >= q.options.length) || new Set(q.correct).size !== q.correct.length || (q.kind === 'single' && q.correct.length !== 1))) throw new Error(`Respuestas de test incoherentes: ${q.id}`);
  if (!['single','multi'].includes(q.kind) && (q.correct.length || q.options.length)) throw new Error(`Pregunta abierta con opciones de test: ${q.id}`);
  if (typeof q.code !== 'string' || typeof q.check !== 'string') throw new Error(`Campos de código o corrección incorrectos: ${q.id}`);
  if(q.kind==='match' && (!Array.isArray(q.pairs) || q.pairs.length<2 || q.pairs.some(p=>typeof p.left!=='string'||typeof p.right!=='string')))throw new Error(`Relaciones incompletas: ${q.id}`);
  if(q.kind==='order' && (!Array.isArray(q.sequence)||q.sequence.length<3||q.sequence.some(v=>typeof v!=='string')))throw new Error(`Secuencia incompleta: ${q.id}`);
  if (q.kind === 'code' && !['write','interpret'].includes(q.codeTask ?? '')) throw new Error(`Modalidad de código ausente: ${q.id}`);
  if (q.image && (typeof q.image !== 'string' || !/^[a-zA-Z0-9_.-]+\.(png|jpe?g|webp|svg)$/.test(q.image))) throw new Error(`Imagen no válida: ${q.id}`);
  if (q.hints && (!Array.isArray(q.hints) || q.hints.length > 3 || q.hints.some(h => typeof h !== 'string' || h.length < 12 || h.length > 800))) throw new Error(`Pistas no válidas: ${q.id}`);
  return structuredClone(q);
}

function downloadFile(text: string, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 250);
}

@Injectable({providedIn:'root'})
export class CatalogService {
  readonly overrides = signal<Record<string, Question>>({});
  readonly additions = signal<Question[]>([]);
  readonly revisions = signal<Revision[]>([]);
  readonly states = signal<Record<string,ReviewState>>({});
  readonly pending = signal<ImportCandidate[]>([]);
  readonly entries = computed<Question[]>(() => [...QUESTIONS.map(q => this.overrides()[q.id] ?? q), ...this.additions()]);
  readonly changedIds = computed(() => new Set(this.revisions().map(r => r.questionId)));
  constructor() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const original = new Set(QUESTIONS.map(q => q.id));
      const overrides: Record<string,Question> = {};
      for (const [id, value] of Object.entries(data.overrides ?? {})) {
        try { const q = validateQuestion(value); if (original.has(id) && q.id === id) overrides[id] = q; } catch {}
      }
      const additions: Question[] = [];
      const seen = new Set(original);
      for (const value of data.additions ?? []) {
        try { const q = validateQuestion(value); if (!seen.has(q.id)) {additions.push(q); seen.add(q.id);} } catch {}
      }
      this.overrides.set(overrides); this.additions.set(additions);
      if (Array.isArray(data.revisions)) this.revisions.set(data.revisions.slice(0,100));
      if (data.states && typeof data.states === 'object') this.states.set(data.states);
    } catch { /* No borrar datos corruptos automáticamente */ }
  }
  private persist(): void {
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify({schema:'estudio-catalogo-v2',overrides:this.overrides(),additions:this.additions(),revisions:this.revisions(),states:this.states()}));} catch {throw new Error('Almacenamiento lleno o no disponible. Exporta una copia del banco.');}
  }
  get(id: string): Question | undefined {return this.entries().find(q => q.id === id);}
  state(id: string): ReviewState {return this.states()[id] ?? 'pendiente';}
  setState(id:string, state:ReviewState):void {if(!this.get(id))return;this.states.update(v=>({...v,[id]:state}));this.persist();}
  export(ids: string[], format: 'json'|'markdown' = 'json', review: Record<string,unknown> = {}): void {
    const selected = this.entries().filter(q => ids.includes(q.id));
    if (!selected.length) throw new Error('No hay preguntas seleccionadas.');
    if (format === 'json') {
      downloadFile(JSON.stringify({schema:'estudio-question-bank-v2',exportedAt:new Date().toISOString(),questions:selected,review},null,2),'estudio-banco-preguntas.json','application/json');
      return;
    }
    const md = selected.map(q => [`## ${q.id} · UD${q.unit} · ${q.kind}`,`**Pregunta:** ${q.prompt}`,q.scenario?`**Contexto:** ${q.scenario}`:'',q.options?.map((op,i)=>`${i+1}. ${op}`).join('\n')??'',q.code?`\n\`\`\`php\n${q.code}\n\`\`\``:'',q.exampleInput?`**Entrada:** ${q.exampleInput}`:'',q.exampleOutput?`**Salida esperada:** ${q.exampleOutput}`:'',`**Solución:** ${q.solution}`,q.check?`**Criterios:** ${q.check}`:'',q.hints?.length?`**Pistas:** ${q.hints.join(' | ')}`:'',`**Origen:** ${q.origin==='audio'?'Relacionado con indicaciones de audio':'Temario/actividades'}`,review[q.id]?`**Marcas y observaciones:** ${JSON.stringify(review[q.id])}`:''].filter(Boolean).join('\n\n')).join('\n\n---\n\n');
    downloadFile(`# Banco ESTUDIO · ${selected.length} preguntas\n\n${md}`,'estudio-banco-preguntas.md','text/markdown');
  }
  previewImport(content:string):ImportCandidate[] {
    if(content.length>7_000_000)throw new Error('Archivo demasiado grande.');
    const input=JSON.parse(content);
    if(!['estudio-question-bank-v2','estudio-question-corrections-v1','estudio-question-review-v1'].includes(input.schema)||!Array.isArray(input.questions))throw new Error('El archivo no es un banco compatible de ESTUDIO.');
    const seen = new Set<string>();
    const candidates: ImportCandidate[] = input.questions.map((item:unknown) => {
      const candidate = item as {question?: unknown};
      const q = validateQuestion(candidate?.question ?? item);
      if(seen.has(q.id))throw new Error(`ID repetido dentro del archivo: ${q.id}`);
      seen.add(q.id);
      const before=this.get(q.id) ?? null;
      return {id:q.id,kind:before?(JSON.stringify(before)===JSON.stringify(q)?'sin-cambios':'modificado'):'nuevo',before,after:q};
    });
    this.pending.set(candidates);
    return candidates;
  }
  applyImport(ids:string[]):number {
    const candidates=this.pending().filter(c=>ids.includes(c.id) && c.kind!=='sin-cambios');
    if(!candidates.length)return 0;
    const overrides={...this.overrides()};
    const additions=[...this.additions()];
    const now=new Date().toISOString();
    const originalIds=new Set(QUESTIONS.map(q=>q.id));
    const revisions:Revision[]=[];
    for(const c of candidates){
      if(originalIds.has(c.id))overrides[c.id]=c.after;
      else {const i=additions.findIndex(q=>q.id===c.id);if(i<0)additions.push(c.after);else additions[i]=c.after;}
      revisions.push({id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,at:now,questionId:c.id,before:c.before,after:c.after});
    }
    this.overrides.set(overrides);this.additions.set(additions);
    this.revisions.update(h=>[...revisions,...h].slice(0,100));
    this.pending.set([]);this.persist();return candidates.length;
  }
  undoRevision(revisionId:string):boolean {
    const item=this.revisions().find(r=>r.id===revisionId);
    if(!item || this.revisions().find(r=>r.questionId===item.questionId)?.id!==revisionId)return false;
    const original=QUESTIONS.find(q=>q.id===item.questionId);
    const overrides={...this.overrides()};
    let additions=[...this.additions()];
    if(original){if(!item.before||JSON.stringify(item.before)===JSON.stringify(original))delete overrides[item.questionId];else overrides[item.questionId]=item.before;}
    else if(item.before){const index=additions.findIndex(q=>q.id===item.questionId);if(index>=0)additions[index]=item.before;else additions.push(item.before);}
    else additions=additions.filter(q=>q.id!==item.questionId);
    this.overrides.set(overrides);this.additions.set(additions);
    this.revisions.update(h=>h.filter(r=>r.id!==revisionId));
    this.persist();return true;
  }
}
