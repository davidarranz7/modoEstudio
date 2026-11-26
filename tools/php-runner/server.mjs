import {createServer} from 'node:http';
import {validatePayload,runInDocker,PHP_IMAGE} from './core.mjs';
const hosts=new Set(['127.0.0.1:8787','localhost:8787','127.0.0.1:4200','localhost:4200']);
const origins=new Set(['http://127.0.0.1:4200','http://localhost:4200','http://127.0.0.1:8787','http://localhost:8787']);
let busy=false;
const server=createServer(async(req,res)=>{
 const send=(status,data)=>{if(res.destroyed)return;res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 if(!hosts.has(req.headers.host??'')||(req.headers.origin&&!origins.has(req.headers.origin))||req.headers['sec-fetch-site']==='cross-site')return send(403,{error:'Ejecutor solo local.'});
 if(req.url==='/api/php/status'&&req.method==='GET')return send(200,{local:true,image:PHP_IMAGE,description:'Servicio local disponible; Docker se comprueba al ejecutar.'});
 if(req.url!=='/api/php/run'||req.method!=='POST')return send(404,{error:'Ruta no disponible.'});
 if(!String(req.headers['content-type']??'').startsWith('application/json'))return send(415,{error:'Se requiere JSON.'});
 if(busy)return send(429,{error:'Ya se está ejecutando un programa.'});
 busy=true;
 try{
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>120000){send(413,{error:'Petición demasiado grande.'});return;}chunks.push(chunk);}
  const payload=validatePayload(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  const result=await runInDocker(payload);send(200,result);
 }catch(e){send(400,{error:e instanceof Error?e.message:'Petición inválida.'});}finally{busy=false;}
});
server.requestTimeout=15000;server.headersTimeout=5000;
server.listen(8787,'127.0.0.1',()=>console.log('ESTUDIO PHP local: http://127.0.0.1:8787 · '+PHP_IMAGE));
