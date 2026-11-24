import type { Question } from '../core/questions';

export const DWCS_TEST_CODIGO: Question[] = [
  {
    "id": "EXAM-U2-092",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué muestra echo después de estas dos operaciones?",
    "solution": "La suma numérica 9+6 da 15 y la concatenación de \"2\" y \"4\" da \"24\".",
    "options": [
      "15-24",
      "15-6",
      "15-26",
      "36-24"
    ],
    "correct": [
      0
    ],
    "code": "$a = 9;\n$b = \"6\";\necho $a + $b;\necho '-';\necho '2' . '4';",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-093",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué imprime este fragmento?",
    "solution": "foreach acumula 1+1 en las dos claves presentes, pero aquí los valores son 1 y 1: 2.",
    "options": [
      "2",
      "3",
      "4",
      "Error de sintaxis"
    ],
    "correct": [
      0
    ],
    "code": "$datos = [0 => 1, 4 => 1];\n$total = 0;\nforeach ($datos as $valor) {\n    $total += $valor;\n}\necho $total;",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-094",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué resultado tendrá este código de un array con claves no consecutivas?",
    "solution": "foreach conserva las claves 0 y 3.",
    "options": [
      "1:A;2:B;",
      "0:A;3:B;",
      "A;B;",
      "Lanza error"
    ],
    "correct": [
      1
    ],
    "code": "$datos = [0 => 'A', 3 => 'B'];\nforeach ($datos as $clave => $valor) {\n    echo \"$clave:$valor;\";\n}",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-095",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué salida produce el contador después de un bucle for?",
    "solution": "El for imprime 012 y el contador termina valiendo 3; el guion proviene del último echo.",
    "options": [
      "0123",
      "012-3",
      "012-2",
      "012-4"
    ],
    "correct": [
      1
    ],
    "code": "for ($i = 0; $i < 3; $i++) {\n    echo $i;\n}\necho '-' . $i;",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-096",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué valor muestra el return de esta función tipada?",
    "solution": "Se suman únicamente los números mayores de 10: 11; pero el ejemplo incluye 9, 10, 11 y se imprime 11.",
    "options": [
      "10",
      "11",
      "12",
      "15"
    ],
    "correct": [
      1
    ],
    "code": "function sumarMayores(array $datos): int {\n    $suma = 0;\n    foreach ($datos as $n) {\n        if ($n > 10) $suma += $n;\n    }\n    return $suma;\n}\necho sumarMayores([9,10,11]);",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-097",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "En PHP, ¿cuál es el resultado?",
    "solution": "La comparación estricta exige coincidencia de tipo; un entero y una cadena son diferentes.",
    "options": [
      "bool(true)",
      "bool(false)",
      "int(1)",
      "Error de sintaxis"
    ],
    "correct": [
      1
    ],
    "code": "var_dump(10 === '10');",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-098",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Si no existe la clave usuario, ¿qué muestra este código?",
    "solution": "El operador ?? devuelve el segundo operando porque la clave no está establecida.",
    "options": [
      "0",
      "Invitado",
      "null",
      "Warning siempre"
    ],
    "correct": [
      1
    ],
    "code": "$_GET = [];\n$nombre = $_GET['usuario'] ?? 'Invitado';\necho $nombre;",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-099",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué salida produce Elvis con una cadena vacía?",
    "solution": "Una cadena vacía es falsy; ?: utiliza la alternativa.",
    "options": [
      "0",
      "Anónimo",
      "Cadena vacía",
      "false"
    ],
    "correct": [
      1
    ],
    "code": "$nombre = '';\necho $nombre ?: 'Anónimo';",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-100",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "El código compara un booleano con un entero. ¿Qué imprime?",
    "solution": "La comparación amplia true == 1 resulta verdadera.",
    "options": [
      "bool(true)",
      "bool(false)",
      "int(1)",
      "Nada"
    ],
    "correct": [
      0
    ],
    "code": "var_dump(true == 1);",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-101",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué imprime switch al faltar el break en case 1?",
    "solution": "Se ejecuta case 1 y continúa por case 2 hasta el break.",
    "options": [
      "A",
      "AB",
      "B",
      "Error"
    ],
    "correct": [
      1
    ],
    "code": "switch (1) {\n    case 1: echo 'A';\n    case 2: echo 'B'; break;\n    default: echo 'C';\n}",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-102",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué muestra el while si la condición inicial es falsa?",
    "solution": "El while verifica la condición antes de entrar y no ejecuta ni una vez.",
    "options": [
      "1",
      "0",
      "Nada",
      "Un error"
    ],
    "correct": [
      2
    ],
    "code": "$i = 1;\nwhile ($i < 0) {\n    echo $i;\n    $i++;\n}",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-103",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué muestra el do-while con la misma condición inicial falsa?",
    "solution": "El cuerpo del do-while se ejecuta al menos una vez.",
    "options": [
      "Nada",
      "1",
      "2",
      "Error"
    ],
    "correct": [
      1
    ],
    "code": "$i = 1;\ndo {\n    echo $i;\n    $i++;\n} while ($i < 0);",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-104",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué secuencia deja continue fuera?",
    "solution": "Cuando i es 3, continue evita echo de esa iteración.",
    "options": [
      "12345",
      "1245",
      "1234",
      "2345"
    ],
    "correct": [
      1
    ],
    "code": "for ($i = 1; $i <= 5; $i++) {\n    if ($i === 3) continue;\n    echo $i;\n}",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-105",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué claves conserva el array al eliminar el elemento 1?",
    "solution": "unset no renumera claves numéricas; quedan 0 y 2.",
    "options": [
      "0 y 1",
      "1 y 2",
      "0 y 2",
      "Solo 0"
    ],
    "correct": [
      2
    ],
    "code": "$datos = ['A', 'B', 'C'];\nunset($datos[1]);\necho implode(',', array_keys($datos));",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-106",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué valor selecciona un array bidimensional?",
    "solution": "Fila 1 (segunda fila), columna 0 (primer valor) es 40.",
    "options": [
      "20",
      "30",
      "40",
      "50"
    ],
    "correct": [
      2
    ],
    "code": "$matriz = [[10,20,30],[40,50,60]];\necho $matriz[1][0];",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-107",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "En este código, ¿qué devuelve strpos cuando encuentra la palabra al principio?",
    "solution": "Devuelve la posición entera 0. No debe evaluarse como booleano sin comparación estricta.",
    "options": [
      "false",
      "true",
      "0",
      "1"
    ],
    "correct": [
      2
    ],
    "code": "$texto = 'PHP es útil';\nvar_dump(strpos($texto, 'PHP'));",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-108",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué imprimen echo y la interpolación entre comillas dobles?",
    "solution": "Las comillas dobles expanden $nombre a su valor.",
    "options": [
      "Hola $nombre",
      "Hola Ana",
      "Hola ${nombre}",
      "Error"
    ],
    "correct": [
      1
    ],
    "code": "$nombre = 'Ana';\necho \"Hola $nombre\";",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-109",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué imprime la interpolación entre comillas simples?",
    "solution": "Las comillas simples no sustituyen las variables por sus valores.",
    "options": [
      "Hola Ana",
      "Hola $nombre",
      "Hola",
      "Error"
    ],
    "correct": [
      1
    ],
    "code": "$nombre = 'Ana';\necho 'Hola $nombre';",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-110",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué resultado tiene la variable después de la función?",
    "solution": "Por defecto se pasan valores; el parámetro local cambia, no la variable original.",
    "options": [
      "9",
      "3",
      "6",
      "TypeError"
    ],
    "correct": [
      1
    ],
    "code": "function triple(int $n): void {\n    $n *= 3;\n}\n$valor = 3;\ntriple($valor);\necho $valor;",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-111",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué ocurre al intentar pasar una cadena numérica en modo estricto?",
    "solution": "Con strict_types=1, una llamada desde ese archivo no convierte automáticamente la cadena \"5\" en int.",
    "options": [
      "Devuelve 5 sin errores",
      "Devuelve \"5\"",
      "Lanza TypeError",
      "Devuelve null"
    ],
    "correct": [
      2
    ],
    "code": "declare(strict_types=1);\nfunction doble(int $numero): int {\n    return $numero * 2;\n}\necho doble('5');",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-112",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "Una página compara la existencia de una clave cuyo valor es null. ¿Qué muestra?",
    "solution": "array_key_exists encuentra la clave; isset devuelve false porque el valor es null.",
    "options": [
      "true-true",
      "false-false",
      "true-false",
      "false-true"
    ],
    "correct": [
      2
    ],
    "code": "$datos = ['a' => null];\necho array_key_exists('a', $datos) ? 'true' : 'false';\necho '-';\necho isset($datos['a']) ? 'true' : 'false';",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-113",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué valor imprime el código de la tabla de multiplicar?",
    "solution": "La clave 2x6 almacena 2×6 = 12.",
    "options": [
      "6",
      "8",
      "10",
      "12"
    ],
    "correct": [
      3
    ],
    "code": "$tabla = [];\nfor ($i = 0; $i <= 10; $i++) {\n    $tabla[\"2x$i\"] = 2 * $i;\n}\necho $tabla['2x6'];",
    "check": "",
    "image": "",
    "activity": "Actividad 2.3 · Multiplicar"
  },
  {
    "id": "EXAM-U2-114",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué salida da la función de descuento para cuatro sesiones?",
    "solution": "La condición >=5 es falsa; no se aplica descuento.",
    "options": [
      "9",
      "0",
      "10",
      "4"
    ],
    "correct": [
      1
    ],
    "code": "function descuento(float $importe, int $sesiones): float {\n    return $sesiones >= 5 ? $importe * 0.10 : 0.0;\n}\necho descuento(90,4);",
    "check": "",
    "image": "",
    "activity": "Tarea02.1 · Descuento"
  },
  {
    "id": "EXAM-U2-115",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Con cinco sesiones de 18 €, ¿cuánto se paga tras el 10 % de descuento?",
    "solution": "5×18=90; descuento 9; total 81.",
    "options": [
      "90 €",
      "81 €",
      "85,50 €",
      "72 €"
    ],
    "correct": [
      1
    ],
    "code": "$importe = 5 * 18;\n$descuento = $importe * 0.10;\necho $importe - $descuento;",
    "check": "",
    "image": "",
    "activity": "Tarea02.1 · Prueba 2"
  },
  {
    "id": "EXAM-U2-116",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "medio",
    "origin": "audio",
    "prompt": "En el fragmento de formulario, ¿qué afirmaciones son correctas?",
    "solution": "Los valores del formulario suelen llegar como cadenas y deben validarse en PHP.",
    "options": [
      "El name genera la clave en $_POST.",
      "type=number garantiza que PHP recibirá int.",
      "required no sustituye a validar en el servidor.",
      "El formulario puede enviarse por POST."
    ],
    "correct": [
      0,
      2,
      3
    ],
    "code": "<form method=\"post\" action=\"\">\n  <input type=\"number\" name=\"sesiones\" min=\"1\" max=\"10\" required>\n  <button type=\"submit\">Enviar</button>\n</form>",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U2-117",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "medio",
    "origin": "temario",
    "prompt": "Sobre la validación previa a subir un fichero, ¿qué verificaciones harías en el servidor?",
    "solution": "error y size ayudan; comprobar contenido/tipo real y controlar el nombre de destino.",
    "options": [
      "Comprobar el código error.",
      "Comprobar tamaño.",
      "Confiar ciegamente en $_FILES[\"type\"].",
      "Verificar el tipo real permitido.",
      "Usar sin comprobar el nombre original como destino."
    ],
    "correct": [
      0,
      1,
      3
    ],
    "code": "if (isset($_FILES['archivo'])) {\n    $file = $_FILES['archivo'];\n}",
    "check": "",
    "image": "",
    "activity": "Actividad 2.6 · Archivos"
  },
  {
    "id": "EXAM-U3-031",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "medio",
    "origin": "audio",
    "prompt": "En este fragmento, ¿cuáles son correctas?",
    "solution": "setcookie prepara Set-Cookie y la variable superglobal $_COOKIE corresponde a las cookies recibidas.",
    "options": [
      "setcookie envía una cabecera al navegador.",
      "$_COOKIE cambia automáticamente dentro de la misma petición.",
      "El navegador podrá enviar la cookie en una petición posterior.",
      "time()+3600 establece aproximadamente una hora."
    ],
    "correct": [
      0,
      2,
      3
    ],
    "code": "setcookie('idioma', 'es', time()+3600);",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U3-032",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué resultado producen los dos password_verify() de este ejemplo?",
    "solution": "La sal aleatoria hace que los hashes normalmente difieran, pero ambos verifican la misma contraseña.",
    "options": [
      "true y true",
      "false y false",
      "true y false",
      "No pueden verificarse dos hashes distintos"
    ],
    "correct": [
      0
    ],
    "code": "$clave = 'abc123.';\n$a = password_hash($clave, PASSWORD_BCRYPT);\n$b = password_hash($clave, PASSWORD_BCRYPT);\nvar_dump(password_verify($clave, $a));\nvar_dump(password_verify($clave, $b));",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U3-033",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué ocurre al intentar acceder a una página privada sin id_usuario en sesión?",
    "solution": "Se envía Location y exit detiene el script; la parte privada no se ejecuta.",
    "options": [
      "Muestra la página privada",
      "Redirige a login y termina",
      "Crea un nuevo usuario",
      "Pide a PHP que calcule un hash"
    ],
    "correct": [
      1
    ],
    "code": "session_start();\nif (!isset($_SESSION['id_usuario'])) {\n    header('Location: login.php');\n    exit;\n}\necho 'Privada';",
    "check": "",
    "image": "",
    "activity": "Ejemplo · privada.php"
  },
  {
    "id": "EXAM-U3-034",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué variable debería utilizar el código para comprobar un rol de administrador en el servidor?",
    "solution": "La autorización se comprueba del lado servidor, utilizando datos de identidad y rol confiables.",
    "options": [
      "Un estilo CSS oculto",
      "Una entrada de rol validada en la sesión",
      "El texto de un botón",
      "La longitud de la URL"
    ],
    "correct": [
      1
    ],
    "code": "session_start();\nif (($_SESSION['rol'] ?? '') !== 'administrador') {\n    http_response_code(403);\n    exit;\n}",
    "check": "",
    "image": ""
  },
  {
    "id": "EXAM-U1-010",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Un navegador solicita una página y recibe HTML, CSS y JavaScript. Explica qué componente inicia la petición HTTP, interpreta HTML/CSS y ejecuta JavaScript del lado cliente.",
    "solution": "El navegador web del cliente interpreta HTML y CSS y normalmente inicia la petición HTTP al servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Navegador en cliente, HTML/CSS y petición HTTP.",
    "image": "",
    "activity": "Tema 1 · Esquema lado cliente",
    "scenario": "Situación: una persona introduce una dirección en Chrome. El navegador solicita una página al servidor y recibe HTML con estilos CSS y scripts JavaScript."
  },
  {
    "id": "EXAM-U2-118",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Dado el siguiente array con claves no consecutivas, explica cómo se relacionan claves y valores y por qué foreach puede recorrerlo correctamente sin conocer sus índices.",
    "solution": "Cada elemento tiene una clave asociada al valor. foreach recorre los elementos existentes en su orden de inserción y puede recuperar tanto clave como valor.",
    "options": [],
    "correct": [],
    "code": "$ciclos = [0 => \"DAM\", 2 => \"ASIR\", 5 => \"DAW\"];",
    "check": "Clave, valor y recorrido real, sin suponer índices consecutivos.",
    "image": "",
    "activity": "Teoría 1.11 · Arrays",
    "scenario": "El array representa los ciclos formativos disponibles. Hay claves 0, 2 y 5, pero las claves 1, 3 y 4 no existen. La pregunta utiliza el código que aparece a continuación, no una imagen externa."
  },
  {
    "id": "EXAM-U2-119",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Observa el esquema de arrays multidimensionales. Explica cómo localizar un valor usando dos índices.",
    "solution": "El primer índice selecciona el array interior o fila y el segundo selecciona un elemento de ese array. Por ejemplo $tabla[1][0] accede al primer valor de la segunda fila.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Fila, columna y base cero.",
    "image": "arrays-multidimensionales.png",
    "activity": "Teoría 1.14 · Matrices",
    "imageCaption": "Ejemplo del manual de PHP de arrays anidados"
  },
  {
    "id": "EXAM-U3-035",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "medio",
    "origin": "audio",
    "prompt": "Observando el diagrama del ciclo de cookies, ¿qué acciones intervienen en peticiones sucesivas?",
    "solution": "La cookie se almacena en navegador y se envía en siguientes solicitudes que cumplan sus atributos.",
    "options": [
      "El servidor envía Set-Cookie.",
      "El navegador almacena la cookie.",
      "El navegador envía Cookie cuando corresponda.",
      "$_COOKIE se actualiza en el mismo instante en que se llama setcookie()."
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": "cookies-ciclo.jpg",
    "imageCaption": "Diagrama del ciclo de vida de las cookies"
  },
  {
    "id": "EXAM-U3-036",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Observa el ejemplo de respuesta HTTP. ¿Qué elemento indica el resultado general de la petición?",
    "solution": "La línea de estado de respuesta contiene protocolo, código de estado y frase.",
    "options": [
      "La línea HTTP/1.1 200 OK",
      "La extensión del archivo HTML",
      "El valor de la cookie",
      "El nombre de la imagen"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "image": "http-response.png",
    "imageCaption": "Estructura de una respuesta HTTP"
  },
  {
    "id": "EXAM-U3-037",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "En el esquema de redirección HTTP, describe qué petición adicional hace el navegador al recibir Location.",
    "solution": "El navegador recibe una respuesta de redirección 3xx con Location y realiza una nueva petición al destino indicado. En PHP, header(\"Location: ...\") genera la cabecera y exit detiene la ejecución posterior.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Código 3xx, Location, nueva petición y exit.",
    "image": "http-redireccion.png",
    "activity": "Teoría 2.2 · Redirección",
    "imageCaption": "Flujo de una redirección HTTP"
  }
];
