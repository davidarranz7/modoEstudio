# UD2 — Directivas PHP

Archivo de configuración habitual en XAMPP para Windows: `C:\xampp\php\php.ini`. Comprueba la configuración cargada en `phpinfo()`.

- `display_errors`: mostrar errores de la aplicación durante el desarrollo, no en producción.
- `error_reporting`: controlar qué categorías de errores se comunican.
- `file_uploads`: permitir subida de ficheros.
- `upload_max_filesize`: tamaño máximo por fichero.
- `post_max_size`: límite global de datos de POST; debe ser superior al tamaño máximo de un fichero cuando se suben archivos.
- `max_file_uploads`: número máximo de ficheros que pueden subirse en una petición.
- `session.save_path`: ruta de ficheros de sesión con el manejador `files`.

`ini_get('upload_max_filesize')` consulta el valor actual. Algunas directivas pueden cambiarse temporalmente con `ini_set()`, otras requieren modificar php.ini y reiniciar el servidor.

En producción, no se deben mostrar detalles de errores a los usuarios. Las restricciones de configuración no sustituyen las validaciones del script.
