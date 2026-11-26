import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild, signal } from '@angular/core';

@Component({selector:'app-code-workspace',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`
<section class="code-workspace enhanced-editor" [class.editor-expanded]="expanded()" [style.--editor-font]="fontSize()+'px'">
 <div class="code-workspace-bar"><span>{{filename}}</span><span>{{language}} · guardado automático</span></div>
 <div class="editor-tools" aria-label="Herramientas del editor">
  <button type="button" (click)="undo()" [disabled]="!undoStack.length" aria-label="Deshacer">↶</button>
  <button type="button" (click)="redo()" [disabled]="!redoStack.length" aria-label="Rehacer">↷</button>
  <button type="button" (click)="copy()">Copiar</button><button type="button" (click)="paste()">Pegar</button>
  <button type="button" (click)="searchOpen.set(!searchOpen())" [attr.aria-expanded]="searchOpen()">Buscar</button>
  <button type="button" (click)="indent()">Sangrar</button>
  <button type="button" (click)="resize(-1)" aria-label="Reducir letra">A−</button><button type="button" (click)="resize(1)" aria-label="Ampliar letra">A+</button>
  <button type="button" (click)="expanded.set(!expanded())" [attr.aria-pressed]="expanded()">{{expanded()?'Reducir':'Ampliar'}}</button>
 </div>
 @if(searchOpen()){<div class="editor-search"><input aria-label="Buscar en el archivo" placeholder="Buscar texto" [value]="search()" (input)="search.set($any($event.target).value)" (keydown.enter)="find()"/><button type="button" (click)="find()">Siguiente</button></div>}
 <div class="code-workspace-body">
  <div class="code-line-numbers" aria-hidden="true">@for(n of lines();track n){<span>{{n}}</span>}</div>
  <div class="editor-layer">
   <pre aria-hidden="true" class="editor-highlight">@for(token of tokens();track $index){<span [class]="token.kind">{{token.text}}</span>}{{'\n'}}</pre>
   <textarea #area spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" wrap="off" [readOnly]="readOnly" [value]="value" (input)="emit($event)" (keydown)="onKeydown($event)" (scroll)="syncTextScroll()" [attr.aria-label]="'Código del archivo '+filename"></textarea>
  </div>
 </div>
 <div class="editor-symbols" aria-label="Símbolos de programación">@for(symbol of symbols;track $index){<button type="button" (pointerdown)="$event.preventDefault()" (click)="insert(symbol)">{{$first?'Tab':symbol}}</button>}</div>
 @if(message()){<p role="status">{{message()}}</p>}
</section>`})
export class CodeWorkspaceComponent implements OnChanges {
 @Input() value=''; @Input() filename='solucion.php'; @Input() language='PHP'; @Input() readOnly=false;
 @Output() valueChange=new EventEmitter<string>(); @ViewChild('area') area?:ElementRef<HTMLTextAreaElement>;
 readonly expanded=signal(false); readonly searchOpen=signal(false); readonly search=signal(''); readonly message=signal(''); readonly fontSize=signal(14);
 readonly symbols=['    ','$',';','(',')','{','}','[',']','=','>','<','"',"'",'/','\\','?',':','&','|','!','_'];
 undoStack:string[]=[]; redoStack:string[]=[]; private file=''; private lastEmitted='';
 ngOnChanges():void {if(this.file!==this.filename||this.value!==this.lastEmitted){this.file=this.filename;this.undoStack=[];this.redoStack=[];}this.lastEmitted=this.value;}
 lines():number[]{return Array.from({length:Math.max(10,this.value.split('\n').length+1)},(_,i)=>i+1);}
 tokens():{text:string;kind:string}[]{
  const regex=/(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\$[a-zA-Z_][\w]*|\b(?:function|return|if|else|elseif|foreach|for|while|require_once|include_once|require|include|echo|true|false|null|array|isset|unset|static|global|int|float|string|bool|void)\b|\b\d+(?:\.\d+)?\b)/g;
  const output:{text:string;kind:string}[]=[];let start=0;
  for(const match of this.value.matchAll(regex)){if(match.index!>start)output.push({text:this.value.slice(start,match.index),kind:''});const text=match[0];output.push({text,kind:text.startsWith('//')||text.startsWith('/*')||text.startsWith('#')?'token-comment':text.startsWith('$')?'token-variable':/^["']/.test(text)?'token-string':/^\d/.test(text)?'token-number':'token-keyword'});start=match.index!+text.length;}
  output.push({text:this.value.slice(start),kind:''});return output;
 }
 private commit(next:string,remember=true):void {if(this.readOnly||next===this.value)return;if(remember){this.undoStack.push(this.value);if(this.undoStack.length>150)this.undoStack.shift();this.redoStack=[];}this.value=next;this.lastEmitted=next;const area=this.area?.nativeElement;if(area&&area.value!==next)area.value=next;this.valueChange.emit(next);}
 emit(event:Event):void {
  const area=event.target as HTMLTextAreaElement;let next=area.value;const input=event as InputEvent;
  const closing:Record<string,string>={'(':')','[':']','{':'}','"':'"',"'":"'"};
  if(!input.isComposing&&input.inputType==='insertText'&&input.data&&closing[input.data]){const pos=area.selectionStart;const before=next[pos-2]??'';const after=next[pos]??'';if(!/[\w$\\]/.test(before)&&(!after||/[\s;,)\]}]/.test(after))){next=next.slice(0,pos)+closing[input.data]+next.slice(pos);area.value=next;area.setSelectionRange(pos,pos);}}
  this.commit(next);
 }
 insert(text:string):void {const area=this.area?.nativeElement;if(!area||this.readOnly)return;const start=area.selectionStart,end=area.selectionEnd;const next=area.value.slice(0,start)+text+area.value.slice(end);this.commit(next);area.value=next;area.focus({preventScroll:true});area.setSelectionRange(start+text.length,start+text.length);}
 onKeydown(event:KeyboardEvent):void {
  if(this.readOnly)return;
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?this.redo():this.undo();return;}
  if(event.key==='Tab'){event.preventDefault();this.insert('    ');}else if(event.key==='Enter'){event.preventDefault();const area=this.area!.nativeElement;const before=area.value.slice(0,area.selectionStart);const indent=before.split('\n').at(-1)?.match(/^\s*/)?.[0]??'';this.insert('\n'+indent+(/[{:[]\s*$/.test(before)?'    ':''));}else if(event.key==='Escape')this.expanded.set(false);
 }
 undo():void {if(this.readOnly)return;const next=this.undoStack.pop();if(next===undefined)return;this.redoStack.push(this.value);this.commit(next,false);}
 redo():void {if(this.readOnly)return;const next=this.redoStack.pop();if(next===undefined)return;this.undoStack.push(this.value);this.commit(next,false);}
 resize(delta:number):void {this.fontSize.update(x=>Math.max(12,Math.min(24,x+delta)));}
 find():void {const area=this.area?.nativeElement;const needle=this.search();if(!area||!needle)return;const index=this.value.indexOf(needle,area.selectionEnd);const found=index<0?this.value.indexOf(needle):index;if(found<0){this.message.set('No se encuentra ese texto.');return;}area.focus();area.setSelectionRange(found,found+needle.length);area.scrollTop=Math.max(0,(this.value.slice(0,found).split('\n').length-3)*this.fontSize()*1.6);this.syncTextScroll();this.message.set('Coincidencia seleccionada.');}
 indent():void {
  if(this.readOnly)return;
  if(this.value.includes('?>')||this.value.includes('<<<')||[...this.value.matchAll(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/gs)].some(x=>x[0].includes('\n'))){this.message.set('El ajuste básico solo admite PHP sin HTML, heredoc ni cadenas de varias líneas. Puedes sangrar con Tab.');return;}
  let depth=0;let inBlock=false;const formatted=this.value.split('\n').map(line=>{const text=line.trim();if(!text)return '';if(inBlock){if(text.includes('*/'))inBlock=false;return line;}if(text.startsWith('/*')&&!text.includes('*/'))inBlock=true;
   const clean=text.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*|\/\*.*?\*\//g,'');const leading=/^[}\]]/.test(clean)?1:0;const result='    '.repeat(Math.max(0,depth-leading))+text;depth=Math.max(0,depth+(clean.match(/[\{\[]/g)?.length??0)-(clean.match(/[\}\]]/g)?.length??0));return result;}).join('\n');this.commit(formatted);this.message.set('Sangría básica aplicada. Puedes deshacer el cambio.');
 }
 async copy():Promise<void>{try{const area=this.area?.nativeElement;await navigator.clipboard.writeText(area&&area.selectionStart!==area.selectionEnd?this.value.slice(area.selectionStart,area.selectionEnd):this.value);this.message.set('Código copiado.');}catch{this.message.set('Selecciona el texto y utiliza Copiar en el menú del teclado.');}}
 async paste():Promise<void>{try{this.insert(await navigator.clipboard.readText());}catch{this.message.set('Mantén pulsado el editor y utiliza Pegar en el menú del teclado.');}}
 syncTextScroll():void {const area=this.area?.nativeElement;const pre=area?.previousElementSibling;if(area&&pre){pre.scrollTop=area.scrollTop;pre.scrollLeft=area.scrollLeft;const numbers=area.parentElement?.previousElementSibling;if(numbers instanceof HTMLElement)numbers.style.transform=`translateY(${-area.scrollTop}px)`;}}
}
