import type { PhpProject, PhpProjectFile, PhpProjectTest, PhpProjectStep } from '../core/php-project';

const practiceNotice = 'Práctica creada para ESTUDIO a partir de competencias del temario. No es un enunciado ni un examen oficial. La rúbrica es orientativa.';
const safety = 'Escapa los datos del usuario con htmlspecialchars antes de mostrarlos. No uses bases de datos, frameworks ni credenciales reales.';
const file = (path: string, responsibility: string, solution: string, starter = '', explanation = responsibility, role: PhpProjectFile['role'] = 'complete'): PhpProjectFile => ({path, responsibility, solution, starter, explanation, role});
const supplied = (path: string, responsibility: string, code: string, explanation = responsibility): PhpProjectFile => file(path, responsibility, code, code, explanation, 'provided');
const get = (url: string, bodyIncludes: string[] = [], status = 200): PhpProjectStep => ({method:'GET',url,expect:{status,bodyIncludes}});
const post = (url: string, body: Record<string,string|string[]>, bodyIncludes: string[] = [], status = 200): PhpProjectStep => ({method:'POST',url,body,expect:{status,bodyIncludes}});
const test = (id: string, label: string, ...steps: PhpProjectStep[]): PhpProjectTest => ({id,label,steps});
const redirect = (step: PhpProjectStep, location: string): PhpProjectStep => ({...step,expect:{status:302,location}});
function project(value: Omit<PhpProject,'restrictions'|'statement'> & {restrictions?: string[]; statement: string}): PhpProject {
  return {...value, statement: value.statement+'\n\n'+practiceNotice, restrictions:[safety,...(value.restrictions??[])]};
}
const phpForm = (title: string, fields: string, action = 'procesar.php', method = 'post'): string => `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><h1>${title}</h1><form action="${action}" method="${method}">${fields}<button>Enviar</button></form></html>`;
const stub = (task: string): string => `<?php\n// TODO: ${task}\n`;
const basicRubric = [{criterion:'Recuperación y validación de datos',points:3},{criterion:'Lógica PHP y resultados',points:4},{criterion:'Archivos, funciones y presentación segura',points:3}];
const stateRubric = [{criterion:'Persistencia y ciclo de vida del estado',points:4},{criterion:'Validación y navegación HTTP',points:3},{criterion:'Separación de archivos y salida segura',points:3}];
const ref = (unit: 2|3, section: string, activity?: string) => ({unit,section,activity,note:'Relación con el apartado presente en el banco DWCS actual. No se atribuye una página no verificada ni este nuevo enunciado a la profesora.'});

const sportsRates = `<?php\n$tarifas = ['Natación' => 12.0, 'Pádel' => 18.0, 'Yoga' => 10.0];\n`;
const sportsFunctions = `<?php
function calcularImporte(float $precio, int $sesiones): float { return $precio * $sesiones; }
/**
 * Calcula el importe del descuento por número de sesiones.
 * @param float $importe Precio antes del descuento.
 * @param int $sesiones Número de sesiones entre 1 y 10.
 * @return float Importe que se resta, no porcentaje.
 */
function calcularDescuento(float $importe, int $sesiones): float {
    return $importe * ($sesiones >= 8 ? 0.15 : ($sesiones >= 5 ? 0.10 : 0));
}
function calcularTotal(float $importe, float $descuento): float { return $importe - $descuento; }
`;
const sportsIndex = `<?php require_once __DIR__ . '/tarifas.php'; ?>
<!doctype html><html lang="es"><meta charset="utf-8"><title>Reserva deportiva</title><h1>Reserva deportiva</h1>
<form action="procesar.php" method="post"><label>Nombre <input name="nombre" required></label>
<label>Actividad <select name="actividad"><?php foreach ($tarifas as $actividad => $precio): ?>
<option value="<?= htmlspecialchars($actividad) ?>"><?= htmlspecialchars($actividad) ?></option><?php endforeach; ?></select></label>
<label>Sesiones <input name="sesiones" type="number" min="1" max="10" required></label><button>Reservar</button></form></html>`;

