# ESTUDIO 17 · Informe de mejoras DWCS

Fecha de trabajo y comprobaciones: 25 de noviembre de 2026. Se ha trabajado sobre la aplicación existente; no se ha reconstruido ni publicado. La versión de producto sigue siendo 17.0.0 y el proyecto conserva Angular 21.

## Conservación del estado inicial

La carpeta ya contenía cambios académicos y técnicos sin confirmar en Git. Antes de editar se guardaron copia de `src`, `tools`, configuración, estado Git, parche y hashes de los recursos en `.local-baseline-20261125/`. Esa referencia local está excluida de Git. La comparación de conservación se hace contra el estado recibido al comenzar este trabajo, no contra un commit anterior que contenía otro banco.

| Banco original | UD1 | UD2 | UD3 | Total conservado |
|---|---:|---:|---:|---:|
| DWCS | 114 | 269 | 162 | **545** |
| Despregamento | 53 | 128 | — | **181** |

**Cero preguntas eliminadas, sustituidas, reescritas o añadidas al banco original. Cero correcciones puntuales de preguntas.** Se verifican SHA256 de los dos archivos completos y de cada objeto/pregunta. Las nuevas prácticas están en un catálogo independiente. No se ha tocado el archivo de preguntas de Despregamento ni sus referencias, imágenes o PDF. Se han conservado byte a byte los 78 recursos binarios iniciales: imágenes, iconos, PDF y ZIP. El manifest mantiene sus colores e iconos.

Se conservan explicaciones, referencias, apartados, modalidades, favoritos, informes de problemas, exportaciones y resultados. La auditoría detectó que el cargador anterior descartaba registros e historial antiguos; ahora los conserva. No se resetea ni migra destructivamente el progreso.

## Resultado implementado

### Preparación del examen

Se incorporan las indicaciones facilitadas por el alumno: miércoles 2 de diciembre de 2026, desde las 15:00 hasta las 18:30 como máximo; UD1 escrita 90 %/tareas 10 %, UD2 práctica 80 %/tareas 20 %, UD3 escrita 25 %/práctica 50 %/tareas 25 %. Las normas de consulta se muestran en Exámenes. No se inventan duración por unidad, número oficial de preguntas ni rúbrica oficial.

«Crear simulacro» y Exámenes permiten elegir estudio general o preparación prioritaria. Los metadatos están separados de las preguntas: unidad, apartado, temas relacionados, dificultad, modalidad y prioridad. La clasificación por apartado es una interpretación didáctica de las indicaciones recibidas, revisable en `exam-priority.ts`; no constituye una nueva indicación oficial de la profesora.

| Unidad | Destacadas | Resto del temario |
|---|---:|---:|
| UD1 | 50 | 64 |
| UD2 | 219 | 50 |
| UD3 | 152 | 10 |

El modo prioritario usa inicialmente una cuota aproximada 70/30; la interfaz ofrece 50/50, 70/30 y 85/15. Ajusta la cuota cuando faltan preguntas de una categoría. Combina preguntas nuevas, errores recientes/repetidos, favoritas, tiempo sin repasar, aciertos acumulados y cobertura de apartados. Muestrea sin reemplazo y mezcla el resultado final. Las categorías minoritarias conservan probabilidad y una sesión de al menos dos preguntas conserva ambas cuando hay disponibilidad. No garantiza visitar todos los apartados en cada sesión breve; las pruebas verifican su cobertura a lo largo de sesiones.

El estudio general mantiene selección aleatoria uniforme mediante Fisher–Yates. La ponderación se aplica exclusivamente al modo explícito de preparación DWCS. Se respetan unidad, apartado, modalidad, errores, origen, imágenes y pendientes. Los identificadores explícitos se deduplican. Despregamento mantiene su estudio general.

UD1 tiene simulacro escrito; UD2 abre proyectos prácticos; UD3 separa escrita y práctica. Las escritas ocultan pistas y soluciones hasta terminar. Los proyectos en modo simulacro permiten apuntes locales, ejecución e inspector; ocultan pistas, solución y comprobaciones hasta entregar. La corrección posterior sigue siendo razonada. Acertar test teóricos no se presenta como equivalencia a dominar la programación.

### PHP real dentro de ESTUDIO

