# Evolución integral de la plataforma de estudio

Quiero que analices detenidamente el proyecto actual y desarrolles una versión mucho más completa, precisa y funcional de la plataforma de estudio.

No quiero que simplemente añadas preguntas o funcionalidades sin criterio. Quiero que revises lo que ya existe, conserves lo que funciona correctamente, corrijas las deficiencias y construyas un sistema de estudio que realmente sirva para preparar exámenes teóricos y prácticos.

## 1. Análisis del material de estudio

Voy a proporcionarte diferentes fuentes de información:

- Temarios completos de las asignaturas.
- Documentación y archivos PDF.
- Ejercicios realizados en clase.
- Prácticas resueltas.
- Ejemplos de código.
- Anotaciones personales tomadas durante las clases.
- Indicaciones oficiales de la profesora sobre los exámenes.
- Preguntas existentes en la aplicación.

Debes analizar todas estas fuentes antes de generar las preguntas.

Utiliza las indicaciones oficiales de la profesora como referencia principal para determinar qué contenidos entran en el examen, qué importancia tienen y qué tipos de ejercicios pueden aparecer.

Las anotaciones personales sirven para ampliar y concretar la información, pero pueden contener errores o información incompleta. Contrasta esas anotaciones con el temario y no reproduzcas posibles errores como si fueran afirmaciones correctas.

No inventes contenidos que no estén relacionados con la asignatura. Si añades alguna ampliación útil, identifícala como tal.

## 2. Organización por asignaturas y unidades didácticas

Quiero que la aplicación sea escalable y permita estudiar diferentes asignaturas, no únicamente PHP.

La estructura debe permitir organizar el contenido de la siguiente manera:

- Asignatura.
  - Unidad didáctica.
    - Apartado del temario.
      - Preguntas tipo test.
      - Preguntas cortas.
      - Preguntas de desarrollo.
      - Preguntas visuales.
      - Ejercicios de interpretación de código.
      - Ejercicios de programación.
      - Ejercicios prácticos.
      - Ejercicios de identificación y relación.
      - Simulacros de examen.

Por ejemplo:

**Desarrollo Web en Entorno Servidor**

- UD1. Introducción al desarrollo web en entorno servidor.
- UD2. Programación en PHP.
- UD3. Acceso a datos y gestión de sesiones.

En el futuro deben poder incorporarse nuevas asignaturas y unidades sin necesidad de modificar toda la arquitectura de la aplicación.

Cada pregunta debe estar asociada a su asignatura, unidad, apartado, tipo de ejercicio y nivel de dificultad.

## 3. Generación de preguntas de calidad

Debes revisar todas las preguntas existentes y generar nuevas preguntas que cubran la totalidad del temario.

No establezcas una cantidad arbitraria de preguntas por unidad. Genera las necesarias para cubrir todos los conceptos, procedimientos, ejercicios y casos relevantes, evitando repeticiones innecesarias.

Quiero preguntas que puedan aparecer realmente en un examen y que permitan comprobar si entiendo los contenidos.

### 3.1. Preguntas tipo test

Incluye:

- Preguntas con una única respuesta correcta.
- Preguntas con varias respuestas correctas.
- Verdadero o falso.
- Identificación de errores.
- Comparación entre conceptos.
- Interpretación de fragmentos de código.
- Preguntas con situaciones reales.

Las respuestas incorrectas deben ser razonables y representar errores habituales de los estudiantes.

Evita que la respuesta correcta sea siempre la más larga, que aparezca siempre en la misma posición o que pueda deducirse sin conocer el contenido.

Cada pregunta debe tener una explicación que justifique la respuesta correcta y, cuando sea útil, explique por qué las demás opciones son incorrectas.

### 3.2. Preguntas cortas

Incluye preguntas de definición, comparación, identificación, funcionamiento y razonamiento.

Las respuestas deben ser precisas, comprensibles y adecuadas para escribirlas en un examen.

Por ejemplo:

- ¿Qué significa que HTTP sea un protocolo sin estado?
- ¿Cuál es la diferencia entre una cookie y una sesión?
- ¿Qué diferencia existe entre include y require?
- ¿Qué finalidad tiene PHPDoc?
- ¿Qué diferencia existe entre el ámbito local y global de una variable?

