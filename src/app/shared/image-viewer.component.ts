import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
@Component({selector:'app-image-viewer',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`
<dialog #dialog class="image-dialog" aria-label="Imagen ampliada del temario" (close)="closed.emit()" (cancel)="closed.emit()">
 <div class="image-dialog-tools"><button type="button" (click)="zoom.set(zoom()>1?zoom()-0.5:1)" aria-label="Reducir imagen">−</button><span>{{zoom()*100}} %</span><button type="button" (click)="zoom.set(zoom()<4?zoom()+0.5:4)" aria-label="Ampliar imagen">+</button><button type="button" (click)="dialog.close()">Cerrar ×</button></div>
 <div class="image-dialog-body"><img [src]="src" [alt]="alt" [style.width.%]="zoom()*100"/></div><p>{{alt}} · Desplaza la imagen o usa los controles de zoom.</p>
</dialog>`})
export class ImageViewerComponent implements AfterViewInit {
 @Input({required:true}) src=''; @Input() alt='Imagen original del material de clase'; @Output() closed=new EventEmitter<void>();
 @ViewChild('dialog') dialog!:ElementRef<HTMLDialogElement>;readonly zoom=signal(1);
 ngAfterViewInit():void{this.dialog.nativeElement.showModal();}
}
