import { DWCS_QUESTIONS } from '../data/dwcs.questions';
import { DWCS_ACTIVITIES } from '../data/dwcs-activities.questions';
import { DWCS_EXAMEN } from '../data/dwcs-examen.questions';
import { DWCS_TEST_CODIGO } from '../data/dwcs-test-codigo.questions';
import { DWCS_SEGURIDAD } from '../data/dwcs-seguridad.questions';
import { DWCS_CURATED } from '../data/dwcs-curated.questions';

export type QuestionKind = 'single' | 'multi' | 'short' | 'develop' | 'code' | 'match' | 'order';
export type Level = 'medio' | 'alto';
export type Source = 'audio' | 'temario';
export interface Question {
  id: string;
  subjectId: string;
  unit: number;
  kind: QuestionKind;
  level: Level;
  origin: Source;
  prompt: string;
  solution: string;
  options: string[];
  correct: number[];
  code: string;
  check: string;
  image?: string;
  activity?: string;
  codeTask?: 'write' | 'interpret';
  scenario?: string;
  exampleInput?: string;
  exampleOutput?: string;
  expectedOutput?: string;
  imageCaption?: string;
  section?: string;
  hints?: string[];
  starterFiles?: Record<string,string>;
  pairs?: {left:string;right:string}[];
  sequence?: string[];
}

export const QUESTIONS: Question[] = [...DWCS_QUESTIONS, ...DWCS_ACTIVITIES, ...DWCS_EXAMEN, ...DWCS_TEST_CODIGO, ...DWCS_SEGURIDAD, ...DWCS_CURATED];
export const TYPE_NAMES: Record<QuestionKind,string> = {
  single: 'Test · una respuesta', multi: 'Test · varias respuestas',
  short: 'Respuesta breve', develop: 'Desarrollo', code: 'Código e interpretación', match: 'Relacionar conceptos', order: 'Ordenar pasos'
};