export const PHP_PROJECTS: PhpProject[] = [
project({
 id:'ud2-reserva-deportiva',unit:2,title:'Reserva de actividades deportivas',entry:'index.php',
 context:'Un centro deportivo necesita calcular reservas de natación, pádel y yoga con un descuento según el número de sesiones.',
 objective:'Conectar un formulario POST con datos compartidos y funciones tipadas documentadas.',
 statement:'Completa cuatro archivos. Natación cuesta 12 €, Pádel 18 € y Yoga 10 € por sesión. Entre 5 y 7 sesiones aplica un 10 % de descuento; desde 8, un 15 %. Valida todos los campos antes de calcular y acumula los errores. El formulario y la estructura visual están proporcionados; completa las opciones con foreach y el procesamiento PHP.',
 skills:['POST','arrays asociativos','foreach','funciones tipadas','PHPDoc','require_once'],
 requirements:['Nombre no vacío; actividad existente; sesiones enteras entre 1 y 10.','Genera las opciones desde tarifas.php mediante foreach.','Implementa calcularImporte, calcularDescuento y calcularTotal con parámetros y retornos tipados.','Documenta calcularDescuento con PHPDoc.','Usa require_once y __DIR__; muestra base, descuento y total con dos decimales.','No muestres importes si hay errores.'],
 files:[supplied('tarifas.php','Array asociativo de precios.',sportsRates),file('index.php','Formulario y opciones dinámicas.',sportsIndex,phpForm('Reserva deportiva','<label>Nombre <input name="nombre"></label><label>Actividad <select name="actividad"><!-- TODO: foreach --></select></label><label>Sesiones <input name="sesiones" type="number"></label>')),file('funciones.php','Funciones de cálculo y PHPDoc.',sportsFunctions,stub('Crear las tres funciones tipadas; documentar calcularDescuento.')),file('procesar.php','Recuperar, validar y mostrar el resultado.',`<?php
require_once __DIR__ . '/tarifas.php';
require_once __DIR__ . '/funciones.php';
$nombre = is_string($_POST['nombre'] ?? null) ? trim($_POST['nombre']) : '';
$actividad = is_string($_POST['actividad'] ?? null) ? $_POST['actividad'] : '';
$sesiones = filter_var($_POST['sesiones'] ?? null, FILTER_VALIDATE_INT);
$errores = [];
if ($nombre === '') $errores[] = 'El nombre es obligatorio.';
if (!array_key_exists($actividad, $tarifas)) $errores[] = 'Actividad no válida.';
if ($sesiones === false || $sesiones < 1 || $sesiones > 10) $errores[] = 'Las sesiones deben ser un entero entre 1 y 10.';
if ($errores) { foreach ($errores as $error) echo '<p>' . htmlspecialchars($error) . '</p>'; }
else {
    $importe = calcularImporte($tarifas[$actividad], $sesiones);
    $descuento = calcularDescuento($importe, $sesiones);
    echo '<h1>Reserva de ' . htmlspecialchars($nombre) . '</h1>';
    echo '<p>Importe: ' . number_format($importe, 2, '.', '') . '</p>';
    echo '<p>Descuento: ' . number_format($descuento, 2, '.', '') . '</p>';
    echo '<p>Total: ' . number_format(calcularTotal($importe, $descuento), 2, '.', '') . '</p>';
}
`,stub('Incluir datos y funciones; validar todos los campos antes de calcular.'))],
 examples:['Ana / Natación / 2 → Total: 24.00','Leo / Pádel / 5 → Total: 81.00','Luz / Yoga / 8 → Total: 68.00','Sesiones 0, 11, 2.5 o texto → error sin total.'],rubric:basicRubric,
 hints:['Recupera cada campo con un valor por defecto y valida con comparaciones estrictas.','La función de descuento recibe el importe, devuelve euros y debe comprobar primero el umbral 8.','Acumula mensajes en $errores y calcula únicamente en la rama sin errores.'],
 explanation:['index.php incluye las tarifas y las recorre; el valor enviado por POST es la clave del array.','procesar.php trata los datos recibidos como no fiables aunque el HTML tenga min y max.','funciones.php separa el cálculo del transporte HTTP. El descuento no modifica la variable exterior.'],
 references:[ref(2,'1.17. Formularios HTML: GET y POST','Actividad 2.5'),ref(2,'Tarea 02.1 · Inscripción en talleres','Tarea 02.1'),ref(2,'1.23. PHPDoc','Actividad 2.9')],
 staticChecks:[{label:'PHPDoc de una función de descuento',file:'funciones.php',pattern:'/\\*\\*[\\s\\S]*?@param[\\s\\S]*?@return[\\s\\S]*?\\*/\\s*function\\s+calcularDescuento'},{label:'Inclusión de archivos',file:'procesar.php',pattern:'require_once'}],
 tests:[test('form','Formulario y actividades',get('/index.php',['method="post"','Natación','Pádel','Yoga'])),test('swim','Dos sesiones de natación',post('/procesar.php',{nombre:'Ana',actividad:'Natación',sesiones:'2'},['Total: 24.00'])),test('paddle','Cinco sesiones con descuento',post('/procesar.php',{nombre:'Leo',actividad:'Pádel',sesiones:'5'},['Total: 81.00'])),test('yoga','Ocho sesiones con descuento superior',post('/procesar.php',{nombre:'Luz',actividad:'Yoga',sesiones:'8'},['Total: 68.00'])),{...test('invalid','Acumula errores y no calcula',post('/procesar.php',{nombre:'',actividad:'Tenis',sesiones:'2.5'},['nombre','Actividad','sesiones'])),additional:true},test('escaped','Nombre mostrado de forma segura',post('/procesar.php',{nombre:'<b>Ana</b>',actividad:'Yoga',sesiones:'1'},['&lt;b&gt;Ana&lt;/b&gt;']))]
}),
project({
 id:'ud2-catalogo-get',unit:2,title:'Catálogo de prendas con filtros GET',entry:'index.php',
 context:'Una tienda quiere compartir búsquedas mediante la URL sin cambiar su catálogo.',objective:'Filtrar un array bidimensional con parámetros GET opcionales.',
 statement:'El formulario está preparado. Completa el catálogo y filtra por color y texto en el nombre. Un filtro vacío admite cualquier valor. La comparación textual ignora mayúsculas usando strtolower. La URL debe conservar los filtros y los resultados mostrar nombre, color y precio. Una consulta sin coincidencias muestra un mensaje explícito.',
 skills:['GET','arrays bidimensionales','foreach','cadenas','HTML seguro'],requirements:['Usa $_GET; no modifiques los datos del catálogo.','Combina los filtros con AND.','Rechaza colores ajenos a rojo y azul; permite vacío.','Muestra el número de coincidencias y los precios con dos decimales.'],
 files:[supplied('datos.php','Productos del catálogo.',`<?php
$productos = [['nombre'=>'Camiseta','color'=>'rojo','precio'=>12.0],['nombre'=>'Pantalón','color'=>'azul','precio'=>25.0],['nombre'=>'Chaqueta','color'=>'rojo','precio'=>40.0]];
`),file('index.php','Formulario GET y resultados filtrados.',`<?php
require_once __DIR__ . '/datos.php';
$color = is_string($_GET['color'] ?? null) ? $_GET['color'] : '';
$texto = is_string($_GET['texto'] ?? null) ? trim($_GET['texto']) : '';
?>${phpForm('Catálogo','<label>Texto <input name="texto"></label><label>Color <select name="color"><option value="">Todos</option><option>rojo</option><option>azul</option></select></label>','index.php','get')}
<?php
if (!in_array($color, ['', 'rojo', 'azul'], true)) { echo 'Color no válido'; exit; }
$coincidencias = [];
foreach ($productos as $producto) {
    if (($color === '' || $producto['color'] === $color) && ($texto === '' || str_contains(strtolower($producto['nombre']), strtolower($texto)))) $coincidencias[] = $producto;
}
echo '<p>Resultados: '.count($coincidencias).'</p>';
if (!$coincidencias) echo '<p>Sin coincidencias</p>';
foreach ($coincidencias as $producto) echo '<p>'.htmlspecialchars($producto['nombre']).' - '.htmlspecialchars($producto['color']).' - '.number_format($producto['precio'],2,'.','').'</p>';
`,phpForm('Catálogo','<label>Texto <input name="texto"></label><label>Color <select name="color"><option value="">Todos</option><option>rojo</option><option>azul</option></select></label>','index.php','get'))],
 examples:['?color=rojo → Camiseta y Chaqueta.','?color=rojo&texto=cami → solo Camiseta.','?texto=zapato → Sin coincidencias.'],rubric:basicRubric,hints:['Una condición debe admitir el filtro vacío.','No imprimas directamente $_GET; úsalo para comparar con datos conocidos.'],explanation:['El array de filas permite añadir productos sin alterar el filtro.','GET hace que los criterios viajen en la URL; el archivo no guarda ni elimina productos.'],references:[ref(2,'Actividad 2.5 · Ejercicio 1: Búsqueda de prendas y filtro por color','Actividad 2.5'),ref(2,'1.14. Arrays multidimensionales')],
 tests:[test('all','Catálogo sin filtros',get('/index.php',['Resultados: 3','Camiseta','Pantalón','Chaqueta'])),test('red','Filtro rojo',get('/index.php?color=rojo',['Resultados: 2','Camiseta','Chaqueta'])),test('and','Dos filtros combinados',get('/index.php?color=rojo&texto=CAMI',['Resultados: 1','Camiseta'])),test('none','Sin coincidencias',get('/index.php?texto=zapato',['Sin coincidencias'])),test('invalid','Color inválido',get('/index.php?color=verde',['Color no válido']))]
}),
project({
 id:'ud2-menu-alergenos',unit:2,title:'Menú y selección múltiple de alérgenos',entry:'index.php',context:'Un restaurante necesita mostrar los platos compatibles con los alérgenos seleccionados por un cliente.',objective:'Procesar un campo multiple como array y cruzarlo con arrays de ingredientes.',
 statement:'Completa el formulario POST con name="alergenos[]" y selección múltiple. Se excluye un plato cuando contiene al menos uno de los alérgenos elegidos. Sin selección deben mostrarse todos. Solo se admiten gluten, leche y huevo; un dato manipulado se considera inválido.',
 skills:['POST','selección múltiple','arrays','array_intersect'],requirements:['Distingue campo ausente de un valor recibido que no es array.','Valida cada alérgeno contra la lista permitida.','Separa el filtro en platosCompatibles(array $platos, array $alergenos): array.','Muestra todos los nombres compatibles y un mensaje cuando no quede ninguno.'],
 files:[supplied('menu.php','Datos de platos y alérgenos.',`<?php
$platos = ['Ensalada'=>[], 'Tortilla'=>['huevo'], 'Pizza'=>['gluten','leche'], 'Bizcocho'=>['gluten','leche','huevo']];
$permitidos = ['gluten','leche','huevo'];
`),file('funciones.php','Filtrar sin modificar el array original.',`<?php
function platosCompatibles(array $platos, array $alergenos): array {
    $resultado = [];
    foreach ($platos as $nombre => $contiene) if (count(array_intersect($contiene, $alergenos)) === 0) $resultado[] = $nombre;
    return $resultado;
}
`,stub('Implementar platosCompatibles con parámetros y retorno array.')),file('index.php','Formulario proporcionado; completar procesamiento.',`<?php require_once __DIR__ . '/menu.php'; require_once __DIR__ . '/funciones.php'; ?>
${phpForm('Menú compatible','<label>Alérgenos <select name="alergenos[]" multiple><option>gluten</option><option>leche</option><option>huevo</option></select></label>','index.php')}
<?php
$elegidos = $_POST['alergenos'] ?? [];
if (!is_array($elegidos) || array_filter($elegidos, fn($valor) => !is_string($valor) || !in_array($valor, $permitidos, true))) { echo 'Selección no válida'; exit; }
$compatibles=platosCompatibles($platos, $elegidos);
if(!$compatibles) echo 'Sin platos compatibles';
foreach ($compatibles as $nombre) echo '<p class="plato">'.htmlspecialchars($nombre).'</p>';
`,phpForm('Menú compatible','<label>Alérgenos <select multiple><!-- TODO: nombre y opciones --></select></label>','index.php'))],
 examples:['gluten y leche → Ensalada y Tortilla.','huevo → Ensalada y Pizza.','Sin selección → los cuatro platos.'],rubric:basicRubric,hints:['Usa [] en el atributo name para recibir varios valores.','Una intersección vacía significa que el plato es compatible.'],explanation:['El navegador envía varias entradas con el mismo nombre; PHP las agrupa por los corchetes.','La función recibe datos, calcula y devuelve; no depende de $_POST.'],references:[ref(2,'1.18. Selección múltiple en formularios HTML y PHP'),ref(2,'1.12. Funciones para trabajar con arrays','Actividad 2.3')],tests:[test('none','Todos los platos sin selección',post('/index.php',{},['class="plato">Ensalada','class="plato">Tortilla','class="plato">Pizza','class="plato">Bizcocho'])),test('multiple','Dos alérgenos',post('/index.php',{'alergenos[]':['gluten','leche']},['class="plato">Ensalada','class="plato">Tortilla'])),test('scalar','Selección enviada como escalar',post('/index.php',{alergenos:'gluten'},['Selección no válida']))]
}),
project({
 id:'ud2-calificaciones',unit:2,title:'Acta de calificaciones en tabla',entry:'index.php',context:'Una tutoría dispone de notas por estudiante y necesita calcular medias sin alterar las notas de origen.',objective:'Recorrer un array bidimensional, calcular resúmenes y generar una tabla HTML.',
 statement:'Los datos iniciales incluyen tres notas por estudiante. Completa media(array $notas): float y una tabla con estudiante, media y resultado. Se supera con media mayor o igual a 5. Añade un filtro GET estado con todos, aprobados o suspensos. No cambies el array de partida.',
 skills:['arrays bidimensionales','funciones','GET','tablas HTML'],requirements:['Calcula la media con array_sum y count o un bucle equivalente.','Admite un array vacío devolviendo 0.0 en media.','Usa dos decimales al presentar la media.','Rechaza un estado no permitido.'],
 files:[supplied('notas.php','Notas verificables de partida.',`<?php $alumnos = ['Ana'=>[6,8,7], 'Brais'=>[3,4,5], 'Carla'=>[4,5,6]];\n`),file('funciones.php','Función reutilizable para medias.',`<?php
function media(array $notas): float { return count($notas) ? array_sum($notas)/count($notas) : 0.0; }
`,stub('Implementar media(array $notas): float.')),file('index.php','Filtro GET y tabla de resultados.',`<?php
require_once __DIR__ . '/notas.php'; require_once __DIR__ . '/funciones.php';
$estado = $_GET['estado'] ?? 'todos';
if (!is_string($estado) || !in_array($estado,['todos','aprobados','suspensos'],true)) { echo 'Estado no válido'; exit; }
?>${phpForm('Acta','<select name="estado"><option>todos</option><option>aprobados</option><option>suspensos</option></select>','index.php','get')}
<table><tr><th>Estudiante</th><th>Media</th><th>Resultado</th></tr>
<?php foreach ($alumnos as $nombre=>$notas) {
    $m=media($notas); $aprobado=$m>=5;
    if (($estado==='aprobados'&&!$aprobado)||($estado==='suspensos'&&$aprobado)) continue;
    echo '<tr><td>'.htmlspecialchars($nombre).'</td><td>'.number_format($m,2,'.','').'</td><td>'.($aprobado?'Aprobado':'Suspenso').'</td></tr>';
} ?></table>`,phpForm('Acta','<select name="estado"><option>todos</option><option>aprobados</option><option>suspensos</option></select>','index.php','get'))],
 examples:['Ana → 7.00 Aprobado.','Brais → 4.00 Suspenso.','Carla → 5.00 Aprobado, incluye el límite.'],rubric:basicRubric,hints:['Cada valor del array exterior es otro array con notas.','Calcula primero la media y utiliza ese valor para el filtro y el resultado.'],explanation:['La tabla se genera mediante un recorrido del array exterior; media procesa el interior.','La comparación >= incluye correctamente la media exacta 5.'],references:[ref(2,'1.15. Crear y recorrer arrays multidimensionales','Actividad 2.4'),ref(2,'Actividad 2.8 · Ejercicio 2c: Representación de los datos del array','Actividad 2.8')],tests:[test('all','Tabla completa',get('/index.php',['Ana','7.00','Brais','4.00','Carla','5.00'])),test('failed','Solo suspensos',get('/index.php?estado=suspensos',['<td>Brais</td>','4.00','Suspenso'])),test('limit','Límite de aprobado',get('/index.php?estado=aprobados',['<td>Carla</td>','5.00','Aprobado'])),test('bad','Filtro inválido',get('/index.php?estado=otro',['Estado no válido']))]
}),
project({
 id:'ud2-presupuesto-ambitos',unit:2,title:'Presupuesto y ámbito de variables',entry:'index.php',context:'Un servicio de reparación calcula horas de trabajo e IVA manteniendo separada su configuración.',objective:'Distinguir variables locales, parámetros y constantes al incluir archivos.',
 statement:'config.php proporciona PRECIO_HORA=20 e IVA=0.21. El formulario solicita horas enteras entre 1 y 40. Define calcularBase(int $horas, float $precio): float y calcularConIva(float $base, float $iva): float. El precio llega como argumento: no uses global. El procesador debe conservar su variable $horas sin alteraciones.',
 skills:['ámbito local','parámetros','constantes','require','PHPDoc'],requirements:['Valida horas enteras de 1 a 40.','Las funciones devuelven los importes y no imprimen.','No utilices global ni accedas a $_POST desde funciones.php.','Muestra Base, IVA y Total con dos decimales.'],
 files:[supplied('config.php','Constantes de configuración.',`<?php const PRECIO_HORA=20.0; const IVA=0.21;\n`),supplied('index.php','Formulario de horas.',phpForm('Presupuesto','<label>Horas <input name="horas" type="number" min="1" max="40"></label>')),file('funciones.php','Cálculo con parámetros locales.',`<?php
/** @param int $horas Horas contratadas. @param float $precio Precio por hora. @return float Base imponible. */
function calcularBase(int $horas, float $precio): float { return $horas*$precio; }
function calcularConIva(float $base, float $iva): float { return $base*(1+$iva); }
`,stub('Crear funciones sin global ni superglobales.')),file('procesar.php','Validación y llamadas con constantes.',`<?php
require_once __DIR__.'/config.php'; require_once __DIR__.'/funciones.php';
$horas=filter_var($_POST['horas']??null,FILTER_VALIDATE_INT);
if ($horas===false || $horas<1 || $horas>40) { echo 'Horas no válidas'; exit; }
$base=calcularBase($horas,PRECIO_HORA); $total=calcularConIva($base,IVA);
echo 'Base: '.number_format($base,2,'.','').' | IVA: '.number_format($total-$base,2,'.','').' | Total: '.number_format($total,2,'.','');
`,stub('Validar horas e incluir config.php y funciones.php.'))],examples:['3 horas → Base: 60.00 | IVA: 12.60 | Total: 72.60.','0 o 1.5 horas → Horas no válidas.'],rubric:basicRubric,hints:['Las constantes incluidas están disponibles, pero una variable exterior no entra automáticamente en una función.','Pasa PRECIO_HORA como argumento; no declares una variable global.'],explanation:['Cada parámetro pertenece al ámbito local de su función.','require_once carga la configuración una sola vez y evita redeclarar constantes o funciones.'],references:[ref(2,'1.25. Ámbito de las variables'),ref(2,'1.24. Include y require'),ref(2,'1.23. PHPDoc','Actividad 2.9')],staticChecks:[{label:'Funciones de cálculo documentadas',file:'funciones.php',pattern:'@param[\\s\\S]*?@return'}],tests:[test('valid','Presupuesto de tres horas',post('/procesar.php',{horas:'3'},['Base: 60.00','IVA: 12.60','Total: 72.60'])),test('limit','Una hora',post('/procesar.php',{horas:'1'},['Total: 24.20'])),test('bad','Horas decimales no admitidas',post('/procesar.php',{horas:'1.5'},['Horas no válidas']))]
}),
project({
 id:'ud2-matriz',unit:2,title:'Generador de matriz y sumas',entry:'index.php',context:'Una clase prepara una tabla de productos entre números y quiere obtener las sumas de cada fila.',objective:'Construir y representar una matriz mediante funciones y bucles anidados.',
 statement:'Recibe por GET filas y columnas, enteros entre 1 y 5. Construye una matriz donde la posición de fila i y columna j contiene (i+1)*(j+1). Devuelve el array desde crearMatriz. Otra función pinta la tabla; cada fila termina con su suma. El HTML del formulario ya está resuelto.',
 skills:['GET','bucles anidados','arrays bidimensionales','funciones'],requirements:['Valores por defecto: 2 filas y 3 columnas.','Valida ambos tamaños antes de crear la matriz.','crearMatriz devuelve datos y no HTML.','Representa cada celda y una columna de suma por fila.'],
 files:[file('funciones.php','Crear matriz y representar HTML.',`<?php
function crearMatriz(int $filas,int $columnas): array {
    $matriz=[];
    for($i=1;$i<=$filas;$i++) { $fila=[]; for($j=1;$j<=$columnas;$j++) $fila[]=$i*$j; $matriz[]=$fila; }
    return $matriz;
}
function tablaMatriz(array $matriz): string {
    $html='<table>';
    foreach($matriz as $fila) { $html.='<tr>'; foreach($fila as $valor) $html.='<td>'.$valor.'</td>'; $html.='<td>Suma: '.array_sum($fila).'</td></tr>'; }
    return $html.'</table>';
}
`,stub('Crear crearMatriz y tablaMatriz.')),file('index.php','Recibir tamaños y mostrar tabla.',`<?php
require_once __DIR__.'/funciones.php';
$filas=filter_var($_GET['filas']??'2',FILTER_VALIDATE_INT); $columnas=filter_var($_GET['columnas']??'3',FILTER_VALIDATE_INT);
?>${phpForm('Matriz','<label>Filas <input name="filas" type="number" min="1" max="5"></label><label>Columnas <input name="columnas" type="number" min="1" max="5"></label>','index.php','get')}
<?php
if($filas===false||$columnas===false||$filas<1||$filas>5||$columnas<1||$columnas>5) { echo 'Dimensiones no válidas'; exit; }
echo tablaMatriz(crearMatriz($filas,$columnas));
`,phpForm('Matriz','<label>Filas <input name="filas" type="number"></label><label>Columnas <input name="columnas" type="number"></label>','index.php','get'))],examples:['2×3 → filas [1,2,3] y [2,4,6]; sumas 6 y 12.','1×1 → una celda con 1 y suma 1.'],rubric:basicRubric,hints:['Crea un array nuevo por cada fila.','La creación y la representación de la matriz deben poder utilizarse por separado.'],explanation:['Los bucles exteriores e interiores representan las dos dimensiones.','Separar datos y HTML permite comprobar la matriz sin interpretar etiquetas.'],references:[ref(2,'Actividad 2.8 · Ejercicio 2b: Creación de un array bidimensional','Actividad 2.8'),ref(2,'Actividad 2.8 · Ejercicio 2c: Representación de los datos del array','Actividad 2.8')],tests:[test('default','Matriz por defecto',get('/index.php',['Suma: 6','Suma: 12'])),test('one','Una celda',get('/index.php?filas=1&columnas=1',['<td>1</td>','Suma: 1'])),test('invalid','Fuera de rango',get('/index.php?filas=6&columnas=2',['Dimensiones no válidas']))]
}),
project({
 id:'ud2-pedido',unit:2,title:'Pedido de material con gastos de envío',entry:'index.php',context:'Una papelería calcula el precio de un producto y aplica envío gratuito a partir de un umbral.',objective:'Validar un pedido, consultar un array asociativo y dividir cálculos en funciones.',
 statement:'Los productos son cuaderno=3.50, carpeta=2 y bolígrafo=1.20. El cliente elige producto y cantidad entera de 1 a 30. El envío cuesta 4 €, salvo que el subtotal alcance 20 €. Completa el formulario y los archivos separados. La comparación del umbral se hace sobre el subtotal antes de sumar el envío.',
 skills:['POST','arrays asociativos','funciones','condicionales'],requirements:['No aceptes un precio recibido del cliente; consúltalo en catalogo.php.','Rechaza productos inexistentes y cantidades fuera de rango.','Implementa gastosEnvio(float $subtotal): float.','Presenta subtotal, envío y total.'],
 files:[supplied('catalogo.php','Precios oficiales de la práctica.',`<?php $precios=['cuaderno'=>3.5,'carpeta'=>2.0,'bolígrafo'=>1.2];\n`),supplied('index.php','Formulario de pedido.',phpForm('Pedido','<select name="producto"><option>cuaderno</option><option>carpeta</option><option>bolígrafo</option></select><label>Cantidad <input name="cantidad" type="number" min="1" max="30"></label>')),file('funciones.php','Cálculo del envío.',`<?php function gastosEnvio(float $subtotal): float { return $subtotal>=20?0.0:4.0; }\n`,stub('Implementar gastosEnvio con el límite incluido.')),file('procesar.php','Validar pedido y calcular.',`<?php
require_once __DIR__.'/catalogo.php'; require_once __DIR__.'/funciones.php';
$producto=$_POST['producto']??''; $cantidad=filter_var($_POST['cantidad']??null,FILTER_VALIDATE_INT);
if(!is_string($producto)||!array_key_exists($producto,$precios)||$cantidad===false||$cantidad<1||$cantidad>30) { echo 'Pedido no válido'; exit; }
$subtotal=$precios[$producto]*$cantidad; $envio=gastosEnvio($subtotal);
echo 'Subtotal: '.number_format($subtotal,2,'.','').' | Envío: '.number_format($envio,2,'.','').' | Total: '.number_format($subtotal+$envio,2,'.','');
`,stub('Recuperar y validar; obtener el precio del catálogo.'))],examples:['2 cuadernos → subtotal 7.00, envío 4.00, total 11.00.','10 carpetas → subtotal 20.00, envío 0.00, total 20.00.'],rubric:basicRubric,hints:['La clave del producto debe existir antes de usarla para acceder al array.','El envío gratuito incluye exactamente 20 €.'],explanation:['El servidor decide el precio a partir del identificador de producto.','El caso del umbral comprueba la diferencia entre > y >=.'],references:[ref(2,'1.11. Arrays'),ref(2,'1.22. Funciones definidas por el usuario','Actividad 2.8'),ref(2,'1.17. Formularios HTML: GET y POST')],tests:[test('shipping','Pedido pequeño',post('/procesar.php',{producto:'cuaderno',cantidad:'2'},['Total: 11.00'])),test('threshold','Umbral de envío gratuito',post('/procesar.php',{producto:'carpeta',cantidad:'10'},['Envío: 0.00','Total: 20.00'])),test('bad','Producto manipulado',post('/procesar.php',{producto:'gratis',cantidad:'1'},['Pedido no válido']))]
}),
project({
 id:'ud2-partes-include',unit:2,title:'Página compuesta e inclusiones',entry:'index.php',context:'Un pequeño sitio comparte cabecera, menú y utilidades sin duplicar funciones.',objective:'Utilizar include, require y sus variantes once con rutas relativas al archivo.',
 statement:'Completa una página de ficha de producto con dos plantillas y un archivo de funciones. index.php y ficha.php incluyen las mismas utilidades mediante require_once. La cabecera se incluye con include. ficha.php se incluye desde index.php y muestra el producto indicado por GET, o un error para una clave desconocida. La carpeta parcial hace necesario construir bien las rutas.',
 skills:['include','require_once','__DIR__','rutas relativas','ámbito de archivos'],requirements:['Usa __DIR__ para resolver rutas sin depender del directorio de trabajo.','Evita redeclarar formatearPrecio al cargar utilidades desde dos archivos.','Conserva la variable $productos incluida por datos.php.','La plantilla no debe solicitar librerías ni acceder a Internet.'],
 files:[supplied('datos.php','Array compartido de productos.',`<?php $productos=['libro'=>['nombre'=>'Libro PHP','precio'=>18.5],'regla'=>['nombre'=>'Regla','precio'=>2.0]];\n`),file('utilidades.php','Formato común.',`<?php function formatearPrecio(float $precio): string { return number_format($precio,2,'.','').' EUR'; }\n`,stub('Definir formatearPrecio.')),supplied('parciales/cabecera.php','Cabecera de HTML proporcionada.',`<!doctype html><html lang="es"><meta charset="utf-8"><title>Ficha</title><h1>Material de estudio</h1>`),file('parciales/ficha.php','Resolver producto y mostrar ficha.',`<?php
require_once __DIR__.'/../utilidades.php';
$clave=$_GET['producto']??'libro';
if(!is_string($clave)||!isset($productos[$clave])) { echo 'Producto no encontrado'; }
else { $producto=$productos[$clave]; echo '<h2>'.htmlspecialchars($producto['nombre']).'</h2><p>'.formatearPrecio($producto['precio']).'</p>'; }
`,stub('Incluir utilidades; utilizar $productos del archivo que incluye esta plantilla.')),file('index.php','Componer página con los archivos.',`<?php
require_once __DIR__.'/datos.php';
require_once __DIR__.'/utilidades.php';
include __DIR__.'/parciales/cabecera.php';
include __DIR__.'/parciales/ficha.php';
echo '</html>';
`,stub('Cargar datos y utilidades; incluir las dos plantillas.'))],examples:['index.php → Libro PHP y 18.50 EUR.','?producto=regla → Regla y 2.00 EUR.'],rubric:basicRubric,hints:['Dentro de parciales, __DIR__ apunta a esa carpeta.','El sufijo _once evita ejecutar dos veces una declaración de función.'],explanation:['Una inclusión comparte el ámbito donde se realiza; por eso ficha puede consultar $productos.','__DIR__ y /../ forman rutas consistentes tanto en el laboratorio como en XAMPP.'],references:[ref(2,'1.24. Include y require'),ref(2,'1.25. Ámbito de las variables')],staticChecks:[{label:'Inclusión de utilidades una sola vez',file:'index.php',pattern:'require_once'},{label:'Plantillas incluidas',file:'index.php',pattern:'include\\s+'}],tests:[test('default','Composición completa',get('/index.php',['Material de estudio','Libro PHP','18.50 EUR'])),test('relative','Otra ficha con rutas relativas',get('/index.php?producto=regla',['Regla','2.00 EUR'])),test('missing','Clave inexistente',get('/index.php?producto=otro',['Producto no encontrado']))]
}),
project({
 id:'ud2-inscripcion',unit:2,title:'Inscripción en talleres y resumen',entry:'index.php',context:'Un centro cultural admite uno o varios talleres por persona y ofrece una reducción por inscripción múltiple.',objective:'Combinar formularios, arrays y funciones de validación en una aplicación completa.',
 statement:'Se proporcionan talleres de fotografía (30 €), cerámica (40 €) y teatro (25 €). Solicita nombre, correo y una selección múltiple de talleres. Con dos o más talleres diferentes aplica un descuento del 10 %. Valida correo, al menos una selección y claves existentes. Una clave repetida debe contarse solo una vez.',
 skills:['POST','selección múltiple','validación','arrays','funciones'],requirements:['Acumula errores de nombre, correo y talleres.','Normaliza selecciones repetidas sin cobrar dos veces.','Implementa totalTalleres(array $claves,array $tarifas): float.','Muestra nombre escapado, talleres y total final.'],
 files:[supplied('talleres.php','Tarifas de talleres.',`<?php $tarifas=['fotografia'=>30.0,'ceramica'=>40.0,'teatro'=>25.0];\n`),supplied('index.php','Formulario HTML proporcionado.',phpForm('Inscripción','<label>Nombre <input name="nombre"></label><label>Correo <input name="correo" type="email"></label><select name="talleres[]" multiple><option value="fotografia">Fotografía</option><option value="ceramica">Cerámica</option><option value="teatro">Teatro</option></select>')),file('funciones.php','Suma y descuento.',`<?php
function totalTalleres(array $claves,array $tarifas): float {
    $claves=array_unique($claves); $base=0.0;
    foreach($claves as $clave) $base+=$tarifas[$clave];
    return count($claves)>=2?$base*0.9:$base;
}
`,stub('Calcular total con claves diferentes; descuento del 10 % desde dos.')),file('procesar.php','Validación y resumen de inscripción.',`<?php
require_once __DIR__.'/talleres.php'; require_once __DIR__.'/funciones.php';
$nombre=is_string($_POST['nombre']??null)?trim($_POST['nombre']):''; $correo=$_POST['correo']??''; $claves=$_POST['talleres']??[]; $errores=[];
if($nombre==='') $errores[]='Nombre obligatorio';
if(!is_string($correo)||!filter_var($correo,FILTER_VALIDATE_EMAIL)) $errores[]='Correo no válido';
if(!is_array($claves)||!count($claves)||array_filter($claves,fn($c)=>!is_string($c)||!array_key_exists($c,$tarifas))) $errores[]='Talleres no válidos';
if($errores) { foreach($errores as $error) echo '<p>'.htmlspecialchars($error).'</p>'; exit; }
$claves=array_values(array_unique($claves));
echo '<h1>Inscripción de '.htmlspecialchars($nombre).'</h1>';
foreach($claves as $clave) echo '<p>'.htmlspecialchars($clave).'</p>';
echo 'Total: '.number_format(totalTalleres($claves,$tarifas),2,'.','');
`,stub('Validar nombre, correo y talleres; después llamar a totalTalleres.'))],examples:['Fotografía → 30.00.','Fotografía + cerámica → 63.00.','Fotografía repetida → 30.00.'],rubric:basicRubric,hints:['Valida que talleres sea array antes de recorrerlo.','array_unique evita cobrar una clave dos veces.'],explanation:['El formulario usa talleres[] para construir una selección múltiple.','La validación se realiza antes de que la función acceda al array de tarifas.'],references:[ref(2,'Tarea 02.1 · Inscripción en talleres','Tarea 02.1'),ref(2,'1.18. Selección múltiple en formularios HTML y PHP')],tests:[test('one','Una inscripción',post('/procesar.php',{nombre:'Ana',correo:'ana@example.test','talleres[]':['fotografia']},['Total: 30.00'])),test('two','Dos talleres diferentes',post('/procesar.php',{nombre:'Ana',correo:'ana@example.test','talleres[]':['fotografia','ceramica']},['Total: 63.00'])),test('duplicate','Taller repetido',post('/procesar.php',{nombre:'Ana',correo:'ana@example.test','talleres[]':['fotografia','fotografia']},['Total: 30.00'])),test('invalid','Errores acumulados',post('/procesar.php',{nombre:'',correo:'mal','talleres[]':['otro']},['Nombre obligatorio','Correo no válido','Talleres no válidos']))]
}),
project({
 id:'ud2-subida-texto',unit:2,title:'Entrega de un archivo de texto',entry:'index.php',context:'El aula recibe un archivo .txt pequeño y debe guardarlo en una carpeta de entregas del entorno de prácticas.',objective:'Entender multipart/form-data, $_FILES y la validación de una subida.',
 statement:'El formulario de subida está proporcionado. Acepta un único archivo con extensión txt y tamaño máximo de 2048 bytes. Comprueba UPLOAD_ERR_OK, valida extensión y tamaño, crea la carpeta entregas si hace falta y guarda como entrega.txt usando move_uploaded_file. Nunca utilices el nombre del usuario como ruta de destino. Distingue la falta de archivo del archivo rechazado.',
 skills:['multipart/form-data','$_FILES','directivas','archivos','validación'],requirements:['Comprueba error de subida, extensión txt y límite 2048 bytes.','Mantén el directorio de destino fijo dentro del proyecto.','No interpretes ni incluyas el archivo recibido.','Muestra Entrega guardada solo cuando move_uploaded_file devuelva true.'],
 files:[supplied('index.php','Formulario multipart proporcionado.',`<!doctype html><html lang="es"><meta charset="utf-8"><title>Entrega</title><h1>Entrega de texto</h1><form action="procesar.php" method="post" enctype="multipart/form-data"><input type="hidden" name="MAX_FILE_SIZE" value="2048"><label>Texto <input type="file" name="entrega" accept=".txt"></label><button>Subir</button></form></html>`),file('procesar.php','Validar subida y guardar de forma controlada.',`<?php
$archivo=$_FILES['entrega']??null;
if(!$archivo || $archivo['error']===UPLOAD_ERR_NO_FILE) { echo 'Falta el archivo'; exit; }
if($archivo['error']!==UPLOAD_ERR_OK) { echo 'Error de subida'; exit; }
if($archivo['size']>2048 || strtolower(pathinfo($archivo['name'],PATHINFO_EXTENSION))!=='txt') { echo 'Archivo rechazado'; exit; }
$carpeta=__DIR__.'/entregas';
if(!is_dir($carpeta)) mkdir($carpeta,0777,true);
if(move_uploaded_file($archivo['tmp_name'],$carpeta.'/entrega.txt')) echo 'Entrega guardada';
else echo 'No se pudo guardar';
`,stub('Validar $_FILES y guardar solo si cumple los requisitos.'))],examples:['notas.txt de 20 bytes → Entrega guardada.','programa.php → Archivo rechazado.','archivo.txt de 2049 bytes → Archivo rechazado.'],rubric:basicRubric,hints:['El atributo enctype permite que el navegador envíe contenido de archivos.','El tamaño máximo del HTML no sustituye la validación del servidor.'],explanation:['$_FILES contiene metadatos y una ruta temporal; el nombre original no es una ruta fiable.','La extensión es una condición académica de este ejercicio, no una comprobación general de que el contenido sea seguro.'],references:[ref(2,'Actividad 2.6 · Envío de ficheros','Actividad 2.6'),ref(2,'Actividad 2.7 · Límites de tamaño','Actividad 2.7')],tests:[test('form','Formulario multipart',get('/index.php',['multipart/form-data','name="entrega"'])),test('missing','Envío sin archivo',post('/procesar.php',{},['Falta el archivo']))],manualChecks:['Subir un .txt válido y verificar su contenido guardado.','Rechazar extensión distinta, archivo de 2049 bytes y un error de subida. Estas pruebas requieren transporte multipart y no están incluidas en la comprobación automática de este proyecto.']
}),

// UD3: each project focuses on a small, distinct part of state maintenance.
project({
 id:'ud3-contador-cookie',unit:3,title:'Contador de visitas con cookie',entry:'index.php',context:'Una página de bienvenida cuenta las visitas de este navegador de laboratorio.',objective:'Observar la separación entre la cookie recibida y la enviada en la respuesta.',
 statement:'Lee visitas, valida que sea un entero entre 0 y 1000000 y muestra el contador incrementado. Una cookie ausente o incorrecta inicia en 1. Envía visitas con caducidad de una hora, path /, HttpOnly y SameSite=Lax. Una página informativa enlazada no incrementa el contador.',
 skills:['$_COOKIE','setcookie','ciclo de vida','cabeceras HTTP'],requirements:['Llama a setcookie antes de imprimir HTML.','No cambies $_COOKIE para fingir la siguiente petición.','Incluye un enlace a info.php y otro de regreso.','La segunda petición debe recibir el valor guardado por la primera.'],
 files:[file('index.php','Leer, incrementar y enviar la cookie.',`<?php
$anterior=filter_var($_COOKIE['visitas']??'0',FILTER_VALIDATE_INT);
if($anterior===false||$anterior<0||$anterior>1000000) $anterior=0;
$visitas=$anterior+1;
setcookie('visitas',(string)$visitas,['expires'=>time()+3600,'path'=>'/','httponly'=>true,'samesite'=>'Lax']);
?><!doctype html><html lang="es"><meta charset="utf-8"><h1>Visitas: <?= $visitas ?></h1><a href="info.php">Información</a></html>`,stub('Leer visitas; incrementar; enviar cookie antes de HTML.')),supplied('info.php','Página que no modifica estado.',`<!doctype html><html lang="es"><meta charset="utf-8"><h1>Información</h1><p>Esta página no incrementa visitas.</p><a href="index.php">Volver</a></html>`) ],examples:['Primera petición → Visitas: 1 y Set-Cookie.','Segunda petición a index.php → Visitas: 2.'],rubric:stateRubric,hints:['La nueva cookie se observa en $_COOKIE al realizar la petición siguiente.','La salida de HTML debe comenzar después de setcookie.'],explanation:['HTTP no recuerda visitas; la cookie viaja en la siguiente cabecera de petición.','Una visita a info.php conserva la cookie y no incrementa el valor.'],references:[ref(3,'1. HTTP: Protocolo sin estado'),ref(3,'2.1. Creación y configuración de cookies en PHP','Actividad 3.1')],tests:[test('visits','Persistencia entre dos peticiones',{...get('/index.php',['Visitas: 1']),expect:{status:200,bodyIncludes:['Visitas: 1'],cookieNames:['visitas']}},get('/index.php',['Visitas: 2'])),test('other','Otra página no incrementa',get('/index.php',['Visitas: 1']),get('/info.php',['Información']),get('/index.php',['Visitas: 2']))],manualChecks:['Comprueba expires, path, HttpOnly y SameSite en el inspector HTTP. El paso real de una hora se revisa manualmente.']
}),
project({
 id:'ud3-idioma',unit:3,title:'Preferencia de idioma persistente',entry:'index.php',context:'Una biblioteca ofrece interfaz en castellano y gallego y recuerda la elección.',objective:'Crear una cookie desde POST y aplicar el patrón POST → redirección → GET.',
 statement:'El selector admite es y gl. guardar.php debe validar el valor, enviar idioma con caducidad de siete días y redirigir a index.php. La página inicial muestra Biblioteca o Biblioteca en galego según la cookie. Una selección inválida devuelve un mensaje sin guardar nada.',
 skills:['POST','cookies','Location','validación'],requirements:['No redirijas hacia un destino recibido del usuario.','Usa exit tras header Location.','Si no hay cookie o es incorrecta, usa es.','Configura path / para compartir la preferencia entre archivos.'],
 files:[file('index.php','Mostrar idioma y formulario proporcionado.',`<?php $idioma=in_array($_COOKIE['idioma']??'', ['es','gl'],true)?$_COOKIE['idioma']:'es'; ?>
<!doctype html><html lang="<?= $idioma ?>"><meta charset="utf-8"><h1><?= $idioma==='gl'?'Biblioteca en galego':'Biblioteca' ?></h1><form method="post" action="guardar.php"><select name="idioma"><option value="es">Castellano</option><option value="gl">Galego</option></select><button>Guardar</button></form></html>`,phpForm('Biblioteca','<select name="idioma"><option value="es">Castellano</option><option value="gl">Galego</option></select>','guardar.php')),file('guardar.php','Validar, guardar y redirigir.',`<?php
$idioma=$_POST['idioma']??'';
if(!is_string($idioma)||!in_array($idioma,['es','gl'],true)) { echo 'Idioma no válido'; exit; }
setcookie('idioma',$idioma,['expires'=>time()+7*86400,'path'=>'/','httponly'=>true,'samesite'=>'Lax']);
header('Location: index.php'); exit;
`,stub('Validar idioma, enviar cookie y redirigir.'))],examples:['Elegir gl → 302 con Location: index.php; siguiente página: Biblioteca en galego.','Elegir fr → Idioma no válido.'],rubric:stateRubric,hints:['header no interrumpe el script: necesitas exit.','No esperes ver la cookie recién enviada en la misma petición.'],explanation:['La redirección inicia la petición que ya transporta la preferencia.','Validar contra una lista evita aceptar valores que la interfaz no sabe representar.'],references:[ref(3,'Actividad 3.1 · Ejercicio 2: Preferencia de idioma','Actividad 3.1'),ref(3,'2.1. Creación y configuración de cookies en PHP')],tests:[test('default','Valor por defecto',get('/index.php',['<h1>Biblioteca</h1>'])),test('save','Guardar y recuperar gallego',redirect(post('/guardar.php',{idioma:'gl'}),'index.php'),get('/index.php',['Biblioteca en galego'])),test('bad','Rechazar idioma inexistente',post('/guardar.php',{idioma:'fr'},['Idioma no válido']))]
}),
project({
 id:'ud3-borrar-cookie',unit:3,title:'Crear y eliminar una preferencia',entry:'index.php',context:'El usuario quiere borrar una preferencia de tema sin borrar otras cookies.',objective:'Eliminar una cookie con el mismo nombre y ruta utilizados al crearla.',
 statement:'Implementa guardar.php para guardar tema=oscuro o claro durante un día y borrar.php para expirar únicamente tema con path /. Ambas acciones se realizan mediante POST y terminan redirigiendo a index.php. La página inicial muestra Tema: sin preferencia cuando la cookie no existe.',
 skills:['setcookie','eliminación','POST','redirecciones'],requirements:['No uses unset($_COOKIE) como sustituto de la eliminación en el cliente.','Rechaza métodos distintos de POST con estado 405 en guardar y borrar.','Usa la misma ruta al crear y borrar.','No destruyas cookies de sesión u otras preferencias.'],
 files:[supplied('index.php','Vista y formularios proporcionados.',`<?php $tema=$_COOKIE['tema']??'sin preferencia'; ?>
<!doctype html><html lang="es"><meta charset="utf-8"><h1>Tema: <?= htmlspecialchars($tema) ?></h1><form action="guardar.php" method="post"><select name="tema"><option>oscuro</option><option>claro</option></select><button>Guardar</button></form><form action="borrar.php" method="post"><button>Borrar preferencia</button></form></html>`),file('guardar.php','Crear cookie de tema.',`<?php
if($_SERVER['REQUEST_METHOD']!=='POST') { http_response_code(405); echo 'Método no permitido'; exit; }
$tema=$_POST['tema']??'';
if(!is_string($tema)||!in_array($tema,['oscuro','claro'],true)) { echo 'Tema no válido'; exit; }
setcookie('tema',$tema,['expires'=>time()+86400,'path'=>'/','httponly'=>true,'samesite'=>'Lax']);
header('Location: index.php'); exit;
`,stub('Comprobar método; validar tema; crear cookie.')),file('borrar.php','Expirar cookie concreta.',`<?php
if($_SERVER['REQUEST_METHOD']!=='POST') { http_response_code(405); echo 'Método no permitido'; exit; }
setcookie('tema','',['expires'=>time()-3600,'path'=>'/','httponly'=>true,'samesite'=>'Lax']);
header('Location: index.php'); exit;
`,stub('Enviar tema con caducidad pasada y ruta idéntica.'))],examples:['Guardar oscuro → Tema: oscuro.','Borrar → Tema: sin preferencia.','GET borrar.php → 405.'],rubric:stateRubric,hints:['El navegador identifica una cookie por nombre y ámbito, incluida la ruta.','La caducidad debe estar en el pasado.'],explanation:['Eliminar en el servidor el elemento de $_COOKIE solo cambia la memoria de esa petición.','Set-Cookie con caducidad pasada solicita al cliente que deje de enviarla.'],references:[ref(3,'2.2. Consulta y eliminación de cookies en PHP'),ref(3,'Actividad 3.1 · Ejercicio 1: Eliminación de cookie','Actividad 3.1')],tests:[test('cycle','Crear, consultar y eliminar',redirect(post('/guardar.php',{tema:'oscuro'}),'index.php'),get('/index.php',['Tema: oscuro']),redirect(post('/borrar.php',{}),'index.php'),{...get('/index.php',['Tema: sin preferencia']),expect:{status:200,bodyIncludes:['Tema: sin preferencia'],absentCookies:['tema']}}),test('method','GET no modifica estado',get('/borrar.php',['Método no permitido'],405))]
}),
project({
 id:'ud3-historial',unit:3,title:'Historial reciente de productos',entry:'index.php',context:'Un catálogo recuerda los últimos tres productos distintos vistos en el navegador.',objective:'Codificar un pequeño array como JSON en una cookie y validar datos al recuperarlo.',
 statement:'El catálogo contiene libro, agenda, regla y carpeta. producto.php recibe id por GET, valida su existencia y actualiza recientes: elimina apariciones anteriores, añade el producto al principio y conserva como máximo tres. historial.php muestra los nombres recuperados desde JSON; ante JSON inválido usa una lista vacía.',
 skills:['cookies','JSON','arrays','GET'],requirements:['No guardes rutas ni HTML dentro de la cookie; solo claves conocidas.','Limita a tres claves diferentes.','Un id inválido no se añade al historial.','Incluye enlaces entre catálogo, producto e historial.'],
 files:[supplied('datos.php','Catálogo conocido.',`<?php $productos=['libro'=>'Libro PHP','agenda'=>'Agenda','regla'=>'Regla','carpeta'=>'Carpeta'];\n`),supplied('index.php','Enlaces de catálogo.',`<!doctype html><html lang="es"><meta charset="utf-8"><h1>Catálogo</h1><a href="producto.php?id=libro">Libro</a> <a href="producto.php?id=agenda">Agenda</a> <a href="producto.php?id=regla">Regla</a> <a href="producto.php?id=carpeta">Carpeta</a> <a href="historial.php">Historial</a></html>`),file('funciones.php','Decodificar y validar claves.',`<?php
function leerHistorial(array $productos): array {
    $datos=json_decode($_COOKIE['recientes']??'[]',true);
    if(!is_array($datos)) return [];
    return array_values(array_filter($datos,fn($id)=>is_string($id)&&array_key_exists($id,$productos)));
}
`,stub('Crear leerHistorial y filtrar claves desconocidas.')),file('producto.php','Actualizar JSON en cookie antes de mostrar.',`<?php
require_once __DIR__.'/datos.php'; require_once __DIR__.'/funciones.php';
$id=$_GET['id']??'';
if(!is_string($id)||!isset($productos[$id])) { echo 'Producto no válido'; exit; }
$historial=array_values(array_filter(leerHistorial($productos),fn($anterior)=>$anterior!==$id));
array_unshift($historial,$id); $historial=array_slice($historial,0,3);
setcookie('recientes',json_encode($historial),['expires'=>time()+86400,'path'=>'/','httponly'=>true,'samesite'=>'Lax']);
echo '<h1>'.htmlspecialchars($productos[$id]).'</h1><a href="historial.php">Historial</a>';
`,stub('Validar id; actualizar lista; guardar JSON.')),file('historial.php','Mostrar historial validado.',`<?php
require_once __DIR__.'/datos.php'; require_once __DIR__.'/funciones.php';
$historial=leerHistorial($productos);
if(!$historial) echo 'Historial vacío';
foreach($historial as $id) echo '<p class="reciente">'.htmlspecialchars($productos[$id]).'</p>';
echo '<a href="index.php">Catálogo</a>';
`,stub('Recuperar el historial y mostrar nombres.'))],examples:['Libro, Agenda, Regla, Carpeta → Carpeta, Regla, Agenda.','Visitar Agenda de nuevo → Agenda, Carpeta, Regla.'],rubric:stateRubric,hints:['array_filter elimina la aparición antigua; array_unshift añade al principio.','Comprueba is_array tras json_decode.'],explanation:['El contenido de una cookie también es entrada externa: puede ser JSON inválido.','Se guarda un identificador y se recupera su nombre desde el catálogo del servidor.'],references:[ref(3,'Actividad 3.1 · Ejercicio 3: Historial de productos visitados','Actividad 3.1')],tests:[test('empty','Historial inicial',get('/historial.php',['Historial vacío'])),test('three','Cuatro visitas conservan tres',get('/producto.php?id=libro',['Libro PHP']),get('/producto.php?id=agenda',['Agenda']),get('/producto.php?id=regla',['Regla']),get('/producto.php?id=carpeta',['Carpeta']),{...get('/historial.php'),expect:{status:200,bodyIncludes:['class="reciente">Carpeta','class="reciente">Regla','class="reciente">Agenda'],bodyExcludes:['class="reciente">Libro PHP']}}),test('invalid','Id desconocido',get('/producto.php?id=otro',['Producto no válido']),get('/historial.php',['Historial vacío']))]
}),
project({
 id:'ud3-cesta',unit:3,title:'Cesta de compra con cantidades',entry:'index.php',context:'Una tienda añade productos a una cesta guardada en sesión y calcula su importe.',objective:'Persistir un array de cantidades en $_SESSION y recuperar precios de un catálogo.',
 statement:'Los productos son libro a 18 € y cuaderno a 3 €. Envia producto y cantidad por POST a agregar.php. Las cantidades son enteras entre 1 y 5 por petición; al añadir de nuevo se acumulan. cesta.php muestra las cantidades, subtotales y total. No recibas precios desde el formulario.',
 skills:['session_start','$_SESSION','POST','arrays','redirecciones'],requirements:['Inicia sesión antes de consultar o guardar la cesta.','Inicializa la cesta como array sin sobrescribir las compras anteriores.','Rechaza claves y cantidades incorrectas.','Añade exit tras redirigir a cesta.php.'],
 files:[supplied('productos.php','Precios de confianza.',`<?php $productos=['libro'=>['nombre'=>'Libro','precio'=>18.0],'cuaderno'=>['nombre'=>'Cuaderno','precio'=>3.0]];\n`),supplied('index.php','Formulario inicial.',phpForm('Comprar','<select name="producto"><option>libro</option><option>cuaderno</option></select><input name="cantidad" type="number" min="1" max="5" value="1">','agregar.php')),file('agregar.php','Validar y acumular cantidades en sesión.',`<?php
session_start(); require_once __DIR__.'/productos.php';
$id=$_POST['producto']??''; $cantidad=filter_var($_POST['cantidad']??null,FILTER_VALIDATE_INT);
if(!is_string($id)||!isset($productos[$id])||$cantidad===false||$cantidad<1||$cantidad>5) { echo 'Compra no válida'; exit; }
$_SESSION['cesta']??=[];
$_SESSION['cesta'][$id]=($_SESSION['cesta'][$id]??0)+$cantidad;
header('Location: cesta.php'); exit;
`,stub('Iniciar sesión y sumar a la cantidad anterior.')),file('cesta.php','Recorrer cesta y calcular total.',`<?php
session_start(); require_once __DIR__.'/productos.php';
$cesta=$_SESSION['cesta']??[]; $total=0.0;
if(!$cesta) echo '<p>Cesta vacía</p>';
foreach($cesta as $id=>$cantidad) {
    if(!isset($productos[$id])) continue;
    $subtotal=$productos[$id]['precio']*$cantidad; $total+=$subtotal;
    echo '<p>'.htmlspecialchars($productos[$id]['nombre']).' x '.$cantidad.': '.number_format($subtotal,2,'.','').'</p>';
}
echo '<p>Total: '.number_format($total,2,'.','').'</p><a href="index.php">Seguir comprando</a>';
`,stub('Recorrer $_SESSION y consultar los precios en productos.php.'))],examples:['2 libros y 3 cuadernos → Total: 45.00.','Añadir libro 1 dos veces → Libro x 2: 36.00.'],rubric:stateRubric,hints:['El navegador conserva solo el identificador de sesión; la cesta queda en los datos de sesión.','Usa el valor anterior de la cantidad más la recibida.'],explanation:['La misma sesión conecta agregar.php y cesta.php pese a tratarse de peticiones separadas.','Las cantidades se conservan pero los precios se consultan al generar el resumen.'],references:[ref(3,'Actividad 3.2 · Cesta de la compra con sesiones','Actividad 3.2'),ref(3,'Actividad 3.2 · Ejercicio 1: Mostrar productos de la cesta y totales','Actividad 3.2')],tests:[test('empty','Cesta recién iniciada',get('/cesta.php',['Cesta vacía','Total: 0.00'])),test('buy','Productos y total acumulado',redirect(post('/agregar.php',{producto:'libro',cantidad:'2'}),'cesta.php'),redirect(post('/agregar.php',{producto:'cuaderno',cantidad:'3'}),'cesta.php'),get('/cesta.php',['Libro x 2: 36.00','Cuaderno x 3: 9.00','Total: 45.00'])),test('repeat','Acumula un mismo producto',redirect(post('/agregar.php',{producto:'libro',cantidad:'1'}),'cesta.php'),redirect(post('/agregar.php',{producto:'libro',cantidad:'1'}),'cesta.php'),get('/cesta.php',['Libro x 2: 36.00'])),test('invalid','Cantidad no válida',post('/agregar.php',{producto:'libro',cantidad:'0'},['Compra no válida']))]
}),
project({
 id:'ud3-cesta-eliminar',unit:3,title:'Eliminar productos y vaciar la cesta',entry:'cesta.php',context:'Una cesta ya preparada permite borrar una línea o vaciar los productos conservando el nombre del usuario.',objective:'Distinguir unset de una clave, vaciado del array y destrucción de toda una sesión.',
 statement:'inicio.php prepara la sesión con usuario=Ana y cesta libro=2, cuaderno=1. Completa quitar.php para borrar un producto recibido por POST y vaciar.php para vaciar solo cesta. Conserva siempre usuario. Los formularios están proporcionados; usa redirecciones tras cada cambio.',
 skills:['unset','$_SESSION','POST','persistencia selectiva'],requirements:['No uses session_destroy para vaciar la cesta.','Quitar una clave que no existe debe producir un mensaje de validación.','Vaciar una cesta vacía sigue siendo válido.','El resumen mantiene el nombre del usuario.'],
 files:[supplied('inicio.php','Preparar datos de prueba explícitamente.',`<?php session_start(); $_SESSION['usuario']='Ana'; $_SESSION['cesta']=['libro'=>2,'cuaderno'=>1]; header('Location: cesta.php'); exit;\n`),supplied('cesta.php','Vista y controles proporcionados.',`<?php session_start(); ?>
<!doctype html><html lang="es"><meta charset="utf-8"><h1>Usuario: <?= htmlspecialchars($_SESSION['usuario']??'sin identificar') ?></h1>
<?php $cesta=$_SESSION['cesta']??[]; if(!$cesta) echo 'Cesta vacía'; foreach($cesta as $id=>$cantidad): ?>
<p><?= htmlspecialchars($id) ?> x <?= $cantidad ?></p><form method="post" action="quitar.php"><input type="hidden" name="producto" value="<?= htmlspecialchars($id) ?>"><button>Quitar</button></form><?php endforeach; ?>
<form action="vaciar.php" method="post"><button>Vaciar cesta</button></form><a href="inicio.php">Preparar ejemplo</a></html>`),file('quitar.php','Borrar solo el producto solicitado.',`<?php
session_start(); $id=$_POST['producto']??'';
if(!is_string($id)||!isset($_SESSION['cesta'][$id])) { echo 'Producto no presente'; exit; }
unset($_SESSION['cesta'][$id]); header('Location: cesta.php'); exit;
`,stub('Iniciar sesión, validar clave y aplicar unset solo a ese producto.')),file('vaciar.php','Vaciar cesta conservando otras variables.',`<?php
session_start(); $_SESSION['cesta']=[]; header('Location: cesta.php'); exit;
`,stub('Vaciar únicamente el array cesta; conservar usuario.'))],examples:['Preparar → libro x 2 y cuaderno x 1.','Quitar libro → queda cuaderno; Usuario: Ana.','Vaciar → Cesta vacía y Usuario: Ana.'],rubric:stateRubric,hints:['unset($_SESSION[\'cesta\'][$id]) borra una línea.','Asignar [] a cesta conserva las demás claves de $_SESSION.'],explanation:['La sesión es un conjunto de datos; borrar la cesta no implica cerrar la sesión.','El enlace de preparación reinicia los datos solo cuando el usuario lo solicita.'],references:[ref(3,'3.1. Eliminación de variables y destrucción de sesiones'),ref(3,'Actividad 3.2 · Ejercicio 2: Vaciar la cesta','Actividad 3.2')],tests:[test('remove','Eliminar una línea conserva las demás',redirect(get('/inicio.php'),'cesta.php'),redirect(post('/quitar.php',{producto:'libro'}),'cesta.php'),{...get('/cesta.php'),expect:{status:200,bodyIncludes:['Usuario: Ana','cuaderno x 1'],bodyExcludes:['libro x 2']}}),test('empty','Vaciar conserva usuario',redirect(get('/inicio.php'),'cesta.php'),redirect(post('/vaciar.php',{}),'cesta.php'),get('/cesta.php',['Usuario: Ana','Cesta vacía'])),test('unknown','Producto ausente',post('/quitar.php',{producto:'otro'},['Producto no presente']))]
}),
];

