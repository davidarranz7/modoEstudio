/** Generated practice material, separate from the immutable academic question bank. */
export interface PhpProjectFile {
  path: string;
  role: 'provided' | 'complete' | 'create';
  responsibility: string;
  starter: string;
  solution: string;
  explanation: string;
}
export interface PhpProjectExpectation {
  status?: number;
  bodyIncludes?: string[];
  bodyExcludes?: string[];
  textIncludes?: string[];
  textExcludes?: string[];
  form?: { method: 'GET' | 'POST'; action: string; fields: string[]; enctype?: string };
  location?: string;
  cookieNames?: string[];
  absentCookies?: string[];
}
export interface PhpProjectStep {
  method: 'GET' | 'POST';
  url: string;
  body?: Record<string, string | string[]>;
  uploads?: { field: string; name: string; content: string; type?: string }[];
  expect: PhpProjectExpectation;
}
/** Each test starts fresh; requests within a test share the project's cookies and session. */
export interface PhpProjectTest {
  id: string;
  label: string;
  additional?: boolean;
  steps: PhpProjectStep[];
}
export interface PhpProject {
  id: string;
  unit: 2 | 3;
  title: string;
  context: string;
  objective: string;
  statement: string;
  entry: string;
  skills: string[];
  requirements: string[];
  restrictions: string[];
  files: PhpProjectFile[];
  generatedFiles?: string[];
  examples: string[];
  rubric: { criterion: string; points: number }[];
  hints: string[];
  explanation: string[];
  references: { unit: 2 | 3; section: string; activity?: string; note?: string }[];
  tests: PhpProjectTest[];
  staticChecks?: { label: string; file: string; pattern: string }[];
  /** Requirements still requiring manual verification, never counted as automatic passes. */
  manualChecks?: string[];
}
