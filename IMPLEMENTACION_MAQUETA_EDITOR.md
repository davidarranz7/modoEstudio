# Integración de la maqueta del editor · 26/11/2026

Se aplica la maqueta `ESTUDIO_MAQUETA_VISUAL_EDITOR_PHP_HTML.zip` a los ejercicios de código y a las prácticas completas. La aplicación conserva Angular, CodeMirror 6, PHP 8.2.35 mediante WebAssembly y el despliegue estático en Render.

## Presentación

- Fondo del editor `#151a23`, cabecera `#222c3c`, numeración lateral y colores de sintaxis de la maqueta.
- Cabecera con archivo activo, indicador real de guardado y descripción discreta. El menú «Opciones del editor» reúne herramientas secundarias.
- Sin filas permanentes de herramientas, símbolos, estado o firma ampliada. Los símbolos pueden activarse voluntariamente.
- Dos acciones principales debajo del editor: **Ejecutar** y **Corregir**. La cancelación aparece mientras hay una operación en curso.
- Un resultado compartido con **Salida** y **Vista HTML**. Errores, HTTP y detalles de las pruebas tienen accesos secundarios.
- En prácticas, pestañas horizontales dentro del bloque oscuro, `+` para crear y «Archivos y carpetas» para gestionar el proyecto. El enunciado, la solución y la rúbrica siguen disponibles.
- El laboratorio y las acciones siguen el flujo de la página. En las preguntas de programación, el footer académico también sigue ese flujo para no tapar el editor ni los resultados.

Las adaptaciones deliberadas respecto del ZIP son la letra de código de al menos 16 px para móvil, pestañas con altura táctil de 44 px, sugerencias junto al cursor y herramientas secundarias en un menú. Se conservan DM Sans y JetBrains Mono locales y los temas generales de ESTUDIO. El bloque de código permanece oscuro en ambos temas.

## Funcionamiento conservado y ampliado

CodeMirror mantiene resaltado, deshacer/rehacer, selección, desplazamiento, búsqueda, plegado, símbolos y pantalla completa. Las fuentes de sugerencias conservan funciones PHP compatibles con el intérprete, variables, superglobales, funciones propias y de otros archivos, PHPDoc, rutas y asistencia HTML/CSS/JSON. Las firmas aparecen en una ayuda compacta junto al cursor.

Los ejercicios rápidos también pueden mostrar HTML real en el iframe aislado y navegar mediante formularios GET/POST y enlaces. Conservan entrada de consola, errores y salida real. Las escrituras de archivos se sincronizan sin reiniciar innecesariamente cookies y sesiones. La corrección utiliza otro intérprete para preservar la aplicación que se está probando.

Los proyectos siguen utilizando todos sus archivos compartidos, `include`/`require`, formularios, subidas, cookies, sesiones, redirecciones y recursos CSS. Ejecutar utiliza la entrada del proyecto; Corregir evalúa el proyecto completo. El guardado conserva la base IndexedDB, la copia local, archivos, historiales y protección frente a conflictos existentes.

En preguntas de escribir código del examen estricto se permite ejecutar; la corrección inmediata permanece deshabilitada y se explica que está diferida hasta terminar. Las preguntas de interpretación conservan su restricción en ese modo.

Los ejercicios sin casos automáticos indican que requieren revisión manual. La comparación de una salida no se presenta como demostración de corrección general. No se añaden ni alteran requisitos académicos para producir aprobados artificiales.

## Alcance

Se mantienen las 545 preguntas DWCS, las 181 de Despregamento, los 18 proyectos, enunciados, soluciones, rúbricas, imágenes y PDF. No se modifican estadísticas, favoritos, reportes, selección ni servicios de progreso. Las dos vistas de estudio autorizadas tienen sus hashes de integración actualizados; el resto de archivos protegidos mantiene sus hashes originales.

Se conserva `render.yaml`, la configuración de caché, el motor y el aislamiento de la vista previa. Esta entrega no publica en Render ni cambia un servicio externo. Existe una copia local previa en `.local-baseline-maqueta-20261126-092050`, excluida de Git.

## Verificación

Las pruebas se centran en el editor y los flujos modificados. El motor y el contenido académico mantienen sus verificaciones específicas.

```powershell
npm run check
npm run build
npm run test:editor
npm run test:editor -- --webkit
npm run test:simple-php
npm run test:simple-php -- --webkit
npm run test:quick -- --focal
npm run test:quick -- --focal --webkit
npm run test:visual
npm run test:visual -- --webkit
```

`test:visual`, `test:laboratory` y `test:workspace` son accesos a la misma prueba focal de la maqueta. Sirve la compilación de producción y utiliza sesiones de prueba aisladas; captura ejercicios y laboratorio en temas claro y oscuro.

El editor ha superado 40 comprobaciones por motor, incluidos colores calculados, sugerencias táctiles, firmas, lenguajes y conservación del historial. Las pruebas focales rápidas comprueban salida real, comparación, HTML/CSS, includes, GET/POST, cookies y sesiones, revisión manual, entrada estándar y comportamiento de examen. La prueba visual comprueba además pestañas, creación de archivos, recuperación tras recargar y un formulario de proyecto que devuelve 42 mediante un include.

La compilación final y el smoke visual pasan en Chromium y WebKit, sin errores de página ni desbordamiento a 390 y 430 px; también se capturó la vista de escritorio de 1280 px. El desplazamiento automático hacia resultados es inmediato: la animación anterior podía mover el formulario mientras se pulsaba en la emulación móvil de Chrome. La prueba final envía el formulario normalmente, sin esperas artificiales ni pulsaciones forzadas. Las sugerencias PHP se filtran por prefijo real y priorizan las funciones habituales, con descripciones españolas breves.

## Límites

No se ha validado en un iPhone físico. Siguen pendientes teclado y selección de Safari reales, suspensión, presión de memoria e instalación PWA. Las comprobaciones de Chrome y WebKit usan emulación móvil.

La previsualización conserva su sandbox, CSP y bloqueo de scripts del alumno y recursos externos. PHP tiene límites de tiempo y salida; su configuración de memoria no es un límite duro sobre la memoria total del navegador. El almacenamiento local puede agotarse o ser retirado por el sistema; conserva las exportaciones de respaldo.

El cambio visual no convierte el intérprete virtual en Apache/XAMPP completo ni permite corregir automáticamente cualquier requisito abierto. Los límites detallados del motor se mantienen en [PHP_RUNTIME.md](PHP_RUNTIME.md).