No quiero respuestas innecesariamente extensas cuando la pregunta solo exige una explicación breve.

### 3.3. Preguntas largas o de desarrollo

Deben permitir practicar explicaciones completas y relacionar diferentes conceptos.

Por ejemplo:

- Explicar cómo funcionan las sesiones en PHP desde que el usuario inicia sesión hasta que cierra sesión.
- Comparar el desarrollo web del lado del cliente y del servidor, indicando tecnologías y responsabilidades.
- Explicar el ciclo de vida de una cookie y las cabeceras HTTP implicadas.

Cada pregunta debe incluir una respuesta modelo, los conceptos imprescindibles y unos criterios de corrección que permitan comprobar si mi respuesta está completa.

### 3.4. Preguntas visuales e imágenes

Utiliza imágenes, esquemas, diagramas, capturas o representaciones visuales cuando realmente aporten valor al ejercicio.

Por ejemplo:

- Identificar elementos de una arquitectura cliente-servidor.
- Interpretar un esquema de comunicación HTTP.
- Identificar dónde se ejecuta cada tecnología.
- Analizar las cabeceras de una petición HTTP.
- Identificar errores en un formulario HTML.
- Interpretar el flujo de una sesión.
- Completar diagramas de autenticación.
- Relacionar tecnologías con su función.

Las imágenes deben corresponder exactamente con la pregunta y ser legibles.

No utilices imágenes meramente decorativas ni incluyas diagramas que revelen directamente la respuesta.

### 3.5. Preguntas de relación, identificación y ordenación

Incorpora ejercicios que permitan:

- Relacionar conceptos con sus definiciones.
- Relacionar tecnologías con el lado del cliente o servidor.
- Clasificar servidores web y servidores de aplicaciones.
- Ordenar las fases de un proceso de autenticación.
- Identificar los parámetros de una función.
- Completar fragmentos de código.
- Identificar errores de sintaxis o lógica.

Siempre que sea posible, implementa estos ejercicios de manera interactiva.

## 4. Ejercicios relacionados con código

Esta sección es especialmente importante.

Quiero aprender a leer, interpretar, escribir, corregir y comprender código, no únicamente memorizar definiciones.

Incluye diferentes modalidades:

- Predecir la salida de un programa.
- Completar código incompleto.
- Identificar errores de sintaxis.
- Identificar errores de lógica.
- Explicar qué realiza un fragmento de código.
- Escribir código desde cero.
- Corregir una implementación incorrecta.
- Comparar diferentes implementaciones.
- Resolver ejercicios similares a los realizados en clase.

### Reglas obligatorias

Si una pregunta pide la salida de un programa, la solución debe mostrar la salida real, no simplemente repetir el código.

Si una pregunta pide escribir una función, la respuesta debe incluir una implementación funcional y explicar los aspectos relevantes.

Si una pregunta pide identificar un error, la solución debe indicar dónde está, por qué ocurre y cómo corregirlo.

Antes de dar por válida una pregunta de código, comprueba que el código, el enunciado y la solución sean coherentes entre sí.

Cuando sea técnicamente posible, ejecuta previamente los fragmentos de código para verificar sus resultados.

Distingue entre errores, advertencias, valores devueltos y contenido mostrado por pantalla.

No consideres incorrecta una solución únicamente porque sea diferente de la solución modelo si ambas cumplen correctamente los requisitos.

## 5. Ejercicios prácticos con contexto real

No quiero prácticas que consistan únicamente en instrucciones aisladas como:

- Crea una función.
- Crea una cookie.
- Utiliza una sesión.
- Crea un array.

Quiero ejercicios contextualizados que expliquen qué problema hay que resolver.

Por ejemplo:

**Contexto:** Una tienda en línea necesita recordar los productos que el usuario añade a su carrito mientras navega entre diferentes páginas.

**Requisitos:**

- Iniciar una sesión.
- Crear una estructura para almacenar los productos.
- Añadir un producto recibido mediante un formulario.
- Mostrar los productos almacenados.
- Permitir eliminar un producto.
- Mantener el carrito entre diferentes peticiones.

