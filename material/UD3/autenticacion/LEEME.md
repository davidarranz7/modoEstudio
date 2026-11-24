# Ejemplo didáctico de login PHP con usuarios en JSON

Ejecutar con PHP y Apache local, utilizando una carpeta de desarrollo. Usuario de prueba: `ana`. Contraseña de prueba: `abc123.` (el punto final forma parte de la contraseña). El archivo usuarios.json contiene un hash bcrypt generado automáticamente.

Este ejemplo es de estudio, no de producción: JSON sin transacciones, no hay limitación de intentos ni registro real de usuarios. Para una app real utiliza almacenamiento seguro fuera del directorio público, protección contra fuerza bruta, HTTPS, CSRF, y gestión de usuarios en una base de datos. La regla `.htaccess` incluida protege el JSON en Apache si AllowOverride está habilitado; **no garantiza la protección en otros servidores**.
