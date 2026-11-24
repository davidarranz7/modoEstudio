# UD1 — Fundamentos de las aplicaciones web

## Web estática

El navegador pide un recurso; el servidor web devuelve el archivo existente y el navegador interpreta su contenido. El servidor no necesita generar un documento diferente para cada petición.

## Web dinámica

Una aplicación procesa la petición en el servidor y genera una respuesta que puede variar según datos o contexto. Puede consultar una base de datos, pero **no es obligatorio** para que la respuesta sea dinámica.

## Cliente y servidor

El navegador ejecuta HTML/CSS/JavaScript en el entorno cliente. PHP se ejecuta en el entorno servidor y su código no se envía para su ejecución al navegador. El servidor web atiende HTTP y puede delegar en una aplicación que maneja la lógica de negocio.

## Ejemplos de servidores

Servidores web: Apache HTTP Server, Nginx, IIS. Servidores o contenedores de aplicaciones Java: Tomcat (servlets/JSP), WildFly/JBoss, GlassFish. En la práctica las fronteras funcionales pueden solaparse.

## HTTP

El cliente realiza una petición con método, ruta, versión y cabeceras. El servidor responde con código de estado, cabeceras y, en muchos casos, cuerpo. GET normalmente recupera recursos; POST envía datos al servidor. Ninguno cifra datos por sí solo: para proteger la transmisión se requiere HTTPS.

## Para repasar

- Diferencia estática/dinámica y flujo cliente-servidor.
- Qué parte ejecuta HTML/CSS/JS y qué parte ejecuta PHP.
- Servidor web frente a servidor de aplicaciones.
- Función de HTML, URL, HTTP, TCP/IP, DNS.
- Diferencias entre GET y POST.
