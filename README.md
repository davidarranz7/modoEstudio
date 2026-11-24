# ESTUDIO 12 — Flujo simplificado para móvil

La aplicación mantiene las dos asignaturas y sus bancos de preguntas, pero diferencia dos entradas:

- **Práctica rápida:** Inicio → Asignaturas → Tema → Tipo de práctica → preguntas, sin configuración intermedia.
- **Crear simulacro:** Inicio → Asignatura → Temas → Modalidad → Cantidad → Empezar. Las opciones específicas se encuentran en «Más opciones».

Al entrar en el simulacro se recuerdan las últimas preferencias en `localStorage` (clave `estudio-simulacro-preferencias-v1`). El progreso y los exámenes anteriores conservan sus claves de almacenamiento.

**Banco de preguntas:** Asignaturas → temas → ver preguntas completas → marcar errores → copiar o exportar. El resto de la app mantiene sus funciones anteriores.

## Ejecutar

```powershell
npm ci
npm run check
npm start
```

## Publicar

```powershell
npm run build
```

En Render: Static Site, comando `npm ci && npm run build`, directorio `dist/modo-estudio/browser` y regla Rewrite `/*` → `/index.html`.

---

# ESTUDIO 11.0 — Dos asignaturas y banco sencillo

Proyecto Angular 21 para estudiar en móvil. Conserva el diseño azul original, el banco sencillo y los simulacros, y añade una segunda asignatura independiente: **Despregamento de Apps. Web**.

## Cómo queda el contenido

- Desenvolvemento Web Contorno Servidor: **408 preguntas** en 3 unidades, conservadas sin cambios.
- Despregamento de Apps. Web: **181 preguntas nuevas** en 2 unidades, con las cinco imágenes aportadas.
- Banco total: **589 preguntas**.
- Acceso: **Banco de preguntas → Asignatura → Tema → Ver todas las preguntas → Marcar para revisar → Copiar/Exportar**.
- Exámenes: los simulacros personalizados permiten escoger ambas asignaturas. También se han añadido simulacros específicos de Despregamento.
- Los ejercicios prácticos de Despregamento incluyen contexto, configuración y comportamiento esperado. El editor no ejecuta comandos Apache; permite escribir la respuesta y compararla con el modelo.

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

Extrae la carpeta `ModoEstudio` en la ubicación que utilices en Windows y ejecuta desde dentro de esa carpeta:

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

Las 408 preguntas originales de PHP siguen intactas: UD1 (51), UD2 (254), UD3 (103). Se añaden 53 de Despregamento UD1 y 128 de Despregamento UD2. Se mantienen los simulacros, ejercicios, imágenes, historial y materiales de consulta anteriores.

## Comprobaciones

- `npm run check:bank`: estructura del banco y referencias de imágenes.
- `npm run check:types`: TypeScript sin errores.
- `npm run check:templates`: compilador Angular sin errores en la nueva pantalla.
- Build completo: **no verificado en este entorno Linux** porque las dependencias montadas incluyen el ejecutable de esbuild para Windows. `npm ci` instalará el correspondiente a tu equipo o a Render.

No hay backend ni sincronización entre dispositivos y la aplicación no ejecuta realmente código PHP.

## Procedencia de Despregamento

Todas las preguntas de esta asignatura se han creado a partir del temario UD1/UD2 y las cinco imágenes que has aportado, sin atribuirlas a audios ni afirmar que son preguntas confirmadas por la profesora. Consulta `GUIA_DESPREGAMENTO.md` para el desglose.
