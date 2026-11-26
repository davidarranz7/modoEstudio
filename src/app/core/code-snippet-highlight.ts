import {php} from '@codemirror/lang-php';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {highlightTree,tagHighlighter,tags} from '@lezer/highlight';
import {formatSnippet} from './code-snippet-format';

export interface SnippetToken {text:string;kind:string;}
export interface SnippetLine {number:number;tokens:SnippetToken[];}

const colors=tagHighlighter([
 {tag:tags.keyword,class:'snippet-keyword'},
 {tag:[tags.string,tags.special(tags.string)],class:'snippet-string'},
 {tag:tags.comment,class:'snippet-comment'},
 {tag:tags.number,class:'snippet-number'},
 {tag:[tags.bool,tags.null],class:'snippet-keyword'},
 {tag:tags.variableName,class:'snippet-variable'},
 {tag:tags.function(tags.variableName),class:'snippet-function'},
 {tag:tags.tagName,class:'snippet-tag'},
 {tag:tags.processingInstruction,class:'snippet-php'},
 {tag:[tags.attributeName,tags.propertyName],class:'snippet-variable'}
]);

/** Static syntax colours only: no editor, executable HTML or PHP runtime is created. */
export function highlightSnippet(code:string,language:string):SnippetLine[]{
 code=formatSnippet(code,language);
 const parser=language==='HTML'?html().language.parser:language==='CSS'?css().language.parser:php({plain:!code.includes('<?')&&!/^\s*</.test(code)}).language.parser;
 const lines:SnippetLine[]=[{number:1,tokens:[]}];
 const append=(text:string,kind:string)=>text.split('\n').forEach((part,index)=>{
  if(index)lines.push({number:lines.length+1,tokens:[]});
  if(part)lines[lines.length-1].tokens.push({text:part,kind});
 });
 let position=0;
 highlightTree(parser.parse(code),colors,(from,to,kind)=>{append(code.slice(position,from),'');append(code.slice(from,to),kind);position=to;});
 append(code.slice(position),'');return lines;
}
