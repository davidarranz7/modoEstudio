# Editor y laboratorio PHP · entrega del 26/11/2026

Las mejoras están implementadas directamente en este proyecto. Se mantiene Angular 21, PHP 8.2.35 mediante WASM en un Web Worker y el despliegue estático. No se requiere Docker, XAMPP, un backend ni servicios de IA remotos.

## Alcance conservado

Las 545 preguntas de DWCS y las 181 de Despregamento permanecen intactas. También los 18 proyectos existentes, sus 66 archivos académicos, enunciados, soluciones, explicaciones, rúbricas, referencias, PDF e imágenes. No se han creado prácticas ni cambiado la organización académica, modos de estudio/examen, banco, estadísticas o selección ponderada.

`npm run check` verifica el banco, recursos originales y referencias. Además, `check:editor-scope` compara mediante SHA256 los 147 originales protegidos frente al estado previo a esta implementación. En las dos plantillas de estudio descuenta exclusivamente la integración exacta del intérprete de fragmentos solicitada al finalizar; el resto de sus bytes sigue comprobándose. La interfaz de soluciones y pistas conserva la restricción del simulacro: no se incorpora su panel al documento antes de entregar.

## Editor seleccionado e implementado

Se integra **CodeMirror 6**, cargado mediante importación diferida. Sustituye el editor de texto y resaltado superpuesto del entorno de programación. No cambia las preguntas ni sus soluciones.

- PHP y HTML mezclados, HTML, CSS, JSON y texto, con resaltado sintáctico, líneas, línea activa, delimitadores y plegado.
- Autoindentación, cierre de delimitadores y comillas, sangrar/desangrar, deshacer/rehacer, búsqueda y reemplazo, selección, copiar y pegar.
- Formateo completo de JSON y ajuste de sangría sintáctica para los otros lenguajes. No se presenta este ajuste como un formateador completo de PHP.
- Tamaño de letra entre 16 y 24 px, barra horizontal de símbolos y herramientas secundarias en «Más». La inserción respeta cursor y selección.
- Pantalla completa con Ejecutar y Corregir donde existe un ejecutor. Al ejecutar se muestran los resultados y se conserva el documento.
- Diagnósticos del analizador y de PHP; los definitivos proceden de la ejecución. Los problemas con localización permiten abrir su archivo y línea.

### Asistencia local

El catálogo se obtiene del mismo PHP 8.2.35 incorporado: **1.149 funciones y 1.720 constantes**, excluyendo funciones deshabilitadas por el entorno. Se añaden palabras reservadas, superglobales y construcciones del lenguaje.

Hay descripciones específicas en español para 131 funciones y construcciones frecuentes. Las restantes ofrecen su firma reflejada y una descripción general en español; no se afirma que todas tengan documentación semántica detallada de cada parámetro. Se muestran tipos, retorno, argumentos opcionales, valores por defecto y argumento activo.

La asistencia incluye variables declaradas del ámbito identificable, funciones propias y de otros archivos, PHPDoc, rutas de `include`/`require` y fragmentos. Se actualiza al editar el proyecto. Las sugerencias respetan el contexto PHP/HTML/CSS/JSON y evitan comentarios y cadenas ordinarias. Se pueden aceptar mediante toque o teclado y cerrar expresamente. «Ayudas» desactiva completado, fragmentos y cierres automáticos, conservando la lectura del código.

Por la última petición se añade **Escribir y probar código PHP** a las preguntas con fragmentos PHP, incluidas operaciones sencillas. Permite editar, ejecutar y ver la salida real, y comprobarla frente a la salida esperada existente o la ejecución del fragmento original. La respuesta escrita se conserva por separado, el código del panel se guarda localmente y la restricción del modo examen se mantiene. Se compara la salida de esa ejecución; no se inventan casos académicos ni se presenta como una prueba general de corrección.

Se comprobaron expresamente `move_`, `array_`, `session_`, `str_`, `$_`, firmas, funciones propias, rutas y contextos mezclados. Es análisis estático local, no un servidor LSP: no resuelve todos los tipos, llamadas dinámicas, herencia o inclusiones calculadas. El índice de símbolos omite archivos de más de 512 KiB para mantener la respuesta; sus documentos siguen siendo editables y ejecutables.

## Archivos, historial y protección del trabajo

