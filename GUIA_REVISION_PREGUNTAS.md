# Cómo revisar preguntas de ESTUDIO desde el móvil

## Marcar y comunicar errores

1. Abre una pregunta en ESTUDIO, ya sea en un examen o en el banco.
2. Pulsa **«⚑ ¿Hay un error en esta pregunta?»**.
3. Elige el motivo (enunciado, solución, código/salida, imagen, falta de contexto u otro) y escribe qué falla.
4. Pulsa **«Guardar aviso»**. Se guarda en el almacenamiento de **ese mismo navegador**.
5. Para consultar los avisos: **Banco de preguntas → Reportadas**.
6. Para enviarlos: **Ajustes → Copiar preguntas marcadas** y pégalos en el chat, o usa **Exportar preguntas para revisar** y adjunta el archivo `.json`.

También se incluyen las preguntas que hayas marcado con ★ como favoritas. Las favoritas no significan que el contenido esté equivocado, solo que quieres revisarlo.

## ¿Quedan registradas las acciones «Bien» y «Favorita»?

Sí, ambas se guardan mediante `localStorage`, por pregunta. **No modifican el código del repositorio** y **no se sincronizan automáticamente con ChatGPT**. El botón «Bien» califica tu respuesta; la estrella guarda una pregunta favorita; el aviso ⚑ identifica un defecto de contenido. Son tres acciones distintas.

## ¿Render o localhost?

Para estudiar y señalar errores no necesitas localhost: la web de Render funciona igual para estos fines. Lo importante es utilizar el mismo navegador para consultar tus marcas y exportarlas. `http://localhost:4200` y `https://...onrender.com` son **orígenes diferentes** y no comparten datos locales. También conviene exportar las marcas desde el icono de inicio del iPhone si has estado estudiando desde esa instalación.

**Para revisar las respuestas realmente erróneas debo recibir tu listado o JSON de revisión.** No puedo ver los avisos de tu navegador por mi cuenta.

## Qué se conserva

La clave del progreso permanece `estudio-php-v1` para que las respuestas y favoritos previos sean compatibles. Los nuevos avisos se añaden a la misma copia de seguridad de progreso; se pueden exportar e importar desde Ajustes. No se ha alterado el diseño principal de ESTUDIO.

## Comprobaciones de esta versión

- Verificación de estructura del banco: **379 preguntas**.
- Verificación de TypeScript y plantillas Angular con `ngc`: correcta.
- Compilación completa para producción: no ejecutable en este entorno porque el `node_modules` disponible contiene binarios nativos de Windows. Se debe instalar con `npm ci` en el entorno de despliegue.
