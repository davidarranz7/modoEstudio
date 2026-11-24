import { Injectable, computed, signal } from '@angular/core';
import { QUESTIONS, Question, QuestionKind } from './questions';
import { DEFAULT_SUBJECT_ID, findSubject } from './subjects';

export type Grade = 'good' | 'medium' | 'bad';
export type ExamMode = 'mixed' | 'test' | 'single' | 'multi' | 'written' | 'short' | 'develop' | 'code' | 'write' | 'interpret';
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
export interface ExamAnswer {
  questionId: string;
  grade: Grade | null;
  skipped: boolean;
  selected: number[];
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
}
const storageKey = 'estudio-php-v1';
const sessionKey = 'estudio-php-session-v1';
const defaultRecord = (): AnswerRecord => ({ seen: 0, good: 0, medium: 0, bad: 0, lastGrade: null, starred: false, note: '', lastDate: '', lastDraft: '' });
const defaultFilters: Filters = { subjectId: DEFAULT_SUBJECT_ID, units: [1, 2, 3], mode: 'mixed', level: 'all', count: 10, source: 'all', content: 'all', withImages: false, weakOnly: false };
const modeKinds: Record<ExamMode, QuestionKind[]> = {
  mixed: ['single', 'multi', 'short', 'develop', 'code'],
  test: ['single', 'multi'], single: ['single'], multi: ['multi'],
  written: ['short', 'develop', 'code'], short: ['short'], develop: ['develop'], code: ['code'],
  write: ['code'], interpret: ['code']
};
const cleanAnswer = (q: Question, session: ExamSession, grade: Grade | null): ExamAnswer => ({
  questionId: q.id, grade, skipped: grade === null, selected: [...session.selected], draft: session.draft
});

