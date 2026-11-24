import type { Question } from '../core/questions';

export const DWCS_CURATED: Question[] = [
  {
    "id": "CUR-U1-001",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "Un usuario visita /productos en una web dinámica. ¿Qué afirmación describe correctamente el recorrido de la petición HTTP?",
    "solution": "El navegador solicita el recurso; el servidor ejecuta la lógica cuando procede y devuelve una respuesta HTTP. Una base de datos puede intervenir, pero no es obligatoria.",
    "options": [
      "El navegador ejecuta el código PHP del servidor antes de pedir datos.",
      "Toda web dinámica necesita consultar obligatoriamente una base de datos.",
      "El navegador envía la petición y el servidor puede generar la respuesta según el estado y los datos.",
      "El servidor envía primero la página y después recibe la petición."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "Arquitectura cliente-servidor",
    "scenario": "Una tienda muestra productos disponibles con una página construida por una aplicación PHP."
  },
  {
    "id": "CUR-U1-002",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona todas las afirmaciones correctas sobre GET, POST y seguridad.",
    "solution": "GET se usa para recuperar recursos y sus parámetros habituales aparecen en la URL. POST puede enviar datos en el cuerpo. Ni GET ni POST sustituyen HTTPS y el servidor debe validar entradas.",
    "options": [
      "Un POST por HTTP sin TLS no cifra automáticamente los datos.",
      "Los parámetros GET pueden quedar en historial o registros de acceso.",
      "Un formulario POST evita por sí solo SQL Injection.",
      "Los datos recibidos por POST deben validarse en el servidor.",
      "GET debe usarse para modificar pedidos porque permite enlaces."
    ],
    "correct": [
      0,
      1,
      3
    ],
    "code": "",
    "check": "",
    "section": "Métodos HTTP"
  },
  {
    "id": "CUR-U1-003",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Por qué el navegador puede interpretar HTML y JavaScript, pero no ejecutar directamente el PHP del servidor?",
    "solution": "Porque PHP se ejecuta en el entorno servidor y genera una respuesta; el navegador recibe HTML, CSS o JavaScript y los procesa en el cliente.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Identificar lugar de ejecución y qué se envía al navegador.",
    "section": "Cliente y servidor"
  },
  {
    "id": "CUR-U1-004",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Una empresa quiere publicar un catálogo estático y una zona privada con compras. Compara cómo atenderías ambas partes y qué papel tendría el servidor web frente a la aplicación.",
    "solution": "El catálogo puede servirse como HTML y recursos estáticos por el servidor web. En la parte privada se valida la sesión/autorización, se procesa la lógica y se genera la respuesta dinámica; el servidor web puede comunicarse con la aplicación o integrar su ejecución. La base de datos se consulta si los datos lo requieren, no por definición.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Distinguir estático/dinámico, servidor web/aplicaciones, sesión y respuesta HTTP; evitar afirmar que toda web dinámica necesita BD.",
    "section": "Web estática y dinámica",
    "scenario": "La empresa tiene páginas informativas públicas y usuarios autenticados que modifican sus pedidos."
  },
  {
    "id": "CUR-U2-001",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "medio",
    "origin": "audio",
    "prompt": "Escribe una función tipada esPar(int $numero): bool que determine si el entero recibido es par. No debe imprimir nada: debe devolver el resultado.",
    "solution": "function esPar(int $numero): bool {\n    return $numero % 2 === 0;\n}",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Firma con int y bool, módulo %, comparación correcta, return sin echo.",
    "section": "Funciones y operadores",
    "codeTask": "write",
    "scenario": "Una aplicación clasifica números introducidos por el estudiante. Otra función consumirá el resultado, así que no debes usar echo.",
    "exampleInput": "esPar(8) y esPar(7)",
    "exampleOutput": "true y false (valores devueltos, no texto impreso)",
    "hints": [
      "Recuerda qué operador devuelve el resto de una división.",
      "Para un número par, el resto de dividirlo entre 2 cumple una condición.",
      "Usa una expresión booleana como resultado de return."
    ]
  },
  {
    "id": "CUR-U2-002",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "audio",
    "prompt": "Escribe una función tipada sumarMayores(array $numeros, int $limite): int que devuelva la suma de los elementos estrictamente mayores que $limite. No utilices array_sum().",
    "solution": "function sumarMayores(array $numeros, int $limite): int {\n    $suma = 0;\n    foreach ($numeros as $numero) {\n        if ($numero > $limite) {\n            $suma += $numero;\n        }\n    }\n    return $suma;\n}",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Acumulador en 0, foreach, condición estricta >, return int.",
    "section": "Arrays y foreach",
    "codeTask": "write",
    "scenario": "En un registro de ventas se guardan importes enteros. El responsable quiere sumar solamente los superiores a una cantidad dada; algunos valores pueden ser negativos.",
    "exampleInput": "sumarMayores([4, 12, 11, -3, 20], 10)",
    "exampleOutput": "43 (valor devuelto, sin salida HTML)",
    "hints": [
      "Comienza con un acumulador numérico.",
      "Recorre cada valor y comprueba la condición antes de sumar.",
      "La condición exige mayor que, no mayor o igual."
    ]
  },
  {
    "id": "CUR-U2-003",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Sin ejecutar el código, escribe exactamente lo que aparece en pantalla. Distingue el índice eliminado del valor de los índices restantes.",
    "solution": "Se muestra: 2:DAW|5:ASIR|. unset elimina una clave sin reindexar el resto; foreach recorre las claves reales.",
    "options": [],
    "correct": [],
    "code": "$ciclos = [0 => \"DAM\", 2 => \"DAW\", 5 => \"ASIR\"];\nunset($ciclos[0]);\nforeach ($ciclos as $i => $nombre) {\n    echo $i . \":\" . $nombre . \"|\";\n}",
    "check": "Mostrar los separadores y las claves numéricas originales.",
    "section": "Arrays y foreach",
    "codeTask": "interpret",
    "expectedOutput": "2:DAW|5:ASIR|",
    "hints": [
      "unset() no convierte automáticamente un array en una lista consecutiva.",
      "foreach permite obtener la clave y el valor.",
      "Observa el carácter | después de cada iteración."
    ]
  },
  {
    "id": "CUR-U2-004",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Predice exactamente qué se muestra con este código y explica por qué utilizar == en vez de === cambiaría la comparación.",
    "solution": "Se muestra distinto: los valores tienen tipos diferentes, string e integer. === compara valor y tipo.",
    "options": [],
    "correct": [],
    "code": "$valor = \"5\";\nif ($valor === 5) {\n    echo \"igual\";\n} else {\n    echo \"distinto\";\n}",
    "check": "Explicar estricta vs amplia, salida textual sin espacios adicionales.",
    "section": "Operadores y tipos",
    "codeTask": "interpret",
    "expectedOutput": "distinto",
    "hints": [
      "Observa las comillas del valor original.",
      "Una comparación estricta no convierte el tipo automáticamente.",
      "Fíjate en cuál de las dos ramas contiene el echo."
    ]
  },
  {
    "id": "CUR-U2-005",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe el código PHP del procesamiento de este formulario: recibe por POST un nombre y un número de sesiones entre 1 y 10; valida que el nombre no esté vacío tras quitar espacios y que sesiones sea entero dentro de rango. Muestra errores como texto seguro.",
    "solution": "<?php\n$errores = [];\n$nombre = $_POST[\"nombre\"] ?? \"\";\n$sesiones = filter_input(INPUT_POST, \"sesiones\", FILTER_VALIDATE_INT);\nif (!is_string($nombre) || trim($nombre) === \"\") {\n    $errores[] = \"El nombre es obligatorio\";\n}\nif ($sesiones === false || $sesiones === null || $sesiones < 1 || $sesiones > 10) {\n    $errores[] = \"Sesiones: entero entre 1 y 10\";\n}\nforeach ($errores as $error) {\n    echo htmlspecialchars($error, ENT_QUOTES, \"UTF-8\") . \"<br>\";\n}\n?>",
    "options": [],
    "correct": [],
    "code": "",
    "check": "POST, validación de tipo y rango, trim, acumulación de errores, salida escapada.",
    "section": "Formularios y validación",
    "codeTask": "write",
    "scenario": "Una escuela ofrece talleres. El formulario HTML tiene method=\"post\", dos controles con name=\"nombre\" y name=\"sesiones\", y la validación HTML puede eludirse.",
    "exampleInput": "nombre=\"   \"; sesiones=\"12\"",
    "exampleOutput": "Dos errores: nombre obligatorio y número de sesiones fuera de rango.",
    "hints": [
      "No confíes solamente en required/min/max del HTML.",
      "Necesitas comprobar que el número es entero real y está en rango.",
      "Acumula los errores antes de mostrarlos en HTML."
    ]
  },
  {
    "id": "CUR-U2-006",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué imprime este fragmento? Ten en cuenta que strpos() puede devolver el entero 0.",
    "solution": "Imprime no encontrado, aunque PHP está al principio. strpos devuelve 0, que es falsy en la condición. La forma correcta de detectar coincidencias es !== false.",
    "options": [],
    "correct": [],
    "code": "$texto = \"PHP y Java\";\nif (strpos($texto, \"PHP\")) {\n    echo \"encontrado\";\n} else {\n    echo \"no encontrado\";\n}",
    "check": "Señalar que 0 no es false en comparación estricta; no hay warning.",
    "section": "Funciones de cadenas",
    "codeTask": "interpret",
    "expectedOutput": "no encontrado",
    "hints": [
      "La primera aparición comienza en posición cero.",
      "En un if, el entero cero se interpreta como falso.",
      "Compara explícitamente con false para corregirlo."
    ]
  },
  {
    "id": "CUR-U2-007",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "audio",
    "prompt": "Implementa crearMatriz(int $filas, int $columnas): array. Debe devolver una matriz de dimensiones dadas, rellenada con ceros, usando bucles anidados.",
    "solution": "function crearMatriz(int $filas, int $columnas): array {\n    $matriz = [];\n    for ($i = 0; $i < $filas; $i++) {\n        for ($j = 0; $j < $columnas; $j++) {\n            $matriz[$i][$j] = 0;\n        }\n    }\n    return $matriz;\n}",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Dos bucles, límites correctos, índices doble corchete, return array; sin impresión.",
    "section": "Arrays multidimensionales",
    "codeTask": "write",
    "scenario": "Una aplicación necesita reservar una tabla de datos antes de introducir notas de estudiantes. Cada fila corresponde a un alumno y cada columna a una evaluación.",
    "exampleInput": "crearMatriz(2,3)",
    "exampleOutput": "[[0, 0, 0], [0, 0, 0]] (array devuelto)",
    "hints": [
      "Necesitas dos índices independientes.",
      "El bucle externo recorre las filas y el interno las columnas.",
      "La posición se escribe con dos pares de corchetes."
    ]
  },
  {
    "id": "CUR-U2-008",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "El formulario incluye <input type=\"number\" name=\"edad\"> y el usuario introduce 25. ¿Qué tipo contiene normalmente $_POST[\"edad\"]?",
    "solution": "Se recibe la cadena de texto \"25\". El control type=\"number\" valida en el navegador, pero PHP no recibe automáticamente un int.",
    "options": [
      "int con valor 25",
      "string con valor \"25\"",
      "float con valor 25.0",
      "booleano true"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "Formularios y superglobales"
  },
  {
    "id": "CUR-U2-009",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "En la tarea Inscripción en talleres, describe qué pertenece a index.php, tarifas.php, funciones.php y procesar.php y por qué no deben duplicarse los precios.",
    "solution": "index.php muestra el formulario y genera las opciones a partir de $tarifas. tarifas.php es la única fuente de precios. funciones.php define calcularImporte, calcularDescuento y calcularTotal con tipos y return. procesar.php recupera POST, valida nombre/sesiones/taller, acumula errores y, si los datos son válidos, calcula y muestra el resultado escapando textos. La no duplicación evita divergencias cuando cambian los precios.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Responsabilidad de los cuatro archivos, validación, inclusión, cálculo, escape y no duplicación.",
    "section": "Actividad evaluable talleres",
    "scenario": "Talleres PHP (15 €/sesión), JavaScript (18 €) y Python (12 €). Por contratar 5 sesiones o más se aplica un 10 % de descuento. Formulario enviado por POST; los precios nunca proceden del navegador.",
    "hints": [
      "Separa presentación, datos de tarifas, cálculos y procesamiento.",
      "Piensa qué debe ocurrir si se cambia una tarifa.",
      "El servidor debe validar que el taller recibido exista."
    ],
    "activity": "Tarea02.1 · Inscripción en talleres"
  },
  {
    "id": "CUR-U2-010",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe un formulario HTML para subir varios archivos y un ejemplo de PHP que recorra los errores de subida con $_FILES. No necesitas guardar todavía los archivos.",
    "solution": "<form method=\"post\" enctype=\"multipart/form-data\">\n    <input type=\"file\" name=\"ficheros[]\" multiple>\n    <button type=\"submit\">Enviar</button>\n</form>\n<?php\nif (isset($_FILES[\"ficheros\"][\"error\"])) {\n    foreach ($_FILES[\"ficheros\"][\"error\"] as $indice => $error) {\n        echo $indice . \": \" . ($error === UPLOAD_ERR_OK ? \"OK\" : \"Error\") . \"<br>\";\n    }\n}\n?>",
    "options": [],
    "correct": [],
    "code": "",
    "check": "method post, multipart/form-data, multiple, name con [], acceso a array error por índice, comparación con UPLOAD_ERR_OK.",
    "section": "Subida de ficheros",
    "codeTask": "write",
    "scenario": "Una aplicación recibe un lote de documentos. El usuario puede seleccionar varios archivos en un único envío; por ahora solo queremos conocer si cada uno se recibió sin error.",
    "exampleInput": "Dos ficheros con índices 0 y 1, ambos con UPLOAD_ERR_OK",
    "exampleOutput": "0: OK\n1: OK (dos líneas HTML)",
    "hints": [
      "Los archivos se reciben en $_FILES, no como texto en $_POST.",
      "El atributo name necesita corchetes para varios ficheros.",
      "Cada propiedad de $_FILES[\"ficheros\"] es un array indexado."
    ],
    "activity": "Actividad 2.6 · Varios ficheros"
  },
  {
    "id": "CUR-U3-001",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "medio",
    "origin": "audio",
    "prompt": "Explica por qué HTTP es un protocolo sin estado y cómo se relaciona esto con el carrito de una tienda.",
    "solution": "HTTP no recuerda por sí mismo los datos de peticiones anteriores. Un identificador de sesión, normalmente enviado en una cookie, permite al servidor recuperar los productos del carrito guardados entre peticiones.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Mencionar independencia de peticiones, necesidad de mecanismo adicional, cookie SID y datos de servidor.",
    "section": "HTTP sin estado"
  },
  {
    "id": "CUR-U3-002",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "multi",
    "level": "alto",
    "origin": "audio",
    "prompt": "Sobre cookies y sesiones PHP, selecciona todas las afirmaciones correctas.",
    "solution": "Una cookie se almacena en el navegador; los datos de $_SESSION suelen estar en el servidor. PHPSESSID contiene normalmente un identificador, no todos los datos de sesión. session_destroy no caduca automáticamente la cookie.",
    "options": [
      "Una cookie puede incluir un identificador de sesión.",
      "La cookie PHPSESSID suele contener todos los objetos de $_SESSION en texto plano.",
      "session_start() recupera una sesión existente si el identificador es válido.",
      "session_destroy() elimina automáticamente todas las cookies del navegador.",
      "La información en $_SESSION suele persistirse en el lado del servidor."
    ],
    "correct": [
      0,
      2,
      4
    ],
    "code": "",
    "check": "",
    "section": "Cookies y sesiones"
  },
  {
    "id": "CUR-U3-003",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Predice lo que imprime el script si esta es la primera petición del navegador. Después explica qué ocurriría con $_COOKIE en la siguiente petición si el navegador acepta la cookie.",
    "solution": "En la primera petición imprime ausente: setcookie programa el envío de Set-Cookie, pero $_COOKIE contiene lo recibido en la petición actual. En la siguiente petición puede recibirse la cookie y se mostraría es, si su ámbito lo permite.",
    "options": [],
    "correct": [],
    "code": "setcookie(\"idioma\", \"es\");\necho $_COOKIE[\"idioma\"] ?? \"ausente\";",
    "check": "Primera petición imprime ausente. Distinción petición/respuesta y cabeceras.",
    "section": "Cookies PHP",
    "codeTask": "interpret",
    "expectedOutput": "Primera petición: ausente\nSiguiente petición (si se acepta): es",
    "hints": [
      "setcookie() prepara una cabecera de respuesta.",
      "$_COOKIE contiene cookies que venían con la petición.",
      "Piensa si el navegador ya pudo devolver la cookie en la misma petición."
    ]
  },
  {
    "id": "CUR-U3-004",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe el script PHP de una página privada que arranque sesión, compruebe un ID de usuario y redirija a login.php si no existe. Tras el encabezado debes detener la ejecución.",
    "solution": "<?php\nsession_start();\nif (!isset($_SESSION[\"id_usuario\"])) {\n    header(\"Location: login.php\");\n    exit;\n}\necho \"Acceso autorizado\";",
    "options": [],
    "correct": [],
    "code": "",
    "check": "session_start antes de salida, isset, Location y exit.",
    "section": "Protección de páginas",
    "codeTask": "write",
    "scenario": "Una aplicación dispone de un formulario de inicio de sesión. La página privada no debe mostrar contenido a visitantes anónimos, aunque conozcan su URL.",
    "exampleInput": "Petición sin sesión autenticada",
    "exampleOutput": "Respuesta de redirección a login.php; no se imprime \"Acceso autorizado\".",
    "hints": [
      "El navegador no puede decidir si el usuario está autenticado.",
      "Recupera $_SESSION antes de comprobar la clave.",
      "Después de enviar Location hay que detener el script."
    ]
  },
  {
    "id": "CUR-U3-005",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Completa la comprobación del formulario de login: se dispone de $usuario con los campos usuario, id y password (hash almacenado) o de null. Guarda la identidad en sesión solo cuando username y contraseña coincidan.",
    "solution": "<?php\nif ($usuario !== null &&\n    $usuario[\"usuario\"] === $username &&\n    password_verify($password, $usuario[\"password\"])) {\n    session_start();\n    session_regenerate_id(true);\n    $_SESSION[\"id_usuario\"] = $usuario[\"id\"];\n    $_SESSION[\"usuario\"] = $usuario[\"usuario\"];\n    echo \"Autenticado\";\n} else {\n    echo \"Credenciales incorrectas\";\n}",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Evitar comparar hash con ==, comprobar null, usar password_verify y no guardar contraseña. session_regenerate_id reduce riesgo de fijación.",
    "section": "Autenticación con JSON",
    "codeTask": "write",
    "scenario": "usuarios.php ya ha leído usuarios.json y ha devuelto el usuario buscado en la variable $usuario. Las credenciales introducidas están en $username y $password. La contraseña guardada es un hash bcrypt.",
    "exampleInput": "$username=\"ana\"; $password=\"abc123.\"; $usuario contiene el usuario \"ana\" y un hash válido de esa contraseña.",
    "exampleOutput": "Autenticado y $_SESSION contiene id_usuario y usuario.",
    "hints": [
      "Un hash no se compara con la contraseña mediante igualdad simple.",
      "Primero verifica que el usuario exista.",
      "La sesión conserva identidad, no la contraseña."
    ]
  },
  {
    "id": "CUR-U3-006",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "develop",
    "level": "alto",
    "origin": "audio",
    "prompt": "Explica cómo crear y utilizar una cookie con atributos de seguridad y cómo eliminarla correctamente. Diferencia la cookie de una sesión.",
    "solution": "setcookie envía Set-Cookie en la respuesta y debe llamarse antes de generar salida. Expires, path y domain determinan duración y ámbito. Secure limita envío a HTTPS; HttpOnly evita acceso por JavaScript; SameSite controla peticiones entre sitios. El navegador la devuelve mediante Cookie en peticiones posteriores; $_COOKIE refleja lo recibido. Para eliminarla se solicita una caducidad pasada con mismo nombre, ruta y dominio. La cookie puede contener un SID; los datos de sesión se guardan normalmente en el servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Ciclo, cabeceras, argumentos setcookie, eliminación, y diferencia cookie/SID/sesión.",
    "section": "Cookies PHP",
    "scenario": "En una tienda se recuerda el idioma y se utiliza otra cookie para identificar la sesión de un usuario autenticado.",
    "hints": [
      "Distingue el lugar en que se guarda la preferencia del lugar donde se guardan las variables de sesión.",
      "Recuerda la diferencia entre Set-Cookie y Cookie.",
      "¿Qué atributos limitan la transmisión o el acceso al contenido?"
    ]
  },
  {
    "id": "CUR-U3-007",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "single",
    "level": "alto",
    "origin": "temario",
    "prompt": "En una aplicación con rol editor y rol usuario, ¿dónde debe comprobarse que el editor puede modificar un producto?",
    "solution": "El control de acceso debe verificarse en el servidor para cada operación protegida. Ocultar botones no sustituye la autorización.",
    "options": [
      "Solo en la interfaz: ocultar el botón de editar.",
      "En el navegador antes de construir el HTML.",
      "En el servidor, cuando se solicita la operación de modificación.",
      "No hace falta comprobar roles si existe una cookie."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "Autorización RBAC"
  },
  {
    "id": "CUR-U3-008",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "short",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué diferencia existe entre hashing y cifrado al almacenar contraseñas?",
    "solution": "El cifrado está diseñado para permitir recuperar datos con la clave correspondiente. Un hash de contraseña es una función unidireccional verificada con password_verify(); debe utilizar algoritmos resistentes a fuerza bruta, con sal gestionada automáticamente por password_hash().",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Hash unidireccional, cifrado reversible con clave, sal y funciones password_hash/password_verify.",
    "section": "Contraseñas seguras"
  },
  {
    "id": "CUR-U2-011",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Completa los cuatro archivos de una aplicación de inscripción en talleres. El formulario debe enviar POST y obtener sus opciones dinámicamente de las tarifas; el servidor valida los datos, calcula el descuento y muestra un recibo seguro.",
    "section": "Tarea02.1 · Aplicación completa",
    "activity": "Tarea02.1 · Inscripción en talleres",
    "scenario": "Un centro ofrece PHP a 15 €/sesión, JavaScript a 18 €/sesión y Python a 12 €/sesión. De 5 a 10 sesiones se descuenta el 10 %. El formulario recibe nombre, taller y sesiones (1 a 10). Se deben usar exactamente index.php, tarifas.php, funciones.php y procesar.php, sin duplicar tarifas.",
    "exampleInput": "Nombre: Ana; taller: JavaScript; sesiones: 5",
    "exampleOutput": "Importe inicial: 90,00 €; descuento: 9,00 €; total: 81,00 €",
    "codeTask": "write",
    "check": "4 archivos; require_once; foreach opciones dinámicas; name/action/method correctos; validación de servidor; array de errores; funciones tipadas con return; descuento constante; salida escapada y number_format.",
    "code": "",
    "options": [],
    "correct": [],
    "hints": [
      "Separa las responsabilidades: tarifas, lógica de cálculo, formulario y procesamiento de POST.",
      "Las opciones del select se generan con foreach y la clave del taller es el value que se envía.",
      "No hagas cálculos si hay errores; usa array_key_exists y una validación de sesiones estricta."
    ],
    "starterFiles": {
      "tarifas.php": "<?php\n$tarifas = [];",
      "funciones.php": "<?php\nconst DESCUENTO = 0.10;",
      "index.php": "<?php\nrequire_once __DIR__ . \"/tarifas.php\";\n?>\n<!DOCTYPE html>\n<html lang=\"es\"><head><meta charset=\"UTF-8\"><title>Talleres</title></head><body>\n<form action=\"procesar.php\" method=\"post\">\n</form>\n</body></html>",
      "procesar.php": "<?php\nrequire_once __DIR__ . \"/tarifas.php\";\nrequire_once __DIR__ . \"/funciones.php\";\n$errores = [];"
    },
    "solution": "=== tarifas.php ===\n<?php\n$tarifas = [\"PHP\" => 15.0, \"JavaScript\" => 18.0, \"Python\" => 12.0];\n\n=== funciones.php ===\n<?php\nconst DESCUENTO = 0.10;\nfunction calcularImporte(float $precio, int $sesiones): float {\n    return $precio * $sesiones;\n}\n/**\n * Calcula el descuento aplicable a una inscripción.\n * @param float $importe Importe sin descuento.\n * @param int $sesiones Número de sesiones contratadas.\n * @return float Importe del descuento.\n */\nfunction calcularDescuento(float $importe, int $sesiones): float {\n    return $sesiones >= 5 ? $importe * DESCUENTO : 0.0;\n}\nfunction calcularTotal(float $importe, float $descuento): float {\n    return $importe - $descuento;\n}\n\n=== index.php ===\n<?php require_once __DIR__ . \"/tarifas.php\"; ?>\n<!DOCTYPE html>\n<html lang=\"es\"><head><meta charset=\"UTF-8\"><title>Talleres</title></head><body>\n<form action=\"procesar.php\" method=\"post\">\n    <label>Nombre <input name=\"nombre\" required></label>\n    <label>Taller <select name=\"taller\">\n        <?php foreach ($tarifas as $nombreTaller => $precio): ?>\n            <option value=\"<?= htmlspecialchars($nombreTaller, ENT_QUOTES, 'UTF-8') ?>\">\n                <?= htmlspecialchars($nombreTaller, ENT_QUOTES, 'UTF-8') ?> — <?= number_format($precio, 2, ',', '.') ?> €/sesión\n            </option>\n        <?php endforeach; ?>\n    </select></label>\n    <label>Sesiones <input type=\"number\" name=\"sesiones\" min=\"1\" max=\"10\" required></label>\n    <button type=\"submit\">Calcular</button>\n</form>\n</body></html>\n\n=== procesar.php ===\n<?php\nrequire_once __DIR__ . \"/tarifas.php\";\nrequire_once __DIR__ . \"/funciones.php\";\n$errores = [];\n$nombre = $_POST['nombre'] ?? '';\n$taller = $_POST['taller'] ?? '';\n$sesiones = filter_input(INPUT_POST, 'sesiones', FILTER_VALIDATE_INT);\nif (!is_string($nombre) || trim($nombre) === '') $errores[] = 'Nombre obligatorio';\nif (!is_string($taller) || !array_key_exists($taller, $tarifas)) $errores[] = 'Taller inválido';\nif ($sesiones === false || $sesiones === null || $sesiones < 1 || $sesiones > 10) $errores[] = 'Sesiones inválidas';\nif ($errores) {\n    foreach ($errores as $error) echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '<br>';\n} else {\n    $precio = $tarifas[$taller];\n    $importe = calcularImporte($precio, $sesiones);\n    $descuento = calcularDescuento($importe, $sesiones);\n    $total = calcularTotal($importe, $descuento);\n    echo htmlspecialchars(trim($nombre), ENT_QUOTES, 'UTF-8') . ': ';\n    echo htmlspecialchars($taller, ENT_QUOTES, 'UTF-8') . ' · ' . $sesiones . ' sesiones<br>';\n    echo 'Importe: ' . number_format($importe, 2, ',', '.') . ' €<br>';\n    echo 'Descuento: ' . number_format($descuento, 2, ',', '.') . ' €<br>';\n    echo 'Total: ' . number_format($total, 2, ',', '.') . ' €';\n}"
  },
  {
    "id": "CUR-U1-005",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona cada tecnología con su función principal en la Web.",
    "solution": "HTML estructura; CSS presenta; JavaScript permite comportamiento en el cliente; PHP ejecuta lógica de servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Distinguir lenguaje de marcado, estilos, script cliente y script servidor.",
    "section": "Tecnologías cliente y servidor",
    "pairs": [
      {
        "left": "HTML",
        "right": "Estructura del documento"
      },
      {
        "left": "CSS",
        "right": "Presentación visual"
      },
      {
        "left": "JavaScript",
        "right": "Interacción ejecutada en el navegador"
      },
      {
        "left": "PHP",
        "right": "Lógica ejecutada en el servidor"
      }
    ]
  },
  {
    "id": "CUR-U1-006",
    "subjectId": "dwcs",
    "unit": 1,
    "kind": "order",
    "level": "medio",
    "origin": "temario",
    "prompt": "Ordena las fases básicas de una petición HTTP en el esquema cliente-servidor.",
    "solution": "El navegador prepara y envía una petición; el servidor la atiende; devuelve una respuesta; el navegador la interpreta.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Petición antes de respuesta; procesamiento del servidor antes de presentación.",
    "section": "Comunicación HTTP",
    "sequence": [
      "El navegador envía una petición HTTP",
      "El servidor recibe y procesa la petición",
      "El servidor envía una respuesta HTTP",
      "El navegador interpreta la respuesta"
    ]
  },
  {
    "id": "CUR-U2-012",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "match",
    "level": "alto",
    "origin": "temario",
    "prompt": "Relaciona las funciones estudiadas con su comportamiento.",
    "solution": "isset comprueba existencia no null; array_key_exists examina claves incluso si valen null; count cuenta elementos; htmlspecialchars escapa contenido para HTML.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Diferenciar isset de array_key_exists y explicar que htmlspecialchars no protege SQL.",
    "section": "Funciones de arrays y seguridad",
    "pairs": [
      {
        "left": "isset($x)",
        "right": "Comprueba que la variable existe y no es null"
      },
      {
        "left": "array_key_exists($clave,$array)",
        "right": "Comprueba la presencia de una clave aunque tenga valor null"
      },
      {
        "left": "count($array)",
        "right": "Devuelve el número de elementos del array"
      },
      {
        "left": "htmlspecialchars($texto)",
        "right": "Convierte caracteres especiales para mostrarlos en HTML"
      }
    ]
  },
  {
    "id": "CUR-U2-013",
    "subjectId": "dwcs",
    "unit": 2,
    "kind": "order",
    "level": "alto",
    "origin": "temario",
    "prompt": "Ordena las acciones necesarias para procesar con seguridad el formulario de inscripción en talleres.",
    "solution": "Primero recibir POST, después validar datos, comprobar errores, calcular con funciones y mostrar valores escapados.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "No calcular si hay errores; nunca confiar en el precio del navegador.",
    "section": "Formularios y validación",
    "sequence": [
      "Recuperar los valores enviados mediante POST",
      "Validar nombre, taller y sesiones en el servidor",
      "Comprobar que el array de errores está vacío",
      "Calcular importe, descuento y total",
      "Mostrar el resultado escapando el texto recibido"
    ],
    "activity": "Tarea02.1 · Inscripción en talleres"
  },
  {
    "id": "CUR-U3-009",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "order",
    "level": "alto",
    "origin": "audio",
    "prompt": "Ordena el ciclo básico de una cookie desde que el servidor la crea hasta que PHP puede leerla en una nueva petición.",
    "solution": "setcookie envía Set-Cookie; el navegador guarda la cookie y la remite posteriormente mediante Cookie; PHP recibe su valor en $_COOKIE.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Separar cabecera de respuesta y cabecera de petición; $_COOKIE no se actualiza automáticamente en el mismo script.",
    "section": "Ciclo de cookies",
    "sequence": [
      "El servidor envía la cabecera Set-Cookie en la respuesta",
      "El navegador almacena la cookie si la acepta",
      "El navegador realiza una nueva petición y envía Cookie",
      "PHP accede al valor recibido mediante $_COOKIE"
    ]
  },
  {
    "id": "CUR-U3-010",
    "subjectId": "dwcs",
    "unit": 3,
    "kind": "match",
    "level": "alto",
    "origin": "audio",
    "prompt": "Relaciona cada función o elemento de sesión con su responsabilidad.",
    "solution": "session_start recupera o crea sesión; $_SESSION almacena datos asociados; session_unset vacía variables; session_destroy destruye datos de servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "No confundir destruir datos con eliminar la cookie PHPSESSID.",
    "section": "Sesiones PHP",
    "pairs": [
      {
        "left": "session_start()",
        "right": "Inicia o recupera una sesión"
      },
      {
        "left": "$_SESSION",
        "right": "Permite consultar y modificar variables de sesión"
      },
      {
        "left": "session_unset()",
        "right": "Vacía las variables de sesión sin destruir el SID"
      },
      {
        "left": "session_destroy()",
        "right": "Destruye los datos asociados a la sesión en el servidor"
      }
    ]
  }
];
