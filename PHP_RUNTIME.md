# Ejecutor PHP integrado

ESTUDIO ejecuta PHP real dentro de un Web Worker del navegador mediante PHP-WASM, los componentes de WordPress Playground. No ejecuta WordPress. Se ha seleccionado PHP 8.2.35 y la variante Asyncify: no depende de JSPI, servidores remotos, Docker ni un ordenador encendido.

## Recursos y reproducción

`public/php-runtime/` incluye la máquina virtual (18.016.349 bytes), el cargador, la API JavaScript y el worker de ESTUDIO. Se cargan al usar PHP, no al abrir una pantalla teórica. La caché de producción de ESTUDIO conserva esos recursos después de descargarlos. Su disponibilidad offline debe comprobarse con el Service Worker de la compilación de producción; no se garantiza en el servidor de desarrollo ni antes de la primera descarga.

Los paquetes originales son `@php-wasm/universal@3.1.66` y `@php-wasm/web-8-2@3.1.66`. No son dependencias necesarias en el dispositivo del alumno: sus recursos ya están incorporados. Para regenerarlos se instalan ambas versiones alineadas y se ejecuta `node tools/runtime-vendor.mjs` con esbuild disponible. El script genera hashes en `vendor-manifest.json`. La distribución conserva la licencia GPL-2.0-or-later de los paquetes, sus avisos y el enlace a la revisión exacta de su código fuente en `NOTICE.txt`.

Fuentes de la selección técnica: [arquitectura oficial de paquetes PHP-WASM](https://wordpress.github.io/wordpress-playground/developers/architecture/php-wasm-packages/), [API PHP](https://wordpress.github.io/wordpress-playground/api/universal/class/PHP/) y [servidor virtual PHPRequestHandler](https://wordpress.github.io/wordpress-playground/api/universal/class/PHPRequestHandler/). El código PHP lo interpreta WebAssembly; las peticiones HTTP, el almacenamiento de cookies y el navegador de previsualización forman un entorno web virtual.

## Capacidades comprobadas

Las pruebas ejecutaron realmente PHP en Chrome y WebKit 26.5. Se comprobaron PHP 8.2, `fgets(STDIN)` y `fscanf(STDIN)`, archivos compartidos, rutas relativas, `include`, `require`, sus variantes `_once`, `__DIR__`, `__FILE__`, JSON, GET, POST y arrays de formulario. También cookies con creación y eliminación, sesiones entre peticiones, eliminación de variables de sesión, redirecciones, bcrypt y `password_verify`, subida multipart con `File` y `move_uploaded_file`, errores de sintaxis, errores de ejecución, salida excesiva y cancelación de un bucle infinito.

El inspector recibe las cabeceras efectivas de la petición, incluida Cookie, Content-Type y la frontera multipart. Las cabeceras de respuesta y el estado proceden del SAPI PHP. Las sesiones se muestran como archivos serializados originales de PHP; no se inventa su contenido. Algunos errores del SAPI se escriben en el cuerpo HTTP, junto con un código de salida distinto de cero y HTTP 500, aunque stderr esté vacío.

Los datos de entrada de consola se proporcionan antes de ejecutar. No hay diálogo interactivo mientras el programa está ejecutándose. Las pruebas de funciones comparan valores y tipos JSON, arrays, cadenas, booleanos, null y números con tolerancia decimal; no comparan el texto del código con una solución modelo. Todos los casos distribuidos en el cliente son consultables, también los llamados adicionales.

## Aislamiento y límites

Cada laboratorio posee un worker y un sistema de archivos virtual. Abrir un proyecto reinicia `/www`, los temporales y la colección de cookies. No se montan archivos del ordenador ni el almacenamiento de ESTUDIO. Se desactivan funciones de procesos, conexiones PHP y puentes de ejecución JavaScript; PHP no dispone de una pasarela de red. `open_basedir` restringe el acceso a `/www` y `/tmp`. Las cookies educativas nunca se escriben en `document.cookie`.

El servicio termina el worker si una petición supera ocho segundos, y permite cancelarlo. La primera carga tiene un margen de sesenta segundos. El límite configurado de memoria PHP es 64M, el proyecto admite hasta ochenta archivos y 1 MiB de texto, cada envío hasta 2 MiB y la salida devuelta hasta 64 KiB. El límite de memoria PHP no equivale a un límite total del proceso WebAssembly: `ini_set` continúa disponible para estudiar directivas y el navegador administra la memoria de la máquina virtual. No se promete un tope duro del consumo total de Safari. Tras cancelar es necesario volver a ejecutar para preparar un entorno nuevo.

El navegador de previsualización debe mantenerse con sandbox y CSP; ese aislamiento se implementa en el componente del laboratorio. Los scripts del estudiante no se ejecutan en el documento de ESTUDIO.

## Verificación reproducible y validación pendiente

Las herramientas de navegador usan Playwright instalado en el proyecto o una instalación aislada en `.runtime-test-deps/node_modules`, con Chrome instalado o WebKit descargado mediante Playwright. `node tools/runtime-poc.mjs --webkit --bank` comprueba el intérprete, su aislamiento y las soluciones del banco. `node tools/runtime-quick-ui.mjs --webkit --production` sirve automáticamente `dist/modo-estudio/browser` para comprobar el componente real de ejercicios rápidos. Sin `--production`, utiliza la aplicación Angular en `http://127.0.0.1:4200` (se puede cambiar mediante `ESTUDIO_TEST_URL`).

El 25/11/2026 pasaron veintitrés comprobaciones del motor en Chrome y WebKit, las salidas exactas de veinticinco preguntas de interpretación y treinta y nueve casos de prueba correspondientes a diecisiete funciones de referencia. Se incluyó la recuperación después de alterar el archivo temporal de arranque, convertirlo en un directorio o reemplazarlo por un enlace simbólico, así como la restauración de la configuración tras usar `ini_set`. Además, la interfaz de producción superó los diecisiete ejercicios y sus treinta y nueve casos en Chrome y WebKit, rechazó una implementación incorrecta y un error de sintaxis y ejecutó la conversión por entrada estándar de 30,48 centímetros. No fue necesario corregir preguntas del banco.

Los resultados de WebKit de escritorio no son una prueba en un iPhone físico. Sigue pendiente comprobar Safari iOS real, instalación PWA, teclado y selección de texto, recuperación tras suspensión, presión de memoria y disponibilidad offline después de reiniciar el dispositivo. La versión académica de referencia es PHP 8.2; el motor incorporado conserva esa versión menor y usa una revisión de mantenimiento posterior a la de XAMPP del aula.