@Injectable({ providedIn: 'root' })
export class StudyService {
  readonly questions = QUESTIONS;
  readonly records = signal<Record<string, AnswerRecord>>({});
  readonly results = signal<ExamResult[]>([]);
  readonly theme = signal<'dark' | 'light'>('light');
  readonly session = signal<ExamSession | null>(null);
  readonly filters = signal<Filters>({ ...defaultFilters });
  readonly seenCount = computed(() => Object.values(this.records()).filter(r => r.seen > 0).length);
  readonly weakCount = computed(() => Object.values(this.records()).filter(r => r.lastGrade === 'bad' || r.lastGrade === 'medium').length);
  readonly favoriteCount = computed(() => Object.values(this.records()).filter(r => r.starred).length);
  readonly totalReviewed = computed(() => Object.values(this.records()).reduce((a, r) => a + r.seen, 0));
  readonly gradeTotals = computed(() => Object.values(this.records()).reduce((a, r) => ({ good: a.good + r.good, medium: a.medium + r.medium, bad: a.bad + r.bad }), { good: 0, medium: 0, bad: 0 }));
  readonly hasActiveExam = computed(() => {
    const s = this.session();
    return s !== null && !s.completed && s.pointer < s.ids.length;
  });
  readonly current = computed(() => {
    const s = this.session();
    return s ? this.questions.find(q => q.id === s.ids[s.pointer]) ?? null : null;
  });
  readonly percent = computed(() => {
    const s = this.session();
    return s ? (s.completed ? 100 : Math.round(s.pointer / s.ids.length * 100)) : 0;
  });
  readonly filtered = computed(() => this.questions.filter(q => this.matches(q, this.filters())));
  constructor() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.records && typeof state.records === 'object' && !Array.isArray(state.records)) this.records.set(state.records);
        if (Array.isArray(state.results)) this.results.set(state.results.filter((r: ExamResult) => r && typeof r.id === 'string' && Array.isArray(r.answers)));
        if (state.theme === 'light' || state.theme === 'dark') this.theme.set(state.theme);
      }
      const previous = localStorage.getItem(sessionKey);
      if (previous) {
        const s = JSON.parse(previous) as ExamSession;
        if (Array.isArray(s.ids) && s.ids.length > 0 && s.ids.every(id => this.questions.some(q => q.id === id))) this.session.set(s);
      }
    } catch { localStorage.removeItem(sessionKey); }
  }
  record(id: string): AnswerRecord { return this.records()[id] ?? defaultRecord(); }
  private persist(): void {
    try { localStorage.setItem(storageKey, JSON.stringify({ records: this.records(), results: this.results(), theme: this.theme() })); } catch {}
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
  saveNote(id: string, note: string): void { this.updateRecord(id, { note }); }
  updateFilters(change: Partial<Filters>): void { this.filters.update(f => ({ ...f, ...change })); }
  selectSubject(id: string): void {
    const subject = findSubject(id);
    if (subject) this.filters.update(f => ({ ...f, subjectId: id, units: subject.themes.map(t => t.id), weakOnly: false }));
  }
  toggleUnit(unit: number): void {
    this.filters.update(f => ({ ...f, units: f.units.includes(unit) ? f.units.filter(n => n !== unit) : [...f.units, unit].sort() }));
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
    return true;
  }
  start(ids?: string[], config?: Filters): boolean {
    if (this.hasActiveExam()) return false;
    const f = config ?? this.filters();
    const valid = this.questions.filter(q => this.matches(q, f));
    const options = ids?.length ? ids.filter(id => valid.some(q => q.id === id)) : [...valid].sort(() => Math.random() - 0.5).map(q => q.id).slice(0, f.count || undefined);
    if (!options.length) return false;
    this.session.set({ ids: options, pointer: 0, selected: [], draft: '', revealed: false, graded: false, lastGrade: null, good: 0, medium: 0, bad: 0, completed: false, history: [], answers: [], startedAt: new Date().toISOString(), config: { ...f, units: [...f.units] } });
    this.persistSession();
    return true;
  }
  startQuick(subjectId: string, units: number[], mode: ExamMode, weakOnly = false): boolean {
    const subject = findSubject(subjectId);
    if (!subject) return false;
    const chosenUnits = units.filter(unit => subject.themes.some(t => t.id === unit));
    if (!chosenUnits.length) return false;
    return this.start(undefined, { ...defaultFilters, subjectId, units: chosenUnits, mode, count: 10, weakOnly });
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
  write(value: string): void { this.updateSession({ draft: value }); }
  reveal(): void {
    const s = this.session();
    const q = this.current();
    if (!s || !q || s.revealed) return;
    this.updateSession({ revealed: true });
    if (q.kind === 'single' || q.kind === 'multi') {
      const correct = q.correct.length === s.selected.length && q.correct.every(n => s.selected.includes(n));
      this.grade(correct ? 'good' : 'bad');
    }
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
    else this.updateSession({ answers: next.answers, pointer: s.pointer + 1, selected: [], draft: '', revealed: false, graded: false, lastGrade: null });
  }
  next(): void {
    const s = this.session();
    if (!s || !s.graded) return;
    if (s.pointer + 1 >= s.ids.length) this.finish(s);
    else this.updateSession({ pointer: s.pointer + 1, selected: [], draft: '', revealed: false, graded: false, lastGrade: null });
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
    const json = JSON.stringify({ schema: 'estudio-php-v1', exportedAt: new Date().toISOString(), records: this.records(), results: this.results(), theme: this.theme() }, null, 2);
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
      if (!QUESTIONS.some(q => q.id === id) || !value || typeof value !== 'object') continue;
      const v = value as Partial<AnswerRecord>;
      next[id] = { ...defaultRecord(), ...v, note: typeof v.note === 'string' ? v.note : '', lastDraft: typeof v.lastDraft === 'string' ? v.lastDraft : '' };
    }
    this.records.set(next);
    this.results.set(Array.isArray(data.results) ? data.results.filter((r: ExamResult) => r && typeof r.id === 'string' && Array.isArray(r.answers)) : []);
    if (data.theme === 'light' || data.theme === 'dark') this.theme.set(data.theme);
    this.abandon();
    this.persist();
  }
  reset(): void { this.records.set({}); this.results.set([]); this.abandon(); this.persist(); }
}