Se seleccionó PHP-WASM de WordPress Playground, paquetes alineados 3.1.66, PHP **8.2.35**, variante **Asyncify**. Se realizó primero una prueba ejecutable y después la integración. Mantiene PHP 8.2, admite Safari/WebKit sin exigir JSPI y proporciona intérprete, SAPI y archivos reales en WebAssembly. No ejecuta WordPress. La selección, las fuentes primarias, licencias, revisión de origen y regeneración están en [PHP_RUNTIME.md](PHP_RUNTIME.md) y `public/php-runtime/`.

La máquina virtual ocupa 18.016.349 bytes; el conjunto de runtime es aproximadamente 18,4 MB. Está alojada con la aplicación, se carga al ejecutar PHP y se conserva mediante la caché de producción. La pantalla teórica no descarga el WASM. No hay llamadas a compiladores externos, backend Node/PHP obligatorio, Docker, XAMPP ni dependencia del ordenador del alumno para estudiar en la versión publicada.

| Capacidad | Estado comprobado |
|---|---|
| PHP y errores de sintaxis/ejecución | Ejecutados realmente en Chromium y WebKit |
| STDIN `fgets` / `fscanf` | Datos multilínea proporcionados antes de ejecutar |
| Archivos compartidos | `include`, `require`, variantes `_once`, `__DIR__`, `__FILE__`, rutas relativas |
| Lectura y escritura | JSON, PHP y TXT dentro del sistema virtual |
| HTTP educativo | GET, POST, arrays, URL y `REQUEST_METHOD` |
| Estado | Cabeceras, redirecciones, cookies, sesiones y su eliminación |
| Autenticación | JSON, bcrypt, `password_verify`, acceso protegido, roles y logout |
| Uploads | `File`, multipart, `$_FILES`, `move_uploaded_file` y validación |
| Consola interactiva durante ejecución | No implementada; la entrada se entrega previamente |

El inspector muestra método, URL, GET, POST, cabeceras efectivas —incluidas Cookie y frontera multipart—, estado, Location, Set-Cookie, cookies virtuales y archivos de sesión serializados por PHP. Los errores pueden aparecer en stderr o en el cuerpo con HTTP 500. No se simulan salidas.

### Ejercicios rápidos y editor

Se mantienen su formato y sus preguntas. «Ejecutar código» muestra el resultado real; «Comprobar solución» llama las funciones con los casos disponibles y compara valores, tipos JSON, arrays, booleanos, null, cadenas y números con tolerancia decimal. No compara el código con una respuesta modelo. Si un ejercicio no tiene casos automáticos, se indica expresamente. Los resultados se invalidan al cambiar código.

El editor conserva los colores oscuros y la familia tipográfica existentes. Añade resaltado, números de línea, Tab y sangría automática, cierre básico de delimitadores al escribir, deshacer/rehacer, copiar/pegar con alternativa nativa del teclado, búsqueda, tamaño de letra, modo ampliado y barra de símbolos. La barra sustituye la selección e inserta en el cursor. El ajuste «Sangrar» es básico y rechaza archivos con HTML, heredoc o cadenas multilínea para no alterar su contenido; no se presenta como un formateador completo. El cierre de delimitadores es una ayuda contextual, no autocompletado semántico de PHP.

La edición se bloquea durante la ejecución del proyecto para evitar ejecutar una instantánea antigua mientras se modifica. El código de las preguntas rápidas también se conserva por identificador, incluso antes de corregirlo.

### Laboratorio multifichero

Ruta `/laboratorio`, con acceso desde Inicio, Exámenes y las unidades DWCS 2/3. Incluye enunciado, explorador, pestañas de archivos, editor, aplicación, HTTP, comprobación y solución. Permite crear archivos/carpetas, renombrar, eliminar, restaurar el inicio y descargar ZIP. Valida rutas y colisiones archivo/carpeta. Las carpetas vacías se materializan en el sistema virtual; los marcadores internos no aparecen entre los archivos editables. Se admiten PHP, HTML, CSS, JSON y TXT. Los TXT/JSON generados al ejecutar se guardan y pueden exportarse.

Los formularios y enlaces de la vista HTML generan peticiones al intérprete. Chromium necesitó `allow-forms` en el sandbox para emitir el evento de envío; se detectó y corrigió en las pruebas de interfaz. Se mantiene el origen opaco, CSP, bloqueo de conexiones y la interceptación del envío. No se permite acceder a localStorage, cookies reales ni datos de ESTUDIO. El JavaScript escrito por el alumno no se ejecuta en la vista; el puente de navegación es el único script autorizado. CSS local se integra desde los archivos del proyecto; no se solicitan dependencias externas desde la previsualización.

