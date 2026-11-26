import { Completion, CompletionContext, CompletionResult, snippetCompletion } from '@codemirror/autocomplete';
import { EditorState, Transaction } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { phpLanguage } from '@codemirror/lang-php';
import type { SyntaxNode } from '@lezer/common';
import { PHP_CONSTANTS, PHP_FUNCTIONS, functionSignature, parameterLabel } from './editor-php-catalog';
import type { EditorFunction, EditorParameter, EditorSignature } from './editor-state';

interface Variable {name:string;from:number;scopeFrom:number;scopeTo:number;type:string;}
interface ParsedFile {code:string;functions:EditorFunction[];variables:Variable[];constants:string[];includes:string[];}
export interface EditorProjectContext { filename:string; files:Record<string,string>; }
const nativeFunctions=new Map(PHP_FUNCTIONS.map(fn=>[fn.name.toLowerCase(),fn]));
const superglobals:Record<string,string>={$_GET:'Parámetros recibidos en la URL.',$_POST:'Campos recibidos mediante POST.',$_FILES:'Archivos enviados por multipart/form-data.',$_COOKIE:'Cookies recibidas en esta petición.',$_SESSION:'Datos de la sesión activa; utiliza session_start().',$_SERVER:'Información de la petición y del entorno del servidor.',$_REQUEST:'Datos de petición; su composición depende de la configuración PHP.',$_ENV:'Variables del entorno permitidas por el intérprete.',$GLOBALS:'Variables del ámbito global.'};
const keywords='if else elseif endif foreach endforeach for endfor while endwhile do switch case default break continue return function fn static global const true false null echo print include include_once require require_once try catch finally throw match as array list new instanceof namespace use declare'.split(' ');
const constructs:Record<string,{description:string;params:string[]}>={isset:{description:'Comprueba que las variables existen y su valor no es null.',params:['mixed $var','mixed ...$vars']},empty:{description:'Comprueba si una variable no existe o tiene un valor considerado vacío.',params:['mixed $var']},unset:{description:'Elimina variables o elementos de un array.',params:['mixed $var','mixed ...$vars']},exit:{description:'Finaliza el programa, opcionalmente con un mensaje o estado.',params:['string|int $status = 0']}};
const constructFunctions=new Map<string,EditorFunction>(Object.entries(constructs).map(([name,definition])=>[name,{name,description:definition.description,source:'Construcción del lenguaje PHP 8.2',returnType:name==='unset'?'void':name==='exit'?'never':'bool',params:definition.params.map(parameter=>{const match=parameter.match(/^(\S+)\s+(\.\.\.)?\$(\w+)(?:\s*=\s*(.*))?$/)!;return {type:match[1],name:match[3],variadic:!!match[2],optional:match[4]!==undefined||!!match[2],...(match[4]!==undefined?{default:match[4]}:{}),description:name==='isset'?'Variable cuya existencia y valor distinto de null se comprueban.':name==='unset'?'Variable o elemento que se elimina.':name==='empty'?'Variable que se comprueba, aunque todavía no exista.':'Mensaje o estado opcional de finalización.'};})}]));
const frequentFunctions=new Set('array_push array_pop array_map array_filter array_keys array_values array_key_exists array_sum array_merge array_slice array_unique session_start session_destroy session_regenerate_id move_uploaded_file htmlspecialchars str_contains str_replace str_split'.split(' '));
const functionPriority:Record<string,number>={array_sum:25,array_push:24,array_merge:23,array_map:22,array_filter:21,array_keys:20,array_values:19,array_key_exists:18,array_pop:17,array_slice:16,session_start:25,session_destroy:20,session_regenerate_id:18,move_uploaded_file:25};
const magicConstants='__DIR__ __FILE__ __LINE__ __FUNCTION__ __CLASS__ __METHOD__ __NAMESPACE__ __TRAIT__'.split(' ');
const completionLabels:Record<string,string>={array_sum:'Sumar elementos',array_push:'Añadir al final',array_pop:'Extraer del final',array_merge:'Combinar arrays',array_filter:'Filtrar elementos',array_map:'Transformar elementos',array_keys:'Obtener claves',array_values:'Obtener valores',array_key_exists:'Comprobar una clave',array_slice:'Extraer parte del array',array_unique:'Eliminar repetidos',count:'Contar elementos',move_uploaded_file:'Mover archivo subido',session_start:'Iniciar sesión',session_destroy:'Destruir sesión',session_regenerate_id:'Renovar identificador',htmlspecialchars:'Escapar HTML',file_get_contents:'Leer archivo',file_put_contents:'Escribir archivo',json_decode:'Interpretar JSON',json_encode:'Generar JSON',password_verify:'Verificar contraseña',password_hash:'Crear hash de contraseña',isset:'Comprobar variable',empty:'Comprobar valor vacío',unset:'Eliminar variable',exit:'Finalizar programa',str_contains:'Buscar texto',str_replace:'Sustituir texto',str_split:'Dividir texto',explode:'Separar una cadena',implode:'Unir elementos',strlen:'Medir longitud',number_format:'Formatear un número',filter_var:'Validar un dato',setcookie:'Crear o borrar cookie',header:'Enviar cabecera HTTP'};
const phpCaseFold=(value:string):string=>value.replace(/[A-Z]/g,letter=>letter.toLowerCase());
function completionDescription(fn:EditorFunction):string {if(completionLabels[fn.name])return completionLabels[fn.name];if(fn.description.startsWith('Función nativa disponible'))return 'Función de PHP 8.2';const text=fn.description.replace(/\.$/,'');return text.length<=30?text:text.slice(0,29).replace(/\s\S*$/,'')+'…';}
const cache=new Map<string,ParsedFile>();
const read=(code:string,node:SyntaxNode|null):string=>node?code.slice(node.from,node.to):'';
function visit(node:SyntaxNode,fn:(node:SyntaxNode)=>void):void {fn(node);for(let child=node.firstChild;child;child=child.nextSibling)visit(child,fn);}
function ancestor(node:SyntaxNode|null,predicate:(node:SyntaxNode)=>boolean):SyntaxNode|null {for(let current=node;current;current=current.parent)if(predicate(current))return current;return null;}
function normalizePath(path:string):string {const parts:string[]=[];for(const segment of path.split('/')){if(!segment||segment==='.')continue;if(segment==='..')parts.pop();else parts.push(segment);}return parts.join('/');}
function dirname(path:string):string {return path.includes('/')?path.slice(0,path.lastIndexOf('/')):'';}
function relativePath(from:string,to:string):string {const a=from.split('/').filter(Boolean),b=to.split('/').filter(Boolean);while(a.length&&b.length&&a[0]===b[0]){a.shift();b.shift();}return [...a.map(()=>'..'),...b].join('/');}
function docInfo(code:string,node:SyntaxNode):{description:string;params:Map<string,{type:string;description:string}>;returnType?:string} {
 const comment=node.prevSibling;
 const raw=comment?.name==='BlockComment'&&read(code,comment).startsWith('/**')&&code.slice(comment.to,node.from).trim()===''?read(code,comment):'';
 const cleaned=raw.replace(/^\/\*\*|\*\/$/g,'').replace(/^\s*\* ?/gm,'').trim();
 const description=cleaned.split(/@\w+/)[0].trim()||'Función declarada en el proyecto.';
 const params=new Map<string,{type:string;description:string}>();
 for(const match of cleaned.matchAll(/@param\s+(\S+)\s+\$(\w+)\s*([^@]*)/g))params.set(match[2],{type:match[1],description:match[3].trim()});
 return {description,params,returnType:cleaned.match(/@return\s+(\S+)/)?.[1]};
}
export function parseProjectFile(filename:string,code:string):ParsedFile {
 const previous=cache.get(filename);if(previous?.code===code)return previous;
 const result:ParsedFile={code,functions:[],variables:[],constants:[],includes:[]};
 // Large documents remain fully editable/executable; project-symbol indexing is bounded.
 if(code.length>524288){cache.set(filename,result);return result;}
 const tree=phpLanguage.parser.configure({top:code.includes('<?')||/^\s*</.test(code)?'Template':'Program'}).parse(code);
 visit(tree.topNode,node=>{
  if(node.name==='FunctionDefinition'){
   const name=read(code,node.getChild('Name'));if(!name)return;
   const docs=docInfo(code,node);const list=node.getChild('ParamList');const params:EditorParameter[]=[];
   for(const parameter of list?.getChildren('Parameter')??[]){
    const variable=parameter.getChild('VariableName');if(!variable)continue;
    const paramName=read(code,variable).slice(1);const before=code.slice(parameter.from,variable.from).trim();
    const defaultValue=code.slice(variable.to,parameter.to).match(/^\s*=\s*([\s\S]*)$/)?.[1];
    params.push({name:paramName,type:before.replace(/&|\.\.\./g,'').trim()||docs.params.get(paramName)?.type||'mixed',optional:defaultValue!==undefined,variadic:before.includes('...'),byReference:before.includes('&'),...(defaultValue!==undefined?{default:defaultValue}:{}),description:docs.params.get(paramName)?.description||'Parámetro declarado por el estudiante.'});
   }
   const body=node.getChild('Block');const afterList=list?code.slice(list.to,body?.from??node.to):'';
   result.functions.push({name,params,returnType:afterList.match(/^\s*:\s*([^\{]+)/)?.[1].trim()||docs.returnType||'mixed',description:docs.description,source:filename,file:filename,from:node.from,to:node.to,scopeFrom:body?.from??node.from,scopeTo:body?.to??node.to});
  }
  if(node.name==='VariableName'){
   const parent=node.parent;const scope=ancestor(parent,n=>['FunctionDefinition','AnonymousFunction','ArrowFunction'].includes(n.name));
   const forSpec=ancestor(parent,n=>n.name==='ForSpec');const as=forSpec?.getChild('as');
   const declared=parent?.name==='Parameter'||(parent?.name==='AssignmentExpression'&&parent.firstChild?.from===node.from)||!!(as&&node.from>as.to)||parent?.name==='GlobalDeclaration';
   if(declared)result.variables.push({name:read(code,node),from:node.from,scopeFrom:scope?.from??0,scopeTo:scope?.to??code.length,type:parent?.name==='Parameter'?code.slice(parent.from,node.from).replace(/&|\.\.\./g,'').trim()||'mixed':'mixed'});
  }
  if(node.name==='VariableDeclarator'&&node.parent?.name==='ConstDeclaration'){const name=read(code,node.getChild('Name'));if(name)result.constants.push(name);}
  if(['RequireExpression','IncludeExpression'].includes(node.name)){
   const expression=read(code,node).replace(/^(?:require|include)(?:_once)?\s*\(?\s*/,'').replace(/\s*\)?$/,'');
   const literal=expression.match(/^(?:__DIR__\s*\.\s*)?(['"])([^'"$]*)\1$/);
   if(literal)result.includes.push(normalizePath(dirname(filename)+'/'+literal[2]));
  }
 });
 if(cache.size>160)cache.delete(cache.keys().next().value!);cache.set(filename,result);return result;
}
function projectFiles(context:EditorProjectContext,state:EditorState):Record<string,string> {return {...context.files,[context.filename]:state.doc.toString()};}
function userFunctions(context:EditorProjectContext,state:EditorState):EditorFunction[] {return Object.entries(projectFiles(context,state)).filter(([name])=>name.endsWith('.php')).flatMap(([name,code])=>parseProjectFile(name,code).functions);}
function helpNode(fn:EditorFunction):HTMLElement {
 const node=document.createElement('div');node.className='estudio-completion-help';
 const title=document.createElement('strong');title.textContent=functionSignature(fn);node.appendChild(title);
 const description=document.createElement('p');description.textContent=fn.description;node.appendChild(description);
 for(const parameter of fn.params){const p=document.createElement('p');const name=document.createElement('code');name.textContent=parameterLabel(parameter);p.append(name,document.createTextNode(' — '+parameter.description));node.appendChild(p);}
 const source=document.createElement('small');source.textContent=fn.file?'Declarada en '+fn.file:'Firma del intérprete '+fn.source;node.appendChild(source);return node;
}
function functionCompletion(fn:EditorFunction,current:string):Completion {
 return {label:fn.name,type:'function',detail:fn.file?(fn.file===current?'Función propia':fn.file+' · comprueba su inclusión'):completionDescription(fn),info:()=>helpNode(fn),boost:fn.file?30:(functionPriority[fn.name]??(frequentFunctions.has(fn.name)?15:0)),apply(view,_completion,from,to){
  const hasParen=/^\s*\(/.test(view.state.doc.sliceString(to,to+4));const insert=fn.name+(hasParen?'':'()');
  view.dispatch({changes:{from,to,insert},selection:{anchor:from+fn.name.length+(hasParen?0:1)},annotations:Transaction.userEvent.of('input.complete')});
 }};
}
export function phpCompletion(context:CompletionContext,project:EditorProjectContext):CompletionResult|null {
 const state=context.state,pos=context.pos;const before=state.sliceDoc(Math.max(0,pos-300),pos);const node=syntaxTree(state).resolveInner(pos,-1);
 if(ancestor(node,n=>/Comment/.test(n.name)))return null;
 if(/<\?(?:p(?:h(?:p)?)?)?$/.test(before)&&!ancestor(node,n=>/String/.test(n.name)))return phpOpenCompletion(context);
 const path=before.match(/\b(?:require|include)(?:_once)?\s*(?:\(\s*)?(?:(__DIR__)\s*\.\s*)?(['"])([^'"\n]*)$/);
 if(path&&ancestor(node,n=>['RequireExpression','IncludeExpression'].includes(n.name))){
  const prefix=path[3];const from=pos-prefix.length;
  const options=Object.keys(project.files).filter(name=>name!==project.filename).map(name=>{const relative=relativePath(dirname(project.filename),name);const label=path[1]?'/'+relative:prefix.startsWith('./')?'./'+relative:relative;return {label,type:'text',detail:'Archivo del proyecto'};}).filter(option=>option.label.startsWith(prefix));
  return {from,options,filter:false};
 }
 if(ancestor(node,n=>/Comment|String/.test(n.name)))return null;
 const word=context.matchBefore(/[$\p{L}\p{N}_\\]*/u);if(!word||(!context.explicit&&word.from===word.to))return null;
 const prefix=word.text;let options:Completion[]=[];
 const parsed=parseProjectFile(project.filename,state.doc.toString());
 if(prefix.startsWith('$')){
  options=Object.entries(superglobals).map(([label,info])=>({label,type:'variable',info,detail:'Superglobal PHP'}));
  const own=parsed.variables.filter(v=>v.from<=pos&&v.scopeFrom<=pos&&v.scopeTo>=pos&&(v.scopeFrom===0?!ancestor(node,n=>['FunctionDefinition','AnonymousFunction','ArrowFunction'].includes(n.name)):true));
  options.push(...own.map(variable=>({label:variable.name,type:'variable',detail:variable.type,info:'Variable declarada en el ámbito actual.',boost:8})));
 }else{
  options=PHP_FUNCTIONS.map(fn=>functionCompletion(fn,project.filename));
  options.push(...userFunctions(project,state).map(fn=>functionCompletion(fn,project.filename)));
  options.push(...keywords.map(label=>({label,type:'keyword'})),...PHP_CONSTANTS.map(constant=>({label:constant.name,type:'constant',detail:constant.type,info:'Constante disponible en este intérprete PHP 8.2.'})),...parsed.constants.map(label=>({label,type:'constant',detail:'Constante del archivo'})),...magicConstants.map(label=>({label,type:'constant',detail:'Constante mágica PHP'})));
  for(const fn of constructFunctions.values())options.push({...functionCompletion(fn,project.filename),type:'keyword',detail:completionDescription(fn)});
  const snippets:Completion[]=[
   snippetCompletion('foreach (${1:$items} as ${2:$value}) {\n\t${}\n}',{label:'foreach',type:'keyword',detail:'Recorrer un array',info:'Fragmento con colección y elemento editables.'}),
   snippetCompletion('if (${1:condicion}) {\n\t${}\n}',{label:'if',type:'keyword',detail:'Condición con bloque'}),
   snippetCompletion('for (${1:$i = 0}; ${2:$i < 10}; ${3:$i++}) {\n\t${}\n}',{label:'for',type:'keyword',detail:'Bucle con contador'}),
   snippetCompletion('function ${1:nombre}(${2:argumentos}): ${3:void} {\n\t${}\n}',{label:'function',type:'keyword',detail:'Declarar función tipada'}),
   snippetCompletion('/**\n * ${1:Descripción.}\n * @param ${2:tipo} ${3:$valor} ${4:Descripción del parámetro.}\n * @return ${5:tipo} ${6:Descripción del resultado.}\n */',{label:'phpdoc',type:'text',detail:'Documentar una función'})
  ];
  const replaced=new Set(snippets.map(s=>s.label));options=options.filter(o=>!replaced.has(o.label));options.push(...snippets);
 }
 const unique=new Map<string,Completion>();for(const option of options)unique.set(option.label,option);
 const matches=[...unique.values()].filter(option=>{const exactCase=option.type==='variable'||(option.type==='constant'&&!magicConstants.includes(option.label));return exactCase?option.label.startsWith(prefix):phpCaseFold(option.label).startsWith(phpCaseFold(prefix));}).sort((a,b)=>(b.boost??0)-(a.boost??0)||a.label.localeCompare(b.label));
 // Requery after each edit. A reusable broad result would let fuzzy filtering
 // introduce unrelated names as a prefix grows (for example move_ -> curl_*).
 return {from:word.from,options:matches,filter:false};
}
export function phpOpenCompletion(context:CompletionContext):CompletionResult|null {
 const word=context.matchBefore(/<\?(?:p(?:h(?:p)?)?)?/);if(!word)return null;
 return {from:word.from,options:[{label:'<?php',type:'keyword',detail:'Abrir bloque PHP',apply:'<?php\n'}],validFor:/^<\?p?h?p?$/};
}
export function currentSignature(state:EditorState,project:EditorProjectContext):EditorSignature|null {
 const pos=state.selection.main.head;const node=syntaxTree(state).resolveInner(pos,-1);const args=ancestor(node,n=>n.name==='ArgList');
 if(!args||args.parent?.name!=='CallExpression')return null;
 const name=read(state.doc.toString(),args.parent.firstChild);const fn=userFunctions(project,state).find(f=>f.name.toLowerCase()===name.toLowerCase())??nativeFunctions.get(name.toLowerCase())??constructFunctions.get(name.toLowerCase());if(!fn)return null;
 let activeParameter=0;for(let child=args.firstChild;child;child=child.nextSibling)if(child.name===','&&child.from<pos)activeParameter++;
 return {fn,activeParameter};
}