Cada práctica debe incluir:

- Contexto.
- Objetivo.
- Enunciado completo.
- Requisitos funcionales.
- Datos de entrada, cuando corresponda.
- Archivos iniciales, cuando sean necesarios.
- Comportamiento esperado.
- Casos de prueba.
- Pistas progresivas.
- Solución completa.
- Explicación de la solución.
- Criterios de evaluación.
- Errores habituales.

El contexto debe ser suficientemente completo para poder resolver el ejercicio sin depender de recordar una práctica anterior.

Incluye prácticas pequeñas, medianas y completas que combinen distintos contenidos.

Utiliza situaciones como tiendas, bibliotecas, formularios de registro, sistemas de autenticación, gestión de productos, preferencias de usuario y control de acceso mediante roles.

## 6. Editor y ejecución de código

Estudia la posibilidad de incorporar un editor de código integrado en la aplicación.

Me gustaría poder resolver los ejercicios directamente desde la plataforma, sin tener que salir continuamente a Visual Studio Code.

El editor debería disponer, siempre que sea viable, de:

- Resaltado de sintaxis.
- Numeración de líneas.
- Sangrado automático.
- Autocompletado básico.
- Edición de código PHP, HTML, CSS y JSON.
- Posibilidad de utilizar varios archivos en una misma práctica.
- Consola de resultados.
- Visualización de errores.
- Ejecución de casos de prueba.
- Restauración del código inicial.
- Visualización de la solución.
- Comparación entre mi solución y la solución propuesta.

Analiza alternativas como Monaco Editor o CodeMirror.

Para ejecutar PHP, estudia soluciones como PHP mediante WebAssembly o un entorno de ejecución aislado en el servidor.

No confundas un editor de código con un intérprete real.

Si se implementa ejecución de código, debe hacerse de forma segura, con aislamiento, límites de recursos y sin permitir acceso al sistema anfitrión.

No simules que el código se ha ejecutado si realmente no se ha ejecutado.

Si inicialmente solo puede implementarse el editor, desarrolla una arquitectura que permita incorporar posteriormente la ejecución real.

## 7. Rediseño del banco de trabajo

Quiero transformar el banco de trabajo actual en un sistema completo de revisión y administración del contenido.

Debe permitir acceder a todas las preguntas disponibles, organizadas por asignatura, unidad y apartado.

Debe incluir filtros por:

- Asignatura.
- Unidad didáctica.
- Apartado.
- Tipo de pregunta.
- Dificultad.
- Estado de revisión.
- Preguntas favoritas.
- Preguntas incorrectas.
- Preguntas pendientes de mejorar.
- Preguntas ya corregidas.

Quiero poder entrar, por ejemplo, en Desarrollo Web en Entorno Servidor, seleccionar la UD2 y visualizar todas las preguntas de esa unidad.

Desde el banco de trabajo quiero poder desplegar la respuesta de cualquier pregunta sin necesidad de realizar previamente un ejercicio.

También quiero poder consultar:

- Enunciado.
- Opciones.
- Respuesta correcta.
- Explicación.
- Código.
- Salida esperada.
- Pistas.
- Imágenes.
- Solución práctica.
- Fuente del contenido.
- Nivel de dificultad.

El banco de trabajo debe servir tanto para revisar la calidad del contenido como para estudiar libremente.

## 8. Sistema de valoración y detección de preguntas defectuosas

Quiero poder valorar todas las preguntas de la aplicación.

Diferencia claramente entre una pregunta que he respondido mal porque no conozco el contenido y una pregunta que está mal elaborada.

Son situaciones completamente diferentes.

Cada pregunta debe permitir acciones como:

- Marcar como favorita.
- Marcar como pregunta útil.
- Marcar como pregunta defectuosa.
- Marcar como pendiente de revisión.
- Añadir una observación personal.
- Seleccionar el motivo del problema.

Los motivos disponibles deben incluir:

- Enunciado ambiguo.
- Falta de contexto.
- Respuesta incorrecta.
- Respuesta incompleta.
- El código no corresponde con la pregunta.
- Falta la salida del programa.
- La salida esperada es incorrecta.
- La imagen no corresponde.
- Las opciones del test son incorrectas.
- La pista revela la solución.
- Pregunta repetida.
- Contenido fuera del temario.
- Dificultad incorrecta.
- Mala redacción.
- Otro motivo.

