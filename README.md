# ESTUDIO 10.0 — Banco de preguntas sencillo

Proyecto Angular 21 para estudiar en móvil. Conserva el diseño original azul y las funcionalidades de simulacros de ESTUDIO 9.0; **solo se ha simplificado el banco de preguntas**.

## Qué ha cambiado

- **Banco de preguntas → Asignaturas → Temas → Preguntas**. Sin paneles de importación ni filtros avanzados.
- En cada tema aparecen las preguntas del banco, por lotes de 20 para facilitar la lectura en móvil. El botón «Ver más preguntas» continúa la lista; no oculta ninguna pregunta.
- Las preguntas tipo test muestran sus opciones A/B/C/D inmediatamente. La respuesta correcta se revela únicamente con «Ver respuesta y explicación».
- Las preguntas de programación muestran su contexto, código inicial y entradas de ejemplo; las de interpretación no revelan la salida real antes de abrir la solución.
- Las preguntas de desarrollo y respuestas breves muestran la respuesta modelo al desplegar.
- **⚐ Marcar para revisar** guarda la marca directamente. El comentario es opcional y se guarda al salir del campo.
- Una barra accesible con marcas permite **Copiar** o **Exportar JSON**. Incluye las preguntas marcadas de todas las asignaturas con enunciado, opciones, solución, código, salida y observaciones.
- Los datos siguen usando el almacenamiento local y los mismos IDs de ESTUDIO 9.0; el historial, progreso y favoritos se conservan en el mismo navegador y dominio.

## Instalación en Windows

Extrae `ModoEstudio` en `C:\Users\arran\Documents` y ejecuta dentro de la carpeta:

```powershell
npm ci
npm run check
npm start
```

Abrir `http://localhost:4200`.

## Publicación en Render

Publica los cambios en el repositorio de GitHub conectado a Render. Para Static Site:

- Build command: `npm ci && npm run build`
- Publish directory: `dist/modo-estudio/browser`
- Rewrite `/*` hacia `/index.html` (no Redirect)

El archivo `render.yaml` ya contiene estos datos. **Localhost y Render no comparten sus marcas**, porque los datos se guardan en cada navegador bajo su propio origen. Si ya habías marcado preguntas en Render, actualiza el mismo servicio y dominio para mantener ese almacenamiento.

## Contenido conservado

408 preguntas: UD1 (51), UD2 (254), UD3 (103). El contenido académico no se ha alterado en esta versión. Se mantienen los simulacros, ejercicios, imágenes, historial y materiales de consulta existentes.

## Comprobaciones

- `npm run check:bank`: estructura del banco y referencias de imágenes.
- `npm run check:types`: TypeScript sin errores.
- `npm run check:templates`: compilador Angular sin errores en la nueva pantalla.
- Build completo: **no verificado en este entorno Linux** porque las dependencias montadas incluyen el ejecutable de esbuild para Windows. `npm ci` instalará el correspondiente a tu equipo o a Render.

No hay backend ni sincronización entre dispositivos y la aplicación no ejecuta realmente código PHP.