El explorador muestra un árbol real con archivos y carpetas, incluidas carpetas vacías. Permite crear, renombrar, eliminar con confirmación, abrir/cerrar pestañas, restaurar el inicio con confirmación y exportar ZIP. Renombrar no reescribe automáticamente las rutas dentro del código: el diálogo lo indica.

Cada archivo conserva código, cursor, selección, desplazamiento, deshacer y rehacer al cambiar de archivo, consultar el enunciado y ver resultados. La selección, desplazamiento, preferencias e historial se serializan junto al proyecto para recuperarlos al reabrirlo. Un identificador del contenido evita aplicar un historial antiguo a código diferente. El cierre del proyecto captura el estado pendiente antes de guardarlo.

Se mantienen la base IndexedDB y el esquema anterior. El guardado agrupa ráfagas de cambios, expone Guardando/Guardado/Error de guardado y conserva respaldo local. Las operaciones de archivos validan todas las rutas antes de modificar el proyecto. Los conflictos entre pestañas se detectan mediante versiones de almacenamiento: no se sobrescribe silenciosamente la versión ajena, y ambas copias se incluyen en la exportación de respaldo. Las copias ilegibles se conservan para recuperación.

El inventario del Worker distingue archivos presentes, contenido omitido y eliminaciones verificadas. La ausencia de un archivo en una respuesta nunca elimina su documento. Un archivo de 300.000 caracteres sobrevive a ejecución, navegación y guardado. Incluso si PHP elimina un archivo virtual, se conserva la copia del alumno en el editor. Las escrituras generadas por la aplicación se incorporan cuando no entran en conflicto con una edición.

## Ejecución, HTTP y resultados

- Recuperación tras una descarga WASM fallida, sin dejar una promesa rechazada bloqueando los siguientes intentos.
- Ejecutar utiliza la entrada del proyecto; la dirección del visor sirve para navegar después.
- Los cambios se aplican al sistema de archivos virtual existente. Editar no reinicia cookies, sesiones ni datos generados. El menú permite reiniciarlos expresamente.
- `include`, `require`, variantes `_once`, rutas relativas, `__DIR__`, `__FILE__`, funciones compartidas, lectura/escritura y JSON usan PHP real.
- Formularios GET/POST, parámetros, controles enviables y botón de envío, navegación, cabeceras, redirecciones, cookies, sesiones, autenticación, roles y subida multipart.
- CSS estático y dinámico, importaciones relativas y recursos se resuelven dentro de la misma sesión y renderizan en el iframe aislado, también en WebKit.
- Vista previa, salida, problemas e inspector HTTP separados. Se distinguen errores de sintaxis y ejecución, advertencias, ausencia de salida, cancelación y tiempo excedido.
- Archivo, línea, mensaje original y explicación cuando están disponibles. Un aviso no aparece como una ejecución limpia. Se señala cuando los resultados pertenecen a una versión anterior del código.
- Cancelar termina el Worker y conserva el código. La siguiente ejecución prepara otro entorno. Continúa el límite de ocho segundos por petición.

La corrección se ejecuta en un intérprete independiente del visor. Compara valores y tipos reales y rechaza resultados JSON impresos o alterados. El evaluador web comprueba controles enviables y comportamientos entre peticiones, y descarta varios falsos positivos de resultados numéricos literales o coincidencias en comentarios/cadenas. No se cambian casos académicos ni rúbricas. Los casos finitos y las comprobaciones léxicas no demuestran la corrección general ni hacen inviolable un examen local.

## Distribución y estética

Los cambios visuales se limitan al entorno de programación. Se conservan los tokens originales de color, DM Sans, JetBrains Mono, iconos, bordes, botones y temas claro/oscuro. En móvil, un área de trabajo ajustada al `visualViewport` permite alternar enunciado, código y resultados sin recorrer una página larga. El árbol se abre como panel lateral y los comandos quedan al pie; la pantalla completa mantiene sus acciones. En escritorio, árbol, editor y resultados aprovechan columnas.

CodeMirror y sus lenguajes están en un bloque diferido de aproximadamente 1,02 MB sin comprimir, con transferencia estimada de 223 kB. La carga inicial de producción es aproximadamente 744 kB, con transferencia estimada de 154 kB. Son estimaciones de Angular, no mediciones de red de un iPhone. El Service Worker conserva los bloques de aplicación en segundo plano; PHP se descarga al usarlo por primera vez, unos 18 MB. No se descarga PHP al entrar en una pantalla teórica.

