import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const files=readdirSync('src/app/data').filter(n=>n.endsWith('.questions.ts'));
const qs=files.flatMap(name=>{const raw=readFileSync(join('src/app/data',name),'utf8');const match=raw.match(/export const [A-Z0-9_]+: Question\[\] = (\[[\s\S]*\]);\s*$/);if(!match)throw new Error(name);return JSON.parse(match[1]);});
const topics=[
 [1,'Historia, WWW, HTML/URL/HTTP',/ARPANET|WWW|World Wide Web|HTML|DNS|Internet|web|Berners-Lee/i],
 [1,'TCP/IP y protocolos',/TCP|UDP|DNS|SMTP|FTP|SSH|transporte|protocolo|IPv4|IP\b/i],
 [1,'Cliente pesado y ligero',/cliente pesado|cliente ligero|servidor pesado|thin client/i],
 [1,'Web estática y dinámica',/estátic|dinámic|servidor de aplicaciones/i],
 [1,'Tecnologías cliente y servidor',/JavaScript|CSS|PHP|Java|CGI|ASP.NET|Jakarta|JSP|Servlet/i],
 [1,'Servidores web y de aplicaciones',/Apache|Nginx|Tomcat|JBoss|GlassFish|IIS|servidor web/i],
 [1,'GET y POST',/\bGET\b|\bPOST\b|formularios/i],
 [1,'Entorno VS Code/XAMPP/Xdebug',/xampp|intelephense|xdebug|php.ini|Visual Studio Code|htdocs/i],
 [2,'Sintaxis, variables, tipos y constantes',/variable|tipado|\bint\b|\bbool\b|\bconst\b|casting|isset/i],
 [2,'Strings y operadores',/string|cadena|strpos|trim|implode|explode|strlen|operador|ternario|comparación/i],
 [2,'Estructuras de control',/\bif\b|\bfor\b|\bswitch\b|\bwhile\b|break|continue/i],
 [2,'Arrays y foreach',/array|foreach|índice|asociativo|\brange\b/i],
 [2,'Arrays multidimensionales',/matriz|bidimensional|fila|columna|multidimensional/i],
 [2,'Superglobales y formularios',/\$_POST|\$_GET|\$_SERVER|formulario|atributo name/i],
 [2,'Seguridad HTML y formularios',/htmlspecialchars|XSS|SQL Injection|validaci[oó]n/i],
 [2,'Subida de ficheros',/\$_FILES|subir|fichero|archivo|multipart\/form-data|move_uploaded_file/i],
 [2,'Directivas php.ini',/php.ini|ini_get|ini_set|error_reporting|upload_max_filesize/i],
 [2,'Funciones tipadas y PHPDoc',/funci[oó]n|return|PHPDoc|strict_types|@param/i],
 [2,'Include/require y ámbitos',/include|require|global|local|__DIR__|\bámbito\b/i],
 [2,'Actividades evaluables',/Actividad 2|Tarea02|talleres|IBEX|notas|calculadora/i],
 [3,'HTTP sin estado',/sin estado|stateless|HTTP|peticiones/i],
 [3,'Cookies: ciclo, opciones y marco legal',/cookie|setcookie|RGPD|LSSI|SameSite|HttpOnly|secure/i],
 [3,'Sesiones PHP y SID',/\$_SESSION|session_|PHPSESSID|identificador de sesión/i],
 [3,'Contraseñas y autenticación',/password_hash|password_verify|bcrypt|autenticaci[oó]n|hash|credenciales/i],
 [3,'Login JSON, privacidad y logout',/usuarios.json|json_decode|logout|validar.php|login.php|privada.php/i],
 [3,'Autorización y roles',/rol|permiso|autorizaci[oó]n|RBAC|control de acceso/i]
];
const lines=['# Matriz de cobertura ESTUDIO — auditoría automática','',`Banco: **${qs.length} preguntas**. Fecha de generación: ${new Date().toISOString().slice(0,10)}.`, '', '**IMPORTANTE:** esta tabla mide coincidencias de términos en preguntas y soluciones. No certifica que cada apartado del temario esté correctamente cubierto; requiere revisión académica manual.','', '| UD | Área temática | Coincidencias | Ejemplos de IDs |','|---|---|---:|---|'];
for(const [u,name,pattern] of topics){const found=qs.filter(q=>q.unit===u&&pattern.test([q.prompt,q.solution,q.activity,q.section].filter(Boolean).join(' ')));lines.push(`| ${u} | ${name} | ${found.length} | ${found.slice(0,4).map(q=>q.id).join(', ')||'Sin coincidencias'} |`);}
const seen=new Map();const duplicates=[];
for(const q of qs){const norm=q.prompt.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').replace(/[^a-z0-9 ]/g,'').trim();if(seen.has(norm))duplicates.push(`${seen.get(norm)} / ${q.id}`);else seen.set(norm,q.id);}
const incomplete=qs.filter(q=>(q.kind==='develop'||q.kind==='code'&&q.codeTask==='write')&&!q.check?.trim());
const hints=qs.filter(q=>q.hints?.length);
const noSection=qs.filter(q=>!q.section&&!q.activity);
const invalidImages=qs.filter(q=>q.image&&!existsSync(join('public/temario',q.image)));
lines.push('','## Señales para revisión humana','',`- Enunciados repetidos literalmente (normalizados): **${duplicates.length}**${duplicates.length?` (${duplicates.slice(0,15).join('; ')})`:''}.`,`- Ejercicios escritos/de desarrollo sin criterios específicos: **${incomplete.length}**${incomplete.length?` (ejemplos: ${incomplete.slice(0,10).map(q=>q.id).join(', ')})`:''}.`,`- Preguntas con pistas específicas: **${hints.length}**.`,`- Preguntas sin apartado explícito ni actividad: **${noSection.length}**.`,`- Imágenes inexistentes: **${invalidImages.length}**.`, '', '## Evidencias y límites','', '- Se ha verificado la existencia de los archivos de imagen, no la correspondencia semántica de todas las imágenes con sus preguntas.', '- El origen «audio» significa que el contenido está relacionado con indicaciones escuchadas, no que la profesora haya formulado literalmente esa pregunta.', '- La grabación larga no dispone de transcripción íntegra verificada.', '- La actividad 2.2 menciona algoritmos de un PDF externo cuyos enunciados exactos no constan completos en el material recibido.', '- Los programas PHP que dependen de peticiones HTTP, archivos o sesión no pueden validarse solo con salida de consola.', '- La revisión de calidad debe continuar antes de considerar el banco exhaustivo o libre de errores.');
writeFileSync('MATRIZ_COBERTURA.md',lines.join('\n')+'\n');
console.log(`Matriz generada: ${qs.length} preguntas, ${duplicates.length} duplicados exactos, ${noSection.length} sin apartado expreso, ${hints.length} con pistas.`);
