import {Injectable,inject} from '@angular/core';
import {PhpDiagnostic,PhpResponse,PhpRuntimeService} from './php-runtime.service';

export interface PhpPreviewResult {
 html:string;
 diagnostics:PhpDiagnostic[];
 resources:{url:string;status:number;mime:string}[];
}
/** Resolves page resources through the same private virtual HTTP session as PHP. */
@Injectable()
export class PhpPreviewService {
 private readonly runtime=inject(PhpRuntimeService);
 private urls=new Set<string>();private generation=0;
 clear():void{this.generation++;this.urls.clear();}
 async prepare(response:PhpResponse,url:string,bridge:string):Promise<PhpPreviewResult>{
  const generation=++this.generation,created=new Set<string>(),diagnostics:PhpDiagnostic[]=[],resources:PhpPreviewResult['resources']=[],cache=new Map<string,Promise<string|null>>(),resolving=new Set<string>();
  const origin='https://estudio-lab.invalid',pageUrl=new URL(url,origin).href;let count=0,bytes=0;
  const issue=(message:string,file?:string):void=>{diagnostics.push({severity:'warning',kind:'warning',message,explanation:'El recurso no se ha incorporado a la vista previa. Las solicitudes externas están deshabilitadas.',...(file?{file}:{})});};
  // Opaque sandbox frames in Safari cannot reliably read parent-origin Blob URLs.
  // Bounded data URLs retain isolation and work without allow-same-origin.
  const resourceUrl=(data:string|Uint8Array,type:string):string=>{const bytes=typeof data==='string'?new TextEncoder().encode(data):data;let binary='';for(let start=0;start<bytes.length;start+=32768)binary+=String.fromCharCode(...bytes.subarray(start,start+32768));const result='data:'+type+';base64,'+btoa(binary);created.add(result);return result;};
  const absolute=(reference:string,base:string):URL|null=>{
   try{const parsed=new URL(reference,base);if(parsed.origin!==origin){issue('Solo se permiten recursos del proyecto: '+reference);return null;}return parsed;}catch{issue('Ruta de recurso no válida: '+reference);return null;}
  };
  const load=async(reference:string,base:string,css=false,depth=0):Promise<string|null>=>{
   if(/^data:(?:image\/|font\/|application\/(?:font|vnd\.ms-fontobject))/i.test(reference))return reference;
   if(reference.startsWith('#'))return reference;
   const parsed=absolute(reference,base);if(!parsed)return null;
   const key=(css?'css:':'asset:')+parsed.href;
   const existing=cache.get(key);if(existing){if(css&&resolving.has(key)){issue('Importación CSS circular omitida.',parsed.pathname.slice(1));return null;}return existing;}
   if(depth>6||++count>64){issue('Límite de recursos o importaciones CSS alcanzado.',parsed.pathname.slice(1));return null;}
   const promise=(async()=>{
    resolving.add(key);let target=parsed.href,run:PhpResponse|undefined;
    try{
    for(let redirects=0;redirects<6;redirects++){
     if(generation!==this.generation)throw Error('Vista previa cancelada.');
     run=await this.runtime.request({url:target,method:'GET',resource:true});
     const mime=(run.headers['content-type']?.[0]??'application/octet-stream').split(';')[0].trim().toLowerCase();resources.push({url:new URL(target).pathname+new URL(target).search,status:run.status,mime});
     diagnostics.push(...(run.diagnostics??[]));
     const location=run.headers['location']?.[0];if(location&&[301,302,303,307,308].includes(run.status)){const next=absolute(location,target);if(!next)return null;target=next.href;continue;}
     if(run.status>=400||run.exitCode!==0||run.truncated){issue('No se pudo cargar '+new URL(target).pathname+' (HTTP '+run.status+').',new URL(target).pathname.slice(1));return null;}
     const data=run.bytes??new TextEncoder().encode(run.body);bytes+=data.byteLength;if(bytes>4194304){issue('Los recursos de esta página superan 4 MiB.');return null;}
     if(css){
      if(mime!=='text/css'){issue('La hoja de estilos debe responder con Content-Type: text/css.',new URL(target).pathname.slice(1));return null;}
      const content=await rewriteCss(run.body,target,depth+1);return resourceUrl(content,'text/css');
     }
     if(mime.startsWith('image/')||mime.startsWith('font/')||/application\/(?:font|x-font|vnd\.ms-fontobject)/.test(mime))return resourceUrl(new Uint8Array(data),mime.trim());
     const path=new URL(target).pathname;if(/\.(?:woff2?|ttf|otf)$/i.test(path))return resourceUrl(new Uint8Array(data),/\.woff2$/i.test(path)?'font/woff2':/\.woff$/i.test(path)?'font/woff':'font/ttf');
     issue('Tipo de recurso no admitido en la vista previa: '+mime,new URL(target).pathname.slice(1));return null;
    }
    issue('Demasiadas redirecciones al cargar '+parsed.pathname);return null;
    }finally{resolving.delete(key);}
   })();
   cache.set(key,promise);return promise;
  };
  const replaceAsync=async(text:string,pattern:RegExp,replace:(match:RegExpMatchArray)=>Promise<string>):Promise<string>=>{
   let result='',position=0;for(const match of text.matchAll(pattern)){result+=text.slice(position,match.index)+await replace(match);position=match.index!+match[0].length;}return result+text.slice(position);
  };
  const rewriteCss=async(text:string,base:string,depth:number):Promise<string>=>{
   // Keep CSS syntax and media queries; resolve the normal quoted/url() import forms.
   let result=await replaceAsync(text,/@import\s+(?:url\(\s*(['"]?)(.*?)\1\s*\)|(['"])(.*?)\3)\s*([^;]*);/gi,async match=>{
    const target=await load(match[2]??match[4],base,true,depth);return target?'@import url("'+target+'") '+match[5]+';':'';
   });
   result=await replaceAsync(result,/url\(\s*(['"]?)(.*?)\1\s*\)/gi,async match=>{
    const value=match[2];if(created.has(value)||value.startsWith('#')||/^data:/i.test(value))return match[0];const target=await load(value,base,false,depth);return target?'url("'+target+'")':'url("")';
   });return result;
  };
  try{
   const doc=new DOMParser().parseFromString(response.body,'text/html');
   doc.querySelectorAll('script,base,meta[http-equiv],iframe,object,embed').forEach(node=>node.remove());
   for(const link of Array.from(doc.querySelectorAll<HTMLLinkElement>('link'))){
    if(link.rel.toLowerCase()!=='stylesheet'){link.remove();continue;}
    const target=await load(link.getAttribute('href')??'',pageUrl,true);if(target)link.setAttribute('href',target);else link.remove();
   }
   for(const style of Array.from(doc.querySelectorAll('style')))style.textContent=(await rewriteCss(style.textContent??'',pageUrl,0)).replace(/<\/style/gi,'<\\/style');
   for(const element of Array.from(doc.querySelectorAll<HTMLElement>('[style]')))element.setAttribute('style',await rewriteCss(element.getAttribute('style')??'',pageUrl,0));
   for(const image of Array.from(doc.querySelectorAll<HTMLImageElement>('img[src]'))){const target=await load(image.getAttribute('src')??'',pageUrl);if(target)image.setAttribute('src',target);else image.removeAttribute('src');}
   for(const image of Array.from(doc.querySelectorAll<HTMLElement>('[srcset]'))){
    const source=image.getAttribute('srcset')??'';if(source.trim().startsWith('data:'))continue;
    const values:string[]=[];for(const entry of source.split(',')){const [reference,...size]=entry.trim().split(/\s+/);if(!reference)continue;const target=await load(reference,pageUrl);if(target)values.push(target+(size.length?' '+size.join(' '):''));}image.setAttribute('srcset',values.join(', '));
   }
   const nonce=crypto.randomUUID().replaceAll('-','');
   const csp=`default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline' data:; img-src data:; font-src data:; form-action 'none'; base-uri 'none'; connect-src 'none'; frame-src 'none'`;
   const html=`<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="viewport" content="width=device-width,initial-scale=1"><script nonce="${nonce}">${bridge}</script>${doc.head.innerHTML}</head><body>${doc.body.innerHTML}</body></html>`;
   if(generation!==this.generation)throw Error('Vista previa cancelada.');
   this.urls=created;
   return{html,diagnostics,resources};
  }catch(error){created.clear();throw error;}
 }
}