// A deliberately non-secret fixture from the existing material/UD3 example.
// The password is abc123. (including the final full stop), never a real credential.
const demoHash = '$2y$12$7IAfdBMj8PrLxOVtLjrfFe7HuDAnA.5N4BWC4rbOk35AhqQ1JvF2S';
const userData = JSON.stringify([{id:1,usuario:'ana',password:demoHash,rol:'usuario'},{id:2,usuario:'admin',password:demoHash,rol:'admin'}],null,2);
const usersFile = `<?php
function buscarUsuario(string $nombre): ?array {
    $contenido=file_get_contents(__DIR__.'/usuarios.json');
    $usuarios=json_decode($contenido,true);
    if(!is_array($usuarios)) return null;
    foreach($usuarios as $usuario) if(is_array($usuario)&&($usuario['usuario']??null)===$nombre) return $usuario;
    return null;
}
`;
const loginForm = phpForm('Acceso de prácticas','<label>Usuario <input name="usuario" autocomplete="username"></label><label>Contraseña <input name="password" type="password" autocomplete="current-password"></label>','validar.php');
const logoutFile = `<?php
session_start(); $_SESSION=[];
if(ini_get('session.use_cookies')) { $p=session_get_cookie_params(); setcookie(session_name(),'', ['expires'=>time()-3600,'path'=>$p['path'],'domain'=>$p['domain'],'secure'=>$p['secure'],'httponly'=>$p['httponly'],'samesite'=>'Lax']); }
session_destroy(); header('Location: login.php'); exit;
`;
PHP_PROJECTS.push(project({
 id:'ud3-login-json',unit:3,title:'Inicio de sesión con JSON y contraseña hasheada',entry:'login.php',context:'Una zona de apuntes identifica usuarios guardados en un archivo JSON proporcionado.',objective:'Leer JSON, verificar una contraseña con password_verify y proteger una página con sesión.',
 statement:'Se proporcionan usuarios.json y el formulario. Las cuentas de prueba son ana y admin; ambas usan la contraseña de ejemplo abc123. (el punto final pertenece a la contraseña). Implementa buscarUsuario sin comparar contraseñas en claro. validar.php debe verificar el hash, regenerar el identificador de sesión, guardar el nombre y redirigir. privada.php rechaza a visitantes sin sesión; logout.php debe cerrar el acceso.',
 skills:['JSON','password_verify','sesiones','página protegida','logout'],requirements:['Lee usuarios.json con file_get_contents y json_decode.','No calcules un nuevo hash para compararlo por igualdad.','No guardes la contraseña ni su hash en la sesión.','Mensaje genérico Credenciales incorrectas sin decir qué dato ha fallado.','Protege privada.php antes de imprimir HTML.','Cierra la sesión y elimina su cookie en logout.php.'],restrictions:['Los archivos JSON se usan como almacenamiento académico. No se deben desplegar cuentas reales ni publicar un servicio de autenticación real con esta plantilla.'],
 files:[supplied('login.php','Formulario proporcionado.',loginForm),supplied('usuarios.json','Usuarios ficticios con hash bcrypt.',userData,'El hash de ejemplo procede del material ya incorporado; no contiene contraseñas reales.'),file('usuarios.php','Buscar usuario en el archivo JSON.',usersFile,stub('Implementar buscarUsuario(string $nombre): ?array.')),file('validar.php','Verificar credenciales y abrir sesión.',`<?php
session_start(); require_once __DIR__.'/usuarios.php';
$nombre=is_string($_POST['usuario']??null)?trim($_POST['usuario']):'';
$password=is_string($_POST['password']??null)?$_POST['password']:'';
$usuario=buscarUsuario($nombre);
if(!$usuario||!password_verify($password,$usuario['password'])) { echo 'Credenciales incorrectas'; exit; }
session_regenerate_id(true); $_SESSION['usuario']=$usuario['usuario'];
header('Location: privada.php'); exit;
`,stub('Buscar usuario, comprobar password_verify, regenerar sesión y redirigir.')),file('privada.php','Permitir solo sesión identificada.',`<?php
session_start(); if(!isset($_SESSION['usuario'])) { header('Location: login.php'); exit; }
echo '<h1>Zona privada: '.htmlspecialchars($_SESSION['usuario']).'</h1><form method="post" action="logout.php"><button>Cerrar sesión</button></form>';
`,stub('Comprobar sesión antes de imprimir zona privada.')),file('logout.php','Eliminar datos, cookie y sesión.',logoutFile,stub('Vaciar $_SESSION, eliminar cookie y destruir sesión.'))],examples:['ana / abc123. → 302 a privada.php y Zona privada: ana.','ana / otra → Credenciales incorrectas.','Tras logout, privada.php → login.php.'],rubric:[{criterion:'Lectura de JSON y password_verify',points:3},{criterion:'Protección y persistencia de sesión',points:4},{criterion:'Cierre de sesión, salida y mensajes',points:3}],hints:['buscarUsuario devuelve null si no encuentra el nombre.','password_verify recibe primero la contraseña escrita y después el hash almacenado.','Borrar solo usuario puede impedir el acceso, pero el cierre completo debe destruir datos y cookie.'],explanation:['JSON proporciona usuarios ficticios; password_verify comprueba un hash con su sal y coste incorporados.','La sesión almacena una identidad mínima, nunca la contraseña.','La página protegida comprueba la identidad en cada petición; no basta ocultar un enlace.'],references:[ref(3,'4.2. Aplicación de ejemplo: autenticación de usuarios en PHP'),ref(3,'4.4. Validación de usuario'),ref(3,'4.6. Cierre de sesión')],
 staticChecks:[{label:'Verificación de hash',file:'validar.php',pattern:'password_verify\\s*\\('},{label:'Lectura de JSON',file:'usuarios.php',pattern:'json_decode\\s*\\('}],tests:[test('protected','Sin sesión no accede',redirect(get('/privada.php'),'login.php')),test('valid','Login correcto y página protegida',redirect(post('/validar.php',{usuario:'ana',password:'abc123.'}),'privada.php'),get('/privada.php',['Zona privada: ana'])),test('wrong','Contraseña incorrecta',post('/validar.php',{usuario:'ana',password:'mal'},['Credenciales incorrectas']),redirect(get('/privada.php'),'login.php')),test('unknown','Usuario inexistente',post('/validar.php',{usuario:'nadie',password:'abc123.'},['Credenciales incorrectas'])),test('logout','Cierre y posterior acceso denegado',redirect(post('/validar.php',{usuario:'ana',password:'abc123.'}),'privada.php'),redirect(post('/logout.php',{}),'login.php'),redirect(get('/privada.php'),'login.php'))]
}));