Las comprobaciones distinguen ejecución HTTP, existencia de archivos, análisis estático y autoevaluación. Las pruebas admiten HTML equivalente, diferencias de comillas/mayúsculas en formularios y redirecciones relativas equivalentes. Cada escenario reinicia archivos/cookies/sesión; sus pasos conservan estado. Muestran entrada, expectativa, estado, salida obtenida y fallos. Las pruebas adicionales se distribuyen en el cliente y no se califican como secretas. Los requisitos manuales aparecen explícitamente y no se suman como aprobados automáticos.

### Proyectos añadidos

Todos son prácticas nuevas inspiradas en competencias del material existente, no tareas oficiales reproducidas. Incluyen contexto, objetivo, enunciado, archivos proporcionados/por completar, requisitos y restricciones, ejemplos, datos, pruebas, rúbrica orientativa, pistas progresivas, solución completa por archivo, explicación y referencias verificadas por apartado. No se han asignado páginas nuevas sin verificar.

| Unidad | Proyecto | Competencias principales |
|---|---|---|
| UD2 | Reserva de actividades deportivas | POST, tarifas, funciones tipadas, PHPDoc, descuentos |
| UD2 | Catálogo de prendas con filtros GET | Arrays bidimensionales, búsqueda y URL |
| UD2 | Menú y selección múltiple de alérgenos | Arrays y campos múltiples |
| UD2 | Acta de calificaciones en tabla | Matrices, medias y HTML |
| UD2 | Presupuesto y ámbito de variables | Parámetros, variables locales y configuración |
| UD2 | Generador de matriz y sumas | Funciones y bucles anidados |
| UD2 | Pedido de material con gastos de envío | Validación, arrays y umbrales |
| UD2 | Página compuesta e inclusiones | include/require/once y archivos relacionados |
| UD2 | Inscripción en talleres y resumen | POST múltiple y funciones de validación |
| UD2 | Entrega de un archivo de texto | Uploads, directivas y archivos |
| UD3 | Contador de visitas con cookie | HTTP sin estado y ciclo petición/respuesta |
| UD3 | Preferencia de idioma persistente | POST, cookie y redirección |
| UD3 | Crear y eliminar una preferencia | Nombre/ruta y caducidad de cookie |
| UD3 | Historial reciente de productos | JSON en cookie y validación |
| UD3 | Cesta de compra con cantidades | Sesión, arrays y catálogo |
| UD3 | Eliminar productos y vaciar la cesta | unset, vaciado y conservación de otras claves |
| UD3 | Inicio de sesión con JSON y contraseña hasheada | JSON, password_verify y sesión |
| UD3 | Acceso y redirección por roles | Autenticación, autorización y logout |

No se exigen bases de datos, frameworks ni POO avanzada. Las credenciales de las prácticas son ficticias; se proporciona una contraseña pública de pruebas y hashes previamente calculados.

### Persistencia, exportación y PWA

Se mantienen las claves de progreso existentes y se amplía su formato con borradores compatibles. Los datos corruptos no se borran automáticamente ni se sobrescriben silenciosamente. Se retiraron los descartes de IDs/resultados antiguos y el recorte silencioso del historial. Los fallos de cuota generan un aviso visible.

Los proyectos usan IndexedDB y un diario síncrono local. Se elige la copia más reciente por fecha; no se permite que un diario obsoleto o una cuota llena oculten código más reciente de IndexedDB. La importación se valida completa antes de guardar, normaliza controles de interfaz y rechaza rutas/collisiones. Conserva archivos, pestañas, observaciones y resultados de comprobación.

«Mi código ZIP» produce archivos normales para VS Code/XAMPP y conserva carpetas vacías. «Práctica completa ZIP» incluye código propio, inicio, soluciones, pruebas y observaciones. La copia JSON de proyectos permite trasladar/restaurar el trabajo. Se exporta por separado del progreso teórico; ambas opciones se explican en README y en la aplicación.

Las fuentes originales DM Sans y JetBrains Mono están incorporadas localmente (77.336 bytes más sus licencias). Esto elimina la dependencia del CDN para conservar tipografía sin conexión. Se mantienen paleta, iconos, bordes, botones, tarjetas, modo oscuro y navegación principal. Las interfaces nuevas reutilizan los tokens existentes. El visor de imágenes usa diálogo nativo con foco/teclado y zoom; no modifica la imagen. Los tres PDF de apuntes DWCS y el PDF original adicional conservan bytes y diseño.

