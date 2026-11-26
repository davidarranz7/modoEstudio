import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
export async function serveWorkspace(directory='dist/modo-estudio/browser'){
 const root=resolve(directory);
 const server=createServer(async(request,response)=>{try{let path=resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://local').pathname));if(path!==root&&!path.startsWith(root+sep))throw Error('path');if(!extname(path))path=resolve(root,'index.html');response.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.json':'application/json','.woff2':'font/woff2','.pdf':'application/pdf','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json'})[extname(path)]??'text/html');response.end(await readFile(path));}catch{response.writeHead(404);response.end('not found');}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return {url:'http://127.0.0.1:'+server.address().port,close:()=>{server.close();server.closeAllConnections();}};
}
