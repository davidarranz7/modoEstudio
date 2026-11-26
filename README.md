# ESTUDIO 17 · DWCS

Se conservan las 545 preguntas DWCS (UD1: 114, UD2: 269, UD3: 162) y las 181 de Despregamento. Sus contenidos originales, imágenes y PDF tienen comprobaciones SHA256. Las prácticas nuevas se guardan en un catálogo separado.

## Desarrollo

```bash
npm ci
npm start
```

Abre http://localhost:4200. Se mantiene Angular 21 y la versión 17.0 de ESTUDIO. El intérprete PHP ya está incorporado en `public/php-runtime`: no requiere instalar PHP, Docker ni ejecutar un segundo servidor. Node solo se utiliza para desarrollar y compilar; la aplicación publicada funciona como sitio estático.

## Estudio y programación

- **Crear simulacro → Preparación**: estudio general o prioridad del examen DWCS. El reparto inicial 70/30 es configurable, orientativo y conserva el resto del temario. Los filtros de unidad, apartado, modalidad, errores y pendientes siguen aplicándose.
- **Exámenes**: indicaciones facilitadas por la profesora; simulacros escritos y accesos separados a prácticas UD2/UD3.
- **Laboratorio PHP**: acceso desde Inicio y las unidades 2/3. Dieciocho proyectos con enunciado, archivos iniciales, funciones por completar, ejecución, formularios, inspector HTTP, pruebas, rúbrica y solución por archivos.
- **Ejercicios rápidos**: se conservan en cada unidad. «Ejecutar código» muestra PHP real; «Comprobar solución» ejecuta los casos disponibles. La entrada estándar se introduce antes de ejecutar.
- **Banco de preguntas**: prioridad, apartado, modalidad, búsqueda, observaciones y exportación completa. Las imágenes se amplían en un diálogo con zoom y teclado.

El laboratorio guarda archivos y observaciones automáticamente en IndexedDB y un diario local. «Descargar mi código ZIP» exporta archivos normales para VS Code/XAMPP. La solución puede consultarse sin sobrescribir tu trabajo. En simulacro práctico se oculta hasta entregar.

## iPhone y funcionamiento sin conexión

Publica por HTTPS, abre ESTUDIO en Safari y usa **Compartir → Añadir a pantalla de inicio**. Con conexión, ejecuta una práctica para descargar PHP una vez (unos 18 MB) y abre los PDF necesarios. Espera a que el Service Worker esté activo antes de comprobar el modo avión. Las fuentes, imágenes y aplicación se conservan en la caché de producción; PDF y PHP se descargan al usarlos.

Exporta el progreso desde Perfil y los proyectos desde Laboratorio → Copias de todos tus proyectos. Son copias separadas. Cambiar de dominio o navegador no traslada los datos automáticamente. Safari puede retirar almacenamiento por falta de espacio. El servidor de desarrollo no ofrece la caché PWA de producción.

Chromium y WebKit han superado pruebas offline, pero la instalación, teclado y suspensión en un **iPhone físico** siguen pendientes de validación. Consulta [el informe](INFORME_DWCS_FINAL.md) para distinguir pruebas realizadas y límites.

## Comprobaciones

```bash
npm run check
npm run build
npx playwright install chromium webkit
npm run test:runtime -- --webkit
npm run test:projects -- --webkit
npm run test:quick -- --webkit
npm run test:laboratory -- --webkit
npm run test:project-storage -- --webkit
npm run test:mobile -- --webkit
npm run test:images -- --webkit
```

Las herramientas buscan Chrome instalado en Windows o el Chromium de Playwright; el parámetro `--webkit` utiliza WebKit. Las pruebas de interfaz y PWA sirven automáticamente la compilación de producción en un puerto local temporal. Las pruebas estructurales de `npm run check` no necesitan navegador ni PHP instalado. Los scripts `php:runner`, `start:php` y `check:php` conservan el ejecutor local anterior como herramienta opcional de desarrollo.

## Despliegue estático

```bash
npm ci
npm run check
npm run build
```

Publica **el contenido de `dist/modo-estudio/browser`** en la raíz del sitio HTTPS. Configura la reescritura de rutas de la aplicación a `index.html`, conservando el acceso directo a archivos existentes. Sirve `.wasm` con `application/wasm`, `.js` con un MIME JavaScript y `.woff2` como fuente. No hace falta un backend PHP. No cambies el dominio si quieres mantener el almacenamiento existente sin importar copias. Cierra y abre ESTUDIO tras publicar para cargar una versión nueva del Service Worker.

No se ha publicado esta actualización ni modificado un servicio externo. [PHP_RUNTIME.md](PHP_RUNTIME.md) documenta el motor, sus licencias, límites y regeneración. Falta el PDF original de algoritmos de la Actividad 2.2; no se han inventado sus ejercicios ni sus referencias.