La PWA precarga aplicación, fuentes e imágenes. PDF y PHP usan instalación/actualización lazy: se almacenan al utilizarlos, sin descargar repetidamente el WASM ni imponerlo al primer arranque. Se añadieron metadatos de instalación iOS e icono táctil, reutilizando el icono actual. La caché no constituye una copia de seguridad permanente: iOS administra almacenamiento y puede retirarlo.

## Pruebas y resultados

Las siguientes comprobaciones han pasado. Las herramientas y capturas están en `tools/` y `test-results/`; las capturas son evidencia de pruebas, no imágenes académicas nuevas.

| Comprobación | Resultado |
|---|---|
| `npm run check` | Banco, 78 recursos, TypeScript, compilador Angular, cobertura, selección, persistencia y estructura de proyectos correctos |
| `npm run build` | Producción correcta, sin avisos; paquete inicial 743,12 kB, transferencia estimada 153,74 kB; laboratorio diferido ~110,75 kB |
| Selección ponderada | 1.500 sesiones, cuota 70/30, sin duplicados; cobertura total a lo largo de sesiones, categorías escasas y repaso adaptativo |
| Banco y referencias | 545 DWCS y 181 Despregamento intactas; referencias estructurales e imágenes disponibles |
| PHP-WASM | 23 comprobaciones reales en Chromium y WebKit, incluidos errores, límites, temporales manipulados e aislamiento |
| Soluciones de preguntas | 25 interpretaciones con salida exacta y 17 funciones/39 casos ejecutados realmente |
| Componente de ejercicios rápidos | 17 soluciones/39 casos en ambos motores; código incorrecto y error de sintaxis rechazados; conversión 30,48 cm ejecutada |
| Proyectos | 18 soluciones, 69 escenarios y 99 peticiones por motor; uploads válidos/incorrectos/exceso de tamaño y contenido guardado |
| Casos negativos de proyectos | Los 18 inicios incompletos no aprueban; detectados descuento erróneo, omisión de password_verify y autorización omitida |
| Persistencia de proyectos | 34 comprobaciones con IndexedDB real por motor: cuota, diario obsoleto, fallos de IDB, recarga, importación y rutas |
| ZIP | Extracción independiente con Python zipfile: CRC, UTF-8, archivos y carpetas vacías correctos |
| Interfaz del laboratorio | Cursor/selección, deshacer/rehacer, recarga con código guardado, formulario POST real, inspector, corrección, ZIP, ocultación de solución en simulacro, cookies, upload y TXT generado |
| Móvil emulado | Chromium/WebKit con configuración iPhone 13: navegación, filtros, referencias, fuentes, preferencias y ausencia de desbordamiento de página |
| Visor y modo oscuro | Diálogo modal nativo en banco/estudio; zoom 100–400 %, fondo inerte, Tab/Escape, restauración del foco y paleta oscura del laboratorio comprobados en ambos motores |
| Offline de producción | Recarga, banco, imágenes, fuentes, PDF y ejecución PHP en Worker nuevo después de preparar caché, en ambos motores |

