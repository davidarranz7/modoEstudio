import { DWCS_QUESTIONS } from '../data/dwcs.questions';
import { DESPREGAMENTO_QUESTIONS } from '../data/despregamento.questions';

export type QuestionKind = 'single' | 'multi' | 'short' | 'develop' | 'code' | 'match' | 'order';
export type Level = 'medio' | 'alto';
export type Source = 'audio' | 'temario';
export interface PhpTestCase { label: string; functionName: string; args: unknown[]; expected: unknown; mode?: 'return' | 'output'; }
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
  reference?: string;
  referenceUrl?: string;
  sourcePage?: number;
  format?: 'true-false' | 'fill' | 'fix-code';
  phpTests?: PhpTestCase[];
  runnerMode?: 'console' | 'tests' | 'manual';
  consoleInput?: string;
  explanation?: string;
  hints?: string[];
  starterFiles?: Record<string,string>;
  pairs?: {left:string;right:string}[];
  sequence?: string[];
}

export const QUESTIONS: Question[] = [...DWCS_QUESTIONS, ...DESPREGAMENTO_QUESTIONS];
export const TYPE_NAMES: Record<QuestionKind,string> = {
  single: 'Test · una respuesta', multi: 'Test · varias respuestas',
  short: 'Respuesta breve', develop: 'Desarrollo', code: 'Código e interpretación', match: 'Relacionar conceptos', order: 'Ordenar pasos'
};
