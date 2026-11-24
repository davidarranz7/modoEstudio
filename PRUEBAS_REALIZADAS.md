# Comprobaciones realizadas en ESTUDIO 9.0

- `npm run check:bank`: estructura de **408** preguntas, referencias de imágenes y modalidades. Correcto.
- `npm run check:types`: TypeScript sin errores. Correcto.
- `npm run check:templates`: Angular compilador de plantillas sin errores; advertencias no bloqueantes de cadena opcional en el componente de reporte. Correcto.
- `npm run check:coverage`: matriz de coincidencias y señales de revisión humana generada. Correcto.
- `php -l` en cada archivo PHP de material de consulta. Correcto.
- Hash bcrypt ficticio de ejemplo verificado mediante `password_verify`. Correcto.
- Salidas exactas de tres nuevos ejercicios de interpretación comprobadas con `php -r`. Correcto.
- El diseño visual original en la hoja `src/styles/figma-original.css` no se ha reemplazado; se añadieron estilos funcionales sin cambiar la paleta.

## Limitaciones de la verificación

- `npm run build` se intentó ejecutar en Linux, pero la copia de `node_modules` disponible incluye esbuild para Windows. Por tanto **no se ha verificado el build final de producción**; requiere `npm ci` en un entorno compatible.
- Sin navegador real, no se han ejecutado pruebas E2E de interacciones, IndexedDB, navegación PWA o persistencia iOS. El almacenamiento en uso es `localStorage` por origen.
- No se ha realizado ejecución integrada de PHP: el editor del simulador no incluye intérprete.
- El sistema de importación/exportación tiene validación de datos y vista previa implementadas, pero falta una batería de pruebas automáticas en navegador para restauraciones complejas.
- La matriz temática usa palabras clave: **no demuestra cobertura exhaustiva ni garantiza ausencia de errores conceptuales**.
- Algunas preguntas antiguas carecen de apartado concreto y requieren clasificación manual.