Permite seleccionar varios motivos y añadir una explicación personalizada.

Las valoraciones deben guardarse de forma persistente, sin perderse al recargar la página, cerrar el navegador o actualizar el contenido.

No quiero tener que enviarte capturas individualmente de cada pregunta defectuosa.

## 9. Exportación de preguntas para su revisión mediante IA

Implementa una funcionalidad que permita seleccionar preguntas del banco de trabajo y exportarlas.

Quiero poder exportar:

- Una pregunta individual.
- Varias preguntas seleccionadas.
- Todas las preguntas defectuosas.
- Todas las preguntas de una unidad.
- Todas las preguntas de una asignatura.
- El banco completo.

La exportación debe incluir toda la información necesaria para revisar y corregir las preguntas:

- Identificador único y estable.
- Asignatura.
- Unidad.
- Apartado.
- Enunciado.
- Tipo.
- Opciones.
- Respuesta.
- Explicación.
- Código inicial.
- Código de solución.
- Salida esperada.
- Pistas.
- Imágenes o referencias a sus archivos.
- Motivos por los que se ha marcado.
- Observaciones personales.
- Fuente.
- Estado de revisión.

Utiliza JSON como formato principal de intercambio.

Añade también un informe legible en Markdown o texto para poder revisar fácilmente las preguntas.

Si existen muchos archivos, imágenes o ejercicios de código, permite descargar un ZIP que incluya toda la información organizada.

El objetivo es que pueda descargar ese archivo, enviárselo a una inteligencia artificial para revisar las preguntas y recibir posteriormente una versión corregida.

## 10. Importación de preguntas corregidas

No quiero tener que modificar manualmente cada pregunta después de recibir las correcciones.

Implementa un sistema de importación que permita cargar el archivo corregido.

Debe:

- Validar la estructura del archivo.
- Identificar las preguntas mediante sus identificadores.
- Detectar preguntas nuevas.
- Detectar preguntas modificadas.
- Mostrar una comparación entre la versión anterior y la nueva.
- Permitir aceptar o rechazar los cambios.
- Evitar duplicados.
- Conservar favoritos, estadísticas y progreso.
- Mantener un historial de revisiones.
- Permitir recuperar versiones anteriores cuando sea viable.

No sobrescribas indiscriminadamente el banco completo.

Las preguntas corregidas deben quedar identificadas como revisadas, pero debe seguir siendo posible volver a marcarlas si detecto algún problema.

## 11. Modos de estudio

Quiero diferentes modos adaptados a distintas formas de aprender.

### Estudio libre

Consultar todas las preguntas, visualizar sus respuestas y navegar sin restricciones.

### Modo test

Responder preguntas tipo test y recibir correcciones y explicaciones.

### Modo tarjetas

Estudiar conceptos mediante tarjetas de pregunta y respuesta con repaso espaciado.

### Modo preguntas escritas

Responder preguntas cortas y largas antes de consultar la solución modelo y los criterios de corrección.

### Modo programación

Resolver ejercicios de código, interpretar resultados y corregir errores.

### Modo prácticas

Realizar ejercicios contextualizados, pudiendo consultar pistas progresivas y soluciones.

### Modo repaso de errores

Estudiar específicamente las preguntas que he respondido incorrectamente o los conceptos que todavía no domino.

No confundirlas con preguntas marcadas como defectuosas.

### Modo simulacro de examen

Generar exámenes que respeten los contenidos, modalidades y características indicadas por la profesora.

Permitir configurar:

- Unidades incluidas.
- Tipos de preguntas.
- Número de ejercicios.
- Duración.
- Dificultad.
- Disponibilidad de pistas.
- Material de apoyo.
- Momento en el que se muestran las soluciones.

Durante un simulacro, no mostrar las soluciones hasta finalizarlo, salvo que el usuario configure lo contrario.

## 12. Sistema de pistas

Las pistas deben ayudar a razonar, no revelar directamente la respuesta.

