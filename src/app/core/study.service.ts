import { Injectable, computed, signal, inject } from '@angular/core';
import { QUESTIONS, Question, QuestionKind } from './questions';
import { DEFAULT_SUBJECT_ID, findSubject } from './subjects';
import { CatalogService } from './catalog.service';

export type Grade = 'good' | 'medium' | 'bad';
export type ExamMode = 'mixed' | 'test' | 'single' | 'multi' | 'written' | 'short' | 'develop' | 'code' | 'write' | 'interpret' | 'match' | 'order';
export type ContentFilter = 'all' | 'activities' | 'theory';
export interface Filters {
  subjectId: string;
  units: number[];
  mode: ExamMode;
  level: 'all' | 'medio' | 'alto';
  count: number;
  source: 'all' | 'audio' | 'temario';
  content: ContentFilter;
  withImages: boolean;
  weakOnly: boolean;
  strict?: boolean;
}
export interface AnswerRecord {
  seen: number;
  good: number;
  medium: number;
  bad: number;
  lastGrade: Grade | null;
  starred: boolean;
  note: string;
  lastDate: string;
  lastDraft: string;
}
export type ReportReason = 'enunciado'|'contexto'|'respuesta'|'respuesta-incompleta'|'codigo'|'salida-falta'|'salida-incorrecta'|'imagen'|'opciones'|'pista'|'duplicada'|'fuera-temario'|'dificultad'|'redaccion'|'otro';
export interface QuestionReport { reason: ReportReason; reasons: ReportReason[]; comment: string; date: string; status: 'pendiente'|'corregida'|'descartada'; useful?: boolean; }
export interface ExamAnswer {
  questionId: string;
  grade: Grade | null;
  skipped: boolean;
  selected: number[];
  matched?: Record<string,string>;
  ordered?: string[];
  draft: string;
}
export interface ExamResult {
  id: string;
  subjectId: string;
  startedAt: string;
  completedAt: string;
  config: Filters;
  total: number;
  good: number;
  medium: number;
  bad: number;
  skipped: number;
  answers: ExamAnswer[];
}
export interface ExamSession {
  history?: { id: string; before: AnswerRecord }[];
  ids: string[];
  pointer: number;
  selected: number[];
  matched?: Record<string,string>;
  ordered?: string[];
  draft: string;
  revealed: boolean;
  graded: boolean;
  lastGrade: Grade | null;
  good: number;
  medium: number;
  bad: number;
  completed: boolean;
  config: Filters;
  startedAt?: string;
  answers?: ExamAnswer[];
  resultId?: string;
  hintLevel?: number;
  files?: Record<string,string>;
}
const storageKey = 'estudio-php-v1';
const sessionKey = 'estudio-php-session-v1';
const filterPreferencesKey = 'estudio-simulacro-preferencias-v1';
const defaultRecord = (): AnswerRecord => ({ seen: 0, good: 0, medium: 0, bad: 0, lastGrade: null, starred: false, note: '', lastDate: '', lastDraft: '' });
const defaultFilters: Filters = { subjectId: DEFAULT_SUBJECT_ID, units: [1, 2, 3], mode: 'mixed', level: 'all', count: 10, source: 'all', content: 'all', withImages: false, weakOnly: false, strict:false };
const modeKinds: Record<ExamMode, QuestionKind[]> = {
  mixed: ['single', 'multi', 'short', 'develop', 'code', 'match', 'order'],
  test: ['single', 'multi'], single: ['single'], multi: ['multi'],
  written: ['short', 'develop'], short: ['short'], develop: ['develop'], code: ['code'],
  write: ['code'], interpret: ['code'],match:['match'],order:['order']
};
const cleanAnswer = (q: Question, session: ExamSession, grade: Grade | null, skipped = grade === null): ExamAnswer => ({
  questionId: q.id, grade, skipped, selected: [...session.selected], matched:{...(session.matched??{})}, ordered:[...(session.ordered??[])], draft: session.draft
});

