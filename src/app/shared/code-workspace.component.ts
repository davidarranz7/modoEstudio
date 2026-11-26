import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, ViewChild, inject, signal } from '@angular/core';
import type { EditorEngine } from '../core/editor-engine';
import type { EditorNavigation, EditorParameter, EditorProblem, EditorSignature, EditorSnapshot } from '../core/editor-state';
let editorSequence=0;
@Component({selector:'app-code-workspace',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`
<section class="code-workspace cm-workspace" [class.editor-expanded]="expanded()" [style.--editor-font]="fontSize()+'px'" [style.--editor-viewport-height]="viewportHeight()+'px'" [style.--editor-viewport-top]="viewportTop()+'px'" aria-label="Editor de código">
 <div class="cm-filebar">
  <span class="cm-file-identity"><span class="cm-file-dot" [class.save-error]="saveStatus.toLowerCase().includes('error')" [class.save-pending]="saveStatus.toLowerCase().includes('guardando')" role="img" [attr.aria-label]="saveStatus" [title]="saveStatus"></span><strong>{{filename}}</strong></span>
  <span class="cm-description">{{editorDescription()}}</span>
  @if(expanded()){<button type="button" class="cm-header-action" aria-label="Salir de pantalla completa" (click)="collapse()">×</button>}
  <button type="button" class="cm-header-action" aria-label="Opciones del editor" [attr.aria-expanded]="moreOpen()" [attr.aria-controls]="optionsId" (click)="toggleOptions()">···</button>
 </div>
 <ng-content select="[editor-files]"/>
 @if(moreOpen()){<div class="cm-options" [id]="optionsId" role="group" aria-label="Herramientas del editor">
  <div class="cm-option-pair"><button type="button" (pointerdown)="$event.preventDefault()" (click)="undo()" [disabled]="readOnly||!undoCount()">Deshacer</button><button type="button" (pointerdown)="$event.preventDefault()" (click)="redo()" [disabled]="readOnly||!redoCount()">Rehacer</button></div>
  <button type="button" (click)="search();moreOpen.set(false)">Buscar y reemplazar</button>
  <button type="button" (click)="toggleAssistance()" [attr.aria-pressed]="assistance()">Ayudas de escritura: {{assistance()?'activadas':'desactivadas'}}</button>
  <button type="button" (click)="toggleSymbols()" [attr.aria-pressed]="symbolsVisible()">{{symbolsVisible()?'Ocultar':'Mostrar'}} símbolos</button>
  <div class="cm-option-pair"><button type="button" (click)="copy()">Copiar</button><button type="button" (click)="paste()" [disabled]="readOnly">Pegar</button></div>
  <div class="cm-option-pair"><button type="button" (pointerdown)="$event.preventDefault()" (click)="indent(false)" [disabled]="readOnly">Sangrar</button><button type="button" (pointerdown)="$event.preventDefault()" (click)="indent(true)" [disabled]="readOnly">Desangrar</button></div>
  <button type="button" (click)="format()" [disabled]="readOnly">{{filename.endsWith('.json')?'Formatear JSON':'Ajustar sangría'}}</button>
  <div class="cm-font-options"><span>Tamaño · {{fontSize()}} px</span><button type="button" (click)="resize(-1)" aria-label="Reducir letra">A−</button><button type="button" (click)="resize(1)" aria-label="Ampliar letra">A+</button></div>
  <button type="button" (click)="toggleExpanded()">{{expanded()?'Reducir editor':'Ampliar editor'}}</button>
 </div>}
 <div class="cm-editor-stage">@if(loading()){<p class="cm-loading" role="status">Preparando editor…</p>}<div #mount class="cm-mount" [attr.aria-busy]="loading()"></div></div>
 @if(symbolsVisible()){<div class="editor-symbols cm-symbols" aria-label="Símbolos de programación">@for(symbol of symbols;track $index){<button type="button" (pointerdown)="$event.preventDefault()" [disabled]="readOnly" (click)="insert(symbol)">{{$first?'Tab':symbol}}</button>}</div>}
 <div class="cm-hint"><span class="cm-hint-dot" [class.help-off]="!assistance()"></span><span>{{editorHint()}}</span></div>
 @if(expanded()&&(showActions||quickRunnerAvailable())){<div class="cm-execution-actions"><button type="button" class="primary-button" [disabled]="busy||loading()" (click)="execute()">Ejecutar</button><button type="button" [disabled]="busy||loading()||!allowCheck" (click)="check()">Corregir</button></div>}
 @if(message()){<p class="cm-message" role="status">{{message()}}</p>}
</section>`,styles:[`
:host{display:block;min-width:0;min-height:0;height:auto}.cm-workspace{position:relative;display:block;background:#151a23;color:#dce6f3;border:1px solid #cad2df;border-radius:12px;overflow:hidden;margin:4px 0 14px;min-height:0;height:auto}
.cm-filebar{height:40px;display:flex;align-items:center;gap:9px;padding:0 10px 0 12px;background:#222c3c;color:#d9e2f1}.cm-file-identity{display:inline-flex;align-items:center;gap:7px;min-width:0;flex:1}.cm-file-identity strong{font:600 11px 'JetBrains Mono',monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cm-file-dot{height:6px;width:6px;flex:none;background:#80dcbd;border-radius:50%}.cm-file-dot.save-error{background:var(--red)}.cm-file-dot.save-pending{background:#f6cc93}.cm-description{font:10px 'DM Sans',sans-serif;color:#9eaec5;white-space:nowrap}.cm-header-action{color:#9eaec5;background:transparent;border:0;border-radius:5px;min-height:36px;min-width:28px;font-size:20px;line-height:1;flex:none}.cm-header-action:focus-visible{outline:2px solid #87aef8}
.cm-options{position:absolute;z-index:70;right:8px;top:43px;width:min(270px,calc(100% - 16px));max-height:min(280px,calc(var(--editor-viewport-height,100dvh) - 100px));overflow:auto;padding:8px;display:grid;gap:5px;border:1px solid #384355;border-radius:9px;background:#202b3b;box-shadow:var(--shadow);font:12px 'DM Sans',sans-serif}.cm-options button{min-height:37px;padding:8px 10px;text-align:left;background:#222c3c;color:#d9e2f1;border:1px solid #384355;border-radius:6px;font:inherit}.cm-options button[aria-pressed=true]{background:#2a3b52}.cm-options button:disabled,.cm-symbols button:disabled{opacity:.45}.cm-option-pair{display:flex;gap:5px}.cm-option-pair button{flex:1}.cm-font-options{display:flex;align-items:center;gap:6px;color:#9eaec5;padding:3px}.cm-font-options>span{flex:1}.cm-font-options button{min-width:36px;text-align:center}
.cm-editor-stage{position:relative;height:280px;min-height:260px;max-height:370px;overflow:hidden;background:#151a23}.cm-mount{height:100%;min-height:inherit}.cm-loading{position:absolute;inset:15px;z-index:1;font:12px 'DM Sans',sans-serif;color:#9eaec5}.cm-symbols{display:flex;gap:5px;overflow-x:auto;padding:7px;border-top:1px solid #384659;background:#202938;overscroll-behavior-x:contain}.cm-symbols button{flex:none;min-width:37px;min-height:39px;border:1px solid #384659;border-radius:6px;padding:6px 9px;font:16px 'JetBrains Mono',monospace;background:#222c3c;color:#d9e2f1}
.cm-hint{padding:9px 12px;background:#202938;color:#9db0c6;font:10px/1.5 'DM Sans',sans-serif;display:flex;align-items:center;gap:8px}.cm-hint-dot{height:6px;width:6px;border-radius:50%;flex:none;background:#75cfae}.cm-hint-dot.help-off{background:#718097}
.cm-execution-actions{display:flex;gap:9px;padding:9px;background:var(--surface);border-top:1px solid var(--line);flex:none}.cm-execution-actions button{flex:1;min-height:45px;border:1px solid var(--line);border-radius:10px;color:var(--text);font:700 13px 'DM Sans',sans-serif}.cm-execution-actions .primary-button{background:var(--blue);border-color:var(--blue);color:#fff}.cm-execution-actions button:disabled{opacity:.5}.cm-message{padding:8px 12px!important;margin:0!important;font:11px/1.4 'DM Sans',sans-serif!important;background:#202938;color:#9db0c6}
.cm-workspace.editor-expanded{position:fixed;left:0;right:0;top:var(--editor-viewport-top,0px);height:var(--editor-viewport-height,100dvh);z-index:150;border-radius:0;margin:0;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom);display:flex;flex-direction:column}.editor-expanded .cm-editor-stage{flex:1;min-height:0;max-height:none;height:auto}.editor-expanded .cm-filebar,.editor-expanded .cm-hint,.editor-expanded .cm-symbols,.editor-expanded .cm-message{flex:none}
@media(max-width:370px){.cm-filebar{padding-left:10px;gap:6px}.cm-description{font-size:9px}.cm-editor-stage{height:260px}}
`]})
export class CodeWorkspaceComponent implements OnChanges,AfterViewInit,OnDestroy {
 @Input() value='';@Input() filename='solucion.php';@Input() language='PHP';@Input() readOnly=false;
 @Input() projectId='';@Input() files:Record<string,string>={};@Input() savedState?:EditorSnapshot;
 @Input() diagnostics:EditorProblem[]=[];@Input() navigateTo?:EditorNavigation;@Input() showActions=false;@Input() busy=false;@Input() saveStatus='Guardado automático';
 @Input() allowCheck=true;@Input() wrapLines=false;
 @Output() valueChange=new EventEmitter<string>();@Output() stateChange=new EventEmitter<EditorSnapshot>();
 @Output() actionExecute=new EventEmitter<void>();@Output() actionCheck=new EventEmitter<void>();@Output() expandedChange=new EventEmitter<boolean>();
 @ViewChild('mount') mount?:ElementRef<HTMLDivElement>;
 readonly expanded=signal(false);readonly assistance=signal(true);readonly fontSize=signal(16);readonly loading=signal(true);readonly message=signal('');readonly moreOpen=signal(false);readonly completionOpen=signal(false);readonly symbolsVisible=signal(false);
 readonly undoCount=signal(0);readonly redoCount=signal(0);readonly line=signal(1);readonly column=signal(1);readonly signature=signal<EditorSignature|null>(null);
 readonly viewportHeight=signal(typeof window==='undefined'?800:window.innerHeight);readonly viewportTop=signal(0);
 readonly symbols=['    ','$',';','(',')','{','}','[',']','=','>','<','"',"'",'/','\\','?',':','&','|','!','_'];
 private readonly host=inject(ElementRef<HTMLElement>);private readonly instanceId='editor-'+ ++editorSequence;private engine?:EditorEngine;private destroyed=false;private lastNavigation?:EditorNavigation;private restoredFile='';
 private readonly viewportChanged=()=>{const viewport=window.visualViewport;this.viewportHeight.set(viewport?.height??window.innerHeight);this.viewportTop.set(viewport?.offsetTop??0);this.engine?.measure();};
 constructor(){try{const preferences=JSON.parse(localStorage.getItem('estudio-editor-preferences-v1')??'{}');this.assistance.set(preferences.assistance!==false);this.symbolsVisible.set(preferences.symbols===true);if(typeof preferences.fontSize==='number')this.fontSize.set(Math.min(24,Math.max(16,preferences.fontSize)));}catch{}}
 async ngAfterViewInit():Promise<void>{
  window.visualViewport?.addEventListener('resize',this.viewportChanged);window.visualViewport?.addEventListener('scroll',this.viewportChanged);window.addEventListener('resize',this.viewportChanged);this.viewportChanged();
  try{const {EditorEngine}=await import('../core/editor-engine');if(this.destroyed||!this.mount)return;
   this.restorePreferences();this.engine=new EditorEngine({parent:this.mount.nativeElement,projectId:this.projectId||this.instanceId,filename:this.filename,language:this.language,value:this.value,files:this.files,savedState:this.savedState,readOnly:this.readOnly,wrapLines:this.wrapLines,assistance:this.assistance(),fontSize:this.fontSize(),
    onChange:value=>{this.value=value;this.valueChange.emit(value);},onState:snapshot=>this.stateChange.emit(snapshot),onUpdate:state=>{this.undoCount.set(state.undo);this.redoCount.set(state.redo);this.line.set(state.line);this.column.set(state.column);this.signature.set(state.signature);this.completionOpen.set(state.completion);},onEscape:()=>{if(this.expanded())this.toggleExpanded();}});
   this.loading.set(false);this.engine.setProblems(this.diagnostics);this.applyNavigation();
  }catch(error){this.loading.set(false);this.message.set('No se pudo cargar el editor. Reintenta al volver a abrir la práctica. '+(error instanceof Error?error.message:''));}
 }
 ngOnChanges():void{if(!this.engine)return;this.engine.update({projectId:this.projectId||this.instanceId,filename:this.filename,language:this.language,value:this.value,files:this.files,savedState:this.savedState,readOnly:this.readOnly,wrapLines:this.wrapLines,assistance:this.assistance(),fontSize:this.fontSize()});if(this.restorePreferences())this.engine.update({assistance:this.assistance(),fontSize:this.fontSize()});this.engine.setProblems(this.diagnostics);this.applyNavigation();}
 private restorePreferences():boolean{const key=(this.projectId||this.instanceId)+'/'+this.filename;if(key===this.restoredFile)return false;this.restoredFile=key;const saved=this.savedState;if(saved?.file===this.filename){this.assistance.set(saved.assistance!==false);if(Number.isFinite(saved.fontSize))this.fontSize.set(Math.max(16,Math.min(24,saved.fontSize)));}return true;}
 private applyNavigation():void{if(this.navigateTo&&this.navigateTo!==this.lastNavigation){this.lastNavigation=this.navigateTo;this.engine?.navigate(this.navigateTo);}}
 ngOnDestroy():void{this.destroyed=true;this.engine?.destroy();window.visualViewport?.removeEventListener('resize',this.viewportChanged);window.visualViewport?.removeEventListener('scroll',this.viewportChanged);window.removeEventListener('resize',this.viewportChanged);if(this.expanded())this.expandedChange.emit(false);}
 private preferences():void{try{localStorage.setItem('estudio-editor-preferences-v1',JSON.stringify({assistance:this.assistance(),fontSize:this.fontSize(),symbols:this.symbolsVisible()}));}catch{}this.engine?.capture();}
 toggleAssistance():void{this.assistance.update(value=>!value);this.engine?.update({assistance:this.assistance()});this.preferences();this.message.set(this.assistance()?'Asistencia contextual activada en este dispositivo.':'Autocompletado, fragmentos y cierre automático desactivados.');}
 get optionsId():string{return this.instanceId+'-options';}
 editorDescription():string{const extension=this.filename.split('.').pop()?.toLowerCase();const language=extension==='php'?'PHP + HTML':extension==='txt'?'Texto':this.language;return language+' · '+(this.assistance()?'sugerencias':'sin ayudas');}
 editorHint():string{if(!this.assistance())return 'Ayudas desactivadas. Puedes activarlas en las opciones del editor.';return this.filename.endsWith('.php')?'Escribe array_ o move_ para ver sugerencias.':'Las sugerencias aparecen mientras escribes, según el lenguaje.';}
 toggleOptions():void{const open=!this.moreOpen();if(open)this.engine?.closeHints();this.moreOpen.set(open);if(open)(this.host.nativeElement.querySelector('[aria-label="Opciones del editor"]') as HTMLButtonElement|null)?.focus({preventScroll:true});else this.engine?.focus();}
 toggleSymbols():void{this.symbolsVisible.update(value=>!value);this.moreOpen.set(false);this.preferences();requestAnimationFrame(()=>this.engine?.measure());}
 toggleExpanded():void{this.moreOpen.set(false);this.expanded.update(value=>!value);this.expandedChange.emit(this.expanded());this.viewportChanged();requestAnimationFrame(()=>{this.engine?.measure();this.engine?.focus();});}
 collapse():void{if(this.expanded())this.toggleExpanded();}
 capture():void{this.engine?.capture();}
 resize(delta:number):void{this.fontSize.update(value=>Math.max(16,Math.min(24,value+delta)));this.engine?.update({fontSize:this.fontSize()});this.preferences();this.engine?.measure();}
 parameterText(parameter:EditorParameter):string{return parameter.type+' '+(parameter.byReference?'&':'')+(parameter.variadic?'...':'')+'$'+parameter.name+(parameter.default!==undefined?' = '+parameter.default:parameter.optional?' (opcional)':'');}
 closeHints():void{this.engine?.closeHints();}
 insert(text:string):void{this.engine?.insert(text);}undo():void{this.engine?.undo();}redo():void{this.engine?.redo();}indent(less=false):void{this.engine?.indent(less);}search():void{this.engine?.search();}complete():void{this.engine?.complete();}
 format():void{try{this.engine?.format();this.message.set(this.filename.endsWith('.json')?'JSON formateado. Puedes deshacer.':'Sangría sintáctica ajustada. No se reescriben expresiones PHP ni HTML. Puedes deshacer.');}catch(error){this.message.set('No se puede formatear: '+(error instanceof Error?error.message:'sintaxis incompleta.'));}}
 async copy():Promise<void>{try{await navigator.clipboard.writeText(this.engine?.selectedText()??this.value);this.message.set('Código copiado.');}catch{this.message.set('Selecciona el texto y utiliza Copiar en el menú del teclado.');}}
 async paste():Promise<void>{try{this.insert(await navigator.clipboard.readText());}catch{this.message.set('Mantén pulsado el editor y utiliza Pegar en el menú del teclado.');}}
 execute():void{this.engine?.capture();if(this.showActions)this.actionExecute.emit();else{this.collapse();this.quickAction('estudio-editor-execute');}}
 check():void{this.engine?.capture();if(this.showActions)this.actionCheck.emit();else{this.collapse();this.quickAction('estudio-editor-check');}}
 quickRunnerAvailable():boolean{return !!this.host.nativeElement.closest('.flashcard')?.querySelector('app-php-runner');}
 @HostListener('document:pointerdown',['$event']) onOutsidePointer(event:PointerEvent):void{const target=event.target;if(!this.moreOpen()||!(target instanceof HTMLElement))return;if(!this.host.nativeElement.contains(target)||(!target.closest('.cm-options')&&!target.closest('[aria-label="Opciones del editor"]')))this.moreOpen.set(false);}
 @HostListener('document:keydown.escape') closeEditorMenu():void{if(this.moreOpen()){this.moreOpen.set(false);this.engine?.focus();}}
 private quickAction(name:string):void{const card=this.host.nativeElement.closest('.flashcard')??this.host.nativeElement.parentElement;card?.dispatchEvent(new CustomEvent(name,{bubbles:true,detail:{editorId:this.instanceId}}));}
 @HostListener('document:estudio-editor-diagnostic',['$event']) onDiagnostic(event:Event):void{const target=event.target;if(!(target instanceof HTMLElement))return;const card=target.closest('.flashcard');if(card&&!card.contains(this.host.nativeElement))return;const diagnostic=(event as CustomEvent<{file?:string;line:number}>).detail;if(!diagnostic)return;if(diagnostic.file&&diagnostic.file!==this.filename){this.message.set('Abre '+diagnostic.file+' para revisar la línea '+diagnostic.line+'.');return;}this.engine?.navigate({line:diagnostic.line});}
}
