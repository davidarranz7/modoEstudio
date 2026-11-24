export interface Theme {
  id: number;
  name: string;
  description: string;
}

export interface Subject {
  id: string;
  shortName: string;
  name: string;
  description: string;
  themes: Theme[];
}

export const SUBJECTS: Subject[] = [
  {
    id: 'dwcs',
    shortName: 'DWCS',
    name: 'Desenvolvemento Web Contorno Servidor',
    description: 'Fundamentos web, programación PHP y gestión de sesiones y autenticación.',
    themes: [
      { id: 1, name: 'Fundamentos web', description: 'Arquitectura cliente-servidor, HTTP, tecnologías y servidores web' },
      { id: 2, name: 'Programación PHP', description: 'Sintaxis, formularios, arrays, funciones, ficheros y seguridad' },
      { id: 3, name: 'HTTP, sesiones y autenticación', description: 'Cookies, sesiones, contraseñas, autenticación y permisos' }
    ]
  }
];
export const DEFAULT_SUBJECT_ID = 'dwcs';
export function findSubject(id: string): Subject | undefined {
  return SUBJECTS.find(subject => subject.id === id);
}
export function themeName(subjectId: string, themeId: number): string {
  return findSubject(subjectId)?.themes.find(theme => theme.id === themeId)?.name ?? `Tema ${themeId}`;
}