@Injectable({ providedIn: 'root' })
export class StudyService {
  readonly catalog = inject(CatalogService);
  readonly questions = this.catalog.entries;
  readonly records = signal<Record<string, AnswerRecord>>({});
  readonly results = signal<ExamResult[]>([]);
  readonly reports = signal<Record<string, QuestionReport>>({});
  readonly reportCount = computed(() => Object.values(this.reports()).filter(r=>r.reasons?.length || r.comment).length);
  readonly theme = signal<'dark' | 'light'>('light');
  readonly session = signal<ExamSession | null>(null);
  readonly filters = signal<Filters>({ ...defaultFilters });
  readonly seenCount = computed(() => Object.values(this.records()).filter(r => r.seen > 0).length);
  readonly weakCount = computed(() => Object.entries(this.records()).filter(([id,r]) => !this.isDefective(id) && (r.lastGrade === 'bad' || r.lastGrade === 'medium')).length);
  readonly favoriteCount = computed(() => Object.values(this.records()).filter(r => r.starred).length);
  readonly totalReviewed = computed(() => Object.values(this.records()).reduce((a, r) => a + r.seen, 0));
  readonly gradeTotals = computed(() => Object.entries(this.records()).filter(([id])=>!this.isDefective(id)).reduce((a, [,r]) => ({ good: a.good + r.good, medium: a.medium + r.medium, bad: a.bad + r.bad }), { good: 0, medium: 0, bad: 0 }));
  readonly hasActiveExam = computed(() => {
    const s = this.session();
    return s !== null && !s.completed && s.pointer < s.ids.length;
  });
  readonly current = computed(() => {
    const s = this.session();
    return s ? this.questions().find(q => q.id === s.ids[s.pointer]) ?? null : null;
  });
  readonly percent = computed(() => {
    const s = this.session();
    return s ? (s.completed ? 100 : Math.round(s.pointer / s.ids.length * 100)) : 0;
  });
  readonly filtered = computed(() => this.questions().filter(q => this.matches(q, this.filters())));
  constructor() {
    try {
      const storedFilters = localStorage.getItem(filterPreferencesKey);
      if (storedFilters) {
        const previous = JSON.parse(storedFilters) as Partial<Filters>;
        const subject = findSubject(previous.subjectId ?? '') ?? findSubject(DEFAULT_SUBJECT_ID)!;
        const available = subject.themes.map(theme => theme.id);
        const units = Array.isArray(previous.units) ? previous.units.filter(id => available.includes(id)) : [];
        this.filters.set({
          ...defaultFilters,
          subjectId: subject.id,
          units: units.length ? [...new Set(units)] : available,
          mode: previous.mode && Object.hasOwn(modeKinds, previous.mode) ? previous.mode : defaultFilters.mode,
          level: ['all','medio','alto'].includes(previous.level ?? '') ? previous.level! : 'all',
          count: typeof previous.count === 'number' && [0,10,20,30].includes(previous.count) ? previous.count : 10,
          source: ['all','audio','temario'].includes(previous.source ?? '') ? previous.source! : 'all',
          content: ['all','activities','theory'].includes(previous.content ?? '') ? previous.content! : 'all',
          weakOnly: previous.weakOnly === true,
          strict: previous.strict === true,
          withImages: previous.withImages === true
        });
      }
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.records && typeof state.records === 'object' && !Array.isArray(state.records)) this.records.set(state.records);
        if (Array.isArray(state.results)) this.results.set(state.results.filter((r: ExamResult) => r && typeof r.id === 'string' && Array.isArray(r.answers)));
        if (state.reports && typeof state.reports === 'object' && !Array.isArray(state.reports)) {
          const known = new Set(this.questions().map(q => q.id));
          this.reports.set(Object.fromEntries(Object.entries(state.reports).filter(([id, report]) => known.has(id) && report && typeof report === 'object').map(([id, raw]) => { const r = raw as QuestionReport; return [id,{...r,reasons:r.reasons??[r.reason],status:r.status??'pendiente'}]; })) as Record<string, QuestionReport>);
        }
        if (state.theme === 'light' || state.theme === 'dark') this.theme.set(state.theme);
      }
      const previous = localStorage.getItem(sessionKey);
      if (previous) {
        const s = JSON.parse(previous) as ExamSession;
        if (Array.isArray(s.ids) && s.ids.length > 0 && s.ids.every(id => this.questions().some(q => q.id === id))) this.session.set(s);
      }
    } catch { localStorage.removeItem(sessionKey); }
  }
  isDefective(id:string):boolean {const report=this.reports()[id];return !!(report?.status==='pendiente' && report.reasons?.length);}
  record(id: string): AnswerRecord { return this.records()[id] ?? defaultRecord(); }
  private persist(): void {
    try { localStorage.setItem(storageKey, JSON.stringify({ records: this.records(), results: this.results(), reports: this.reports(), theme: this.theme() })); } catch {}
  }
  private persistSession(): void {
    try {
      const s = this.session();
      if (s) localStorage.setItem(sessionKey, JSON.stringify(s));
      else localStorage.removeItem(sessionKey);
    } catch {}
  }
  private updateRecord(id: string, patch: Partial<AnswerRecord>): void {
    this.records.update(v => ({ ...v, [id]: { ...this.record(id), ...patch } }));
    this.persist();
  }
  toggleTheme(): void { this.theme.update(v => v === 'dark' ? 'light' : 'dark'); this.persist(); }
  toggleStar(id: string): void { this.updateRecord(id, { starred: !this.record(id).starred }); }
  reportQuestion(id: string, reasons: ReportReason[], comment: string): void {
    if (!this.questions().some(q => q.id === id) || !reasons.length) return;
    this.reports.update(all => ({ ...all, [id]: { reason: reasons[0], reasons: [...new Set(reasons)], comment: comment.trim().slice(0, 2000), date: new Date().toISOString(), status: 'pendiente', useful: all[id]?.useful } }));
    this.persist();
  }
  setReportStatus(id: string, status: 'pendiente'|'corregida'|'descartada'): void {
    const previous = this.reports()[id];
    if(!previous)return;
    this.reports.update(all=>({...all,[id]:{...previous,status}}));this.persist();
  }
  toggleUseful(id: string): void {
    const old = this.reports()[id];
    this.reports.update(all=>({...all,[id]:{reason:old?.reason??'otro',reasons:old?.reasons??[],comment:old?.comment??'',date:old?.date??new Date().toISOString(),status:old?.status??'pendiente',useful:!old?.useful}}));
    this.persist();
  }
  clearReport(id: string): void {
    this.reports.update(all => {
      const next = { ...all };
      if(next[id]?.useful) next[id]={...next[id],reasons:[],comment:'',status:'pendiente'};
      else delete next[id];
      return next;
    });
    this.persist();
  }
  reviewText(): string {
    const chosen = this.questions().filter(q => (this.reports()[q.id]?.reasons?.length || this.reports()[q.id]?.comment) || this.record(q.id).starred);
    return chosen.map((q, index) => {
      const report = this.reports()[q.id];
      return [
        `${index + 1}. ${q.id} · Tema ${q.unit} · ${q.kind}`,
        `Estado: ${report?.reasons?.length ? 'Reportada (' + report.reasons.join(', ') + ')' : 'Favorita'}`,
        report?.comment ? `Observación: ${report.comment}` : '',
        `Pregunta: ${q.prompt}`,
        q.code ? `Código: ${q.code}` : '',
        q.image ? `Imagen: ${q.image}` : '',
        `Respuesta de ESTUDIO: ${q.solution}`
      ].filter(Boolean).join('\n');
    }).join('\n\n---\n\n');
  }
  exportReviewFile(): boolean {
    const chosen = this.questions().filter(q => (this.reports()[q.id]?.reasons?.length || this.reports()[q.id]?.comment) || this.record(q.id).starred);
    if (!chosen.length) return false;
    const json = JSON.stringify({
      schema: 'estudio-question-review-v1',
      exportedAt: new Date().toISOString(),
      instructions: 'Preguntas reportadas o favoritas para que el revisor compruebe enunciado, imagen y respuesta. No incluye contraseñas ni otros datos privados.',
      summary: { reported: chosen.filter(q => this.reports()[q.id]).length, favorites: chosen.filter(q => this.record(q.id).starred).length },
      questions: chosen.map(q => ({ id: q.id, status: { report: this.reports()[q.id] ?? null, favorite: this.record(q.id).starred, note: this.record(q.id).note }, question: q }))
    }, null, 2);
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'estudio-preguntas-para-revisar.json';
    anchor.click();
    URL.revokeObjectURL(url);
    return true;
  }
  saveNote(id: string, note: string): void { this.updateRecord(id, { note }); }
  private persistFilters(): void {
    try { localStorage.setItem(filterPreferencesKey, JSON.stringify(this.filters())); } catch {}
  }
  updateFilters(change: Partial<Filters>): void {
    this.filters.update(f => ({ ...f, ...change }));
    this.persistFilters();
  }
  selectSubject(id: string): void {
    const subject = findSubject(id);
    if (subject) {
      this.filters.update(f => ({ ...f, subjectId: id, units: subject.themes.map(t => t.id), source: 'all', content: 'all', weakOnly: false, withImages: false }));
      this.persistFilters();
    }
  }
  toggleUnit(unit: number): void {
    this.filters.update(f => ({ ...f, units: f.units.includes(unit) ? f.units.filter(n => n !== unit) : [...f.units, unit].sort() }));
    this.persistFilters();
  }
  matches(q: Question, f: Filters): boolean {
    if (q.subjectId !== f.subjectId || !f.units.includes(q.unit)) return false;
    if (!modeKinds[f.mode].includes(q.kind)) return false;
    if ((f.mode === 'write' || f.mode === 'interpret') && q.codeTask !== f.mode) return false;
    if (f.level !== 'all' && f.level !== q.level) return false;
    if (f.source !== 'all' && q.origin !== f.source) return false;
    if (f.content === 'activities' && !q.activity) return false;
    if (f.content === 'theory' && q.activity) return false;
    if (f.withImages && !q.image) return false;
    if (f.weakOnly && !['bad', 'medium'].includes(this.record(q.id).lastGrade ?? '')) return false;
    if (this.isDefective(q.id)) return false;
    return true;
  }
  start(ids?: string[], config?: Filters): boolean {
    if (this.hasActiveExam()) return false;
    const f = config ?? this.filters();
    if(ids && !ids.length)return false;
    const valid = this.questions().filter(q => this.matches(q, f));
    const options = ids?.length ? ids.filter(id => valid.some(q => q.id === id)) : [...valid].sort(() => Math.random() - 0.5).map(q => q.id).slice(0, f.count || undefined);
    if (!options.length) return false;
    this.session.set({ ids: options, pointer: 0, selected: [], matched:{}, ordered:[], draft: '', files:{}, hintLevel:0, revealed: false, graded: false, lastGrade: null, good: 0, medium: 0, bad: 0, completed: false, history: [], answers: [], startedAt: new Date().toISOString(), config: { ...f, units: [...f.units] } });
    this.persistSession();
    return true;
  }
  startQuick(subjectId: string, units: number[], mode: ExamMode, weakOnly = false, content: ContentFilter = 'all'): boolean {
    const subject = findSubject(subjectId);
    if (!subject) return false;
    const chosenUnits = units.filter(unit => subject.themes.some(t => t.id === unit));
    if (!chosenUnits.length) return false;
    return this.start(undefined, { ...defaultFilters, subjectId, units: chosenUnits, mode, content, count: 10, weakOnly });
  }
  private updateSession(patch: Partial<ExamSession>): void {
    this.session.update(s => s ? { ...s, ...patch } : null);
    this.persistSession();
  }
  select(index: number): void {
    const s = this.session();
    if (!s || s.revealed) return;
    const q = this.current();
    this.updateSession({ selected: q?.kind === 'single' ? [index] : s.selected.includes(index) ? s.selected.filter(n => n !== index) : [...s.selected, index] });
  }
  chooseMatch(left:string,right:string):void {const s=this.session();if(!s||s.revealed)return;this.updateSession({matched:{...(s.matched??{}),[left]:right}});}
  orderItems():string[] {const q=this.current();const s=this.session();return s?.ordered?.length?s.ordered:q?.sequence?[...q.sequence].reverse():[];}
  moveOrder(index:number,direction:-1|1):void {const s=this.session();if(!s||s.revealed)return;const items=this.orderItems();const other=index+direction;if(other<0||other>=items.length)return;[items[index],items[other]]=[items[other],items[index]];this.updateSession({ordered:items});}
  write(value: string): void { this.updateSession({ draft: value }); }
  writeFile(name: string, value: string, starter: Record<string,string>): void {
    const s=this.session(); if(!s||!Object.hasOwn(starter,name))return;
    const files={...starter,...(s.files??{}),[name]:value};
    const draft=Object.entries(files).map(([file,code])=>`===== ${file} =====\n${code}`).join('\n\n');
    this.updateSession({files,draft});
  }
  nextHint(): void {
    const s=this.session(); const q=this.current();
    if(!s||!q||s.revealed||!q.hints?.length)return;
    this.updateSession({hintLevel:Math.min((s.hintLevel??0)+1,q.hints.length)});
  }
  reveal(): void {
    const s = this.session();
    const q = this.current();
    if (!s || !q || s.revealed) return;
    if(s.config.strict){this.submitStrict(s,q);return;}
    this.updateSession({ revealed: true });
    if (q.kind === 'single' || q.kind === 'multi' || q.kind === 'match' || q.kind === 'order') {
      const correct = q.kind==='match' ? q.pairs?.every(p=>s.matched?.[p.left]===p.right) : q.kind==='order' ? q.sequence?.every((v,i)=>this.orderItems()[i]===v) : q.correct.length === s.selected.length && q.correct.every(n => s.selected.includes(n));
      this.grade(correct ? 'good' : 'bad');
    }
  }
  private submitStrict(s: ExamSession, q: Question): void {
    const test = ['single','multi','match','order'].includes(q.kind);
    const isBlank = q.kind==='match'?Object.keys(s.matched??{}).length===0:q.kind==='order'?false:test?s.selected.length===0:!s.draft.trim();
    const correct = q.kind==='match' ? q.pairs?.every(p=>s.matched?.[p.left]===p.right) : q.kind==='order' ? q.sequence?.every((v,i)=>this.orderItems()[i]===v) : q.correct.length === s.selected.length && q.correct.every(n => s.selected.includes(n));
    const grade: Grade|null = isBlank || !test ? null : correct?'good':'bad';
    const entry = cleanAnswer(q,s,grade,isBlank);
    const history=[...(s.history??[])];
    if(grade){
      const before={...this.record(q.id)};
      this.updateRecord(q.id,{seen:before.seen+1,[grade]:before[grade]+1,lastGrade:grade,lastDate:new Date().toISOString(),lastDraft:s.draft});
      history.push({id:q.id,before});
    }
    const next:ExamSession={...s,history,answers:[...(s.answers??[]),entry],good:s.good+ +(grade==='good'),bad:s.bad+ +(grade==='bad')};
    if(s.pointer+1>=s.ids.length)this.finish(next);
    else this.updateSession({...next,pointer:s.pointer+1,selected:[],matched:{},ordered:[],files:{},draft:'',hintLevel:0,revealed:false,graded:false,lastGrade:null});
  }
  assessResult(resultId:string,questionId:string,grade:Grade):void {
    const result=this.results().find(r=>r.id===resultId);
    const answer=result?.answers.find(a=>a.questionId===questionId);
    if(!result || !answer || answer.grade || answer.skipped)return;
    const rec=this.record(questionId);
    this.updateRecord(questionId,{seen:rec.seen+1,[grade]:rec[grade]+1,lastGrade:grade,lastDate:new Date().toISOString(),lastDraft:answer.draft});
    this.results.update(all=>all.map(r=>r.id!==resultId?r:{...r,[grade]:r[grade]+1,answers:r.answers.map(a=>a.questionId===questionId?{...a,grade}:a)}));
    this.persist();
  }
  grade(grade: Grade): void {
    const s = this.session();
    const q = this.current();
    if (!s || !q || s.graded) return;
    const before = { ...this.record(q.id) };
    this.updateRecord(q.id, { seen: before.seen + 1, [grade]: before[grade] + 1, lastGrade: grade, lastDate: new Date().toISOString(), lastDraft: s.draft });
    this.updateSession({ graded: true, lastGrade: grade, good: s.good + +(grade === 'good'), medium: s.medium + +(grade === 'medium'), bad: s.bad + +(grade === 'bad'), history: [...(s.history ?? []), { id: q.id, before }], answers: [...(s.answers ?? []), cleanAnswer(q, s, grade)] });
  }
  private finish(s: ExamSession): void {
    const alreadySaved = s.resultId && this.results().some(r => r.id === s.resultId);
    const resultId = s.resultId ?? `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    if (!alreadySaved) {
      this.results.update(results => [{ id: resultId, subjectId: s.config.subjectId, startedAt: s.startedAt ?? new Date().toISOString(), completedAt: new Date().toISOString(), config: { ...s.config, content: s.config.content ?? 'all' }, total: s.ids.length, good: s.good, medium: s.medium, bad: s.bad, skipped: (s.answers ?? []).filter(a => a.skipped).length, answers: [...(s.answers ?? [])] }, ...results].slice(0, 250));
      this.persist();
    }
    this.updateSession({ completed: true, resultId, answers: s.answers ?? [] });
  }
  skip(): void {
    const s = this.session();
    const q = this.current();
    if (!s || !q || s.revealed) return;
    const next: ExamSession = { ...s, answers: [...(s.answers ?? []), cleanAnswer(q, s, null)] };
    if (s.pointer + 1 >= s.ids.length) this.finish(next);
    else this.updateSession({ answers: next.answers, pointer: s.pointer + 1, selected: [], matched:{}, ordered:[], draft: '', files:{}, hintLevel:0, revealed: false, graded: false, lastGrade: null });
  }
  next(): void {
    const s = this.session();
    if (!s || !s.graded) return;
    if (s.pointer + 1 >= s.ids.length) this.finish(s);
    else this.updateSession({ pointer: s.pointer + 1, selected: [], matched:{}, ordered:[], draft: '', files:{}, hintLevel:0, revealed: false, graded: false, lastGrade: null });
  }
  abandon(): void { this.session.set(null); this.persistSession(); }
  discardActiveExam(): void {
    const s = this.session();
    if (s && !s.completed && s.history?.length) {
      const restored = { ...this.records() };
      for (const entry of [...s.history].reverse()) {
        const current = restored[entry.id] ?? defaultRecord();
        restored[entry.id] = { ...entry.before, starred: current.starred, note: current.note };
      }
      this.records.set(restored);
      this.persist();
    }
    this.abandon();
  }
  exportFile(): void {
    const json = JSON.stringify({ schema: 'estudio-php-v1', exportedAt: new Date().toISOString(), records: this.records(), results: this.results(), reports: this.reports(), theme: this.theme() }, null, 2);
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'estudio-progreso.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }
  importFile(text: string): void {
    const data = JSON.parse(text);
    if (data.schema !== 'estudio-php-v1' || !data.records || typeof data.records !== 'object' || Array.isArray(data.records)) throw new Error('Archivo de progreso no válido');
    const next: Record<string, AnswerRecord> = {};
    for (const [id, value] of Object.entries(data.records)) {
      if (!this.questions().some(q => q.id === id) || !value || typeof value !== 'object') continue;
      const v = value as Partial<AnswerRecord>;
      next[id] = { ...defaultRecord(), ...v, note: typeof v.note === 'string' ? v.note : '', lastDraft: typeof v.lastDraft === 'string' ? v.lastDraft : '' };
    }
    this.records.set(next);
    if (data.reports && typeof data.reports === 'object' && !Array.isArray(data.reports)) {
      const known = new Set(this.questions().map(q => q.id));
      this.reports.set(Object.fromEntries(Object.entries(data.reports).filter(([id, report]) => known.has(id) && report && typeof report === 'object')) as Record<string, QuestionReport>);
    }
    this.results.set(Array.isArray(data.results) ? data.results.filter((r: ExamResult) => r && typeof r.id === 'string' && Array.isArray(r.answers)) : []);
    if (data.theme === 'light' || data.theme === 'dark') this.theme.set(data.theme);
    this.abandon();
    this.persist();
  }
  reset(): void { this.records.set({}); this.results.set([]); this.reports.set({}); this.abandon(); this.persist(); }
}