Implementa niveles progresivos:

- Primera pista: orientación conceptual.
- Segunda pista: estrategia para resolver el ejercicio.
- Tercera pista: ayuda más específica.
- Solución: respuesta completa y explicada.

Cada pista debe estar relacionada con el ejercicio y no ser una frase genérica.

## 13. Estadísticas y seguimiento del aprendizaje

Quiero conocer mi progreso real.

Incluye estadísticas como:

- Porcentaje de aciertos por asignatura.
- Porcentaje de aciertos por unidad.
- Rendimiento por apartado.
- Preguntas pendientes.
- Preguntas dominadas.
- Preguntas que fallo frecuentemente.
- Rendimiento por tipo de ejercicio.
- Resultados de simulacros.
- Evolución del aprendizaje.
- Tiempo de estudio.

Separa el progreso académico de la calidad del banco de preguntas.

Una pregunta defectuosa no debería perjudicar injustamente mis estadísticas.

## 14. Temario prioritario: Desarrollo Web en Entorno Servidor

El examen de la primera evaluación tendrá lugar el 2 de diciembre de 2026, desde las 15:00 hasta las 18:30 como máximo.

Abarca las unidades UD1, UD2 y UD3.

Utiliza las siguientes indicaciones oficiales y anotaciones personales para generar preguntas adaptadas al examen.

### UD1. Introducción al desarrollo web en entorno servidor

**Evaluación:**

- Prueba escrita: 90 %.
- Tareas publicadas: 10 %.
- No se permite material de apoyo en la prueba escrita.

**Contenidos:**

- Páginas web estáticas y dinámicas.
- Diferencias entre ambas.
- Ventajas de las páginas web dinámicas.
- Ejecución del lado del cliente.
- Ejecución del lado del servidor.
- Tecnologías asociadas al cliente.
- Tecnologías asociadas al servidor.
- Lenguajes de programación del lado del servidor.
- Tecnologías y plataformas.
- Servidores web.
- Servidores de aplicaciones.
- Diferencias entre ambos.
- Ejemplos de cada tipo.
- Comunicación entre cliente y servidor.

Prioriza preguntas tipo test de una o varias respuestas correctas, preguntas cortas, ejercicios de relación, identificación y comparación.

### UD2. Programación en PHP

**Evaluación:**

- Prueba práctica: 80 %.
- Tareas publicadas: 20 %.
- Se permite consultar material autorizado.

**Contenidos principales:**

- Sintaxis básica de PHP.
- Procesamiento de formularios HTML.
- Métodos GET y POST.
- Variables superglobales relacionadas con formularios.
- Creación de funciones definidas por el usuario.
- Invocación de funciones.
- Parámetros y argumentos.
- Declaración de tipos de parámetros.
- Tipos de retorno.
- Documentación de funciones mediante PHPDoc.
- Arrays unidimensionales.
- Arrays bidimensionales.
- Arrays indexados y asociativos, según el temario.
- Acceso y modificación de elementos.
- Ámbito local y global de las variables.
- Instrucciones include y require.
- Interpretación de código.
- Predicción de resultados y salidas.
- Directivas de configuración de PHP.
- Archivo php.ini.
- Funciones ini_get() e ini_set().
- Operador de fusión de null (??), cuando corresponda.

Presta especial atención a los contenidos trabajados desde formularios en adelante.

Revisa las prácticas que voy a proporcionar para determinar qué ejercicios y procedimientos ha enseñado realmente la profesora.

Genera principalmente ejercicios de programación, interpretación, corrección y desarrollo de aplicaciones pequeñas.

No limites esta unidad a preguntas teóricas, ya que el examen oficial es práctico.

### UD3. Acceso a datos y gestión de sesiones

**Evaluación:**

- Prueba escrita: 25 %.
- Prueba práctica: 50 %.
- Tareas publicadas: 25 %.

#### Parte teórica

