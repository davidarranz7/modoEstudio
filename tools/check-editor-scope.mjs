import {readFileSync} from 'node:fs';
import {fileContentHash} from './file-integrity.mjs';
const baseline=JSON.parse(readFileSync('tools/editor-scope-baseline.json','utf8'));
for(const [path,expected] of Object.entries(baseline)){
 let content=readFileSync(path);
 // Only the two study view entries were renewed for the authorised mockup integration.
 // Academic data, study services, other sections and original global styles keep their original hashes.
 if(fileContentHash(path,content)!==expected)throw Error('Se ha modificado un archivo fuera del alcance técnico: '+path);
}
console.log(`Alcance conservado: ${Object.keys(baseline).length} archivos protegidos verificados. Las vistas de código autorizadas están fijadas; preguntas, prácticas, soluciones, referencias, estadísticas, selección y estilos globales intactos.`);
