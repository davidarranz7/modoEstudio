import { PHP, PHPRequestHandler, loadPHPRuntime, setPhpIniEntries } from './php-api.js';
import * as loader from './php-loader.js';

// No host files are mounted. Each worker owns one Emscripten filesystem.
const root = '/www';
const MAX_OUTPUT = 65536;
let php, server, stdinBytes = new Uint8Array(), stdinOffset = 0;
let cookies = [];
let initialization;
const disabled = ['exec','passthru','shell_exec','system','proc_open','popen','pcntl_exec','dl','putenv','mail','curl_exec','curl_multi_exec','fsockopen','pfsockopen','stream_socket_client','stream_socket_server','socket_create','js_eval','js_eval_async','post_message_to_js'];
const bootstrap = `<?php
if (!defined('STDIN')) define('STDIN', fopen('php://stdin', 'r'));
if (!defined('STDOUT')) define('STDOUT', fopen('php://output', 'w'));
if (!defined('STDERR')) define('STDERR', fopen('php://stderr', 'w'));
$GLOBALS['__estudio_output_bytes'] = 0;
ob_start(function ($chunk) { $GLOBALS['__estudio_output_bytes'] += strlen($chunk); if ($GLOBALS['__estudio_output_bytes'] > 65536) { throw new RuntimeException('Límite de salida: 64 KiB'); } return $chunk; }, 4096);
`;

async function initialize() {
  if (php) return;
  const id = await loadPHPRuntime(loader, {
    stdin: () => stdinOffset < stdinBytes.length ? stdinBytes[stdinOffset++] : null,
    locateFile: () => new URL('./php_8_2.wasm', import.meta.url).href,
  });
  php = new PHP(id);
  php.mkdirTree(root);
  php.mkdirTree('/tmp/sessions');
  php.writeFile('/tmp/.estudio-bootstrap.php', bootstrap);
  await setPhpIniEntries(php, {
    auto_prepend_file: '/tmp/.estudio-bootstrap.php',
    memory_limit: '64M', max_execution_time: '3', max_input_time: '3',
    display_errors: 'stderr', log_errors: '0', html_errors: '0',
    allow_url_fopen: '0', allow_url_include: '0',
    open_basedir: '/www:/tmp',
    disable_functions: disabled.join(','),
    'session.save_path': '/tmp/sessions', 'session.use_strict_mode': '1',
    'session.cookie_httponly': '1', 'session.cookie_samesite': 'Lax',
    upload_tmp_dir: '/tmp', upload_max_filesize: '1M', post_max_size: '2M',
    'opcache.enable': '0', 'opcache.enable_cli': '0',
  });
  // PHP networking is disabled above; the worker has no network proxy or mounts.
  server = new PHPRequestHandler({php, documentRoot: root, absoluteUrl: 'https://estudio-lab.invalid', cookieStore: false});
}

