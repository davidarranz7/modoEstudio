import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
export interface ProjectDialog {title:string;description:string;label?:string;value?:string;confirm:string;danger?:boolean;}
@Component({selector:'app-project-dialog',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`
<dialog #dialog class="workspace-dialog" [attr.aria-label]="config.title" (cancel)="dismiss.emit()">
 <form (submit)="$event.preventDefault();confirm.emit(value())">
  <h2>{{config.title}}</h2><p>{{config.description}}</p>
  @if(config.label){<label>{{config.label}}<input autofocus autocomplete="off" autocapitalize="off" spellcheck="false" [value]="value()" (input)="value.set($any($event.target).value)" required/></label>}
  <div class="workspace-dialog-actions"><button type="button" class="outline-button" (click)="dismiss.emit()">Cancelar</button><button type="submit" class="primary-button" [class.workspace-danger]="config.danger" [disabled]="!!config.label&&!value().trim()">{{config.confirm}}</button></div>
 </form>
</dialog>`})
export class ProjectDialogComponent implements AfterViewInit {
 @Input({required:true}) config!:ProjectDialog;@Output() confirm=new EventEmitter<string>();@Output() dismiss=new EventEmitter<void>();
 @ViewChild('dialog') dialog!:ElementRef<HTMLDialogElement>;readonly value=signal('');
 ngAfterViewInit():void{this.value.set(this.config.value??'');this.dialog.nativeElement.showModal();}
}
