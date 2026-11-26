# Verificación de ESTUDIO 17 · 25/11/2026

El detalle de cambios, límites y uso está en [INFORME_DWCS_FINAL.md](INFORME_DWCS_FINAL.md).

| Comprobación | Resultado |
|---|---|
| `npm run check` | Superado: banco, recursos, TypeScript, Angular, cobertura, selección, persistencia y catálogo de prácticas |
| Conservación | 545 DWCS + 181 Despregamento y 78 recursos binarios intactos por SHA256 frente al estado recibido |
| Producción | `npm run build` superado sin avisos; inicial 743,12 kB y laboratorio diferido |
| Selección | 1.500 sesiones 70/30 sin repetición, cobertura, escasez de categorías y repaso adaptativo |
| PHP 8.2.35 real | 23 comprobaciones del motor en Chromium/WebKit; aislamiento, errores, STDIN, archivos, JSON, HTTP, cookies, sesiones, autenticación, uploads y cancelación |
| Preguntas PHP | 25 interpretaciones y 17 funciones/39 casos; sin necesidad de modificar preguntas |
| Interfaz de ejercicios rápidos | 17 soluciones/39 casos por motor; rechaza errores y ejecuta la conversión por STDIN |
| Proyectos | 18 soluciones, 69 escenarios y 99 peticiones por motor; 18 inicios incompletos y tres errores realistas rechazados |
| Laboratorio completo | Cursor y selección, deshacer/rehacer, guardado, POST, inspector, pruebas, ZIP, simulacro, cookies, upload y TXT generado comprobados en Chromium/WebKit |
| IndexedDB real | 34 comprobaciones por motor; diario obsoleto/cuota, fallos, recarga, importación y rutas |
| ZIP | CRC, UTF-8, archivos y carpetas vacías verificados con Python zipfile |
| Móvil emulado | Chromium y WebKit con configuración iPhone 13; navegación, filtros, referencias y fuentes locales sin desbordamiento |
| Visor de imágenes | Diálogo modal nativo, zoom 100–400 %, teclado, fondo inerte y devolución de foco en ambos motores; laboratorio oscuro conserva paleta/ancho |
| Offline de producción | Recarga, banco, imágenes, fuentes, PDF y Worker PHP nuevo sin servidor tras preparar caché en ambos motores |

Las pruebas se reproducen con los scripts `test:*` del package.json y `-- --webkit` para el segundo motor. Instalar previamente navegadores mediante `npx playwright install chromium webkit`. La prueba offline WebKit apaga el servidor origen para evitar una incidencia de emulación de desconexión de Playwright con Service Worker.

Pendientes: iPhone físico (instalación, teclado, suspensión, memoria y reinicio offline), revisión pedagógica humana completa y PDF original de algoritmos de la Actividad 2.2. Los PDF existentes se conservan íntegros; no se atribuye una nueva revisión visual completa de sus páginas a este trabajo. No se ha probado Docker ni se requiere para estudiar con el nuevo intérprete.
