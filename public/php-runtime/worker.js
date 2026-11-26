import { PHP, PHPRequestHandler, loadPHPRuntime, setPhpIniEntries } from './php-api.js';
import * as loader from './php-loader.js';

const root='/www', host='estudio-lab.invalid', origin='https://'+host;
const MAX_OUTPUT=65536, MAX_RESOURCE=2097152, MAX_PROJECT=8388608, MAX_SNAPSHOT=8388608;
let php,server,initialization,stdinBytes=new Uint8Array(),stdinOffset=0,cookies=[],previousFiles=new Set();
const disabled=['exec','passthru','shell_exec','system','proc_open','popen','pcntl_exec','dl','putenv','mail','curl_exec','curl_multi_exec','fsockopen','pfsockopen','stream_socket_client','stream_socket_server','socket_create','js_eval','js_eval_async','post_message_to_js'];
const diagnosticPath='/tmp/.estudio-diagnostics.jsonl',errorPath='/tmp/.estudio-errors.log';
const bootstrap=`<?php
if(!defined('STDIN'))define('STDIN',fopen('php://stdin','r'));
if(!defined('STDOUT'))define('STDOUT',fopen('php://output','w'));
if(!defined('STDERR'))define('STDERR',fopen('php://stderr','w'));
(static function(){
 $write=static function(int $type,string $message,string $file,int $line):void { file_put_contents('/tmp/.estudio-diagnostics.jsonl',json_encode(['type'=>$type,'message'=>$message,'file'=>$file,'line'=>$line],JSON_INVALID_UTF8_SUBSTITUTE)."\\n",FILE_APPEND); };
 set_error_handler(static function($type,$message,$file,$line)use($write){if(error_reporting()&$type)$write($type,$message,$file,$line);return true;});
 register_shutdown_function(static function()use($write){$last=error_get_last();if($last&&in_array($last['type'],[E_ERROR,E_PARSE,E_CORE_ERROR,E_COMPILE_ERROR,E_USER_ERROR],true))$write($last['type'],$last['message'],$last['file'],$last['line']);});
 $bytes=0;ob_start(static function($chunk)use(&$bytes){$bytes+=strlen($chunk);if($bytes>65536)throw new RuntimeException('Límite de salida: 64 KiB');return $chunk;},4096);
})();
`;

