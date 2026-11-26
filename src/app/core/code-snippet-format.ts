import {php} from '@codemirror/lang-php';
import {html} from '@codemirror/lang-html';
import type {SyntaxNode,Tree} from '@lezer/common';

interface Token {node:SyntaxNode;from:number;to:number;text:string;}
interface Edit {from:number;to:number;text:string;}
const controls=/^(?:If|While|Do|For|Foreach)Statement$/;
const blocks=/^(?:Block|ClassBody|SwitchBody|EnumBody)$/;
const protectedText=/String|Heredoc|Comment|^Text$/;

function tokens(tree:Tree,code:string):Token[]{
 const result:Token[]=[];
 tree.iterate({enter(node){
  if(protectedText.test(node.name)||!node.node.firstChild){result.push({node:node.node,from:node.from,to:node.to,text:code.slice(node.from,node.to)});return false;}
  return;
 }});
 return result;
}
function indentation(node:SyntaxNode):number{
 let depth=0;
 for(let parent:SyntaxNode|null=node;parent;parent=parent.parent){
  if(blocks.test(parent.name))depth++;
  if(parent.name.endsWith('Statement')&&parent.parent&&controls.test(parent.parent.name))depth++;
 }
 return depth;
}
function apply(code:string,edits:Edit[]):string{
 let result='',position=0;
 for(const edit of edits.sort((a,b)=>a.from-b.from)){
  if(edit.from<position||!/^\s*$/.test(code.slice(edit.from,edit.to)))continue;
  result+=code.slice(position,edit.from)+edit.text;position=edit.to;
 }
 return result+code.slice(position);
}

/** Read-only layout. The stored source and the interpreter never use this formatted copy. */
export function formatSnippet(code:string,language:string):string{
 if(language==='CSS')return code;
 let formatted=code;
 if(language==='PHP'){
  const tree=php({plain:!code.includes('<?')&&!/^\s*</.test(code)}).language.parser.parse(code);
  let invalid=false;tree.iterate({enter(node){if(node.type.isError)invalid=true;}});
  if(invalid)return code;
  const items=tokens(tree,code),edits:Edit[]=[];
  for(let index=1;index<items.length;index++){
   const current=items[index],previous=items[index-1],gap=code.slice(previous.to,current.from);
   if(!/^\s*$/.test(gap)||current.node.name==='Text'||previous.node.name==='Text')continue;
   const blockOpen=previous.text==='{'&&blocks.test(previous.node.parent?.name??'');
   const blockClose=current.text==='}'&&blocks.test(current.node.parent?.name??'');
   const afterBlock=previous.text==='}'&&blocks.test(previous.node.parent?.name??'');
   const forSeparator=previous.text===';'&&previous.node.parent?.name==='ForSpec';
   const continuation=/^(?:else|elseif|catch|finally)$/.test(current.text)||(current.text==='while'&&current.node.parent?.name==='DoStatement');
   const bareBody=current.node.parent?.from===current.from&&current.node.parent.name.endsWith('Statement')&&controls.test(current.node.parent.parent?.name??'');
   let depth=indentation(current.node)-(blockClose?1:0),replacement:string|undefined;
   const newline=(blank=false)=>(blank?'\n\n':'\n')+'    '.repeat(Math.max(0,depth));
   if(blockOpen||blockClose||bareBody)replacement=newline();
   else if(previous.text===';'&&!forSeparator)replacement=newline(depth===0&&controls.test(current.node.parent?.name??'')&&!continuation);
   else if(afterBlock)replacement=continuation?' ':/^[;,\)\]]$/.test(current.text)?'':newline(depth===0&&controls.test(current.node.parent?.name??''));
   else if(previous.node.name==='PhpOpen')replacement=previous.text==='<?php'?newline():' ';
   else if(current.node.name==='PhpClose')replacement=' ';
   else if(current.text==='{'&&blocks.test(current.node.parent?.name??''))replacement=' ';
   else if(current.text==='('&&/^(?:if|elseif|while|for|foreach|switch|catch|declare)$/.test(previous.text))replacement=' ';
   else if(previous.text===','||forSeparator)replacement=' ';
   else if([current,previous].some(token=>/Op$/.test(token.node.name)&&/^(?:Assignment|Binary)Expression$/.test(token.node.parent?.name??'')))replacement=' ';
   else if(gap.includes('\n'))replacement=newline(/\n\s*\n/.test(gap));
   if(replacement!==undefined)edits.push({from:previous.to,to:current.from,text:replacement});
  }
  formatted=apply(code,edits);
 }
 return formatHtml(formatted,language);
}

function formatHtml(code:string,language:string):string{
 let masked=code;
 if(language==='PHP'){
  if(!code.includes('<?')&&!/^\s*</.test(code))return code;
  const phpTree=php().language.parser.parse(code),parts:string[]=[];let position=0;
  phpTree.iterate({enter(node){if(node.name==='Text'){
   parts.push(code.slice(position,node.from).replace(/[^\r\n]/g,' '),code.slice(node.from,node.to));position=node.to;return false;
  }return;}});
  parts.push(code.slice(position).replace(/[^\r\n]/g,' '));masked=parts.join('');
 }
 const tree=html().language.parser.parse(masked),edits:Edit[]=[],lineStarts=new Set<number>();
 const breakBefore=(position:number,depth:number)=>{
  if(lineStarts.has(position))return;lineStarts.add(position);
  let start=position;while(start>0&&/\s/.test(code[start-1]))start--;
  edits.push({from:start,to:position,text:(start?'\n':'')+'    '.repeat(depth)});
 };
 tree.iterate({enter(node){
  if(/^(?:Script|Style)Text$/.test(node.name))return false;
  if(!/^(?:OpenTag|CloseTag|SelfClosingTag)$/.test(node.name))return;
  for(let parent=node.node.parent;parent;parent=parent.parent){const open=parent.getChild('OpenTag'),tag=open?.getChild('TagName');if(tag&&/^(?:pre|textarea|script|style)$/i.test(masked.slice(tag.from,tag.to)))return false;}
  const tag=node.node.getChild('TagName');if(!tag)return false;
  const name=masked.slice(tag.from,tag.to).toLowerCase(),element=node.node.parent;
  let depth=-1;for(let parent=element;parent;parent=parent.parent)if(parent.name==='Element')depth++;
  const children=element?.getChildren('Element')??[];
  if(node.name==='CloseTag'){
   if(children.length)breakBefore(node.from,Math.max(0,depth));
  }else if(/^(?:html|head|body|form|div|section|article|main|header|footer|nav|p|h[1-6]|table|thead|tbody|tr|td|th|ul|ol|li|select|option|label|input|button|textarea)$/.test(name)){
   breakBefore(node.from,Math.max(0,depth));
  }
  return false;
 }});
 return apply(code,edits);
}