PHP_PROJECTS.push(project({
 id:'ud3-roles',unit:3,title:'Acceso y redirección por roles',entry:'login.php',context:'La misma aplicación distingue una zona de usuario y una página reservada a administración.',objective:'Separar autenticación de autorización y proteger el rol en cada petición.',
 statement:'Amplía la estructura de login proporcionada con rol en la sesión. ana es usuario y admin es admin; ambas contraseñas ficticias son abc123. (con punto final). Tras autenticar, dirige admin a admin.php y usuario a privada.php. Una persona identificada sin rol admin recibe estado 403 al entrar directamente en admin.php. Una persona anónima se redirige a login.php. Incluye logout.',
 skills:['JSON','password_verify','roles','403','Location','sesiones'],requirements:['El rol se obtiene del JSON, nunca de un campo del formulario o de la URL.','Protege admin.php aunque se acceda escribiendo su URL.','Distingue visitante anónimo de usuario identificado sin permiso.','Implementa cerrar sesión sin conservar el rol anterior.'],restrictions:['Usuarios ficticios del laboratorio; la plantilla no constituye un sistema de autenticación listo para producción.'],
 files:[supplied('login.php','Formulario proporcionado.',loginForm),supplied('usuarios.json','Dos usuarios y roles de prueba.',userData),supplied('usuarios.php','Lectura JSON proporcionada para centrar la práctica en roles.',usersFile),file('validar.php','Verificar identidad y redirigir según rol.',`<?php
session_start(); require_once __DIR__.'/usuarios.php';
$nombre=is_string($_POST['usuario']??null)?trim($_POST['usuario']):''; $password=is_string($_POST['password']??null)?$_POST['password']:'';
$usuario=buscarUsuario($nombre);
if(!$usuario||!password_verify($password,$usuario['password'])) { echo 'Credenciales incorrectas'; exit; }
session_regenerate_id(true); $_SESSION['usuario']=$usuario['usuario']; $_SESSION['rol']=$usuario['rol'];
header('Location: '.($usuario['rol']==='admin'?'admin.php':'privada.php')); exit;
`,stub('Verificar usuario y guardar rol procedente del JSON; redirigir.')),file('privada.php','Zona para usuarios identificados.',`<?php
session_start(); if(!isset($_SESSION['usuario'])) { header('Location: login.php'); exit; }
echo '<h1>Zona privada: '.htmlspecialchars($_SESSION['usuario']).'</h1><a href="admin.php">Administración</a><form method="post" action="logout.php"><button>Salir</button></form>';
`,stub('Proteger contra accesos anónimos.')),file('admin.php','Comprobar autorización administrativa.',`<?php
session_start();
if(!isset($_SESSION['usuario'])) { header('Location: login.php'); exit; }
if(($_SESSION['rol']??'')!=='admin') { http_response_code(403); echo 'Acceso denegado'; exit; }
echo '<h1>Administración: '.htmlspecialchars($_SESSION['usuario']).'</h1><form method="post" action="logout.php"><button>Salir</button></form>';
`,stub('Primero comprobar identidad; después comprobar rol admin.')),file('logout.php','Cerrar estado completo.',logoutFile,stub('Destruir datos y cookie de sesión; volver al login.'))],
 examples:['admin / abc123. → Location: admin.php.','ana / abc123. → Location: privada.php.','ana solicita admin.php → 403 Acceso denegado.','Anónimo solicita admin.php → 302 login.php.'],rubric:[{criterion:'Identidad y rol desde JSON',points:3},{criterion:'Autorización y códigos HTTP',points:4},{criterion:'Redirecciones y cierre de sesión',points:3}],hints:['Conocer quién es el usuario no implica que tenga autorización para administrar.','La comprobación de rol debe estar en admin.php antes de cualquier HTML.'],explanation:['La autenticación verifica credenciales; la autorización comprueba permisos para una acción.','La redirección al entrar mejora la navegación, pero no sustituye la comprobación de acceso en la página destino.'],references:[ref(3,'Tarea 03.1 · Apartado 2: Modificar el proceso de autenticación','Tarea 03.1'),ref(3,'Tarea 03.1 · Apartado 3: Crear la página de administración','Tarea 03.1'),ref(3,'5. Autorización y control de acceso')],tests:[test('anon','Administración anónima redirige',redirect(get('/admin.php'),'login.php')),test('user','Usuario identificado no administra',redirect(post('/validar.php',{usuario:'ana',password:'abc123.'}),'privada.php'),get('/admin.php',['Acceso denegado'],403)),test('admin','Administrador sí accede',redirect(post('/validar.php',{usuario:'admin',password:'abc123.'}),'admin.php'),get('/admin.php',['Administración: admin'])),test('forged','No acepta rol del formulario',redirect(post('/validar.php',{usuario:'ana',password:'abc123.',rol:'admin'}),'privada.php'),get('/admin.php',['Acceso denegado'],403)),test('logout','Logout retira rol y acceso',redirect(post('/validar.php',{usuario:'admin',password:'abc123.'}),'admin.php'),redirect(post('/logout.php',{}),'login.php'),redirect(get('/admin.php'),'login.php'))]
}));