- Protocolo HTTP.
- Significado de protocolo sin estado.
- Problemas derivados de no conservar información entre peticiones.
- Mecanismos para mantener el estado.
- Ventajas y desventajas de los mecanismos estudiados.
- Principales mecanismos de autenticación de usuarios.
- Los cuatro mecanismos de autenticación explicados en el temario.
- Definición de cookie.
- Ciclo de vida de una cookie.
- Almacenamiento de cookies.
- Transporte de cookies mediante HTTP.
- Cabecera Set-Cookie.
- Cabecera Cookie.
- Definición conceptual de sesión.
- Definición técnica de sesión.
- Almacenamiento de datos de sesión en el servidor.
- Identificador único de sesión.
- Relación entre sesiones y cookies.
- Transporte del identificador de sesión.
- Concepto de hash.
- Propiedades de las funciones hash.
- Diferencia entre hashing y cifrado.
- Funciones de PHP relacionadas con el hashing estudiadas en clase.
- Hashing seguro de contraseñas.
- Verificación de contraseñas.

Diferencia correctamente el almacenamiento de las cookies en el navegador y el almacenamiento de los datos de sesión en el servidor.

En XAMPP, los archivos de sesión pueden almacenarse en el directorio tmp y comenzar por sess_, dependiendo de la configuración de PHP.

No confundas estos archivos con las cookies.

#### Parte práctica

- Creación de cookies con setcookie().
- Eliminación de cookies.
- Lectura mediante $_COOKIE.
- Parámetro name de setcookie().
- Parámetro value.
- Parámetro expires.
- Parámetro path.
- Parámetro domain.
- Parámetro secure.
- Parámetro httponly.
- Otros parámetros únicamente si aparecen en el temario o como ampliación identificada.
- Inicio de sesiones mediante session_start().
- Uso de $_SESSION.
- Almacenamiento de información mediante claves y valores.
- Añadir elementos a una sesión.
- Leer elementos de una sesión.
- Modificar elementos.
- Eliminar elementos.
- Cerrar sesiones.
- Uso del operador ??.
- Lectura de usuarios desde archivos JSON.
- Interpretación de estructuras JSON.
- Inicio de sesión con usuarios almacenados en JSON.
- Contraseñas previamente hasheadas.
- Uso de password_hash() y password_verify(), cuando corresponda.
- Validación de credenciales.
- Almacenamiento de información del usuario autenticado en la sesión.
- Control de acceso.
- Gestión de roles.
- Redirecciones mediante header().
- Finalización correcta del flujo después de una redirección.
- Gestión del cierre de sesión.

Genera prácticas independientes y prácticas completas que combinen formularios, funciones, arrays, JSON, cookies, sesiones, autenticación y roles.

Por ejemplo:

- Sistema de inicio y cierre de sesión.
- Aplicación con roles de usuario y administrador.
- Carrito de compra mediante sesiones.
- Sistema de preferencias mediante cookies.
- Formularios de autenticación con usuarios almacenados en JSON.
- Páginas protegidas mediante sesiones.

## 15. Simulacros adaptados al examen real

Crea simulacros independientes para:

- UD1: examen teórico.
- UD2: examen práctico.
- UD3: examen teórico.
- UD3: examen práctico.
- Evaluación completa.

Respeta los pesos de evaluación comunicados por la profesora.

No presupongas que esos pesos representan la cantidad de preguntas o la duración de cada prueba.

Los simulacros deben permitir practicar en condiciones similares a las del examen.

En las pruebas escritas, simula la ausencia de material de apoyo.

En las prácticas, permite consultar los recursos de estudio autorizados dentro de la aplicación.

Recuerda que en el examen real no está permitido utilizar Internet, GitHub, almacenamiento personal externo o en la nube, inteligencia artificial ni comunicación con otras personas.

La aplicación es para preparar el examen con anterioridad, no para utilizarla incumpliendo sus normas.

## 16. Material de preparación para el examen práctico

Incorpora la posibilidad de generar y descargar material de consulta sin conexión.

Me interesa disponer de:

- Ejercicios resueltos.
- Ejemplos de código.
- Resúmenes de PHP.
- Formularios HTML.
- Ejemplos de funciones.
- Documentación PHPDoc.
- Ejemplos de arrays.
- Ejemplos de cookies.
- Ejemplos de sesiones.
- Sistemas de autenticación.
- Gestión de roles.
- Lectura de archivos JSON.
- Explicaciones de errores habituales.