function safePath(name) {
  if (typeof name !== 'string' || name.length > 160 || !/^[\w.-]+(?:\/[\w.-]+)*\.(?:php|html|css|json|txt)$/i.test(name) || name.split('/').some(x => x === '..' || x === '.')) throw Error('Ruta de archivo no válida: ' + name);
  return root + '/' + name;
}
function listFiles(folder, prefix = '') {
  const files = {};
  for (const name of php.listFiles(folder)) {
    const path = folder + '/' + name;
    // Do not follow student-created aliases into cycles or outside exported files.
    if (php.isSymlink(path)) continue;
    if (php.isDir(path)) Object.assign(files, listFiles(path, prefix + name + '/'));
    else if (php.readFileAsBuffer(path).byteLength <= 262144) files[prefix + name] = php.readFileAsText(path);
  }
  return files;
}
function cookiePath(url) { const p = new URL(url).pathname; return p.slice(0, p.lastIndexOf('/') + 1) || '/'; }
function rememberCookies(headers, url) {
  for (const line of headers['set-cookie'] ?? []) {
    const parts = line.split(';').map(x => x.trim());
    const pos = parts[0].indexOf('='); if (pos < 1) continue;
    const name = parts[0].slice(0, pos), value = parts[0].slice(pos + 1);
    let path = cookiePath(url), expires = Infinity;
    for (const attr of parts.slice(1)) {
      const [key, ...rest] = attr.split('='); const value = rest.join('=');
      if (key.toLowerCase() === 'path') path = value || '/';
      if (key.toLowerCase() === 'expires') expires = Date.parse(value);
      if (key.toLowerCase() === 'max-age') expires = Date.now() + Number(value) * 1000;
    }
    cookies = cookies.filter(c => !(c.name === name && c.path === path));
    if (expires > Date.now()) cookies.push({name, value, path, expires});
  }
}
function cookieHeader(url) {
  const path = new URL(url).pathname;
  cookies = cookies.filter(c => c.expires > Date.now());
  return cookies.filter(c => path === c.path || path.startsWith(c.path.endsWith('/') ? c.path : c.path + '/')).sort((a,b) => b.path.length-a.path.length).map(c => c.name + '=' + c.value).join('; ');
}
function normalizeHeaders(headers) { return Object.fromEntries(Object.entries(headers).map(([key,value]) => [key.toLowerCase(),value])); }
async function open(files) {
  if (!files || typeof files !== 'object' || Array.isArray(files) || Object.keys(files).length > 80) throw Error('Proyecto inválido: máximo 80 archivos.');
  if (php.isSymlink(root)) php.unlink(root); else if (php.isDir(root)) php.rmdir(root, {recursive:true});
  // Student code may write anywhere in /tmp. Clear it completely between projects.
  if (php.isSymlink('/tmp')) php.unlink('/tmp');
  php.mkdirTree('/tmp');
  for (const name of php.listFiles('/tmp')) {
    const path = '/tmp/' + name;
    if (!php.isSymlink(path) && php.isDir(path)) php.rmdir(path, {recursive:true}); else php.unlink(path);
  }
  php.writeFile('/tmp/.estudio-bootstrap.php', bootstrap);
  php.mkdirTree(root); php.mkdirTree('/tmp/sessions'); cookies = [];
  let size = 0;
  for (const [name, content] of Object.entries(files)) {
    if (typeof content !== 'string' || (size += content.length) > 1048576) throw Error('El proyecto supera 1 MiB de texto.');
    const path = safePath(name); php.mkdirTree(path.slice(0,path.lastIndexOf('/'))); php.writeFile(path, content);
  }
  php.chdir(root);
  return true;
}
async function request(input) {
  const started = performance.now();
  const url = new URL(input.url || '/index.php', 'https://estudio-lab.invalid');
  if (url.origin !== 'https://estudio-lab.invalid') throw Error('El laboratorio solo permite direcciones de su proyecto.');
  const headers = Object.fromEntries(Object.entries(input.headers ?? {}).map(([name,value])=>[name.toLowerCase(),String(value)]));
  headers.host = 'estudio-lab.invalid';
  const cookie = cookieHeader(url.href); if (cookie) headers.cookie = cookie;
  let body = input.body;
  if (body && typeof body === 'object' && !ArrayBuffer.isView(body)) {
    if (Object.values(body).some(value => typeof File !== 'undefined' && value instanceof File)) {
      const boundary='----EstudioLab'+crypto.randomUUID().replaceAll('-','');
      const chunks=[]; const encode=value=>new TextEncoder().encode(value);
      const quoted=value=>String(value).replace(/[\r\n"\\]/g,'_');
      for(const [name,values] of Object.entries(body))for(const value of Array.isArray(values)?values:[values]){
        const field=Array.isArray(values)&&!name.endsWith('[]')?name+'[]':name;
        if(typeof File!=='undefined'&&value instanceof File){
          chunks.push(encode('--'+boundary+'\r\nContent-Disposition: form-data; name="'+quoted(field)+'"; filename="'+quoted(value.name)+'"\r\nContent-Type: '+(value.type||'application/octet-stream')+'\r\n\r\n'));
          chunks.push(new Uint8Array(await value.arrayBuffer())); chunks.push(encode('\r\n'));
        }else chunks.push(encode('--'+boundary+'\r\nContent-Disposition: form-data; name="'+quoted(field)+'"\r\n\r\n'+String(value)+'\r\n'));
      }
      chunks.push(encode('--'+boundary+'--\r\n'));
      const size=chunks.reduce((sum,chunk)=>sum+chunk.length,0);if(size>2097152)throw Error('El envío supera 2 MiB.');
      body=new Uint8Array(size);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
      headers['content-type']='multipart/form-data; boundary='+boundary;
    } else {
      const params = new URLSearchParams();
      for (const [name,value] of Object.entries(body)) for (const item of Array.isArray(value) ? value : [value]) params.append(Array.isArray(value) && !name.endsWith('[]') ? name+'[]' : name, String(item));
      body = params.toString(); headers['content-type'] = 'application/x-www-form-urlencoded';
    }
  }
  if (typeof body === 'string') body = new TextEncoder().encode(body);
  if(body)headers['content-length']=String(body.byteLength);
  stdinBytes = new TextEncoder().encode(input.stdin ?? ''); stdinOffset = 0;
  let response;
  try { response = await server.request({url:url.href, method:input.method ?? 'GET', body, headers}); }
  catch (error) { if (error.response) response = error.response; else throw error; }
  const normalized = normalizeHeaders(response.headers);
  rememberCookies(normalized, url.href);
  const text = response.text;
  const session = listFiles('/tmp/sessions');
  const cookieValues = Object.fromEntries(cookies.map(c=>{let value=c.value;try{value=decodeURIComponent(value);}catch{}return[c.name,value];}));
  return {body:text.slice(0,MAX_OUTPUT), stdout:text.slice(0,MAX_OUTPUT), stderr:response.errors.slice(0,MAX_OUTPUT), status:response.httpStatusCode, headers:normalized, requestHeaders:headers, cookies:cookieValues, session, files:listFiles(root), exitCode:response.exitCode, elapsedMs:Math.round(performance.now()-started), truncated:text.length > MAX_OUTPUT};
}
self.onmessage = async ({data}) => {
  try {
    initialization ??= initialize(); await initialization;
    const result = data.action === 'open' ? await open(data.files) : data.action === 'request' ? await request(data.request) : (()=>{throw Error('Operación desconocida');})();
    self.postMessage({id:data.id,result});
  } catch (error) { self.postMessage({id:data.id,error:error instanceof Error ? error.message : String(error)}); }
};
