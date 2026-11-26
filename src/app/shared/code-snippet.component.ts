import {ChangeDetectionStrategy,Component,Input,OnChanges,OnDestroy,signal} from '@angular/core';
import type {SnippetLine} from '../core/code-snippet-highlight';

@Component({selector:'app-code-snippet',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`
<section class="code-snippet" [attr.aria-label]="label+', solo lectura'">
 <div class="snippet-header"><strong><span aria-hidden="true">{{'{}'}}</span> {{language}}</strong><span>{{label}}</span></div>
 <div class="snippet-source" tabindex="0" role="region" [attr.aria-label]="'Fragmento '+language+' de solo lectura'" [attr.aria-busy]="loading()">
  @for(line of lines();track line.number){<div class="snippet-line"><code class="snippet-text">@for(token of line.tokens;track $index){<span [class]="token.kind">{{token.text}}</span>}</code></div>}
 </div>
 @if(hint){<div class="snippet-hint">{{hint}}</div>}
</section>`,styles:[`
:host{display:block;min-width:0;margin:15px 0}.code-snippet{overflow:hidden;border:1px solid #393939;border-radius:16px;background:#272727;color:#ededed;text-align:left}
.snippet-header{min-height:42px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 16px;color:#f5f5f5}.snippet-header strong{display:flex;gap:9px;align-items:center;font:600 12px 'JetBrains Mono',monospace}.snippet-header>span{font:10px 'DM Sans',sans-serif;color:#b7b7b7;text-align:right}
.snippet-source{overflow-x:auto;padding:7px 16px 15px;tab-size:4}.snippet-source:focus-visible{outline:2px solid #87aef8;outline-offset:-2px}.snippet-line{min-height:24px;font:14px/24px 'JetBrains Mono',monospace}.snippet-text{display:block;white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;color:#ededed}
.snippet-keyword{color:#e8a0bf}.snippet-string{color:#8fcb8b}.snippet-comment{color:#a0a0a0}.snippet-number{color:#e3b091}.snippet-variable{color:#c4a0e8}.snippet-function{color:#dfdfaa}.snippet-tag{color:#e8a0bf}.snippet-php{color:#78b6e9}
.snippet-hint{padding:0 16px 12px;color:#b7b7b7;font:10px/1.5 'DM Sans',sans-serif}
`]})
export class CodeSnippetComponent implements OnChanges,OnDestroy {
 @Input() code='';@Input() language='PHP';@Input() label='Interpretar código';
 @Input() hint='Lee el código y razona su resultado sin ejecutarlo.';
 readonly lines=signal<SnippetLine[]>([]);readonly loading=signal(false);private version=0;
 async ngOnChanges():Promise<void>{
  const version=++this.version;this.lines.set(this.code.split('\n').map((text,index)=>({number:index+1,tokens:[{text,kind:''}]})));this.loading.set(true);
  try{const {highlightSnippet}=await import('../core/code-snippet-highlight');if(version===this.version)this.lines.set(highlightSnippet(this.code,this.language));}
  catch{/* Keep the original read-only source visible if the optional highlighting chunk is unavailable. */}
  finally{if(version===this.version)this.loading.set(false);}
 }
 ngOnDestroy():void{this.version++;}
}