## Validación reproducible

Las herramientas sirven la compilación de producción en un puerto temporal y usan almacenamiento de prueba aislado. Los cambios se verificaron con Chrome y WebKit de Playwright, con vista móvil de iPhone 13 emulada.

| Comprobación | Resultado |
| --- | --- |
| `npm run check` | Banco de 726 preguntas, recursos, TypeScript, plantillas Angular, cobertura, selección, persistencia y 147 archivos protegidos correctos |
| `npm run build` | Compilación de producción correcta |
| `test:editor` | 34 comprobaciones por motor: completado contextual, toque real, firmas, PHPDoc, rutas, Unicode, catálogo compatible e historial persistente |
| `test:runtime-editor` | 20 comprobaciones por motor, incluida descarga fallida/reintento, archivo grande, sesión, carpetas, diagnósticos, cancelación, recursos y aislamiento |
| `test:runtime` | 23 regresiones por motor; además 25 interpretaciones y 39 casos de 17 funciones del banco |
| `test:project-storage` | 48 comprobaciones por motor y dos pestañas reales: guardado, cuotas, corrupción, conflictos, exportación e historial |
| `test:evaluation` | 17 casos específicos y las 18 soluciones: 69 escenarios, 99 peticiones y 7 comprobaciones estáticas, por motor |
| `test:quick` | 17 soluciones/39 casos, rechazo de código incorrecto, sintaxis y JSON falsificado; ampliación, avisos, resultado anterior y entrada estándar |
| `test:laboratory` | Edición y guardado, formulario real, HTTP, corrección, dos ZIP, solución ausente durante simulacro, cookies y subida real persistente tras recargar, en ambos motores |
| `test:workspace` | Sugerencias, firmas, historial, ampliación, POST, CSS dinámico, continuidad de sesión, entrada, archivo grande, nuevo include, carpetas, diagnósticos y cancelación/reintento |
| `test:editor-offline` | Recarga de producción, CodeMirror, sugerencia táctil y Worker PHP nuevo sin red en ambos motores |
| `test:simple-php` | Comprobación breve del editor de operaciones: ejecutar 2+3, detectar salida diferente y coincidente, conservar la respuesta escrita |

Para repetir las pruebas de navegador, ejecutar primero `npm ci`, `npm run build` y `npx playwright install chromium webkit`. Los comandos anteriores aceptan `-- --webkit`; sin ese argumento utilizan Chrome instalado o Chromium. `test:laboratory` cubre además el flujo de las prácticas existentes con formularios, ZIP, simulacro, cookies y subida real de archivos.

La prueba offline de WebKit detiene realmente el servidor de origen tras preparar la caché, porque el modo offline emulado de Playwright interfiere con su Service Worker. No se sustituye PHP por respuestas simuladas.

## Límites y validación móvil pendiente

No se ha probado en un iPhone físico. Quedan por comprobar allí teclado virtual y selección táctil real, composición y dictado, áreas seguras, instalación desde Safari, orientación, suspensión/reanudación, presión de memoria y arranque offline tras reiniciar el dispositivo. La emulación y WebKit no sustituyen esas pruebas.

La ejecución HTTP es virtual y educativa; no reproduce completamente Apache/XAMPP ni las políticas de Safari. La previsualización mantiene sandbox sin mismo origen y CSP, bloquea scripts del alumno y conexiones externas, y resuelve recursos locales admitidos. Los límites de archivos, memoria, recursos, tiempos y salida están descritos en [PHP_RUNTIME.md](PHP_RUNTIME.md). El portapapeles depende del permiso del navegador; si no está disponible se indica cómo usar su menú nativo. El almacenamiento puede agotarse o ser retirado por iOS; las exportaciones siguen siendo necesarias para trasladar y respaldar el trabajo.

## Uso y despliegue

Los cambios ya están en la carpeta del proyecto; no hace falta extraer un ZIP para utilizarlos:

```powershell
cd C:\Users\arran\Documents\ModoEstudio
npm ci
npm start
```

Para Render se conserva `render.yaml`: `npm ci --no-audit --no-fund && npm run build`, publicación de `dist/modo-estudio/browser` y reescritura a `index.html`. El PHP incorporado sigue funcionando como recurso estático. No se ha publicado ni modificado un servicio externo durante esta entrega.
