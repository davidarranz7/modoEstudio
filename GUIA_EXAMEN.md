# ESTUDIO · Guía de preparación basada en el temario y las grabaciones

Esta guía distingue lo que la profesora **indicó expresamente** de las preguntas que hemos **preparado como entrenamiento**. Ningún enunciado se presenta como pregunta confirmada del examen salvo que el audio lo indique de forma explícita. La aplicación permite filtrar preguntas **relacionadas con lo destacado en los audios**; ese filtro no significa que se hayan pronunciado literalmente.

## Grabación 2 — Qué priorizar en los Temas 1 y 2

**Tema 1:** la profesora remite a las transparencias, la documentación de clase y las presentaciones sobre tecnologías del lado cliente y servidor. No exige buscar información adicional para ese bloque.

**Tema 2:** dice expresamente que la unidad será **práctica**, aunque la prueba podría hacerse en ordenador o papel. Concreta que hay que poder:

1. Obtener datos de un formulario HTML por **GET o POST**.
2. Resolver un algoritmo sencillo con esos datos.
3. Crear funciones de usuario **con los tipos de los parámetros y del retorno**.
4. Crear y recorrer arrays de **una o dos dimensiones**.
5. Utilizar **include y require**.
6. Documentar funciones con **PHPDoc**.
7. Manejar los **operadores de PHP** y sus estructuras de control (`if`, `for`, `foreach`, etc.).
8. **Interpretar código:** predecir el resultado de ejecutar un fragmento.

La profesora pone como ejemplos concretos **par/impar**, **sumar los valores de un array** y **sumar solo los que sean mayores que 10**. Señala que una prueba en papel sería sencilla y que no exigiría memorizar funciones muy específicas sin ayuda; sí hay que dominar las bases de forma autónoma. Los parámetros opcionales aparecen en el temario, pero dice que no prevé profundizar en ellos en esta prueba.

## Grabación 3 — Qué priorizar en el Tema 3

En teoría, la profesora señala:

1. Qué significa que **HTTP sea un protocolo sin estado**.
2. Qué mecanismos permiten **suplir esa falta de estado**.
3. Qué **ventajas e inconvenientes** tiene cada uno.
4. Conocer las **categorías de autenticación** que se estudien.

Indica que la teoría representa el **25 % de la Unidad 3**. La profesora menciona «cuatro categorías», **pero el audio no enumera cuáles**. El temario escrito lista cinco mecanismos habituales (contraseña, certificados, tokens/llaves, biometría y autenticación federada); no se ha supuesto que esa lista corresponda literalmente a las cuatro categorías del audio.

La profesora también menciona una práctica de autenticación y, **si da tiempo**, redirecciones, autorización y roles. Por tanto, esos últimos puntos se mantienen en el banco por estar en el temario, pero no se presentan como preguntas confirmadas del examen.

## Alcance de las grabaciones

- Grabación 2: recuperado el contenido pertinente a DWCS.
- Grabación 3: recuperado el contenido pertinente a DWCS.
- Grabación 4: excluida porque corresponde a Despliegue, no a PHP.
- Grabación 7 (larga): no hay una transcripción fiable; no se le han atribuido preguntas concretas.

## Relación entre las preguntas y los materiales

**Tema 1:** fundamentos de Internet y Web, cliente/servidor, tecnologías, modelos estático/dinámico, servidores web y aplicaciones, XAMPP/Xdebug/Emmet.

**Tema 2:** sintaxis, variables, tipos, operadores, cadenas, estructuras de control, arrays, matrices, formularios, `$_GET`, `$_POST`, HTML seguro, `$_FILES`, `php.ini`, funciones, PHPDoc, ámbito e inclusiones. Incluye ejercicios de CLI, dado, IBEX, horas extra, tablas, reserva de brunch, varias subidas y la **Tarea02.1 de talleres**, con validaciones y cálculos.

**Tema 3:** HTTP sin estado, cookies, sesiones, autenticación, contraseña con hash, aplicación JSON de login/logout, páginas privadas y RBAC. Incluye interpretación de código y pruebas de comportamiento.

El PDF con la definición exacta de los algoritmos **5.3, 5.8, 5.9 y 5.10** no estaba disponible. No se han inventado sus algoritmos. Sí se incluyen las actividades cuyos enunciados completos estaban disponibles.

## Cómo utilizar las modalidades

- **Test:** marcar una o varias opciones y recibir corrección inmediata.
- **Escribir código PHP:** programar la solución y compararla con la respuesta modelo, siguiendo criterios de corrección.
- **Interpretar código PHP:** calcular manualmente salidas y razonar su causa; algunos test también incluyen código para interpretar.
- **Respuestas breves:** contestar de forma concisa con los conceptos clave.
- **Desarrollo:** justificar y relacionar conceptos, arquitectura y seguridad.
- **Mixto:** combinar todas las modalidades.

Las respuestas abiertas se autoevalúan; el código escrito no se ejecuta en la aplicación. Si quieres comprobarlo, puedes probar las soluciones en tu entorno XAMPP/PHP.

## Fuentes adicionales verificadas

La **Actividad 4 de la Unidad 2** remite al aviso de CERT-EU `2026-018`, «Critical Vulnerabilities in PHP», publicado en octubre de 2026:

https://cert.europa.eu/publications/security-advisories/2026-018/

Las preguntas sobre esa actividad presentan los cambios de directivas como **mitigaciones temporales y condicionadas**, nunca como sustitutos de actualizar PHP.