// Additional cases are shipped to the client and are never described as secret.
const sports=PHP_PROJECTS.find(p=>p.id==='ud2-reserva-deportiva')!;
const invalidSports=sports.tests.find(t=>t.id==='invalid')!.steps[0];
invalidSports.expect.bodyExcludes=['Total:','Importe:'];
const menu=PHP_PROJECTS.find(p=>p.id==='ud2-menu-alergenos')!;
menu.tests.find(t=>t.id==='multiple')!.steps[0].expect.bodyExcludes=['Pizza','Bizcocho'];
const catalog=PHP_PROJECTS.find(p=>p.id==='ud2-catalogo-get')!;
catalog.tests.find(t=>t.id==='red')!.steps[0].expect.bodyExcludes=['Pantalón'];
const grades=PHP_PROJECTS.find(p=>p.id==='ud2-calificaciones')!;
grades.tests.find(t=>t.id==='failed')!.steps[0].expect.bodyExcludes=['<td>Ana</td>','<td>Carla</td>'];
const upload=PHP_PROJECTS.find(p=>p.id==='ud2-subida-texto')!;
upload.generatedFiles=['entregas/entrega.txt'];
upload.tests.push(
 test('valid-upload','Archivo de texto válido',{method:'POST',url:'/procesar.php',uploads:[{field:'entrega',name:'notas.txt',content:'Apuntes de PHP',type:'text/plain'}],expect:{status:200,bodyIncludes:['Entrega guardada']}}),
 {...test('wrong-extension','No acepta código PHP',{method:'POST',url:'/procesar.php',uploads:[{field:'entrega',name:'ejercicio.php',content:'<?php echo 1;',type:'text/plain'}],expect:{status:200,bodyIncludes:['Archivo rechazado'],bodyExcludes:['Entrega guardada']}}),additional:true},
 {...test('too-large','Límite de tamaño',{method:'POST',url:'/procesar.php',uploads:[{field:'entrega',name:'grande.txt',content:'x'.repeat(2049),type:'text/plain'}],expect:{status:200,bodyIncludes:['Archivo rechazado'],bodyExcludes:['Entrega guardada']}}),additional:true},
 test('saved-file','El archivo guardado contiene los bytes recibidos',{method:'POST',url:'/procesar.php',uploads:[{field:'entrega',name:'texto.txt',content:'Contenido verificable',type:'text/plain'}],expect:{status:200,bodyIncludes:['Entrega guardada']}},get('/entregas/entrega.txt',['Contenido verificable']))
);
upload.manualChecks=['Revisar en XAMPP la interacción entre upload_max_filesize, post_max_size y MAX_FILE_SIZE. El laboratorio ejecuta la validación y la subida multipart, pero no modifica la configuración del XAMPP de examen.'];
for(const id of ['ud3-login-json','ud3-roles']) {
 PHP_PROJECTS.find(p=>p.id===id)!.tests.unshift(test('form','Formulario de acceso proporcionado',get('/login.php',['Usuario','Contraseña','validar.php'])));
}

