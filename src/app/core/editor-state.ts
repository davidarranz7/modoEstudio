export interface EditorSnapshot {
  file: string;
  selection: { anchor: number; head: number };
  scrollTop: number;
  scrollLeft: number;
  /** CodeMirror's selection/history JSON. The document is stored separately with the project files. */
  state?: unknown;
  assistance: boolean;
  fontSize: number;
  documentHash?: string;
}
export interface EditorProblem {
  file?: string;
  line: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  source?: string;
}
export interface EditorNavigation { line: number; column?: number; revision?: number; }
export interface EditorParameter { name: string; type: string; optional: boolean; variadic: boolean; byReference?: boolean; default?: string; description: string; }
export interface EditorFunction {
  name: string;
  returnType: string;
  params: EditorParameter[];
  description: string;
  source: string;
  file?: string;
  from?: number;
  to?: number;
  scopeFrom?: number;
  scopeTo?: number;
}
export interface EditorSignature { fn: EditorFunction; activeParameter: number; }
