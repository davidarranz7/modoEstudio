import { Compartment, EditorSelection, EditorState, Extension, StateEffect, StateField, Transaction } from '@codemirror/state';
import { EditorView, ViewUpdate, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers, rectangularSelection, showTooltip, tooltips, Tooltip } from '@codemirror/view';
import { defaultKeymap, history, historyField, historyKeymap, indentLess, indentMore, indentSelection, indentWithTab, redo, redoDepth, undo, undoDepth } from '@codemirror/commands';
import { HighlightStyle, bracketMatching, foldGutter, foldKeymap, indentOnInput, indentUnit, syntaxHighlighting, syntaxTree } from '@codemirror/language';
import { CompletionContext, autocompletion, closeBrackets, closeBracketsKeymap, closeCompletion, completionKeymap, completionStatus, insertBracket, snippetCompletion, startCompletion } from '@codemirror/autocomplete';
import { openSearchPanel, search, searchKeymap } from '@codemirror/search';
import { Diagnostic, forceLinting, linter } from '@codemirror/lint';
import { php, phpLanguage } from '@codemirror/lang-php';
import { html, htmlLanguage } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json, jsonLanguage } from '@codemirror/lang-json';
import { tags } from '@lezer/highlight';
import { currentSignature, phpCompletion, phpOpenCompletion } from './editor-php-intelligence';
import { functionSignature, parameterLabel } from './editor-php-catalog';
import type { EditorNavigation, EditorProblem, EditorSignature, EditorSnapshot } from './editor-state';