Organiza este material en carpetas por unidad y facilita su descarga.

El material debe poder consultarse localmente con Visual Studio Code y utilizarse con XAMPP, siempre dentro de lo autorizado por la profesora.

## 17. Diseño y experiencia de usuario

Conserva la identidad visual de la aplicación actual y mejora aquello que sea necesario.

Quiero una aplicación moderna, intuitiva, organizada y rápida.

Prioriza:

- Navegación clara.
- Separación visual entre asignaturas y unidades.
- Código con resaltado de sintaxis.
- Filtros accesibles.
- Buscador de preguntas.
- Visualización cómoda de preguntas largas.
- Imágenes ampliables.
- Diseño adaptable.
- Modo claro y oscuro, si ya existe o resulta viable.
- Estados de revisión fácilmente identificables.
- Acceso rápido al banco de trabajo.
- Persistencia del progreso.

No sacrifiques la funcionalidad por incorporar elementos visuales innecesarios.

## 18. Arquitectura y persistencia

Analiza primero la tecnología y la arquitectura que utiliza actualmente el proyecto.

Evita reescribir todo desde cero si no es necesario.

Separa adecuadamente:

- Contenido académico.
- Preguntas.
- Soluciones.
- Progreso del usuario.
- Valoraciones.
- Incidencias.
- Configuración.
- Historial de revisiones.
- Importación y exportación.
- Ejecución de código.

Utiliza identificadores únicos y estables para que actualizar las preguntas no provoque la pérdida de estadísticas, favoritos o revisiones.

Comprueba que los datos se conservan al cerrar y volver a abrir la aplicación.

Si actualmente se utiliza almacenamiento local del navegador, estudia si conviene mantenerlo, utilizar IndexedDB o incorporar otra solución.

Ten en cuenta tanto el funcionamiento en localhost como el despliegue actual de la aplicación.

## 19. Control de calidad obligatorio

Antes de considerar terminada la implementación, comprueba:

- Que todos los apartados del temario tienen preguntas asociadas.
- Que las preguntas corresponden con sus respuestas.
- Que las preguntas no están duplicadas innecesariamente.
- Que las prácticas tienen contexto suficiente.
- Que los resultados del código son correctos.
- Que las imágenes corresponden con sus ejercicios.
- Que las pistas no revelan directamente las respuestas.
- Que el banco de trabajo permite revisar todas las preguntas.
- Que los filtros funcionan.
- Que las valoraciones son persistentes.
- Que la exportación contiene toda la información.
- Que la importación actualiza correctamente las preguntas.
- Que no se pierde el progreso al actualizar contenidos.
- Que los modos de estudio funcionan correctamente.
- Que no existen errores de navegación.
- Que las funcionalidades existentes siguen funcionando.

Genera también una matriz de cobertura que relacione cada apartado del temario con las preguntas y prácticas disponibles para detectar contenidos insuficientemente trabajados.

## 20. Metodología de implementación

Antes de modificar el proyecto:

1. Analiza la estructura completa del código existente.
2. Revisa las funcionalidades actuales.
3. Detecta los problemas de calidad del banco de preguntas.
4. Analiza todo el material académico proporcionado.
5. Diseña una arquitectura que permita implementar las mejoras.
6. Determina qué funcionalidades pueden reutilizarse.
7. Implementa los cambios.
8. Genera y valida las preguntas.
9. Realiza pruebas funcionales.
10. Comprueba la persistencia, exportación e importación.

No te limites a proponer funcionalidades: quiero que las implementes realmente en el proyecto cuando sea técnicamente viable.

No declares terminada una funcionalidad que solamente tenga una interfaz visual sin comportamiento real.

Si alguna funcionalidad presenta limitaciones técnicas, explica cuáles son, qué alternativa has implementado y qué queda pendiente.

El resultado final debe ser una plataforma de estudio completa, escalable, revisable y orientada a preparar exámenes reales, tanto teóricos como prácticos.

Prioriza siempre la calidad de las preguntas, la exactitud de las respuestas, la comprensión de los conceptos y la capacidad de practicar situaciones reales por encima de generar una gran cantidad de contenido sin revisar.