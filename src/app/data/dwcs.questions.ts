import type { Question } from '../core/questions';

export const DWCS_QUESTIONS: Question[] = [
  {
    "id": "U1-01",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia fundamental existe entre una página web estática y una dinámica?",
    "solution": "En la estática se sirve normalmente un recurso ya existente; la dinámica genera la respuesta a partir de lógica del servidor y, en su caso, datos.",
    "options": [
      "La estática no utiliza HTTP.",
      "La dinámica puede construir la respuesta ejecutando lógica en el servidor.",
      "La dinámica obliga a usar Java.",
      "La estática siempre necesita una base de datos."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": "web-estatica-dinamica.png"
  },
  {
    "id": "U1-02",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "multi",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué tecnologías figuran expresamente en el apartado «Lado cliente» del temario?",
    "solution": "El temario enumera JavaScript, HTML, CSS y HTTP. PHP pertenece al entorno servidor.",
    "options": [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "HTTP"
    ],
    "correct": [
      0,
      1,
      2,
      4
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U1-03",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "audio",
    "prompt": "Define el papel del cliente y el servidor en una aplicación web y explica quién inicia normalmente la comunicación.",
    "solution": "El navegador, como cliente, inicia una petición HTTP; el servidor recibe la petición y envía una respuesta. El navegador interpreta la respuesta para presentarla.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Cliente inicia la petición; servidor responde; se menciona HTTP y el papel del navegador.",
    "image": ""
  },
  {
    "id": "U1-04",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Describe, paso a paso, el recorrido de una petición en una web dinámica que consulta una base de datos.",
    "solution": "1) El navegador solicita una URL. 2) El servidor web recibe la petición. 3) Se ejecuta lógica de la aplicación en el servidor. 4) Si procede, consulta datos. 5) Se genera una respuesta (por ejemplo HTML). 6) El servidor devuelve la respuesta HTTP y el navegador la muestra.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Incluye cliente, servidor web, lógica/aplicación, base de datos opcional, respuesta HTTP y navegador.",
    "image": ""
  },
  {
    "id": "U1-05",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál de las siguientes afirmaciones describe mejor un cliente pesado (thick client)?",
    "solution": "El equipo del usuario realiza gran parte de la interfaz y del procesamiento; el servidor proporciona datos o almacenamiento.",
    "options": [
      "Toda la lógica se ejecuta necesariamente en el servidor.",
      "El cliente realiza gran parte del procesamiento.",
      "Solo puede accederse desde Firefox.",
      "No puede comunicarse con una base de datos."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U1-06",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona las afirmaciones correctas sobre servidores web y servidores de aplicaciones.",
    "solution": "Un servidor web atiende HTTP y puede entregar recursos estáticos; uno de aplicaciones suele ejecutar lógica de negocio. En la práctica un mismo software puede asumir ambos papeles.",
    "options": [
      "Un servidor web puede servir HTML e imágenes.",
      "Un servidor de aplicaciones puede ejecutar lógica de negocio.",
      "Todo servidor de aplicaciones necesita una máquina física distinta.",
      "Un mismo software puede asumir funciones de ambos tipos."
    ],
    "correct": [
      0,
      1,
      3
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U1-07",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "audio",
    "prompt": "Explica qué son HTML, CSS y JavaScript en el lado cliente, y cuál es la función de cada uno.",
    "solution": "HTML estructura el contenido, CSS define su presentación y JavaScript aporta comportamiento e interactividad en el navegador.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Atribuye estructura a HTML, estilos a CSS y comportamiento a JavaScript.",
    "image": ""
  },
  {
    "id": "U1-08",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué diferencia básica existe entre TCP y UDP, según el modelo TCP/IP del temario?",
    "solution": "TCP establece conexión y proporciona entrega ordenada y fiable; UDP no establece conexión ni garantiza entrega u orden.",
    "options": [
      "UDP garantiza la entrega ordenada y TCP no.",
      "TCP y UDP son lenguajes de marcado.",
      "TCP establece conexión y UDP no garantiza entrega u orden.",
      "TCP solo se usa en redes Wi-Fi."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U1-09",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica qué hace DNS cuando un navegador utiliza un dominio para acceder a una web.",
    "solution": "DNS permite resolver un nombre de dominio legible a una dirección IP, de manera que se pueda localizar el servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Nombres de dominio → resolución → dirección IP.",
    "image": ""
  },
  {
    "id": "U1-10",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "multi",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuáles de estos componentes forman parte de la pila AMP descrita en el temario?",
    "solution": "AMP se refiere a Apache, MySQL y un lenguaje como PHP, Perl o Python. LAMP/WAMP/MAMP incorporan el sistema operativo.",
    "options": [
      "Apache",
      "MySQL",
      "PHP",
      "IIS",
      "Perl"
    ],
    "correct": [
      0,
      1,
      2,
      4
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U1-11",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Compara Apache Tomcat, un Servlet y una página JSP, indicando sus funciones en una aplicación Java web.",
    "solution": "Tomcat es un contenedor web para servlets y JSP. Un servlet es una clase Java que procesa solicitudes HTTP (por ejemplo con doGet/doPost); una JSP facilita construir la vista y se traduce a servlet. Tomcat no incluye por sí mismo todas las capacidades de un servidor Jakarta EE completo.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Define Tomcat, Servlet, JSP y diferencia vista/controlador.",
    "image": ""
  },
  {
    "id": "U1-12",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "alto",
    "origin": "audio",
    "prompt": "Explica dos diferencias entre tecnología del lado cliente y tecnología del lado servidor usando PHP como ejemplo.",
    "solution": "HTML/CSS/JavaScript se procesan principalmente en el navegador; PHP se ejecuta en el servidor, puede consultar datos y generar HTML. El navegador recibe el resultado, no el código PHP original.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Menciona dónde se ejecuta PHP y que la respuesta HTTP transporta la salida generada.",
    "image": ""
  },
  {
    "id": "U1-13",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "Una URL contiene parámetros tras el signo ? y separados por &. En el ejemplo de búsqueda del temario, ¿qué método HTTP se ilustra?",
    "solution": "El ejemplo ilustra una petición GET con parámetros en la URL.",
    "options": [
      "POST",
      "GET",
      "PUT",
      "DELETE"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-01",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "En un formulario con method=\"post\", ¿qué atributo HTML determina la clave de $_POST que recibe PHP?",
    "solution": "El atributo name, no el id, define la clave enviada.",
    "options": [
      "id",
      "class",
      "name",
      "placeholder"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-02",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "audio",
    "prompt": "Un formulario permite marcar varias prendas y elegir un solo color. ¿Qué configuraciones son correctas?",
    "solution": "Para reunir valores múltiples en PHP se usa name=\"prendas[]\"; un solo color utiliza name=\"color\". El método GET permite recuperarlos con $_GET.",
    "options": [
      "Checkbox con name=\"prendas[]\"",
      "Color con name=\"color\"",
      "Formulario con method=\"get\"",
      "Checkbox con name=\"prendas\" para obtener automáticamente un array",
      "Leer las prendas con $_POST cuando se envió GET"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-03",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué diferencia existe entre $_GET, $_POST y $_SERVER[\"REQUEST_METHOD\"]?",
    "solution": "$_GET contiene parámetros recibidos por GET; $_POST contiene datos de formularios POST compatibles; REQUEST_METHOD indica el método de la petición, no verifica si existe un campo.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Distingue la fuente de datos de la detección del método HTTP.",
    "image": ""
  },
  {
    "id": "U2-04",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "audio",
    "prompt": "Escribe una función tipada esPar(int $numero): bool que devuelva si un entero es par.",
    "solution": "function esPar(int $numero): bool {\n    return $numero % 2 === 0;\n}",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Declara tipos int y bool, utiliza % 2 y devuelve bool mediante return.",
    "image": "",
    "codeTask": "write"
  },
  {
    "id": "U2-05",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "audio",
    "prompt": "Escribe una función tipada que reciba un array y devuelva la suma de sus elementos mayores que 10, utilizando foreach.",
    "solution": "function sumarMayoresQueDiez(array $valores): int {\n    $total = 0;\n    foreach ($valores as $valor) {\n        if ($valor > 10) {\n            $total += $valor;\n        }\n    }\n    return $total;\n}",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Usa acumulador inicial 0, foreach, condición > 10 y return; se asumen números enteros.",
    "image": "",
    "codeTask": "write"
  },
  {
    "id": "U2-06",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es el resultado de la comparación estricta 5 === \"5\" en PHP?",
    "solution": "false: el valor parece equivalente, pero los tipos son distintos (int frente a string).",
    "options": [
      "true",
      "false",
      "null",
      "Se produce siempre una excepción"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-07",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "audio",
    "prompt": "Indica exactamente qué se imprime y explica por qué.",
    "solution": "bool(false)\nbool(true)\n\nisset() devuelve false cuando la variable contiene null y true si está definida y no es null.",
    "options": [],
    "correct": [],
    "code": "$x = null;\nvar_dump(isset($x));\n$x = 0;\nvar_dump(isset($x));",
    "check": "Salida booleana false, true; distingue null de 0.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U2-08",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué expresión comprueba correctamente si strpos($texto, \"PHP\") ha encontrado el texto, incluso cuando comienza en la posición 0?",
    "solution": "strpos devuelve 0 cuando aparece al comienzo y false cuando no existe, así que se usa !== false.",
    "options": [
      "if (strpos($texto, \"PHP\"))",
      "if (strpos($texto, \"PHP\") !== false)",
      "if (strpos($texto, \"PHP\") === true)",
      "if (strpos($texto, \"PHP\") > 0)"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-09",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué valores muestra el recorrido y en qué orden?",
    "solution": "DAM, ASIR y DAW, en ese orden de inserción. foreach no supone índices consecutivos.",
    "options": [],
    "correct": [],
    "code": "$ciclos = [0 => \"DAM\", 2 => \"ASIR\", 5 => \"DAW\"];\nforeach ($ciclos as $ciclo) {\n    echo $ciclo . \" \";\n}",
    "check": "Identifica salida DAM ASIR DAW y que foreach no necesita índices consecutivos.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U2-10",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "audio",
    "prompt": "¿Qué salida se obtiene? Explica el funcionamiento de los índices de una matriz.",
    "solution": "90. $tabla[1] apunta a la segunda fila y [1] al segundo elemento de esa fila.",
    "options": [],
    "correct": [],
    "code": "$tabla = [\n    [10, 20, 30],\n    [40, 90, 60]\n];\necho $tabla[1][1];",
    "check": "Indica 90 y la interpretación fila 1, columna 1.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U2-11",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "audio",
    "prompt": "Diseña una solución para generar una tabla HTML de 3 × 4 con valores aleatorios entre 0 y 10, separando crearMatriz() y mostrarMatriz(). ¿Por qué no deben generarse números en mostrarMatriz()?",
    "solution": "crearMatriz(int $filas, int $columnas): array debe construir y devolver una matriz con rand(0,10). mostrarMatriz(array $matriz): void debe recorrerla y generar etiquetas table/tr/td con echo. Se generan los datos una sola vez para separar modelo y presentación y mostrar exactamente los valores almacenados.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Separación de responsabilidades, bucles anidados, rand(0,10), retorno array y salida HTML sin recalcular.",
    "image": ""
  },
  {
    "id": "U2-12",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué diferencia existe entre require e include cuando el archivo indicado no se encuentra?",
    "solution": "include emite una advertencia y permite seguir; require provoca un error que impide continuar normalmente.",
    "options": [
      "Ambos ejecutan el archivo dos veces.",
      "include continúa con advertencia; require impide seguir normalmente.",
      "require sirve solo para archivos HTML.",
      "include siempre carga el archivo una sola vez."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-13",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Para qué se utiliza require_once con __DIR__ al incluir un archivo PHP?",
    "solution": "require_once incorpora el archivo si aún no ha sido incluido, y __DIR__ construye la ruta desde el directorio del archivo actual evitando depender del directorio de ejecución.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Explica inclusión una sola vez y ruta basada en ubicación del archivo.",
    "image": ""
  },
  {
    "id": "U2-14",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué elementos corresponden a la documentación PHPDoc de una función?",
    "solution": "Un bloque /** ... */ puede llevar descripción, @param, @return y @throws.",
    "options": [
      "@param",
      "@return",
      "@throws",
      "session_start()",
      "<html>"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-15",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "audio",
    "prompt": "Escribe el resultado de la llamada.",
    "solution": "La función devuelve el producto 12.5 × 2 = 25.0 (float). La instrucción echo lo muestra como 25.",
    "options": [],
    "correct": [],
    "code": "function calcularImporte(float $precio, int $sesiones): float {\n    return $precio * $sesiones;\n}\necho calcularImporte(12.5, 2);",
    "check": "Resultado visible: 25; el valor retornado es float 25.0.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U2-16",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Explica qué se imprime y por qué el bucle no repite la condición original cuando se asigna continue.",
    "solution": "1 2 4 5. Cuando $i es 3 se salta el echo y continúa con la siguiente iteración; for ejecuta su actualización.",
    "options": [],
    "correct": [],
    "code": "for ($i = 1; $i <= 5; $i++) {\n    if ($i === 3) {\n        continue;\n    }\n    echo $i . \" \";\n}",
    "check": "Salida 1 2 4 5 y significado de continue.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U2-17",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué devuelve el operador ?? en la expresión $nombre = $_GET[\"nombre\"] ?? \"Anónimo\" si no existe ese parámetro?",
    "solution": "Devuelve \"Anónimo\" sin intentar leer como valor definido una clave inexistente.",
    "options": [
      "null",
      "false",
      "\"Anónimo\"",
      "Una excepción siempre"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-18",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué resultado tiene $resultado = 0 ?: 99 en PHP?",
    "solution": "Elvis comprueba si el operando es truthy; 0 es falsy, por lo que se elige 99.",
    "options": [
      "0",
      "false",
      "99",
      "null"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-19",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Explica por qué validar con required, min y max en HTML no sustituye las validaciones en PHP. Pon como ejemplo el número de sesiones de un taller.",
    "solution": "El navegador es controlado por el cliente y las comprobaciones HTML pueden evitarse. En procesar.php se debe validar que sesiones existe, es un entero y está entre 1 y 10; también validar nombre no vacío y que la clave del taller existe en $tarifas. Si hay errores no se calcula el importe.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Manipulación del cliente, validación servidor, reglas de sesión y taller, acumulación de errores.",
    "image": ""
  },
  {
    "id": "U2-20",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué sucede si el formulario envía edad=\"25\" desde un input type=\"number\"? ¿Cómo garantizar un número entero para calcular?",
    "solution": "En $_POST el valor recibido es string \"25\". Puede validarse el formato y rango y convertirse a int después, por ejemplo con filter_var usando FILTER_VALIDATE_INT; un simple cast no valida el contenido.",
    "options": [],
    "correct": [],
    "code": "$edad = $_POST[\"edad\"];",
    "check": "Distingue string de int, recomienda validar antes del cast.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U2-21",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué hace htmlspecialchars() al mostrar un dato de usuario dentro del contenido HTML de una página?",
    "solution": "Convierte caracteres especiales en entidades HTML, reduciendo el riesgo de XSS en ese contexto. No evita por sí sola la inyección SQL.",
    "options": [
      "Evita todas las inyecciones SQL.",
      "Convierte texto potencialmente interpretado como HTML en entidades.",
      "Cifra el valor antes de almacenarlo.",
      "Comprueba que la contraseña sea correcta."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-22",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué se necesita para enviar correctamente varios ficheros desde un formulario a PHP?",
    "solution": "POST, multipart/form-data, multiple y name con [] son necesarios según la actividad; la información llega a $_FILES.",
    "options": [
      "method=\"post\"",
      "enctype=\"multipart/form-data\"",
      "input con multiple",
      "name=\"ficheros[]\"",
      "method=\"get\""
    ],
    "correct": [
      0,
      1,
      2,
      3
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-23",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Describe las comprobaciones que debe hacer el servidor antes de guardar los archivos subidos y cómo funciona move_uploaded_file().",
    "solution": "Comprobar método, existencia de $_FILES, código UPLOAD_ERR_OK, límite de tamaño, tipo permitido verificado en servidor y nombre de destino seguro generado por la aplicación. Guardar con move_uploaded_file(tmp_name, destino), comprobar su retorno y no confiar en name/type/full_path enviados por cliente. Para múltiples archivos, recorrer sus índices.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Error, tamaño, tipo real, nombre seguro, tmp_name, destino y control del resultado.",
    "image": ""
  },
  {
    "id": "U2-24",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia hay entre upload_max_filesize, post_max_size y max_file_uploads?",
    "solution": "upload_max_filesize limita cada fichero, post_max_size limita el tamaño total del cuerpo POST y max_file_uploads el número máximo de archivos admitidos por petición.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Cada archivo vs total POST vs cantidad de ficheros.",
    "image": ""
  },
  {
    "id": "U2-25",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué se muestra? Explica la diferencia entre el array devuelto y la variable original.",
    "solution": "Java es fácil. Java es útil. str_replace devuelve la cadena modificada; $mensaje original no cambia.",
    "options": [],
    "correct": [],
    "code": "$mensaje = \"PHP es fácil. PHP es útil.\";\necho str_replace(\"PHP\", \"Java\", $mensaje);",
    "check": "Salida completa y ausencia de mutación de $mensaje.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U2-26",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué significa declare(strict_types=1) en un archivo que llama a una función con parámetros tipados?",
    "solution": "Activa comprobación estricta de tipos escalares en llamadas hechas desde ese archivo, con las excepciones definidas por PHP.",
    "options": [
      "PHP deja de admitir arrays.",
      "El tipo de cada variable se fija para siempre.",
      "Las llamadas realizadas desde ese archivo aplican comprobaciones estrictas de tipos escalares.",
      "Desactiva la conversión HTML."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-27",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "alto",
    "origin": "audio",
    "prompt": "Explica por qué, para sumar elementos de un array, la profesora considera suficiente saber usar un acumulador y foreach aunque no recuerdes array_sum().",
    "solution": "Un recorrido permite procesar uno a uno los valores y acumularlos en una variable inicializada a 0. La profesora prioriza conocer el algoritmo y estructuras básicas frente a memorizar funciones específicas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Acumulador, bucle y prioridad de lógica frente a nombres de funciones.",
    "image": ""
  },
  {
    "id": "U2-28",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "audio",
    "prompt": "Plantea la organización de los cuatro archivos de la tarea de inscripción en talleres y cómo evitar duplicar datos.",
    "solution": "tarifas.php define el único array asociativo de precios; index.php lo requiere y genera el select con foreach; funciones.php implementa calcularImporte, calcularDescuento y calcularTotal con tipos y return; procesar.php valida $_POST, recopila errores y calcula/muestra solo si los datos son válidos. Se utiliza require_once y htmlspecialchars al presentar texto.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Responsabilidades de index.php/procesar.php/funciones.php/tarifas.php, validación y un solo origen para precios.",
    "image": ""
  },
  {
    "id": "U2-29",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué ocurre con el array después de unset($ciclos[1]) si antes era [\"DAM\", \"DAW\", \"ASIR\"]?",
    "solution": "Se elimina la clave 1, pero las claves restantes no se renumeran automáticamente.",
    "options": [
      "Queda con claves 0 y 1, automáticamente.",
      "Queda con claves 0 y 2.",
      "Se elimina todo el array.",
      "Da error de sintaxis."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U2-30",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica la diferencia entre strlen() y mb_strlen() sobre la cadena UTF-8 \"María\".",
    "solution": "strlen cuenta bytes: 6; mb_strlen($nombre, \"UTF-8\") cuenta caracteres Unicode: 5.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "6 bytes frente a 5 caracteres.",
    "image": ""
  },
  {
    "id": "U2-31",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Indica la salida exacta y explica qué variable se conserva fuera de los bucles.",
    "solution": "3 y luego 2-6 (según la separación realizada con echo). En PHP, los bucles no crean un ámbito local propio: $i, $key y $value persisten tras el bucle.",
    "options": [],
    "correct": [],
    "code": "$i = 0;\nfor (; $i < 3; $i++) {}\n$datos = [2, 4, 6];\nforeach ($datos as $key => $value) {}\necho $i . \" / \" . $key . \"-\" . $value;",
    "check": "Salida 3 / 2-6 y explicación del ámbito.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U3-01",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "audio",
    "prompt": "¿Qué significa exactamente que HTTP sea un protocolo sin estado?",
    "solution": "Que cada petición HTTP se procesa por sí misma y el protocolo no conserva automáticamente un contexto de usuario entre peticiones. La aplicación necesita mecanismos adicionales si quiere relacionarlas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Independencia de peticiones y ausencia de memoria automática.",
    "image": "http-request.png"
  },
  {
    "id": "U3-02",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "audio",
    "prompt": "Explica cómo las cookies y las sesiones de PHP permiten suplir la falta de estado de HTTP. Compara ventajas e inconvenientes.",
    "solution": "La cookie conserva valores en el navegador y los remite en peticiones posteriores; es sencilla para preferencias, pero el usuario puede verla/modificarla y hay límites de tamaño y privacidad. La sesión guarda datos en el servidor; el navegador suele conservar únicamente un SID en cookie, que permite recuperar esos datos. Da mejor control sobre datos internos, pero requiere almacenamiento/gestión en el servidor y proteger el SID.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Ambos mecanismos, ubicación de datos, SID y ventajas/inconvenientes de cada uno.",
    "image": "http-response.png"
  },
  {
    "id": "U3-03",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuándo estará disponible en $_COOKIE una cookie recién creada con setcookie() sin modificar manualmente el array?",
    "solution": "En la siguiente petición del navegador que envíe la cookie, no durante la misma ejecución.",
    "options": [
      "De inmediato en la misma ejecución.",
      "Solo tras reiniciar Apache.",
      "En una petición posterior cuando el navegador la envíe.",
      "Nunca."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": "cookies-ciclo.jpg"
  },
  {
    "id": "U3-04",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona las afirmaciones correctas sobre parámetros de cookies.",
    "solution": "Secure restringe la transmisión a HTTPS; HttpOnly restringe lectura directa desde JavaScript y SameSite ayuda a limitar el envío entre sitios. Path delimita las rutas en las que se enviará.",
    "options": [
      "secure ayuda a impedir el envío por HTTP.",
      "httponly impide acceso directo desde document.cookie.",
      "samesite puede ayudar a mitigar CSRF.",
      "path indica una ruta de disco del cliente.",
      "expires determina caducidad."
    ],
    "correct": [
      0,
      1,
      2,
      4
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U3-05",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "audio",
    "prompt": "Enumera los pasos del ciclo de vida de una cookie desde su creación hasta una nueva petición al servidor.",
    "solution": "El cliente solicita la página; el servidor responde con Set-Cookie; el navegador almacena la cookie; en peticiones posteriores compatibles la envía mediante Cookie; PHP la recibe en $_COOKIE.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Petición, respuesta Set-Cookie, almacenamiento, envío posterior y $_COOKIE.",
    "image": ""
  },
  {
    "id": "U3-06",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Dónde se almacena normalmente el valor de $_SESSION en la configuración habitual de PHP con el manejador files?",
    "solution": "En archivos del servidor; el navegador guarda generalmente el identificador PHPSESSID.",
    "options": [
      "En el atributo URL fragment.",
      "En una tabla DNS.",
      "En un fichero del servidor asociado al SID.",
      "Siempre en localStorage del navegador."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U3-07",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué afirmaciones sobre la destrucción de sesiones son correctas?",
    "solution": "unset elimina una clave; session_unset vacía variables; session_destroy destruye los datos persistidos, pero no borra por sí misma la cookie ni necesariamente el array en memoria.",
    "options": [
      "unset($_SESSION[\"cesta\"]) elimina solo esa variable.",
      "session_unset() vacía las variables de sesión.",
      "session_destroy() elimina automáticamente la cookie del navegador.",
      "session_destroy() destruye los datos del servidor asociados a esa sesión."
    ],
    "correct": [
      0,
      1,
      3
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U3-08",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "audio",
    "prompt": "Explica cómo debe realizarse un cierre de sesión completo en PHP y por qué son necesarias varias operaciones.",
    "solution": "Iniciar/recuperar la sesión, vaciar $_SESSION, caducar la cookie de sesión empleando nombre y parámetros coherentes, llamar a session_destroy(), redirigir con header(Location) y terminar con exit. Los datos del servidor y el SID en el navegador son entidades distintas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "session_start, vaciar, cookie caducada, session_destroy, redirección/exit y distinción SID/datos.",
    "image": ""
  },
  {
    "id": "U3-09",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Si generamos dos hashes consecutivos de la misma contraseña con password_hash($password, PASSWORD_BCRYPT), ¿qué se espera?",
    "solution": "Normalmente los hashes serán distintos por las sales aleatorias, pero password_verify comprobará correctamente ambos.",
    "options": [
      "Serán idénticos necesariamente.",
      "Serán normalmente distintos y ambos válidos para verificar la contraseña.",
      "Se recupera la contraseña original desde el hash.",
      "password_verify exige generar un nuevo hash igual."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U3-10",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Describe la comprobación de acceso en este fragmento y qué sucede si el usuario no está autenticado.",
    "solution": "session_start recupera la sesión; si no existe id_usuario se envía una redirección a login.php y exit detiene la ejecución, impidiendo mostrar el contenido privado.",
    "options": [],
    "correct": [],
    "code": "session_start();\nif (!isset($_SESSION[\"id_usuario\"])) {\n    header(\"Location: login.php\");\n    exit;\n}",
    "check": "Reconoce sesión, comprobación, redirección y salida inmediata.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "U3-11",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "alto",
    "origin": "temario",
    "prompt": "Diferencia password_hash() de password_verify() y explica por qué no se compara la contraseña con el hash usando ==.",
    "solution": "password_hash genera el hash para almacenar durante el registro; password_verify comprueba la contraseña frente al hash guardado usando sus parámetros. == no sirve porque el hash no es el texto original y la sal hace que los hashes puedan variar.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Funciones para registro/verificación y efecto de sal.",
    "image": ""
  },
  {
    "id": "U3-12",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "alto",
    "origin": "audio",
    "prompt": "¿Qué mecanismos de autenticación aparecen descritos expresamente en el apartado 4 del temario?",
    "solution": "El texto enumera usuario/contraseña, certificados digitales, tokens o llaves, biometría y federación. El audio habla de cuatro categorías, sin enumerarlas; no conviene confundir ambas fuentes.",
    "options": [
      "Usuario y contraseña",
      "Certificados digitales",
      "Tokens o llaves de seguridad",
      "Biometría",
      "Autenticación federada",
      "Solo dirección IP"
    ],
    "correct": [
      0,
      1,
      2,
      3,
      4
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U3-13",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Cuál de estas afirmaciones diferencia correctamente OAuth 2.0 de OpenID Connect?",
    "solution": "OAuth 2.0 es un marco de autorización delegada; OIDC añade una capa de identidad/autenticación sobre OAuth 2.0.",
    "options": [
      "OAuth 2.0 se utiliza solo para almacenar contraseñas.",
      "OIDC está construido sobre OAuth 2.0 y añade autenticación.",
      "OIDC es el formato de cookies de PHP.",
      "Son nombres de dos algoritmos hash."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U3-14",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "audio",
    "prompt": "Describe el recorrido de un inicio de sesión en la aplicación de ejemplo: desde login.php hasta privada.php, identificando el papel de usuarios.php y validar.php.",
    "solution": "login.php recoge credenciales por POST. validar.php comprueba método y entradas, usa usuarios.php para consultar el usuario almacenado en usuarios.json y password_verify contra el hash. Si valida, inicia sesión y guarda id_usuario/usuario, redirigiendo a privada.php. Esta página recupera la sesión y protege el acceso. Si falla, guarda un mensaje de error temporal y redirige al login.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Archivos, POST, validación, lectura JSON, password_verify, $_SESSION, redirecciones y protección.",
    "image": ""
  },
  {
    "id": "U3-15",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia fundamental existe entre autenticación y autorización?",
    "solution": "Autenticación verifica identidad; autorización determina acciones y recursos permitidos.",
    "options": [
      "Son exactamente lo mismo.",
      "Autenticación decide permisos y autorización verifica la contraseña.",
      "Autenticación verifica identidad; autorización comprueba permisos.",
      "La autorización solo se hace en CSS."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U3-16",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "audio",
    "prompt": "Explica el modelo RBAC y por qué no basta con ocultar un botón de administración en HTML.",
    "solution": "RBAC asigna permisos a roles y roles a usuarios. Tras autenticarse, el servidor debe comprobar permisos al realizar cada operación protegida; ocultar botones no impide que alguien llame directamente a una URL o endpoint.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Usuarios/roles/permisos, comprobación del lado servidor y acceso directo a rutas.",
    "image": ""
  },
  {
    "id": "U3-17",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica por qué header(\"Location: privada.php\") debe ir acompañado de exit() y por qué las cabeceras deben enviarse antes del HTML.",
    "solution": "header establece una cabecera de redirección; exit impide que continúe el procesamiento y se emita contenido protegido. Las cabeceras HTTP deben prepararse antes de enviar el cuerpo de la respuesta.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Cabeceras antes de salida, redirección y detención con exit.",
    "image": "http-redireccion.png"
  },
  {
    "id": "U3-18",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "medio",
    "origin": "temario",
    "prompt": "Según el apartado normativo, ¿cuáles son las obligaciones generales para cookies de analítica o publicidad no exentas?",
    "solution": "Información clara y consentimiento previo y libre cuando corresponde. Las cookies técnicas estrictamente necesarias pueden quedar exentas del consentimiento.",
    "options": [
      "Informar claramente al usuario.",
      "Obtener consentimiento previo cuando no están exentas.",
      "Todas las cookies están siempre exentas.",
      "El consentimiento tácito sirve siempre."
    ],
    "correct": [
      0,
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "U3-19",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "alto",
    "origin": "audio",
    "prompt": "¿Por qué conservar el identificador SID en una cookie suele ser preferible a incluirlo en una URL?",
    "solution": "En la URL puede filtrarse por historial, registros, capturas, enlaces compartidos o referencias; el identificador de sesión es sensible y conviene mantenerlo en cookies adecuadamente protegidas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Riesgo de exposición por URL y papel del SID.",
    "image": ""
  },
  {
    "id": "IMG-01",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Observa el esquema de web estática y web dinámica. Describe el recorrido de la petición y en qué momento interviene la lógica del servidor en cada caso.",
    "solution": "Estática: el navegador solicita un recurso existente, el servidor lo entrega mediante HTTP y el navegador lo interpreta. Dinámica: la petición provoca la ejecución de lógica del servidor, que puede consultar una base de datos y generar una respuesta que se devuelve al cliente.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Distinguir recurso preexistente frente a generación dinámica y describir cliente, HTTP, servidor y navegador.",
    "image": "web-estatica-dinamica.png"
  },
  {
    "id": "IMG-02",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "En el esquema del ciclo de una cookie, ¿cuándo recibe PHP normalmente el valor de una cookie que acaba de establecer mediante setcookie()?",
    "solution": "Cuando el navegador la envía en una petición HTTP posterior; setcookie() prepara la cabecera de respuesta, no actualiza automáticamente $_COOKIE de la petición actual.",
    "options": [
      "En la misma llamada a setcookie() se actualiza $_COOKIE.",
      "En la siguiente petición del navegador que envíe esa cookie.",
      "Al ejecutar phpinfo().",
      "Al cerrar Apache."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": "cookies-ciclo.jpg"
  },
  {
    "id": "IMG-03",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "alto",
    "origin": "temario",
    "prompt": "Examina la imagen de una petición HTTP. Explica para qué sirven la primera línea y las cabeceras de la solicitud.",
    "solution": "La línea inicial indica método, recurso solicitado y versión en HTTP/1.x. Las cabeceras aportan metadatos como Host, idioma aceptado o tipo de contenido. El servidor las utiliza al procesar la petición.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Debe identificar línea de petición, método, URL/recurso, versión y cabeceras.",
    "image": "http-request.png"
  },
  {
    "id": "IMG-04",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Observa el esquema de una respuesta HTTP. ¿Qué elementos pueden aparecer en la respuesta del servidor?",
    "solution": "Una respuesta HTTP/1.1 presenta línea de estado, cabeceras y, normalmente, un cuerpo opcional. No lleva necesariamente una consulta SQL.",
    "options": [
      "Línea de estado HTTP",
      "Cabeceras de respuesta",
      "Cuerpo de respuesta",
      "Código fuente PHP ejecutable para el navegador",
      "Consulta SQL como sección obligatoria"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": "http-response.png"
  },
  {
    "id": "IMG-05",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Apoyándote en el esquema de redirecciones, explica qué sucede cuando PHP ejecuta header(\"Location: privada.php\") seguido de exit().",
    "solution": "El servidor prepara una respuesta con una cabecera Location y un estado de redirección. El navegador recibe esa respuesta e inicia una nueva petición a la URL indicada. exit() detiene el script para que no continúe emitiendo contenido.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Explica dos peticiones, respuesta con Location, actuación del navegador y papel de exit().",
    "image": "http-redireccion.png"
  },
  {
    "id": "EX-U1-01",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué parte de una aplicación web interpreta HTML y CSS para mostrar una página al usuario?",
    "solution": "El navegador web interpreta los documentos HTML y aplica CSS en el lado cliente.",
    "options": [
      "El navegador web",
      "El gestor de base de datos",
      "El DNS",
      "El servidor de correo"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U1-02",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "multi",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuáles son tecnologías o componentes fundamentales de la World Wide Web según el temario?",
    "solution": "HTML, URL, HTTP/HTTPS y navegadores web son tecnologías fundamentales de la Web.",
    "options": [
      "HTML",
      "URL",
      "HTTP/HTTPS",
      "Navegadores web",
      "Solo FTP"
    ],
    "correct": [
      0,
      1,
      2,
      3
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U1-03",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica qué función cumple una URL en la Web y relaciónala con HTTP.",
    "solution": "Una URL identifica/localiza un recurso web. El navegador utiliza una URL para realizar una petición HTTP al servidor correspondiente.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Debe distinguir dirección/localización de recurso del protocolo que permite solicitarlo.",
    "image": ""
  },
  {
    "id": "EX-U1-04",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿En qué capa del modelo TCP/IP se encuentran HTTP, FTP y SMTP?",
    "solution": "En la capa de aplicación.",
    "options": [
      "Acceso a la red",
      "Internet",
      "Transporte",
      "Aplicación"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U1-05",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué afirmaciones sobre las capas TCP/IP son correctas?",
    "solution": "La capa de transporte incluye TCP/UDP; Internet encamina paquetes con IP; acceso a red comprende Ethernet y Wi-Fi.",
    "options": [
      "TCP y UDP operan en transporte",
      "IP interviene en la capa de Internet",
      "Ethernet y Wi-Fi se relacionan con el acceso a la red",
      "DNS sustituye la capa de transporte"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U1-06",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es la diferencia entre una dirección IP y un puerto al acceder a un servidor?",
    "solution": "La IP identifica el dispositivo o destino de red; el puerto identifica el servicio/proceso de red al que va dirigida la comunicación.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Debe mencionar destino de red y servicio concreto.",
    "image": ""
  },
  {
    "id": "EX-U1-07",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué protocolo permite acceder a un servidor de forma remota mediante una conexión cifrada?",
    "solution": "SSH proporciona acceso remoto seguro.",
    "options": [
      "NTP",
      "IRC",
      "SSH",
      "BitTorrent"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U1-08",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué protocolo sincroniza los relojes de los dispositivos conectados a una red?",
    "solution": "NTP sincroniza la hora de los equipos.",
    "options": [
      "LDAP",
      "NTP",
      "NFS",
      "CGI"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U1-09",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "alto",
    "origin": "temario",
    "prompt": "Compara Nginx, Apache HTTP Server e IIS según el temario.",
    "solution": "Son servidores web. Nginx ofrece también funciones de proxy, caché y balanceo; Apache es libre y de código abierto; IIS es la solución de Microsoft para servicios web y otros protocolos.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Identifica los tres servidores y al menos una característica distintiva de cada uno.",
    "image": ""
  },
  {
    "id": "EX-U1-10",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué combinación identifica correctamente LAMP?",
    "solution": "Linux, Apache, MySQL y PHP/Perl/Python.",
    "options": [
      "Linux, Apache, MySQL y PHP",
      "Linux, Angular, MongoDB y Python",
      "LiteSpeed, Apache, MariaDB y PHP",
      "Laravel, Apache, MySQL y PostgreSQL"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U1-11",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Explica qué es CGI y describe por qué un servidor web puede generar HTML ejecutando un programa externo.",
    "solution": "CGI es una interfaz que permite a un servidor web invocar un programa externo para procesar una petición y utilizar su salida como respuesta. El programa puede estar escrito en distintos lenguajes; su ejecución clásica por proceso tiene costes de rendimiento.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Menciona petición, programa externo, respuesta y limitación de rendimiento.",
    "image": ""
  },
  {
    "id": "EX-U1-12",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué afirmaciones acerca de Apache Tomcat son correctas?",
    "solution": "Tomcat ejecuta servlets y JSP; no ofrece toda la plataforma empresarial Jakarta EE y se utiliza para aplicaciones web Java.",
    "options": [
      "Es un contenedor de servlets",
      "Permite ejecutar JSP",
      "Incluye por sí solo todas las funciones empresariales Jakarta EE",
      "Se utiliza con aplicaciones web basadas en Java"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U1-13",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Para qué se utiliza XAMPP en el entorno de desarrollo de PHP de la asignatura?",
    "solution": "XAMPP reúne componentes como Apache, PHP y servicios relacionados para preparar un entorno local de desarrollo y ejecución de aplicaciones web.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Debe reconocer Apache y PHP como componentes del entorno local.",
    "image": ""
  },
  {
    "id": "EX-U1-14",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Si un servidor devuelve un archivo HTML existente sin ejecutar lógica de negocio para crearlo, ¿qué modelo ilustra?",
    "solution": "El servidor está ofreciendo un recurso estático.",
    "options": [
      "Web estática",
      "Web dinámica obligatoria",
      "Aplicación empresarial con EJB",
      "Autenticación federada"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-01",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es una forma recomendada de abrir un bloque PHP dentro de un archivo HTML?",
    "solution": "La sintaxis recomendada es <?php ... ?>.",
    "options": [
      "<php> ... </php>",
      "<?php ... ?>",
      "{{ php }}",
      "<script php>"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-02",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencias existen entre phpinfo() y phpversion()?",
    "solution": "phpinfo() muestra información extensa sobre configuración y entorno PHP; phpversion() devuelve la versión actual de PHP.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Distinguir configuración detallada frente a número de versión.",
    "image": ""
  },
  {
    "id": "EX-U2-03",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué devuelve isset($dato) cuando la variable existe pero contiene null?",
    "solution": "Devuelve false si no está definida o su valor es null.",
    "options": [
      "true",
      "false",
      "La cadena \"null\"",
      "Un array vacío"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-04",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "medio",
    "origin": "temario",
    "prompt": "Selecciona las afirmaciones correctas sobre variables de PHP.",
    "solution": "Las variables comienzan por $, son sensibles a mayúsculas/minúsculas y sus tipos pueden cambiar dinámicamente.",
    "options": [
      "Empiezan con $",
      "Distinguen mayúsculas y minúsculas",
      "Una misma variable puede almacenar tipos distintos en momentos distintos",
      "Todas necesitan una declaración de tipo explícita"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-05",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál será la salida de este fragmento?",
    "solution": "Se imprime bool(true): el entero 10 se convierte explícitamente en booleano true.",
    "options": [],
    "correct": [],
    "code": "$foo = 10;\n$bar = (bool) $foo;\nvar_dump($bar);",
    "check": "Distingue conversión explícita y valor booleano.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-06",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cómo se declara normalmente una constante llamada MAX_INTENTOS con valor 3?",
    "solution": "const MAX_INTENTOS = 3;",
    "options": [
      "$MAX_INTENTOS = const 3;",
      "const MAX_INTENTOS = 3;",
      "constant MAX_INTENTOS: 3;",
      "define MAX_INTENTOS 3;"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-07",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué formas de generar salida aparecen en el temario de PHP?",
    "solution": "echo, print, printf y la etiqueta abreviada <?= ... ?> permiten generar salida.",
    "options": [
      "echo",
      "print",
      "printf",
      "<?= ... ?>",
      "session_start()"
    ],
    "correct": [
      0,
      1,
      2,
      3
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-08",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué muestra el navegador?",
    "solution": "Hola, Ana. La etiqueta <?= es una forma abreviada de echo.",
    "options": [],
    "correct": [],
    "code": "<?php $nombre = \"Ana\"; ?>\n<p>Hola, <?= $nombre ?>.</p>",
    "check": "Relacionar la expansión de $nombre con la salida HTML.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-09",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué operador concatena cadenas de texto en PHP?",
    "solution": "El punto (.) concatena cadenas.",
    "options": [
      "+",
      ".",
      "&",
      "??"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-10",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es la diferencia entre las dos líneas de salida?",
    "solution": "En comillas simples no se expande la variable; en comillas dobles se sustituye $nombre por su contenido.",
    "options": [],
    "correct": [],
    "code": "$nombre = \"Juan\";\necho 'Hola $nombre';\necho \"Hola $nombre\";",
    "check": "Distingue interpolación en comillas dobles de cadenas literales con comillas simples.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-11",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál de estos identificadores respeta las convenciones de variables camelCase del temario?",
    "solution": "nombreUsuario se escribe en camelCase.",
    "options": [
      "$nombre_usuario",
      "$NombreUsuario",
      "$nombreUsuario",
      "$NOMBRE_USUARIO"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-12",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué resultados son correctos en PHP?",
    "solution": "5 == \"5\" es true; 5 === \"5\" es false; true === 1 es false.",
    "options": [
      "5 == \"5\" devuelve true",
      "5 === \"5\" devuelve false",
      "true === 1 devuelve false",
      "5 === \"5\" devuelve true"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-13",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Cuál de los operadores lógicos tiene mayor prioridad en PHP: && o and?",
    "solution": "&& tiene mayor precedencia que and.",
    "options": [
      "and",
      "&&",
      "Ambos tienen exactamente la misma",
      "Depende del valor de los operandos"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-14",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué devuelve la expresión 8 <=> 10?",
    "solution": "El operador nave espacial devuelve -1 cuando el primer valor es menor que el segundo.",
    "options": [
      "-1",
      "0",
      "1",
      "true"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-15",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué cadena contiene $mensaje después de ejecutar este código?",
    "solution": "Menor de edad, porque 17 >= 18 es falso.",
    "options": [],
    "correct": [],
    "code": "$edad = 17;\n$mensaje = $edad >= 18 ? \"Mayor de edad\" : \"Menor de edad\";",
    "check": "Identifica condición, rama verdadera y rama falsa.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-16",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "alto",
    "origin": "temario",
    "prompt": "Diferencia el operador Elvis (?:) del operador de fusión de null (??).",
    "solution": "Elvis usa el valor alternativo cuando el operando inicial es falsy (por ejemplo 0 o \"\"); ?? solo lo sustituye si no existe o es null.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Debe explicar comportamiento para 0 y cadena vacía.",
    "image": ""
  },
  {
    "id": "EX-U2-17",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué números se muestran y por qué?",
    "solution": "Se muestran 1, 2 y 3. while comprueba la condición antes de cada iteración.",
    "options": [],
    "correct": [],
    "code": "$i = 1;\nwhile ($i <= 3) {\n  echo $i;\n  $i++;\n}",
    "check": "Salida 123 y evaluación previa de la condición.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-18",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué imprime este do-while?",
    "solution": "Imprime 5 una vez: la condición se evalúa después del cuerpo.",
    "options": [],
    "correct": [],
    "code": "$i = 5;\ndo {\n  echo $i;\n  $i++;\n} while ($i < 3);",
    "check": "Salida 5 y una ejecución mínima.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-19",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué tipo de comparación utiliza switch para comprobar sus casos en PHP?",
    "solution": "switch utiliza comparación amplia (==).",
    "options": [
      "Comparación estricta (===)",
      "Comparación amplia (==)",
      "Solo compara tipos de datos",
      "Siempre utiliza strcmp()"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-20",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es la salida del bucle con continue?",
    "solution": "Se muestran 1, 2, 4 y 5; continue omite el resto del cuerpo cuando i vale 3.",
    "options": [],
    "correct": [],
    "code": "for ($i = 1; $i <= 5; $i++) {\n  if ($i === 3) continue;\n  echo $i . \" \";\n}",
    "check": "No debe incluirse el 3.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-21",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué sintaxis alternativa se utiliza para cerrar un bloque if: ... en una plantilla con HTML?",
    "solution": "endif; cierra la sintaxis alternativa del if.",
    "options": [
      "end if",
      "endwhile;",
      "endif;",
      "closeif;"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-22",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "medio",
    "origin": "temario",
    "prompt": "Selecciona las afirmaciones correctas sobre arrays PHP.",
    "solution": "Pueden utilizar claves numéricas o de texto, almacenar tipos diversos y combinar estructuras anidadas.",
    "options": [
      "Pueden tener claves de tipo entero",
      "Pueden tener claves de texto",
      "Sus elementos pueden ser de tipos distintos",
      "Deben tener siempre claves consecutivas"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-23",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué valores y claves quedan tras eliminar el índice 1?",
    "solution": "Quedan 0 => DAM y 2 => ASIR; unset no reindexa automáticamente las claves numéricas.",
    "options": [],
    "correct": [],
    "code": "$ciclos = [\"DAM\", \"DAW\", \"ASIR\"];\nunset($ciclos[1]);\nprint_r($ciclos);",
    "check": "Mantiene índices 0 y 2.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-24",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia hay entre array_key_exists() e isset() cuando la clave existe con valor null?",
    "solution": "array_key_exists() devuelve true porque la clave existe; isset() devuelve false porque su valor es null.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Debe incluir el caso de null.",
    "image": ""
  },
  {
    "id": "EX-U2-25",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué función convierte la cadena \"DAM,DAW,ASIR\" en un array a partir de las comas?",
    "solution": "explode() divide una cadena por un separador.",
    "options": [
      "implode()",
      "array_merge()",
      "explode()",
      "array_diff()"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-26",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué array devuelve range(5, 1)?",
    "solution": "Devuelve [5, 4, 3, 2, 1], una secuencia descendente.",
    "options": [],
    "correct": [],
    "code": "$numeros = range(5, 1);\nprint_r($numeros);",
    "check": "Se incluyen ambos extremos.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-27",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Por qué es preferible foreach frente a un for de índices 0..count($array)-1 para recorrer un array asociativo?",
    "solution": "Porque foreach recorre directamente los elementos y sus claves reales, mientras que el for presupone índices numéricos consecutivos.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Considera claves de texto o índices dispersos.",
    "image": ""
  },
  {
    "id": "EX-U2-28",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué valor se obtiene en $datos[1][0]?",
    "solution": "ASIR, porque la fila con índice 1 contiene ASIR y SMR.",
    "options": [],
    "correct": [],
    "code": "$datos = [[\"DAM\", \"DAW\"], [\"ASIR\", \"SMR\"]];\necho $datos[1][0];",
    "check": "Fila 1, elemento 0.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-29",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué conclusiones se deducen del atributo name en formularios HTML?",
    "solution": "name determina la clave enviada. El sufijo [] permite agrupar valores múltiples en arrays PHP.",
    "options": [
      "name=\"prendas[]\" permite recibir varios valores agrupados",
      "id sustituye a name como clave de $_POST",
      "Un select multiple puede enviarse como array con name=\"alergenos[]\"",
      "Un input type=\"number\" se recibe directamente como entero"
    ],
    "correct": [
      0,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-30",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica qué diferencia hay entre method=\"post\" y action=\"\" en un formulario HTML.",
    "solution": "method indica cómo se envían los datos (POST); action=\"\" hace que el formulario se envíe a la URL actual.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Diferencia método HTTP y destino del envío.",
    "image": ""
  },
  {
    "id": "EX-U2-31",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué función se utiliza para mover al destino un fichero que PHP ha recibido temporalmente por un formulario?",
    "solution": "move_uploaded_file() permite trasladar un archivo subido al destino indicado.",
    "options": [
      "copy_uploaded_file()",
      "file_put_contents()",
      "move_uploaded_file()",
      "array_merge()"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-32",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Compara los límites del servidor y la validación propia de la aplicación al subir archivos.",
    "solution": "PHP puede limitar tamaño y número mediante upload_max_filesize, post_max_size y max_file_uploads. Además, la aplicación debe validar tipo real, tamaño, error, nombre/destino y restricciones de negocio; no debe confiar en $_FILES[\"type\"] ni en el nombre proporcionado por el navegador.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Dos niveles de control: directivas de PHP y validación del programa.",
    "image": ""
  },
  {
    "id": "EX-U2-33",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica la diferencia entre Local Value y Master Value de una directiva en phpinfo().",
    "solution": "Master Value representa el valor base configurado y Local Value el valor efectivo en el contexto actual, que puede haber sido modificado.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Distinguir configuración base y valor efectivo.",
    "image": ""
  },
  {
    "id": "EX-U2-34",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál de estas funciones permite consultar una directiva del archivo de configuración PHP desde el código?",
    "solution": "ini_get() consulta el valor de una directiva.",
    "options": [
      "ini_get()",
      "session_destroy()",
      "htmlspecialchars()",
      "explode()"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-35",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué ocurre al pasar la cadena \"5\" a una función que exige int en un archivo con strict_types=1?",
    "solution": "Se produce un TypeError cuando una llamada estricta pasa un string a un parámetro int.",
    "options": [],
    "correct": [],
    "code": "<?php\ndeclare(strict_types=1);\nfunction duplicar(int $n): int { return $n * 2; }\nduplicar(\"5\");",
    "check": "Menciona TypeError y tipado estricto del archivo que realiza la llamada.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-36",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Para qué sirven @param, @return y @throws en un DocBlock PHPDoc?",
    "solution": "@param documenta parámetros; @return describe el valor devuelto; @throws identifica excepciones que puede lanzar la función.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Las tres etiquetas con su cometido.",
    "image": ""
  },
  {
    "id": "EX-U2-37",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué constante mágica permite construir una ruta al directorio del archivo PHP actual?",
    "solution": "__DIR__ contiene la ruta del directorio del archivo que contiene la expresión.",
    "options": [
      "__FILE__",
      "__DIR__",
      "__CLASS__",
      "PHP_VERSION"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-38",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué imprime este ejemplo y por qué puede leerse $i fuera del for?",
    "solution": "Imprime 3. Los bucles for no crean un nuevo ámbito de variables en PHP.",
    "options": [],
    "correct": [],
    "code": "for ($i = 0; $i < 3; $i++) {}\necho $i;",
    "check": "Salida 3 y ausencia de ámbito de bloque separado.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U2-39",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué comparación evita confundir el resultado 0 de strpos() con false?",
    "solution": "El operador !== permite distinguir 0 de false.",
    "options": [
      "strpos($t, \"PHP\") == true",
      "strpos($t, \"PHP\") !== false",
      "strpos($t, \"PHP\") > 0",
      "strpos($t, \"PHP\") === true"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U2-40",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "short",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Por qué no es suficiente comprobar si un archivo termina en .pdf para permitir su subida segura?",
    "solution": "El nombre y la extensión enviados por el cliente pueden manipularse; deben verificarse el tipo/contenido real, límites, errores y condiciones de almacenamiento seguro.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "No confiar en nombres del cliente; validar en servidor.",
    "image": ""
  },
  {
    "id": "EX-U2-41",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Describe la validación que exige la tarea de inscripción en talleres antes de calcular el importe.",
    "solution": "Nombre obligatorio tras quitar espacios, número entero de sesiones entre 1 y 10, taller existente como clave de tarifas; acumular todos los mensajes en $errores, evitar cálculos si hay fallos y escapar la salida HTML.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Nombre, sesiones, taller, errores y salida segura.",
    "image": ""
  },
  {
    "id": "EX-U2-42",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Calcula el importe inicial, el descuento y el total de un taller JavaScript de 5 sesiones a 18 € por sesión.",
    "solution": "Importe 90 €, descuento 9 € (10 % por cinco o más sesiones), total 81 €.",
    "options": [],
    "correct": [],
    "code": "$tarifas = [\"PHP\" => 15.0, \"JavaScript\" => 18.0, \"Python\" => 12.0];\n$taller = \"JavaScript\";\n$sesiones = 5;",
    "check": "90,00 €, 9,00 € y 81,00 €.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U3-01",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Dónde guarda normalmente el navegador una cookie HTTP y dónde quedan los datos de sesión de PHP?",
    "solution": "La cookie se almacena en el cliente y los datos de sesión normalmente en el servidor.",
    "options": [
      "Ambos en el servidor",
      "Cookie en cliente y datos de sesión en servidor",
      "Ambos en URL",
      "Cookie en base de datos obligatoriamente"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-02",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona parámetros admitidos en la configuración de setcookie() mediante un array.",
    "solution": "expires, path, secure, httponly y samesite figuran entre las opciones de setcookie().",
    "options": [
      "expires",
      "path",
      "secure",
      "httponly",
      "samesite",
      "upload_tmp_dir"
    ],
    "correct": [
      0,
      1,
      2,
      3,
      4
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-03",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué significa que una cookie tenga la opción httponly activada?",
    "solution": "Impide el acceso directo a esa cookie desde JavaScript mediante document.cookie, aunque el navegador puede continuar enviándola al servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "No confundir con cifrado ni bloqueo de envío HTTP.",
    "image": ""
  },
  {
    "id": "EX-U3-04",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué valor de SameSite permite cookies en contextos entre sitios y requiere Secure?",
    "solution": "SameSite=None exige Secure en navegadores modernos.",
    "options": [
      "Strict",
      "Lax",
      "None",
      "Off"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-05",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Explica qué relación tienen los atributos Secure, HttpOnly y SameSite con los riesgos de seguridad.",
    "solution": "Secure limita el envío a conexiones HTTPS; HttpOnly dificulta la lectura de cookies mediante JavaScript malicioso; SameSite restringe algunos envíos entre sitios y ayuda a mitigar CSRF. No sustituyen por sí solos una arquitectura de seguridad completa.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Relacionar cada atributo con su riesgo específico.",
    "image": ""
  },
  {
    "id": "EX-U3-06",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cómo se puede pedir al navegador que elimine una cookie existente desde PHP?",
    "solution": "Se envía mediante setcookie() una cookie con el mismo nombre y ámbito aplicable y una fecha expires en el pasado.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Menciona expires pasado, nombre y ámbito.",
    "image": ""
  },
  {
    "id": "EX-U3-07",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es el nombre predeterminado de la cookie que identifica una sesión PHP?",
    "solution": "PHPSESSID es el nombre predeterminado configurado por session.name.",
    "options": [
      "PHP_TOKEN",
      "SID",
      "PHPSESSID",
      "SESSION_HASH"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-08",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Cuáles de las siguientes funciones están relacionadas con la gestión de sesiones PHP?",
    "solution": "session_start, session_id, session_name y session_destroy gestionan distintos aspectos de la sesión.",
    "options": [
      "session_start()",
      "session_id()",
      "session_name()",
      "session_destroy()",
      "array_push()"
    ],
    "correct": [
      0,
      1,
      2,
      3
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-09",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "code",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué se muestra si la página se carga tres veces con el mismo identificador de sesión?",
    "solution": "Tras la tercera petición, el valor de $_SESSION[\"visitas\"] es 3 si partió de cero y no hubo reinicio.",
    "options": [],
    "correct": [],
    "code": "session_start();\nif (!isset($_SESSION[\"visitas\"])) $_SESSION[\"visitas\"] = 0;\n$_SESSION[\"visitas\"]++;\necho $_SESSION[\"visitas\"];",
    "check": "Explica persistencia entre peticiones.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U3-10",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿En qué se diferencian session_unset() y session_destroy()?",
    "solution": "session_unset() vacía las variables de $_SESSION; session_destroy() destruye los datos persistidos de esa sesión en el servidor, sin eliminar por sí sola su cookie.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Distingue variables de datos persistidos y cookie.",
    "image": ""
  },
  {
    "id": "EX-U3-11",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué función verifica si una contraseña introducida coincide con un hash almacenado?",
    "solution": "password_verify() comprueba la contraseña frente al hash.",
    "options": [
      "password_hash()",
      "password_verify()",
      "hash_equals() usada sola con texto plano",
      "md5()"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-12",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "medio",
    "origin": "temario",
    "prompt": "Selecciona factores distintos que pueden combinarse en una autenticación multifactor.",
    "solution": "Conocimiento, posesión e inherencia son categorías distintas de MFA.",
    "options": [
      "Algo que sabes",
      "Algo que tienes",
      "Algo que eres",
      "Dos contraseñas independientes como dos factores diferentes"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-13",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué papel cumplen el salt aleatorio y el algoritmo de hashing de contraseñas?",
    "solution": "El salt ayuda a que la misma contraseña produzca hashes diferentes y dificulta tablas precalculadas; el algoritmo especializado encarece los intentos masivos de adivinar contraseñas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Sal aleatoria, hashes diferentes y resistencia a ataques masivos.",
    "image": ""
  },
  {
    "id": "EX-U3-14",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Por qué no debe recalcularse el hash para compararlo con == en vez de utilizar password_verify()?",
    "solution": "password_hash() usa salt aleatorio y puede producir hashes distintos para la misma contraseña. password_verify() interpreta el hash guardado y verifica la contraseña correctamente.",
    "options": [],
    "correct": [],
    "code": "$a = password_hash(\"clave\", PASSWORD_BCRYPT);\n$b = password_hash(\"clave\", PASSWORD_BCRYPT);\nvar_dump($a === $b);",
    "check": "Normalmente false en la comparación; password_verify() es la comprobación correcta.",
    "image": "",
    "codeTask": "interpret"
  },
  {
    "id": "EX-U3-15",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Explica qué responsabilidad tienen login.php, validar.php, usuarios.php, privada.php y logout.php en el ejemplo del temario.",
    "solution": "login.php presenta y envía el formulario; validar.php valida la petición, busca usuario y comprueba hash; usuarios.php accede a JSON; privada.php comprueba la sesión antes de mostrar contenido; logout.php vacía y destruye la sesión y elimina su cookie.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Describe los cinco componentes y flujo coherente de credenciales.",
    "image": ""
  },
  {
    "id": "EX-U3-16",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué debe comprobarse para impedir que un usuario sin sesión entre directamente en privada.php?",
    "solution": "Debe verificarse en el servidor la sesión/identidad autenticada, no solo ocultar el enlace.",
    "options": [
      "Que el enlace esté oculto",
      "Que $_SESSION tenga la identidad esperada",
      "Que exista un campo CSS hidden",
      "Que el navegador haya visitado login.php antes"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-17",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué afirmaciones correctas distinguen autorización y autenticación?",
    "solution": "Autenticación valida identidad y autorización aplica permisos; las verificaciones de recursos deben estar en servidor.",
    "options": [
      "Autenticación comprueba identidad",
      "Autorización determina operaciones permitidas",
      "RBAC relaciona roles y permisos",
      "Ocultar botones en HTML es suficiente como autorización"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-18",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica para qué sirve la cabecera Location enviada mediante header() en PHP.",
    "solution": "Indica al navegador una URL de destino para realizar una nueva petición; normalmente se acompaña de un código de redirección y exit() para detener el script.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Redirección HTTP y nueva solicitud.",
    "image": ""
  },
  {
    "id": "EX-U3-19",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Según el apartado normativo, ¿qué cookies requieren normalmente consentimiento previo?",
    "solution": "Las cookies no estrictamente necesarias, como muchas de analítica y publicidad.",
    "options": [
      "Todas, sin excepción",
      "Solo las de autenticación técnicas",
      "Las no necesarias, como analítica y publicidad",
      "Ninguna si aparece el aviso"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "image": ""
  },
  {
    "id": "EX-U3-20",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Describe cómo inspeccionar en el navegador la cookie PHPSESSID y comprobar su relación con un archivo de sesión en XAMPP.",
    "solution": "En F12 > Almacenamiento/Cookies se localiza PHPSESSID; su valor corresponde al SID. Con el manejador files de PHP, puede encontrarse un fichero sess_SID en session.save_path (habitualmente C:\\xampp\\tmp) con los datos serializados de sesión.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Identificador en cookie del navegador y datos en fichero del servidor.",
    "image": ""
  },
  {
    "id": "EX-U3-21",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Por qué OAuth 2.0 no debe presentarse por sí solo como protocolo de autenticación de usuarios?",
    "solution": "OAuth 2.0 es un marco de autorización; OpenID Connect añade la capa de identidad/autenticación sobre OAuth 2.0.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Distingue autorización de autenticación.",
    "image": ""
  }
];