interface CachedEditor { state:EditorState; scrollTop:number; scrollLeft:number; }
interface EngineOptions {
 parent:HTMLElement;projectId:string;filename:string;language:string;value:string;files:Record<string,string>;
 savedState?:EditorSnapshot;readOnly:boolean;assistance:boolean;fontSize?:number;wrapLines?:boolean;
 onChange:(value:string)=>void;onState:(state:EditorSnapshot)=>void;
 onUpdate:(value:{undo:number;redo:number;line:number;column:number;signature:EditorSignature|null;completion:boolean})=>void;
 onEscape:()=>void;
}
const documents=new Map<string,CachedEditor>();
const serialFields={history:historyField};
function documentHash(value:string):string{let hash=2166136261;for(let i=0;i<value.length;i++){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619);}return value.length+':'+(hash>>>0).toString(16);}
function jsonCompletion(context:CompletionContext){const node=syntaxTree(context.state).resolveInner(context.pos,-1);for(let current:typeof node|null=node;current;current=current.parent)if(current.name==='String'||current.name==='PropertyName')return null;const word=context.matchBefore(/[a-z]*/);if(!word||(!context.explicit&&word.from===word.to))return null;const before=context.state.sliceDoc(0,word.from).trimEnd();if(!before||/[:\[,]$/.test(before))return {from:word.from,options:[{label:'true',type:'keyword',info:'Valor booleano verdadero.'},{label:'false',type:'keyword',info:'Valor booleano falso.'},{label:'null',type:'keyword',info:'Ausencia de valor.'},snippetCompletion('{\n\t"${1:clave}": ${2:null}\n}',{label:'objeto',type:'text',detail:'Estructura JSON'}),snippetCompletion('[${1}]',{label:'array',type:'text',detail:'Lista JSON'})]};return null;}
const highlight=HighlightStyle.define([
 {tag:tags.keyword,color:'#caa4f3'},{tag:[tags.string,tags.special(tags.string)],color:'#a7df9a'},
 {tag:tags.comment,color:'#7a91a7'},
 {tag:tags.number,color:'#f6cc93'},{tag:[tags.bool,tags.null],color:'#caa4f3'},
 {tag:tags.variableName,color:'#86c7f5'},{tag:tags.function(tags.variableName),color:'#80d8d1'},
 {tag:tags.tagName,color:'#f1ba84'},{tag:tags.processingInstruction,color:'#a3bffa'},
 {tag:[tags.attributeName,tags.propertyName],color:'#86c7f5'},
 {tag:tags.invalid,textDecoration:'underline wavy var(--red)'}
]);
const editorTheme=EditorView.theme({
 '&':{height:'100%',backgroundColor:'#151a23',color:'#dce6f3',fontSize:'var(--editor-font,16px)'},
 '&.cm-focused':{outline:'none'},'.cm-scroller':{fontFamily:'"JetBrains Mono", monospace',lineHeight:'1.6',overflow:'auto',overscrollBehavior:'contain'},
 '.cm-content':{padding:'14px 0',caretColor:'#f5f8ff',minHeight:'100%'},'.cm-line':{padding:'0 10px'},
 '.cm-gutters':{backgroundColor:'#171d27',color:'#718097',borderRight:'1px solid #2b3442'},
 '.cm-lineNumbers .cm-gutterElement':{minWidth:'32px',padding:'0 8px 0 3px'},
 '.cm-activeLine,.cm-activeLineGutter':{backgroundColor:'#171d27'},
 '.cm-selectionBackground,&.cm-focused .cm-selectionBackground,::selection':{backgroundColor:'#5b85cf55'},
 '.cm-cursor,.cm-dropCursor':{borderLeftColor:'#f5f8ff'},
 '.cm-matchingBracket':{backgroundColor:'#2a3b52',outline:'1px solid #6b9efb',color:'#f1f7ff'},
 '.cm-tooltip':{zIndex:'260',border:'1px solid #384659',borderRadius:'9px',backgroundColor:'#192439',color:'#eff4fb',boxShadow:'var(--shadow)',fontFamily:'"DM Sans",sans-serif',maxWidth:'min(92vw,520px)'},
 '.cm-tooltip-autocomplete > ul':{fontFamily:'"JetBrains Mono",monospace',maxWidth:'min(92vw,520px)',maxHeight:'180px',minWidth:'min(270px,85vw)'},
 '.cm-tooltip-autocomplete > ul > li':{padding:'8px 13px',minHeight:'41px',fontSize:'12px',lineHeight:'1.4',borderBottom:'1px solid #314157'},
 '.cm-tooltip-autocomplete > ul > li[aria-selected]':{backgroundColor:'#2a3b52',color:'#eff4fb'},
 '.cm-completionDetail':{fontFamily:'"DM Sans",sans-serif',fontSize:'10px',color:'#aebed2',marginLeft:'8px'},
 '.cm-completionInfo':{padding:'12px',maxHeight:'min(45vh,320px)',overflow:'auto'},
 '.estudio-completion-help p':{margin:'7px 0',fontSize:'12px',lineHeight:'1.5'},
 '.estudio-completion-help strong':{display:'block',fontFamily:'"JetBrains Mono",monospace',fontSize:'12px',whiteSpace:'normal'},
 '.estudio-completion-help small':{color:'#aebed2'},
 '.cm-panel.cm-search':{backgroundColor:'#202b3b',color:'#d9e2f1',fontFamily:'"DM Sans",sans-serif',padding:'8px',fontSize:'13px'},
 '.cm-textfield':{backgroundColor:'#151a23',color:'#dce6f3',border:'1px solid #384355',borderRadius:'6px',padding:'5px',maxWidth:'100%',fontSize:'16px'},
 '.cm-button':{backgroundImage:'none',backgroundColor:'#222c3c',color:'#d9e2f1',border:'1px solid #384355',borderRadius:'6px',minHeight:'30px'},
 '.cm-diagnostic':{fontSize:'12px',fontFamily:'"DM Sans",sans-serif'},
 '.cm-lintRange-error':{backgroundImage:'none',textDecoration:'underline wavy var(--red)'},
 '.cm-lintRange-warning':{backgroundImage:'none',textDecoration:'underline wavy var(--orange)'},
 '.cm-foldPlaceholder':{backgroundColor:'#222c3c',color:'#9eaec5',border:'1px solid #384355'},
 '.cm-signature-help':{padding:'9px 12px',fontSize:'12px',maxWidth:'min(88vw,490px)',maxHeight:'min(180px,35vh)',overflow:'auto'},
 '.cm-signature-help strong':{fontFamily:'"JetBrains Mono",monospace'},
 '.cm-signature-help p':{margin:'6px 0',lineHeight:'1.45'}
},{dark:true});

/** Lazily imported by the Angular shell. No PHP execution or application storage is accessible to completion providers. */
export class EditorEngine {
 readonly view:EditorView;
 private options:EngineOptions;
 private readonly readOnly=new Compartment();private readonly language=new Compartment();private readonly assistance=new Compartment();private readonly wrapping=new Compartment();
 private problems:EditorProblem[]=[];private timer?:ReturnType<typeof setTimeout>;private destroyed=false;private applying=false;
 private suppressSignature=false;private readonly hintsVisibility=StateEffect.define<boolean>();
 private readonly scrollListener=()=>this.scheduleSnapshot();
 constructor(options:EngineOptions){
  this.options=options;
  const state=this.makeState(options.value,options.savedState);
  this.view=new EditorView({state,parent:options.parent});
  this.restoreScroll();this.view.scrollDOM.addEventListener('scroll',this.scrollListener,{passive:true});this.report();
 }
 private get key():string{return this.options.projectId+'\0'+this.options.filename;}
 private project(){return {filename:this.options.filename,files:this.options.files};}
 private languageExtensions(doc:string):Extension[] {
  const extension=this.options.filename.split('.').pop()?.toLowerCase()??this.options.language.toLowerCase();
  if(extension==='php')return [php({plain:!doc.includes('<?')&&!/^\s*</.test(doc)}),phpLanguage.data.of({autocomplete:(context:any)=>this.options.assistance?phpCompletion(context,this.project()):null}),htmlLanguage.data.of({autocomplete:(context:any)=>this.options.assistance?phpOpenCompletion(context):null})];
  if(extension==='html'||extension==='htm')return [html()];
  if(extension==='css')return [css()];
  if(extension==='json')return [json(),jsonLanguage.data.of({autocomplete:jsonCompletion})];return [];
 }
 private helpExtensions():Extension[] {
  // Keep the completion state installed while disabled so pending keyboard queries
  // cannot refer to a removed field when the user toggles assistance or changes files.
  if(!this.options.assistance)return [autocompletion({activateOnTyping:false,override:[]})];
  const signature=StateField.define<readonly Tooltip[]>({
   create:state=>this.signatureTooltip(state),
   update:(value,tr)=>{const visibility=tr.effects.find(effect=>effect.is(this.hintsVisibility));if(tr.docChanged||tr.selection)this.suppressSignature=false;if(visibility)this.suppressSignature=visibility.value;return tr.docChanged||tr.selection||tr.reconfigured||visibility?this.signatureTooltip(tr.state):value;},
   provide:field=>showTooltip.computeN([field],state=>state.field(field))
  });
  return [autocompletion({activateOnTyping:true,activateOnTypingDelay:140,maxRenderedOptions:30,selectOnOpen:false,aboveCursor:true,closeOnBlur:true}),closeBrackets(),signature];
 }
 private signatureTooltip(state:EditorState):readonly Tooltip[] {
  if(!this.options.filename.endsWith('.php')||this.suppressSignature)return [];
  const signature=currentSignature(state,this.project());if(!signature)return [];
  return [{pos:state.selection.main.head,above:true,arrow:false,create:()=>{
   const dom=document.createElement('div');dom.className='cm-signature-help';
   const code=document.createElement('strong');code.textContent=functionSignature(signature.fn);dom.appendChild(code);
   const description=document.createElement('p');description.textContent=signature.fn.description;dom.appendChild(description);
   const param=signature.fn.params[Math.min(signature.activeParameter,signature.fn.params.length-1)];
   if(param){const p=document.createElement('p');p.textContent=parameterLabel(param)+' — '+param.description;dom.appendChild(p);}
   return {dom};
  }}];
 }
 private extensions():Extension[] {
  return [lineNumbers(),highlightActiveLineGutter(),history(),drawSelection(),rectangularSelection(),highlightActiveLine(),bracketMatching(),indentOnInput(),indentUnit.of('    '),foldGutter(),syntaxHighlighting(highlight),editorTheme,
   tooltips({parent:this.options.parent.closest<HTMLElement>('.app-shell')??document.body,position:'fixed',tooltipSpace:()=>{const viewport=window.visualViewport;const left=viewport?.offsetLeft??0,top=viewport?.offsetTop??0;return {left:left+6,top:top+6,right:left+(viewport?.width??window.innerWidth)-6,bottom:top+(viewport?.height??window.innerHeight)-6};}}),
   this.readOnly.of(EditorState.readOnly.of(this.options.readOnly)),this.language.of(this.languageExtensions(this.options.value)),this.assistance.of(this.helpExtensions()),this.wrapping.of(this.options.wrapLines?EditorView.lineWrapping:[]),
   EditorView.contentAttributes.of({'aria-label':'Código del archivo '+this.options.filename,spellcheck:'false',autocorrect:'off',autocapitalize:'off','data-editor':'codemirror'}),
   EditorState.phrases.of({'Find':'Buscar','Replace':'Reemplazar','next':'Siguiente','previous':'Anterior','all':'Todos','match case':'Mayúsculas','regexp':'Expresión regular','by word':'Palabra completa','replace':'Reemplazar','replace all':'Reemplazar todo','close':'Cerrar','Fold line':'Plegar línea','Unfold line':'Desplegar línea'}),
   search({top:true}),keymap.of([...closeBracketsKeymap,...completionKeymap,...defaultKeymap,...historyKeymap,...searchKeymap,...foldKeymap,indentWithTab,{key:'Escape',run:view=>{closeCompletion(view);this.options.onEscape();return true;}}]),
   linter(view=>this.diagnostics(view.state),{delay:650}),
   EditorView.updateListener.of(update=>this.updated(update))
  ];
 }
 private makeState(value:string,saved?:EditorSnapshot):EditorState {
  const config={doc:value,extensions:this.extensions()};const cached=documents.get(this.key);
  if(cached&&cached.state.doc.toString()===value)return cached.state.update({effects:StateEffect.reconfigure.of(config.extensions)}).state;
  if(saved?.file===this.options.filename&&saved.state&&(!saved.documentHash||saved.documentHash===documentHash(value))){try{return EditorState.fromJSON({...saved.state as object,doc:value},config,serialFields);}catch{/* A corrupt/stale cursor snapshot never replaces the student's document. */}}
  const length=value.length;return EditorState.create({...config,...(saved?.file===this.options.filename?{selection:EditorSelection.single(Math.min(length,Math.max(0,saved.selection.anchor)),Math.min(length,Math.max(0,saved.selection.head)))}:{})});
 }
 private diagnostics(state:EditorState):Diagnostic[] {
  const diagnostics:Diagnostic[]=this.problems.filter(problem=>!problem.file||problem.file===this.options.filename).map(problem=>{
   const line=state.doc.line(Math.max(1,Math.min(state.doc.lines,problem.line||1)));const from=Math.min(line.to,line.from+Math.max(0,(problem.column??1)-1));return {from,to:Math.max(from,Math.min(state.doc.length,from+1)),severity:problem.severity,message:problem.message,source:problem.source??'PHP'};
  });
  if(this.options.filename.endsWith('.json')){try{JSON.parse(state.doc.toString());}catch(error){diagnostics.push({from:0,to:Math.min(1,state.doc.length),severity:'error',message:error instanceof Error?error.message:'JSON no válido',source:'Sintaxis JSON'});}}
  else syntaxTree(state).iterate({enter:node=>{if(node.type.isError&&diagnostics.filter(d=>d.source==='Análisis sintáctico').length<8)diagnostics.push({from:node.from,to:Math.min(state.doc.length,Math.max(node.to,node.from+1)),severity:'warning',message:'Posible sintaxis incompleta. El resultado de PHP al ejecutar es la comprobación definitiva.',source:'Análisis sintáctico'});}});
  return diagnostics;
 }
 private updated(update:ViewUpdate):void {
  if(this.applying||this.destroyed)return;
  if(update.docChanged){
   const value=update.state.doc.toString();this.options.value=value;this.options.onChange(value);
   const wasPlain=!update.startState.doc.toString().includes('<?')&&!/^\s*</.test(update.startState.doc.toString());const nowPlain=!value.includes('<?')&&!/^\s*</.test(value);
   if(this.options.filename.endsWith('.php')&&wasPlain!==nowPlain)queueMicrotask(()=>{if(!this.destroyed)this.view.dispatch({effects:this.language.reconfigure(this.languageExtensions(value))});});
  }
  if(update.transactions.length||update.focusChanged)this.report();
  if(update.docChanged||update.selectionSet)this.scheduleSnapshot();
 }
 private report():void {const state=this.view.state;const position=state.selection.main.head,line=state.doc.lineAt(position);this.options.onUpdate({undo:undoDepth(state),redo:redoDepth(state),line:line.number,column:position-line.from+1,signature:this.options.assistance&&!this.suppressSignature&&this.options.filename.endsWith('.php')?currentSignature(state,this.project()):null,completion:completionStatus(state)!==null});}
 private scheduleSnapshot():void {clearTimeout(this.timer);this.timer=setTimeout(()=>this.capture(),250);}
 private restoreScroll():void {const cached=documents.get(this.key),saved=this.options.savedState;const top=cached?.scrollTop??saved?.scrollTop??0,left=cached?.scrollLeft??saved?.scrollLeft??0;requestAnimationFrame(()=>{if(!this.destroyed){this.view.scrollDOM.scrollTop=top;this.view.scrollDOM.scrollLeft=left;}});}
 capture():EditorSnapshot {
  clearTimeout(this.timer);const state=this.view.state;const main=state.selection.main;const serial=state.toJSON(serialFields);delete serial['doc'];
  const snapshot:EditorSnapshot={file:this.options.filename,selection:{anchor:main.anchor,head:main.head},scrollTop:this.view.scrollDOM.scrollTop,scrollLeft:this.view.scrollDOM.scrollLeft,state:serial,assistance:this.options.assistance,fontSize:this.options.fontSize??16,documentHash:documentHash(state.doc.toString())};
  documents.set(this.key,{state,scrollTop:snapshot.scrollTop,scrollLeft:snapshot.scrollLeft});if(documents.size>200)documents.delete(documents.keys().next().value!);
  this.options.onState(snapshot);return snapshot;
 }
 update(input:Partial<Pick<EngineOptions,'projectId'|'filename'|'language'|'files'|'value'|'readOnly'|'assistance'|'fontSize'|'savedState'|'wrapLines'>>):void {
  const switching=(input.projectId!==undefined&&input.projectId!==this.options.projectId)||(input.filename!==undefined&&input.filename!==this.options.filename);
  if(switching)this.capture();const oldAssistance=this.options.assistance;const oldValue=this.options.value;const oldLanguage=this.options.language;const oldWrapping=this.options.wrapLines;this.options={...this.options,...input};
  if(switching||this.view.state.doc.toString()!==this.options.value){this.applying=true;this.view.setState(this.makeState(this.options.value,this.options.savedState));this.applying=false;this.restoreScroll();this.report();return;}
  const effects:StateEffect<unknown>[]=[this.readOnly.reconfigure(EditorState.readOnly.of(this.options.readOnly))];
  if(oldWrapping!==this.options.wrapLines)effects.push(this.wrapping.reconfigure(this.options.wrapLines?EditorView.lineWrapping:[]));
  if(oldAssistance!==this.options.assistance){effects.push(this.assistance.reconfigure(this.helpExtensions()));if(!this.options.assistance)closeCompletion(this.view);}
  if(oldLanguage!==this.options.language||oldValue!==this.options.value)effects.push(this.language.reconfigure(this.languageExtensions(this.options.value)));
  this.view.dispatch({effects});
 }
 setProblems(problems:EditorProblem[]):void {this.problems=problems;forceLinting(this.view);}
 navigate(position:EditorNavigation):void {const line=this.view.state.doc.line(Math.min(this.view.state.doc.lines,Math.max(1,position.line)));const anchor=Math.min(line.to,line.from+Math.max(0,(position.column??1)-1));this.view.dispatch({selection:{anchor},effects:EditorView.scrollIntoView(anchor,{y:'center'})});this.view.focus();}
 insert(text:string):void {
  if(this.options.readOnly)return;const state=this.view.state;
  if(text.length===1&&this.options.assistance&&/^[()[\]{}'"]$/.test(text)){const transaction=insertBracket(state,text);if(transaction){this.view.dispatch(transaction);this.view.focus();return;}}
  this.view.dispatch(state.replaceSelection(text),{annotations:Transaction.userEvent.of('input.type'),scrollIntoView:true});this.view.focus();
 }
 undo():void {if(!this.options.readOnly)undo(this.view);this.view.focus();}
 redo():void {if(!this.options.readOnly)redo(this.view);this.view.focus();}
 indent(less=false):void {if(!this.options.readOnly)(less?indentLess:indentMore)(this.view);this.view.focus();}
 format():void {if(this.options.readOnly)return;const state=this.view.state;if(this.options.filename.endsWith('.json')){const value=JSON.stringify(JSON.parse(state.doc.toString()),null,4);this.view.dispatch({changes:{from:0,to:state.doc.length,insert:value},annotations:Transaction.userEvent.of('input.format')});}else{const selection=state.selection;this.view.dispatch({selection:{anchor:0,head:state.doc.length}});indentSelection(this.view);this.view.dispatch({selection});}this.view.focus();}
 search():void {openSearchPanel(this.view);}
 complete():void {if(this.options.assistance)startCompletion(this.view);this.view.focus();}
 closeHints():void {closeCompletion(this.view);this.suppressSignature=true;this.view.dispatch({effects:this.hintsVisibility.of(true)});this.report();this.view.focus();}
 selectedText():string {const state=this.view.state,selection=state.selection.main;return selection.empty?state.doc.toString():state.sliceDoc(selection.from,selection.to);}
 focus():void{this.view.focus();}
 measure():void {this.view.requestMeasure();}
 destroy():void {if(this.destroyed)return;this.capture();this.destroyed=true;clearTimeout(this.timer);this.view.scrollDOM.removeEventListener('scroll',this.scrollListener);this.view.destroy();}
}
