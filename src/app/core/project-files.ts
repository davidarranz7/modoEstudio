import type { ProjectWork } from './project-storage.service';
import { projectPathConflict, safeProjectPath } from './project-storage.service';

export interface ProjectTreeNode {path:string;name:string;kind:'file'|'folder';children:ProjectTreeNode[];}
export function buildProjectTree(files:Record<string,string>,folders:string[]=[]):ProjectTreeNode[]{
 const roots:ProjectTreeNode[]=[];const nodes=new Map<string,ProjectTreeNode>();
 const ensureFolder=(path:string):ProjectTreeNode=>{const known=nodes.get(path);if(known)return known;const parts=path.split('/');const node:ProjectTreeNode={path,name:parts.at(-1)!,kind:'folder',children:[]};nodes.set(path,node);if(parts.length>1)ensureFolder(parts.slice(0,-1).join('/')).children.push(node);else roots.push(node);return node;};
 for(const folder of folders)if(safeProjectPath(folder))ensureFolder(folder);
 for(const path of Object.keys(files)){if(!safeProjectPath(path))continue;const parts=path.split('/');const node:ProjectTreeNode={path,name:parts.at(-1)!,kind:'file',children:[]};nodes.set(path,node);if(parts.length>1)ensureFolder(parts.slice(0,-1).join('/')).children.push(node);else roots.push(node);}
 const sort=(items:ProjectTreeNode[]):void=>{items.sort((a,b)=>(a.kind===b.kind?0:a.kind==='folder'?-1:1)||a.name.localeCompare(b.name,'es',{numeric:true}));items.forEach(item=>sort(item.children));};sort(roots);return roots;
}
export function renameProjectPath(work:ProjectWork,from:string,to:string,isFolder=false):ProjectWork{
 if(!safeProjectPath(to)||!safeProjectPath(from)||from===to)throw Error('La nueva ruta no es válida.');
 if(isFolder&&(to.startsWith(from+'/')||!safeProjectPath(to+'/.estudio-folder.txt')))throw Error('No se puede mover una carpeta dentro de sí misma.');
 if(!isFolder&&! /\.(php|html|css|json|txt)$/i.test(to))throw Error('Utiliza una extensión PHP, HTML, CSS, JSON o TXT.');
 const paths=new Set<string>();const visit=(nodes:ProjectTreeNode[])=>{for(const node of nodes){paths.add(node.path);visit(node.children);}};visit(buildProjectTree(work.files,work.folders));
 if(!paths.has(from))throw Error('La ruta original ya no existe.');if(paths.has(to))throw Error('La ruta de destino ya existe.');
 const affected=(path:string)=>path===from||(isFolder&&path.startsWith(from+'/'));const renamed=(path:string)=>affected(path)?to+path.slice(from.length):path;
 const files=Object.fromEntries(Object.entries(work.files).map(([path,code])=>[renamed(path),code]));const folders=[...new Set(work.folders.map(renamed))];
 if(Object.keys(files).some(path=>!safeProjectPath(path))||folders.some(path=>!safeProjectPath(path+'/.estudio-folder.txt')))throw Error('La nueva ruta supera el límite permitido.');
 if(projectPathConflict(files,folders)||Object.keys(files).length!==Object.keys(work.files).length)throw Error('La ruta entra en conflicto con otro archivo o carpeta.');
 const editorState=work.editorState?Object.fromEntries(Object.entries(work.editorState).map(([path,state])=>[renamed(path),{...state,file:renamed(path)}])):undefined;
 return {...work,files,folders,activeFile:renamed(work.activeFile),tabs:[...new Set(work.tabs.map(renamed))],...(editorState?{editorState}:{})};
}
export function deleteProjectPath(work:ProjectWork,path:string,isFolder=false):ProjectWork{
 if(!safeProjectPath(path))throw Error('La ruta no es válida.');const affected=(candidate:string)=>candidate===path||(isFolder&&candidate.startsWith(path+'/'));
 const files=Object.fromEntries(Object.entries(work.files).filter(([name])=>!affected(name)));const tabs=work.tabs.filter(name=>!affected(name));
 return {...work,files,folders:work.folders.filter(name=>!affected(name)),tabs,activeFile:affected(work.activeFile)?tabs[0]??Object.keys(files)[0]??'':work.activeFile,...(work.editorState?{editorState:Object.fromEntries(Object.entries(work.editorState).filter(([name])=>!affected(name)))}:{})};
}
