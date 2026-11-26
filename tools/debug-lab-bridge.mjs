import {createServer} from 'node:http';
import {chromium,webkit} from '../.runtime-test-deps/node_modules/playwright/index.mjs';
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Bridge reproduction</title><div id="root"></div>');});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await (process.argv.includes('--webkit')?webkit:chromium).launch({headless:true,...(!process.argv.includes('--webkit')?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{})});
try {
 const page=await browser.newPage();page.on('console',msg=>console.log(msg.type(),msg.text()));page.on('pageerror',e=>console.log('pageerror',e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 for(const sandbox of ['allow-scripts','allow-scripts allow-forms']) {
  await page.evaluate(sandbox=>{document.querySelector('#root').innerHTML='';const frame=document.createElement('iframe');frame.sandbox=sandbox;frame.srcdoc=`<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-fixedtest'; form-action 'none'"><script nonce="fixedtest">document.addEventListener('submit',function(e){e.preventDefault();console.log('BRIDGE_SUBMIT_FIRED');parent.postMessage('submitted','*')});</script><form method="post" action="https://estudio-lab.invalid/procesar.php"><input name="nombre" value="Ana"><button>Reservar</button></form>`;document.querySelector('#root').appendChild(frame);},sandbox);
  await page.frameLocator('iframe').getByRole('button',{name:'Reservar'}).click();
  await page.waitForTimeout(300);
  console.log('Sandbox tested:',sandbox);
 }
} finally {await browser.close();await new Promise(r=>server.close(r));}