async function initialize(){
 if(php)return;
 const id=await loadPHPRuntime(loader,{stdin:()=>stdinOffset<stdinBytes.length?stdinBytes[stdinOffset++]:null,locateFile:()=>new URL('./php_8_2.wasm',import.meta.url).href});
 php=new PHP(id);php.mkdirTree(root);php.mkdirTree('/tmp/sessions');
 php.writeFile('/tmp/.estudio-bootstrap.php',bootstrap);
 await setPhpIniEntries(php,{auto_prepend_file:'/tmp/.estudio-bootstrap.php',memory_limit:'64M',max_execution_time:'3',max_input_time:'3',display_errors:'0',log_errors:'1',error_log:errorPath,html_errors:'0',allow_url_fopen:'0',allow_url_include:'0',open_basedir:'/www:/tmp',disable_functions:disabled.join(','),'session.save_path':'/tmp/sessions','session.use_strict_mode':'1','session.cookie_httponly':'1','session.cookie_samesite':'Lax',upload_tmp_dir:'/tmp',upload_max_filesize:'1M',post_max_size:'2M','opcache.enable':'0','opcache.enable_cli':'0'});
 server=new PHPRequestHandler({php,documentRoot:root,absoluteUrl:origin,cookieStore:false});
}
async function ready(){
 if(!initialization)initialization=initialize().catch(error=>{initialization=undefined;php=undefined;server=undefined;throw Object.assign(error,{kind:'load'});});
 await initialization;
}
function safePath(name){
 if(typeof name!=='string'||!name||name.length>160||!/^[\w.-]+(?:\/[\w.-]+)*\.(?:php|html|css|json|txt)$/i.test(name)||name.split('/').some(x=>x==='..'||x==='.'))throw Error('Ruta de archivo no válida: '+name);
 return root+'/'+name;
}
function safeFolder(name){
 if(typeof name!=='string'||!name||name.length>140||!/^[\w.-]+(?:\/[\w.-]+)*$/.test(name)||name.split('/').some(x=>x==='.'||x==='..'))throw Error('Ruta de carpeta no válida.');
 return root+'/'+name;
}
function validateFiles(files){
 if(!files||typeof files!=='object'||Array.isArray(files)||Object.keys(files).length>80)throw Error('Proyecto inválido: máximo 80 archivos por actualización.');
 let size=0;for(const [path,content]of Object.entries(files)){safePath(path);if(typeof content!=='string'||(size+=new TextEncoder().encode(content).byteLength)>MAX_PROJECT)throw Error('El proyecto supera 8 MiB de texto.');}
 const names=new Set(Object.keys(files));for(const path of names){const parts=path.split('/');for(let i=1;i<parts.length;i++)if(names.has(parts.slice(0,i).join('/')))throw Error('La misma ruta se utiliza como archivo y carpeta.');}
}
function removePath(path){if(php.isSymlink(path))php.unlink(path);else if(php.isDir(path))php.rmdir(path,{recursive:true});else if(php.fileExists(path))php.unlink(path);}
function writeFiles(files){for(const [name,content]of Object.entries(files)){const path=safePath(name);php.mkdirTree(path.slice(0,path.lastIndexOf('/')));php.writeFile(path,content);}}
async function open(files){
 validateFiles(files);
 removePath(root);if(php.isSymlink('/tmp'))php.unlink('/tmp');php.mkdirTree('/tmp');
 for(const name of php.listFiles('/tmp'))removePath('/tmp/'+name);
 php.mkdirTree(root);php.mkdirTree('/tmp/sessions');php.writeFile('/tmp/.estudio-bootstrap.php',bootstrap);
 writeFiles(files);php.chdir(root);cookies=[];previousFiles=new Set(Object.keys(files));return true;
}
async function updateFiles(files,deleted=[],folders=[],deletedFolders=[]){
 validateFiles(files);if(!Array.isArray(deleted)||!Array.isArray(folders)||!Array.isArray(deletedFolders))throw Error('Actualización de archivos no válida.');
 for(const name of deleted)safePath(name);for(const folder of [...folders,...deletedFolders])safeFolder(folder);
 // Only explicit editor operations remove files. Cookie and session state is untouched.
 for(const name of deleted){removePath(safePath(name));previousFiles.delete(name);}
 for(const folder of deletedFolders){removePath(safeFolder(folder));for(const name of previousFiles)if(name.startsWith(folder+'/'))previousFiles.delete(name);}
 for(const folder of folders)php.mkdirTree(safeFolder(folder));
 writeFiles(files);for(const name of Object.keys(files))previousFiles.add(name);return true;
}
function snapshot(){
 const files={},inventory=[];let bytes=0,complete=true;
 const visit=(folder,prefix='')=>{
  if(!php.isDir(folder))return;
  for(const name of php.listFiles(folder)){
   if(inventory.length>=1200){complete=false;return;}
   const path=folder+'/'+name,relative=prefix+name;
   if(php.isSymlink(path)){inventory.push({path:relative,size:0,kind:'symlink',contentIncluded:false,reason:'Enlace simbólico no exportado.'});continue;}
   if(php.isDir(path)){inventory.push({path:relative,size:0,kind:'directory',contentIncluded:false});visit(path,relative+'/');continue;}
   const data=php.readFileAsBuffer(path),entry={path:relative,size:data.byteLength,kind:'file',contentIncluded:false};
   if(bytes+data.byteLength<=MAX_SNAPSHOT&&/\.(php|html|css|json|txt)$/i.test(relative)){
    try{files[relative]=new TextDecoder('utf-8',{fatal:true}).decode(data);entry.contentIncluded=true;bytes+=data.byteLength;}catch{entry.reason='Archivo binario; permanece en el entorno de ejecución.';}
   }else entry.reason='Contenido no transferido por tamaño o tipo; el archivo sigue existiendo.';
   inventory.push(entry);
  }
 };
 visit(root);
 const present=new Set(inventory.filter(x=>x.kind!=='directory').map(x=>x.path));
 const deletedFiles=complete?[...previousFiles].filter(path=>!present.has(path)):[];
 if(complete)previousFiles=present;
 return{files,inventory,deletedFiles,fileSnapshotComplete:complete};
}
function rawSession(){const result={};if(php.isDir('/tmp/sessions'))for(const name of php.listFiles('/tmp/sessions')){const path='/tmp/sessions/'+name;if(!php.isSymlink(path)&&!php.isDir(path)&&php.readFileAsBuffer(path).byteLength<=262144)result[name]=php.readFileAsText(path);}return result;}
function defaultCookiePath(url){const path=new URL(url).pathname,index=path.lastIndexOf('/');return index<=0?'/':path.slice(0,index);}
function rememberCookies(headers,url){
 const parsed=new URL(url);
 for(const line of headers['set-cookie']??[]){
  const parts=line.split(';').map(value=>value.trim()),pos=parts[0].indexOf('=');if(pos<1)continue;
  const name=parts[0].slice(0,pos),value=parts[0].slice(pos+1);let path=defaultCookiePath(url),expires=Infinity,maxAge,domain=parsed.hostname,secure=false,valid=true;
  for(const attr of parts.slice(1)){const [key,...rest]=attr.split('='),value=rest.join('=');switch(key.toLowerCase()){
   case'path':if(value.startsWith('/'))path=value;break;
   case'domain':domain=value.toLowerCase().replace(/^\./,'');if(domain!==parsed.hostname)valid=false;break;
   case'secure':secure=true;break;
   case'expires':{const time=Date.parse(value);if(Number.isFinite(time))expires=time;break;}
   case'max-age':if(/^-?\d+$/.test(value))maxAge=Date.now()+Number(value)*1000;break;
  }}
  if(!valid||(secure&&parsed.protocol!=='https:'))continue;
  if(maxAge!==undefined)expires=maxAge;
  cookies=cookies.filter(cookie=>!(cookie.name===name&&cookie.path===path&&cookie.domain===domain));
  if(expires>Date.now())cookies.push({name,value,path,expires,domain,secure});
 }
}
function cookieHeader(url){const parsed=new URL(url),path=parsed.pathname;cookies=cookies.filter(c=>c.expires>Date.now());return cookies.filter(c=>c.domain===parsed.hostname&&(!c.secure||parsed.protocol==='https:')&&(path===c.path||path.startsWith(c.path.endsWith('/')?c.path:c.path+'/'))).sort((a,b)=>b.path.length-a.path.length).map(c=>c.name+'='+c.value).join('; ');}
function cookieValues(){return Object.fromEntries(cookies.filter(c=>c.expires>Date.now()).map(c=>{let value=c.value;try{value=decodeURIComponent(value);}catch{}return[c.name,value];}));}
function beginRequest(stdin=''){
 php.mkdirTree('/tmp');php.mkdirTree('/tmp/sessions');
 // Restore trusted instrumentation even if an earlier request modified its temporary copy.
 removePath('/tmp/.estudio-bootstrap.php');php.writeFile('/tmp/.estudio-bootstrap.php',bootstrap);
 for(const path of[diagnosticPath,errorPath]){removePath(path);php.writeFile(path,'');}
 stdinBytes=new TextEncoder().encode(stdin);stdinOffset=0;
}
function diagnostic(type,message,file,line){
 const detail=message;message=message.split('\n')[0].replace(/\s+in\s+\/[^\r\n]+:\d+\s*$/,'');
 const kind=type===4?'syntax':[1,16,64,256,4096].includes(type)?'runtime':[2,32,128,512].includes(type)?'warning':'notice';
 const severity=['syntax','runtime'].includes(kind)?'error':kind==='warning'?'warning':'notice';
 const explanation=kind==='syntax'?'PHP no puede interpretar esta sintaxis. Revisa los delimitadores y la línea anterior.':kind==='runtime'?'La ejecución se ha interrumpido. Revisa el mensaje original y los datos utilizados.':kind==='warning'?'PHP ha detectado un problema aunque puede haber continuado. Revisa el dato o recurso indicado.':'Aviso de PHP: revisa la variable o el uso señalado.';
 return{severity,kind,message,explanation,...(detail!==message?{detail}:{}),...(file?{file:file.startsWith(root+'/')?file.slice(root.length+1):file}:{}),...(line?{line:Number(line)}:{})};
}
function collectDiagnostics(response){
 const result=[];
 if(php.fileExists(diagnosticPath))for(const line of php.readFileAsText(diagnosticPath).split('\n')){if(!line.trim())continue;try{const entry=JSON.parse(line);result.push(diagnostic(entry.type,entry.message,entry.file,entry.line));}catch{}}
 const log=(php.fileExists(errorPath)?php.readFileAsText(errorPath):'')+'\n'+(response.errors??'');
 for(const line of log.split('\n')){const found=line.match(/(?:PHP\s+)?(Parse error|Fatal error|Warning|Notice|Deprecated):\s*([\s\S]*?)\s+in\s+(.+?)(?:\s+on\s+line\s+|:)(\d+)\s*$/i);if(found){const type=/parse/i.test(found[1])?4:/fatal/i.test(found[1])?1:/warning/i.test(found[1])?2:8;result.push(diagnostic(type,found[2],found[3],found[4]));}}
 const unique=[...new Map(result.map(item=>[item.kind+'|'+item.message+'|'+item.file+'|'+item.line,item])).values()];
 if(response.exitCode!==0&&!unique.some(item=>item.severity==='error'))unique.push(diagnostic(1,response.errors||'PHP terminó con código '+response.exitCode+'.'));
 return unique;
}
function normalizeHeaders(headers){return Object.fromEntries(Object.entries(headers).map(([key,value])=>[key.toLowerCase(),value]));}
async function encodeBody(body,headers){
 if(body&&typeof body==='object'&&!ArrayBuffer.isView(body)){
  const hasFiles=Object.values(body).flat().some(value=>typeof File!=='undefined'&&value instanceof File);
  if(hasFiles){
   const boundary='----EstudioLab'+crypto.randomUUID().replaceAll('-',''),chunks=[],encode=value=>new TextEncoder().encode(value),quoted=value=>String(value).replace(/[\r\n"\\]/g,'_');
   for(const[name,values]of Object.entries(body))for(const value of Array.isArray(values)?values:[values]){
    if(typeof File!=='undefined'&&value instanceof File){chunks.push(encode('--'+boundary+'\r\nContent-Disposition: form-data; name="'+quoted(name)+'"; filename="'+quoted(value.name)+'"\r\nContent-Type: '+(value.type||'application/octet-stream')+'\r\n\r\n'));chunks.push(new Uint8Array(await value.arrayBuffer()));chunks.push(encode('\r\n'));}
    else chunks.push(encode('--'+boundary+'\r\nContent-Disposition: form-data; name="'+quoted(name)+'"\r\n\r\n'+String(value)+'\r\n'));
   }
   chunks.push(encode('--'+boundary+'--\r\n'));const size=chunks.reduce((sum,chunk)=>sum+chunk.length,0);if(size>MAX_RESOURCE)throw Error('El envío supera 2 MiB.');
   body=new Uint8Array(size);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}headers['content-type']='multipart/form-data; boundary='+boundary;
  }else{const params=new URLSearchParams();for(const[name,values]of Object.entries(body))for(const value of Array.isArray(values)?values:[values])params.append(name,String(value));body=params.toString();headers['content-type']='application/x-www-form-urlencoded';}
 }
 if(typeof body==='string')body=new TextEncoder().encode(body);
 if(body){if(body.byteLength>MAX_RESOURCE)throw Error('El envío supera 2 MiB.');headers['content-length']=String(body.byteLength);}return body;
}
function responseData(response,started,headers={},resource=false){
 const normalized=normalizeHeaders(response.headers),limit=resource?MAX_RESOURCE:MAX_OUTPUT,bytes=response.bytes.slice(0,limit),text=new TextDecoder().decode(bytes),diagnostics=collectDiagnostics(response);
 const truncated=response.bytes.byteLength>limit;if(truncated)diagnostics.push(diagnostic(1,'La salida supera el límite de '+limit+' bytes.'));
 return{body:text,stdout:text,stderr:response.errors.slice(0,MAX_OUTPUT),status:response.httpStatusCode,headers:normalized,requestHeaders:headers,cookies:cookieValues(),session:rawSession(),...snapshot(),bytes,diagnostics,exitCode:response.exitCode,elapsedMs:Math.round(performance.now()-started),truncated};
}
async function request(input){
 const started=performance.now(),url=new URL(input.url||'/index.php',origin);if(url.origin!==origin)throw Error('El laboratorio solo permite direcciones de su proyecto.');
 const headers=Object.fromEntries(Object.entries(input.headers??{}).map(([name,value])=>[name.toLowerCase(),String(value)]));headers.host=host;const cookie=cookieHeader(url.href);if(cookie)headers.cookie=cookie;
 const body=await encodeBody(input.body,headers);beginRequest(input.stdin??'');let response;
 try{response=await server.request({url:url.href,method:input.method??'GET',body,headers});}catch(error){if(error.response)response=error.response;else throw error;}
 rememberCookies(normalizeHeaders(response.headers),url.href);return responseData(response,started,headers,input.resource===true);
}
const phpLiteral=value=>"json_decode('"+JSON.stringify(value).replaceAll('\\','\\\\').replaceAll("'","\\'")+"',true,512,JSON_THROW_ON_ERROR)";
async function checkFunctions(input){
 validateFiles(input.files);safePath(input.entry);if(!Array.isArray(input.tests)||input.tests.length>64)throw Error('Casos de prueba no válidos.');
 const key=crypto.randomUUID()+crypto.randomUUID(),cryptoKey=await crypto.subtle.importKey('raw',new TextEncoder().encode(key),{name:'HMAC',hash:'SHA-256'},false,['verify']);const results=[];
 for(const test of input.tests){
  if(!/^[a-zA-Z_]\w*$/.test(test.functionName)||!Array.isArray(test.args))throw Error('Función o argumentos no válidos.');
  await open(input.files);beginRequest(input.stdin??'');const resultPath='/tmp/.estudio-result-'+crypto.randomUUID()+'.json',started=performance.now();
  // PHP compiles the complete primary script before running its first statement.
  // Remove that source before student code runs: secrets remain in a local closure,
  // not in globals, readable files, stdout or test arguments. Expected values stay in JS.
  const harnessName='estudio-check-'+crypto.randomUUID()+'.php';
  const code=`<?php
unlink(__FILE__);
ob_start();$__estudio_load_error=null;
try{require ${phpLiteral(root+'/'+input.entry)};}catch(Throwable $e){$__estudio_load_error=['type'=>$e instanceof ParseError?4:1,'message'=>$e::class.': '.$e->getMessage(),'file'=>$e->getFile(),'line'=>$e->getLine()];}
$__estudio_initial=ob_get_clean();
(static function($initial,$loadError){
 $path=${phpLiteral(resultPath)};$key=${phpLiteral(key)};$test=${phpLiteral(test)};
 $actual=null;$error=$loadError['message']??null;$errorInfo=$loadError;$printed='';
 if($error===null){ob_start();try{if(!function_exists($test['functionName']))throw new RuntimeException('No existe la función '.$test['functionName']);$actual=call_user_func_array($test['functionName'],$test['args']);}catch(Throwable $e){$error=$e::class.': '.$e->getMessage();$errorInfo=['type'=>$e instanceof ParseError?4:1,'message'=>$error,'file'=>$e->getFile(),'line'=>$e->getLine()];}$printed=ob_get_clean();}
 $value=($test['mode']??'return')==='output'?$printed:$actual;
 try{$payload=json_encode(['actual'=>$value,'actualType'=>get_debug_type($value),'error'=>$error,'errorInfo'=>$errorInfo,'printed'=>$printed,'initialOutput'=>$initial],JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_SUBSTITUTE);file_put_contents($path,json_encode(['payload'=>$payload,'signature'=>hash_hmac('sha256',$payload,$key)],JSON_THROW_ON_ERROR));}catch(Throwable $e){fwrite(STDERR,$e->getMessage());}
})(is_string($__estudio_initial)?$__estudio_initial:'',$__estudio_load_error);
unset($__estudio_initial,$__estudio_load_error);
`;
  php.writeFile(root+'/'+harnessName,code);let response;
  try{response=await server.request({url:origin+'/'+harnessName,method:'GET'});}catch(error){if(error.response)response=error.response;else throw error;}
  const run=responseData(response,started);let value;
  try{
   if(!php.fileExists(resultPath))throw Error('La ejecución terminó antes de completar la prueba (por ejemplo, exit o die).');
   const signed=JSON.parse(php.readFileAsText(resultPath));if(typeof signed.payload!=='string'||typeof signed.signature!=='string'||!/^[a-f0-9]{64}$/.test(signed.signature))throw Error('El resultado de la prueba no es válido.');
   const signature=Uint8Array.from(signed.signature.match(/../g),byte=>parseInt(byte,16));if(!await crypto.subtle.verify('HMAC',cryptoKey,signature,new TextEncoder().encode(signed.payload)))throw Error('El programa modificó el resultado de la prueba.');
   value=JSON.parse(signed.payload);
  }catch(error){value={actual:null,actualType:'unknown',printed:'',initialOutput:run.stdout,error:error.message};}
  const diagnostics=[...run.diagnostics];if(value.errorInfo)diagnostics.push(diagnostic(value.errorInfo.type,value.errorInfo.message,value.errorInfo.file,value.errorInfo.line));delete value.errorInfo;
  // Output outside the capture buffers is still real stdout, never a protocol response.
  if(run.stdout)value.initialOutput=(value.initialOutput??'')+run.stdout;
  results.push({...value,diagnostics,exitCode:run.exitCode,elapsedMs:run.elapsedMs});
 }
 return results;
}
self.onmessage=async({data})=>{
 try{await ready();const result=data.action==='open'?await open(data.files):data.action==='update'?await updateFiles(data.files,data.deletedFiles,data.folders,data.deletedFolders):data.action==='request'?await request(data.request):data.action==='check'?await checkFunctions(data.input):(()=>{throw Error('Operación desconocida');})();self.postMessage({id:data.id,result});}
 catch(error){self.postMessage({id:data.id,error:error instanceof Error?error.message:String(error),kind:error.kind??'runtime'});}
};
