import type { Question } from './questions';
import { questionMetadata } from './exam-priority';

export interface SelectionRecord {
  seen: number; good: number; bad: number; medium: number;
  lastGrade: 'good' | 'medium' | 'bad' | null;
  starred: boolean; lastDate: string;
}
export interface SelectionOptions {
  preparation?: 'general' | 'exam';
  priorityShare?: number;
  now?: number;
  random?: () => number;
}
export function shuffleQuestions<T>(items: readonly T[], random = Math.random): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.min(index, Math.max(0, Math.floor(random() * (index + 1))));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

/** Real sampling without replacement. Quotas fall back to the available pool, retaining secondary content. */
export function selectQuestions(pool: readonly Question[], count: number, records: Readonly<Record<string, SelectionRecord>> = {}, options: SelectionOptions = {}): Question[] {
  const unique = [...new Map(pool.map(question => [question.id, question])).values()];
  const limit = count > 0 ? Math.min(Math.floor(count), unique.length) : unique.length;
  const random = options.random ?? Math.random;
  if (options.preparation !== 'exam' || !unique.every(question => question.subjectId === 'dwcs')) return shuffleQuestions(unique, random).slice(0, limit);
  const high = unique.filter(question => questionMetadata(question).teacherHighlighted);
  const normal = unique.filter(question => !questionMetadata(question).teacherHighlighted);
  const share = Math.min(90, Math.max(10, Number.isFinite(options.priorityShare) ? options.priorityShare! : 70)) / 100;
  let highCount = limit === 1 ? Number(random() < share) : Math.round(limit * share);
  if (limit >= 2 && high.length && normal.length) highCount = Math.max(1, Math.min(limit - 1, highCount));
  highCount = Math.min(high.length, Math.max(limit - normal.length, highCount));
  const selected: Question[] = [];
  const coverage = new Map<string, number>();
  const now = options.now ?? Date.now();
  const sample = (candidates: Question[], amount: number): void => {
    const remaining = [...candidates];
    const sectionSizes = new Map<string, number>();
    for (const question of candidates) {
      const section = `${question.unit}:${question.section ?? ''}`;
      sectionSizes.set(section, (sectionSizes.get(section) ?? 0) + 1);
    }
    for (let index = 0; index < amount && remaining.length; index++) {
      const weights = remaining.map(question => {
        const record = records[question.id];
        const section = `${question.unit}:${question.section ?? ''}`;
        const days = record?.lastDate ? Math.max(0, (now - Date.parse(record.lastDate)) / 86400000) : 30;
        const age = Number.isFinite(days) ? Math.min(days, 60) / 60 : 0;
        let need = !record?.seen ? 2.5 : 1 + age;
        if (record?.lastGrade === 'bad') need += 2.5 + (days < 7 ? 1 : 0);
        if (record?.lastGrade === 'medium') need += 1.5;
        if (record?.starred) need += 2;
        if (record?.bad) need += Math.min(record.bad, 6) * 0.3;
        if (record?.lastGrade === 'good') need /= 1 + Math.min(record.good ?? 0, 8) * 0.2;
        // Small sections retain a chance; represented sections gradually yield room to others.
        return need / ((1 + (coverage.get(section) ?? 0) * 3) * Math.sqrt(sectionSizes.get(section) ?? 1));
      });
      let point = Math.max(0, Math.min(0.999999999, random())) * weights.reduce((sum, weight) => sum + weight, 0);
      let chosen = remaining.length - 1;
      for (let candidate = 0; candidate < weights.length; candidate++) { point -= weights[candidate]; if (point < 0) { chosen = candidate; break; } }
      const [question] = remaining.splice(chosen, 1);
      selected.push(question);
      const section = `${question.unit}:${question.section ?? ''}`;
      coverage.set(section, (coverage.get(section) ?? 0) + 1);
    }
  };
  sample(high, highCount);
  sample(normal, limit - highCount);
  return shuffleQuestions(selected, random);
}
