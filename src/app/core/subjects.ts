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
  ,{
    id: 'despregamento',
    shortName: 'DAW',
    name: 'Despregamento de Apps. Web',
    description: 'Arquitecturas web, virtualización, Apache, HTTPS, seguridad y administración de servidores.',
    themes: [
      { id: 1, name: 'Implantación de arquitecturas web', description: 'Cliente-servidor, SPA, SSR, PWA, microservicios, nube y contenedores' },
      { id: 2, name: 'Configuración e administración de servidores Web', description: 'Apache, VirtualHosts, directivas, HTTPS, autenticación, logs, monitorización y LDAP' }
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
