import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const baseline=JSON.parse(readFileSync('tools/academic-assets-baseline.json','utf8'));
for(const asset of baseline){const bytes=readFileSync(asset.path);if(bytes.length!==asset.bytes||createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw Error('Recurso académico original alterado: '+asset.path);}
console.log(`Recursos originales conservados byte a byte: ${baseline.length} imágenes, iconos, PDF y archivos ZIP.`);