La prueba offline WebKit detiene realmente el servidor origen para evitar el fallo de Playwright al emular desconexión en páginas con Service Worker ([incidencia del proyecto](https://github.com/microsoft/playwright/issues/42775)). No proporciona respuestas simuladas. Las pruebas de escritorio WebKit y la emulación iPhone **no equivalen a Safari en un iPhone físico**.

La revisión del banco es estructural y ejecuta las preguntas PHP indicadas; no se presenta como una nueva revisión humana exhaustiva de la corrección pedagógica de las 545 preguntas. No se detectó una corrección objetiva que obligase a cambiar el banco.

## Limitaciones y validaciones pendientes

- **iPhone físico**: instalación desde Safari, teclado/portapapeles, selección y zoom, áreas seguras con distintos tamaños, suspensión/reapertura, reinicio en modo avión y presión de memoria. Deben probarse en el teléfono real.
- **Memoria**: `memory_limit=64M` es una configuración PHP que se puede estudiar/cambiar con ini_set. No es un límite duro de memoria total WebAssembly/Safari. Se aplican cancelación, watchdog de ocho segundos y límite de salida devuelta de 64 KiB.
- **Entorno web virtual**: no es una réplica completa de Apache/XAMPP ni de todas las políticas de cookies de Safari. No implementa bases de datos, red externa, frameworks o JavaScript del alumno. Las sesiones se inspeccionan como archivos serializados originales.
- **Entrada estándar**: no es interactiva durante la ejecución. Los datos se preparan previamente.
- **Editor**: resaltado y cierre de delimitadores básicos; no incluye un analizador semántico/autocompletado PHP ni un formateador completo de documentos mixtos.
- **Material académico**: sigue faltando el PDF original de algoritmos de la Actividad 2.2. Las guías existentes son reelaboraciones del material recibido, no transcripciones literales. Las prácticas nuevas citan apartados, sin inventar páginas.
- **Revisión manual**: PHPDoc completo, claridad, estructura y algunos límites/configuración de XAMPP se valoran con rúbrica, no se dan automáticamente por correctos por pasar los casos distribuidos.
- **Copias y despliegue**: no hay sincronización entre dispositivos ni publicación realizada. El progreso teórico y los proyectos tienen exportaciones separadas. La copia local se conserva en el mismo origen/navegador.

## Uso desde iPhone

1. Publicar la compilación mediante HTTPS en el mismo dominio de uso, o importar las copias al cambiar de dominio.
2. Abrir Safari → ESTUDIO → Compartir → Añadir a pantalla de inicio.
3. Con conexión, abrir una práctica y ejecutarla para descargar PHP; abrir los PDF que se vayan a consultar. Esperar a que el Service Worker quede activo.
4. Entrar en Laboratorio, elegir UD2/UD3, leer el enunciado y abrir Archivos. Completar el código y ejecutar para navegar por formularios. HTTP permite observar el estado.
5. Usar Comprobación para revisar casos y rúbrica; Solución muestra cada archivo sin sobrescribir el trabajo. Para simular una práctica, elegir la opción correspondiente y entregar para corregir.
6. Exportar periódicamente el progreso en Perfil y los proyectos en Laboratorio. Descargar ZIP para preparar material local de VS Code/XAMPP conforme a las normas de la profesora.
7. Comprobar el modo avión y la reapertura en el teléfono real antes de depender de la caché.

## Despliegue y reproducción

Ejecutar `npm ci`, `npm run check` y `npm run build`. Publicar el contenido de `dist/modo-estudio/browser` en la raíz HTTPS; mantener archivos reales accesibles y reescribir únicamente rutas de navegación a `index.html`. Servir WASM/JavaScript/fuentes con sus MIME adecuados. No hay servidor PHP obligatorio. `render.yaml` conserva la configuración de sitio estático existente.

Para pruebas de navegador, instalar sus binarios con `npx playwright install chromium webkit`. `npm run test:runtime`, `test:projects`, `test:quick`, `test:laboratory`, `test:project-storage` y `test:mobile` aceptan `-- --webkit`; las pruebas de interfaz/PWA sirven automáticamente la compilación. `CHROME_PATH` permite seleccionar Chrome explícitamente. La CI ejecuta comprobaciones estructurales y build; los navegadores se ejecutaron localmente en este trabajo.

## Archivos principales creados y modificados

El inventario completo, con estado y hashes inicial/final por archivo, se entrega en [CAMBIOS_DWCS.json](CAMBIOS_DWCS.json). Se calcula frente a la copia inicial y excluye dependencias, builds y resultados temporales.

**Creados:** `core/exam-priority.ts`, `core/question-selection.ts`, `core/php-project.ts`, `core/php-runtime.service.ts`, `core/project-storage.service.ts`, `core/project-evaluation.ts`, `core/project-zip.ts`, `data/php-projects.ts`, `features/laboratory/`, `shared/image-viewer.component.ts`, `styles/laboratory.css`, `public/php-runtime/`, `public/fonts/`, manifiestos de conservación y herramientas de prueba en `tools/`, `PHP_RUNTIME.md` y este informe.

**Modificados respecto al estado recibido:** StudyService; Exámenes y banco; editor y ejecutor PHP; pantallas/enlaces de Inicio y unidades; rutas; configuración del simulacro; reporte de referencias; visor de imágenes; estilos originales únicamente para disponer localmente de fuentes; imports/estilos de los controles nuevos; `ngsw-config.json`, `src/index.html`, scripts/dependencias de desarrollo, CI, README y documentación de pruebas/cobertura. No se modificaron los archivos originales de preguntas ni los PDF/imágenes.

`shared/php-runner.component.ts` y otros archivos ya estaban presentes sin seguimiento de Git al comenzar. Su aparición como «nuevo» en el diff no significa que se creasen desde cero durante este trabajo. La referencia `.local-baseline-20261125/` permite distinguirlo.
