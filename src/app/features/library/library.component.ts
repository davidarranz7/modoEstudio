import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Question, TYPE_NAMES } from '../../core/questions';
import { SUBJECTS, Subject, Theme } from '../../core/subjects';
import { CatalogService } from '../../core/catalog.service';
import { StudyService } from '../../core/study.service';
import { IconComponent } from '../../shared/icon.component';
import { HeaderComponent } from '../../shared/header.component';

@Component({
 selector: 'app-library',
 standalone: true,
 imports: [IconComponent, HeaderComponent],
 templateUrl: './library.component.html',
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent {
 readonly study = inject(StudyService);
 readonly catalog = inject(CatalogService);
 private readonly router = inject(Router);
 private readonly route = inject(ActivatedRoute);
 readonly subjects = SUBJECTS;
 readonly typeNames = TYPE_NAMES;
 readonly subjectId = signal<string | null>(null);
 readonly unitId = signal(0);
 readonly search = signal('');
 readonly markedOnly = signal(false);
 readonly expanded = signal<string | null>(null);
 readonly countVisible = signal(20);
 readonly imageZoom = signal<string | null>(null);
 readonly feedback = signal('');
 readonly busy = signal(false);
 readonly activeSubject = computed(() => SUBJECTS.find(s => s.id === this.subjectId()) ?? null);
 readonly activeTheme = computed(() => this.activeSubject()?.themes.find(t => t.id === this.unitId()) ?? null);
 readonly currentQuestions = computed(() => this.study.questions().filter(q => {
  if (q.subjectId !== this.subjectId() || q.unit !== this.unitId()) return false;
  if (this.markedOnly() && !this.isMarked(q.id)) return false;
  const term = this.search().trim().toLocaleLowerCase('es');
  return !term || [q.id,q.prompt,q.activity??'',q.section??'',q.code, ...q.options].join(' ').toLocaleLowerCase('es').includes(term);
 }));
 readonly shownQuestions = computed(() => this.currentQuestions().slice(0, this.countVisible()));
 readonly markedQuestions = computed(() => this.study.questions().filter(q => this.isMarked(q.id)));
 readonly markedCount = computed(() => this.markedQuestions().length);

 constructor() {
  this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
   const subject = SUBJECTS.find(s => s.id === params.get('asignatura')) ?? null;
   const parsed = Number(params.get('tema'));
   const theme = subject?.themes.some(t => t.id === parsed) ? parsed : 0;
   this.subjectId.set(subject?.id ?? null);
   this.unitId.set(theme);
   this.search.set('');
   this.markedOnly.set(false);
   this.expanded.set(null);
   this.countVisible.set(20);
  });
 }
 questionsFor(subjectId: string, unitId?: number): number {
  return this.study.questions().filter(q => q.subjectId === subjectId && (!unitId || q.unit === unitId)).length;
 }
 flagsFor(subjectId: string, unitId?: number): number {
  return this.markedQuestions().filter(q => q.subjectId === subjectId && (!unitId || q.unit === unitId)).length;
 }
 selectSubject(subject: Subject): void {
  void this.router.navigate(['/preguntas'], { queryParams: { asignatura: subject.id } });
 }
 selectTheme(theme: Theme): void {
  void this.router.navigate(['/preguntas'], { queryParams: { asignatura: this.subjectId(), tema: theme.id } });
 }
 back(): void {
  if (this.unitId()) void this.router.navigate(['/preguntas'], { queryParams: { asignatura: this.subjectId() } });
  else void this.router.navigate(['/preguntas']);
 }
 isMarked(id: string): boolean {
  const report = this.study.reports()[id];
  return !!(report?.reasons?.length || report?.comment);
 }
 toggleMark(id: string): void {
  if (this.isMarked(id)) {
   this.study.clearReport(id);
   this.feedback.set('Marca retirada.');
  } else {
   this.study.reportQuestion(id, ['otro'], '');
   this.feedback.set('Pregunta marcada. Puedes añadir una nota si quieres.');
  }
 }
 saveNote(id: string, text: string): void {
  const old = this.study.reports()[id];
  if (!old?.reasons?.length) return;
  if ((old.comment ?? '') === text.trim()) return;
  this.study.reportQuestion(id, old.reasons, text);
  this.feedback.set('Observación guardada en este dispositivo.');
 }
 toggleAnswer(id: string): void { this.expanded.update(v => v === id ? null : id); }
 isCorrect(q: Question, index: number): boolean { return q.correct.includes(index); }
 correctLabels(q: Question): string { return q.correct.map(index => 'ABCDEFGH'[index]).join(', '); }
 reversedSteps(q: Question): string[] { return [...(q.sequence ?? [])].reverse(); }
 pairChoices(q: Question): string[] { return [...(q.pairs ?? [])].map(p => p.right).reverse(); }
 starterFiles(q: Question): {name:string;code:string}[] { return Object.entries(q.starterFiles ?? {}).map(([name,code]) => ({name,code})); }
 typeName(q: Question): string {
  if (q.kind === 'code') return q.codeTask === 'interpret' ? 'Interpretar código' : 'Escribir código';
  return this.typeNames[q.kind];
 }
 private reportPayload(q: Question): object {
  const report = this.study.reports()[q.id];
  return {
   id: q.id,
   asignatura: SUBJECTS.find(s => s.id === q.subjectId)?.name ?? q.subjectId,
   unidad: q.unit,
   tipo: this.typeName(q),
   dificultad: q.level,
   apartado: q.section ?? null,
   actividad: q.activity ?? null,
   origen: q.origin,
   enunciado: q.prompt,
   contexto: q.scenario ?? null,
   opciones: q.options,
   respuestasCorrectas: q.correct,
   codigo: q.code || null,
   archivosIniciales: q.starterFiles ?? null,
   entradaEjemplo: q.exampleInput ?? null,
   salidaEjemplo: q.exampleOutput ?? null,
   salidaReal: q.expectedOutput ?? null,
   solucion: q.solution,
   criterios: q.check,
   imagen: q.image ?? null,
   pistas: q.hints ?? [],
   relaciones: q.pairs ?? null,
   secuencia: q.sequence ?? null,
   observacion: report?.comment ?? '',
   motivos: report?.reasons ?? [],
   estado: report?.status ?? 'pendiente'
  };
 }
 private getMarkedText(): string {
  return this.markedQuestions().map((q, i) => {
   const payload = this.reportPayload(q) as Record<string,unknown>;
   const format = (key: string, name: string) => payload[key] ? `${name}: ${typeof payload[key] === 'string' ? payload[key] : JSON.stringify(payload[key])}` : '';
   return [
    `# ${i + 1} · ${q.id} · UD${q.unit} · ${this.typeName(q)}`,
    format('asignatura','Asignatura'), format('apartado','Apartado'),
    format('enunciado','Pregunta'), format('contexto','Contexto'),
    q.options.length ? `Opciones:\n${q.options.map((o,j) => `${j+1}. ${o}`).join('\n')}` : '',
    q.correct.length ? `Opciones correctas (índices 1..N): ${q.correct.map(x=>x+1).join(', ')}` : '',
    format('codigo','Código'), format('archivosIniciales','Archivos iniciales'), format('relaciones','Relaciones'), format('secuencia','Pasos'), format('entradaEjemplo','Entrada'),
    format('salidaEjemplo','Ejemplo de salida'), format('salidaReal','Salida del programa'),
    format('solucion','Solución guardada'), format('criterios','Criterios'),
    format('imagen','Imagen'), format('motivos','Marca'), format('observacion','Tu observación')
   ].filter(Boolean).join('\n');
  }).join('\n\n--------------------\n\n');
 }
 async copyMarked(): Promise<void> {
  if (!this.markedCount()) { this.feedback.set('Primero marca alguna pregunta.'); return; }
  this.busy.set(true);
  try {
   await navigator.clipboard.writeText(this.getMarkedText());
   this.feedback.set(`Copiadas ${this.markedCount()} preguntas. Pégalas en ChatGPT para revisarlas.`);
  } catch {
   this.feedback.set('Tu navegador no ha permitido copiar automáticamente. Usa «Exportar JSON».');
  } finally { this.busy.set(false); }
 }
 exportMarked(): void {
  const questions = this.markedQuestions();
  if (!questions.length) { this.feedback.set('Primero marca alguna pregunta.'); return; }
  const content = JSON.stringify({
   schema: 'estudio-question-review-simple-v1',
   createdAt: new Date().toISOString(),
   total: questions.length,
   questions: questions.map(q => this.reportPayload(q))
  }, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ESTUDIO-preguntas-para-revisar.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  this.feedback.set(`Exportadas ${questions.length} preguntas para revisar.`);
 }
}
