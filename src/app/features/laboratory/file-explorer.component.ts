import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { buildProjectTree, ProjectTreeNode } from '../../core/project-files';

@Component({selector:'app-file-explorer',standalone:true,imports:[NgTemplateOutlet],changeDetection:ChangeDetectionStrategy.OnPush,template:`
<nav class="workspace-file-tree" aria-label="Explorador de archivos">
 <ng-container [ngTemplateOutlet]="branch" [ngTemplateOutletContext]="{$implicit:nodes,level:0}"/>
 <ng-template #branch let-items let-level="level">
  @for(node of items;track node.path){
   <div class="workspace-file-row" [class.active]="activeFile===node.path" [style.--file-depth]="level">
    <button type="button" class="workspace-file-open" [attr.aria-expanded]="node.kind==='folder'?!closed().includes(node.path):null" [attr.aria-current]="activeFile===node.path?'page':null" (click)="choose(node)">
     <span class="workspace-file-kind" [class.folder]="node.kind==='folder'">{{node.kind==='folder'?(closed().includes(node.path)?'▸':'▾'):extension(node.name)}}</span><span>{{node.name}}</span>
    </button>
    <button type="button" class="workspace-file-menu" [disabled]="disabled" [attr.aria-label]="'Opciones de '+node.path" (click)="options.emit(node)">···</button>
   </div>
   @if(node.kind==='folder'&&!closed().includes(node.path)){<ng-container [ngTemplateOutlet]="branch" [ngTemplateOutletContext]="{$implicit:node.children,level:level+1}"/>}
  }
 </ng-template>
 @if(!nodes.length){<p class="small-muted">El proyecto está vacío. Crea un archivo para empezar.</p>}
</nav>`})
export class FileExplorerComponent implements OnChanges {
 @Input() files:Record<string,string>={}; @Input() folders:string[]=[]; @Input() activeFile=''; @Input() disabled=false;
 @Output() fileOpen=new EventEmitter<string>(); @Output() options=new EventEmitter<ProjectTreeNode>();
 readonly closed=signal<string[]>([]);nodes:ProjectTreeNode[]=[];
 ngOnChanges():void{this.nodes=buildProjectTree(this.files,this.folders);}
 choose(node:ProjectTreeNode):void{if(node.kind==='file')this.fileOpen.emit(node.path);else this.closed.update(items=>items.includes(node.path)?items.filter(x=>x!==node.path):[...items,node.path]);}
 extension(name:string):string{return name.split('.').at(-1)?.toUpperCase()??'TXT';}
}