// Assert rendered text and form semantics, accepting equivalent HTML, quote styles and spacing.
for(const project of PHP_PROJECTS) for(const scenario of project.tests) for(const step of scenario.steps) {
 const text=(value:string)=>value.replace(/class="(?:plato|reciente)">/g,'').replace(/<\/?(?:td|h1)>/g,'');
 if(step.expect.bodyIncludes){step.expect.textIncludes=step.expect.bodyIncludes.map(text);delete step.expect.bodyIncludes;}
 if(step.expect.bodyExcludes){step.expect.textExcludes=step.expect.bodyExcludes.map(text);delete step.expect.bodyExcludes;}
}
const sportsForm=sports.tests.find(t=>t.id==='form')!.steps[0].expect;
sportsForm.textIncludes=['Natación','Pádel','Yoga'];
sportsForm.form={method:'POST',action:'procesar.php',fields:['nombre','actividad','sesiones']};
const sportsEscape=sports.tests.find(t=>t.id==='escaped')!.steps[0].expect;
sportsEscape.textIncludes=['<b>Ana</b>'];
sportsEscape.bodyExcludes=['<b>Ana</b>'];
const uploadForm=upload.tests.find(t=>t.id==='form')!.steps[0].expect;
uploadForm.textIncludes=[];
uploadForm.form={method:'POST',action:'procesar.php',fields:['entrega'],enctype:'multipart/form-data'};
for(const id of ['ud3-login-json','ud3-roles']) {
 const expected=PHP_PROJECTS.find(p=>p.id===id)!.tests.find(t=>t.id==='form')!.steps[0].expect;
 expected.textIncludes=['Usuario','Contraseña'];
 expected.form={method:'POST',action:'validar.php',fields:['usuario','password']};
}
PHP_PROJECTS.find(p=>p.id==='ud3-idioma')!.tests.find(t=>t.id==='default')!.steps[0].expect.textExcludes=['Biblioteca en galego'];
