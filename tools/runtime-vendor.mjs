/** Run after installing aligned @php-wasm/universal and @php-wasm/web-8-2 3.1.66. */
import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
const version='3.1.66',destination='public/php-runtime/';
for(const name of ['universal','web-8-2']){
 const metadata=JSON.parse(await readFile(`node_modules/@php-wasm/${name}/package.json`,'utf8'));
 if(metadata.version!==version)throw Error(`Expected @php-wasm/${name}@${version}`);
}
await mkdir(destination,{recursive:true});
const loader=await readFile('node_modules/@php-wasm/web-8-2/asyncify/php_8_2.js','utf8');
await writeFile(destination+'php-loader.js',loader.replace("new URL('./8_2_35/php_8_2.wasm', import.meta.url)","new URL('./php_8_2.wasm', import.meta.url)"));
await copyFile('node_modules/@php-wasm/web-8-2/asyncify/8_2_35/php_8_2.wasm',destination+'php_8_2.wasm');
await copyFile('node_modules/@php-wasm/web-8-2/LICENSE',destination+'LICENSE-PHP-WASM.txt');
await build({stdin:{contents:'export {PHP,PHPRequestHandler,loadPHPRuntime,setPhpIniEntries} from "@php-wasm/universal";',resolveDir:process.cwd()},outfile:destination+'php-api.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,external:['worker_threads']});
const files=[];
for(const name of ['php-api.js','php-loader.js','php_8_2.wasm']){
 const data=await readFile(destination+name);files.push({path:name,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});
}
await writeFile(destination+'vendor-manifest.json',JSON.stringify({packageVersion:version,phpVersion:'8.2.35',asyncMode:'asyncify',source:'https://github.com/WordPress/wordpress-playground/tree/d8fce746d38e168e6929b1289940339403293679',files},null,2)+'\n');
console.log(files);
