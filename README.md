# ESTUDIO — Banco DWCS contextualizado y corregido (v6.1)

Aplicación Angular 21 mobile-first para preparar exámenes de **Desenvolvemento Web Contorno Servidor**. Usa la identidad visual que el usuario aprobó de Tarjeteros (mismos CSS, colores, composición, modo oscuro y navegación) y conserva su estructura preparada para **añadir otras asignaturas**.

## Banco de preguntas

La revisión conserva **379 preguntas** basadas en el temario, las actividades y los contenidos de PHP destacados por la profesora en las grabaciones con transcripción verificable.

| Tema | Preguntas | Materia |
| --- | ---: | --- |
| 1 | 45 | Fundamentos de las aplicaciones web |
| 2 | 241 | PHP, formularios, algoritmos, arrays, funciones, ficheros y prácticas |
| 3 | 93 | HTTP sin estado, cookies, sesiones, autenticación y autorización |

| Modalidad | Número |
| --- | ---: |
| Test de una respuesta | 102 |
| Test de varias respuestas | 50 |
| Respuestas breves | 61 |
| Desarrollo | 29 |
| Escribir código PHP | 66 |
| Interpretar código PHP | 71 |

**152 preguntas tipo test** (muchas con fragmentos PHP); **137 ejercicios de programación** repartidos entre escribir e interpretar. Además, **145** preguntas están vinculadas a actividades o ejercicios concretos, **24** incluyen imágenes de los materiales y **71** se relacionan con los temas mencionados en los audios.

Las preguntas tienen dos niveles (media y alta), soluciones y —en las abiertas— puntos concretos para corregir la respuesta. Las modalidades de código se pueden practicar por separado o juntas.

Para ver qué indicó realmente la profesora, consulta **[GUIA_EXAMEN.md](GUIA_EXAMEN.md)**. Las 71 preguntas señaladas como relacionadas con el audio **no son necesariamente preguntas literales de examen**, sino contenidos priorizados usando las indicaciones de las grabaciones 2 y 3. Se excluyó la grabación de Despliegue; la grabación larga 7 sigue sin transcripción fiable.

## Correcciones de calidad incluidas

- Los **66 ejercicios de escribir PHP** incluyen contexto, datos de ejemplo y salida esperada.
- Los **71 ejercicios de interpretar PHP** incluyen código y resultado o efecto de ejecución; se diferencia claramente un resultado calculado de una salida impresa con `echo`.
- Las **29 preguntas de desarrollo** disponen de contexto independiente del enunciado original.
- Los **152 test** muestran explícitamente las opciones correctas después de responder.
- Se han eliminado las asociaciones de dos capturas que no correspondían con su pregunta.
- Se ha corregido el ejercicio IBEX para incluir las cinco empresas que aparecen en la actividad 2.3.
- Se conserva la identidad visual móvil original y los IDs de las preguntas, para mantener la compatibilidad con el progreso guardado.

Consulta `CALIDAD_PREGUNTAS.md` para revisar los criterios de elaboración.

## Cómo estudiar desde el móvil

- **Inicio:** crear un simulacro a medida; continuar únicamente cuando exista uno sin terminar.
- **Asignaturas → Temas:** elegir test, breve, desarrollo, escribir PHP, interpretar PHP o código mixto; comienza directamente la práctica.
- **Crear simulacro:** escoger asignatura, temas, dificultad, modalidad, procedencia del contenido, repaso, imágenes y número de preguntas.
- **Examen:** responder, marcar favoritas, comprobar test automáticamente y autoevaluar respuestas de texto o código contra una solución y criterios.
- **Guardar / descartar:** guardar para continuar o descartar ese intento sin borrar resultados anteriores.
- **Exámenes / Progreso:** consultar historial de intentos terminados, resultados, respuestas, errores y repetición de preguntas falladas.

**Limitación deliberada:** no se ejecuta el código PHP dentro del navegador; se redacta y se contrasta con una solución. Los resultados se guardan en el `localStorage` del navegador, con exportación/importación manual, pero sin cuenta de usuario ni sincronización entre dispositivos.

## Instalación en Windows

Extrae el ZIP dentro de `C:\Users\arran\Documents`. Debe quedar la carpeta `C:\Users\arran\Documents\ModoEstudio`.

```powershell
cd C:\Users\arran\Documents\ModoEstudio
npm ci
npm start
```

Abre `http://localhost:4200`. Requiere Node.js 20.19 o superior.

Para validar antes de desplegar:

```powershell
npm run check:bank
npm run build
```

No se incluyen `node_modules` ni `dist` en el ZIP. `npm ci` descargará las dependencias para Windows.

## Render

Proyecto independiente de Tarjeteros. Se proporciona `render.yaml` para desplegar como Static Site:

- Build: `npm ci --no-audit --no-fund && npm run build`
- Publish: `dist/modo-estudio/browser`
- Rewrite: `/*` → `/index.html`

Los estilos de Tarjeteros siguen referenciados desde la revisión original fijada en `src/styles/figma-original.css`; el navegador necesita conexión para cargarlos del CDN y para obtener las fuentes.

## Ampliar el proyecto con más asignaturas

1. Registrar la asignatura y sus temas en `src/app/core/subjects.ts`.
2. Crear su banco tipado `src/app/data/nombre.questions.ts` y asignar `subjectId` y `unit` correctamente.
3. Importar el banco en `src/app/core/questions.ts`.
4. Si tiene imágenes, copiarlas a `public/temario` y asignar `image`.
5. Ejecutar `npm run check:bank`.

Todos los ejercicios de código llevan `codeTask: 'interpret'` o `codeTask: 'write'`. Los tipos disponibles son `single`, `multi`, `short`, `develop` y `code`.

## Verificaciones

- Se verificaron las 379 preguntas con el validador del proyecto: IDs únicos, modalidad, soluciones, opciones correctas e imágenes existentes.
- Se comprobó la salida real mediante PHP CLI en los ejemplos nuevos de interpretación con ejecución determinista y los tests de código, además de la sintaxis de los ejemplos de escritura que se pueden analizar aisladamente.
- TypeScript y plantillas Angular pasaron las comprobaciones con el compilador Angular.
- El `ng build` completo y la ejecución visual en tu Windows deben verificarse tras `npm ci` antes de subir a Render: los binarios disponibles aquí no son compatibles con este contenedor Linux.
- Para no perder el progreso de versiones anteriores, se conservaron los IDs de las 209 preguntas existentes y se añadieron IDs nuevos para las preguntas revisadas y ampliadas.

## Cobertura pendiente

Los algoritmos 5.3, 5.8, 5.9 y 5.10 de la actividad 2.2 remiten a un PDF que no se adjuntó con su definición concreta. No se han inventado sus instrucciones ni respuestas. La captura y la tabla de calificaciones sí están incorporadas.
