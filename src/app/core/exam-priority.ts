import type { Question } from './questions';

export interface QuestionMetadata {
  unit: number;
  section: string;
  topics: string[];
  priority: 'high' | 'normal';
  teacherHighlighted: boolean;
  modality: 'theory' | 'practice';
  difficulty: 'medio' | 'alto';
  classificationSource: string;
}

/** Guidance supplied by the student. The 70/30 split is a study setting, never an official exam criterion. */
export const DWCS_EXAM_GUIDANCE = {
  date: '2026-12-02', start: '15:00', latestEnd: '18:30',
  units: [
    { unit: 1, written: 90, practical: 0, coursework: 10, notesAllowed: false },
    { unit: 2, written: 0, practical: 80, coursework: 20, notesAllowed: true },
    { unit: 3, written: 25, practical: 50, coursework: 25, notesAllowed: true }
  ],
  source: 'Indicaciones de la profesora facilitadas por el alumno para la primera evaluación.'
} as const;

/** Classification is separate from the original academic content and makes its rules reviewable. */
export function questionMetadata(question: Question): QuestionMetadata {
  const section = question.section ?? 'Sin apartado';
  const text = `${section} ${question.prompt}`;
  let high = false;
  let topics: string[] = [section];
  if (question.subjectId === 'dwcs') {
    if (question.unit === 1) {
      high = /^(?:2\.|3\.|4\.(?:1\.|2\.|3\.|4\.| Lado))/.test(section)
        || /Cliente pesado \/ servidor pesado/.test(section);
      if (/estática|dinámica/i.test(text)) topics = ['Web estática y dinámica'];
      else if (/servidores web|servidores de aplicaciones/i.test(section)) topics = ['Servidores web y de aplicaciones'];
      else if (/lenguajes|tecnologías|ejemplos/i.test(section)) topics = ['Lenguajes, tecnologías y plataformas servidor'];
      else if (high) topics = ['Ejecución en cliente y servidor'];
    } else if (question.unit === 2) {
      // Syntax, forms, arrays, user functions, PHPDoc, includes and scope are explicit practical skills.
      high = /^1\.(?: PHP|[1-9]\.\s|1[0-9]\.\s|2[2-5]\.\s)/.test(section)
        || /^(?:Actividad 2\.[34589]|Tarea 02\.1)/.test(section)
        || /^Actividad 2\.2/.test(section);
      if (/formulario|superglobal|taller/i.test(section)) topics = ['Formularios GET y POST'];
      else if (/array|foreach|Actividad 2\.[34]/i.test(section)) topics = ['Arrays de una y dos dimensiones'];
      else if (/PHPDoc|documentación/i.test(section)) topics = ['PHPDoc'];
      else if (/include|require/i.test(section)) topics = ['Include y require'];
      else if (/ámbito/i.test(section)) topics = ['Ámbito de variables'];
      else if (/funciones definidas|Actividad 2\.8/i.test(section)) topics = ['Funciones de usuario'];
      else if (high) topics = ['Sintaxis básica de PHP'];
    } else if (question.unit === 3) {
      high = /^(?:1\. HTTP|2\. Cookies|2\.[12]\.|3\.|4\.|5\.|Actividad 3\.|Tarea 03\.1)/.test(section);
      if (/cookie/i.test(section) || /^Actividad 3\.1/.test(section)) topics = ['Cookies: definición, ciclo de vida, creación y eliminación'];
      else if (/sesion|sesión|sesiones|cesta/i.test(section)) topics = ['Sesiones y mantenimiento del estado'];
      else if (/autentic|login|validación|privada|cierre|autorización|roles/i.test(section)) topics = ['Autenticación, JSON, contraseñas y roles'];
      else if (/HTTP/i.test(section)) topics = ['HTTP sin estado'];
    }
  }
  return {
    unit: question.unit, section, topics, priority: high ? 'high' : 'normal',
    teacherHighlighted: high,
    modality: question.codeTask === 'write' || (question.kind === 'develop' && !!question.activity) ? 'practice' : 'theory',
    difficulty: question.level,
    classificationSource: question.subjectId === 'dwcs'
      ? 'Clasificación didáctica por apartado según las indicaciones facilitadas por el alumno; no modifica el temario ni constituye una rúbrica oficial.'
      : 'Sin clasificación de prioridad académica para esta asignatura.'
  };
}
