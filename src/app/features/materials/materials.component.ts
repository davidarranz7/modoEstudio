import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';
import { SUBJECTS } from '../../core/subjects';
@Component({selector:'app-materials',standalone:true,imports:[HeaderComponent,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,template:`
<app-header title="Apuntes y materiales" back="/inicio"/>
<main class="page with-header topics-page academic-materials">
 <div class="intro-copy"><span class="eyebrow">ESTUDIO · MATERIAL DE CLASE</span><h2>Apuntes por asignatura</h2><p>Guías de repaso con los apartados originales, imágenes de clase y código. Las referencias de las soluciones llevan a la página correspondiente.</p></div>
 @for(subject of subjects;track subject.id){
  <section class="academic-material-section">
   <h3>{{subject.name}}</h3>
   @if(subject.id==='dwcs'){
    @for(theme of subject.themes;track theme.id){<a class="academic-material-row" [href]="'/apuntes/dwcs-ud'+theme.id+'.pdf'" target="_blank" rel="noopener"><div><strong>UD{{theme.id}} · {{theme.name}}</strong><small>Guía PDF de repaso · teoría, capturas y prácticas</small></div><app-icon name="download" [size]="20"/></a>}
    <a class="academic-material-row" href="/apuntes/dwcs-ud1-original-protocolos.pdf" target="_blank" rel="noopener"><div><strong>UD1 · PDF original de Juan Pavón</strong><small>Protocolos y arquitecturas de aplicaciones en internet</small></div><app-icon name="download" [size]="20"/></a>
    <a class="academic-material-row" href="/apuntes/dwcs-tarea01.1-original.zip" download><div><strong>UD1 · Archivos de partida de la Tarea 01.1</strong><small>Material original de la profesora</small></div><app-icon name="download" [size]="20"/></a>
   }@else{<p>Material nuevo pendiente de completar. Esta asignatura conserva su banco anterior.</p>}
  </section>
 }
 <p class="small-muted">Las guías son una reorganización didáctica del contenido recibido, no una transcripción literal. Falta el PDF de algoritmos de la Actividad 2.2.</p>
</main>`})
export class MaterialsComponent {readonly subjects=SUBJECTS;}
