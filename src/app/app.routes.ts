import { Routes } from '@angular/router';
export const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'inicio'},
  {path:'inicio',title:'Inicio · Estudio',loadComponent:()=>import('./features/home/home.component').then(m=>m.HomeComponent)},
  {path:'asignaturas',title:'Asignaturas · Estudio',loadComponent:()=>import('./features/modules/modules.component').then(m=>m.ModulesComponent)},
  {path:'asignaturas/:subjectId/temas',title:'Temas · Estudio',loadComponent:()=>import('./features/topics/topics.component').then(m=>m.TopicsComponent)},
  {path:'asignaturas/:subjectId/temas/:unit',title:'Tipo de examen · Estudio',loadComponent:()=>import('./features/theme-detail/theme-detail.component').then(m=>m.ThemeDetailComponent)},
  {path:'modulos',redirectTo:'asignaturas'},
  {path:'preguntas',title:'Banco de preguntas · Estudio',loadComponent:()=>import('./features/library/library.component').then(m=>m.LibraryComponent)},
  {path:'estudiar',title:'Examen · Estudio',loadComponent:()=>import('./features/study/study.component').then(m=>m.ExamComponent)},
  {path:'examenes',title:'Exámenes · Estudio',loadComponent:()=>import('./features/exams/exams.component').then(m=>m.ExamsComponent)},
  {path:'examenes/:id',title:'Resultados · Estudio',loadComponent:()=>import('./features/exam-detail/exam-detail.component').then(m=>m.ExamDetailComponent)},
  {path:'perfil',title:'Perfil · Estudio',loadComponent:()=>import('./features/settings/settings.component').then(m=>m.SettingsComponent)},
  {path:'progreso',title:'Progreso · Estudio',loadComponent:()=>import('./features/stats/stats.component').then(m=>m.StatsComponent)},
  {path:'ajustes',title:'Ajustes · Estudio',loadComponent:()=>import('./features/settings/settings.component').then(m=>m.SettingsComponent)},
  {path:'**',redirectTo:'inicio'}
];
