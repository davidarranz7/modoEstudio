# Criterios de calidad de ESTUDIO

Este banco está diseñado para practicar los tres temas de **Desenvolvemento Web Contorno Servidor**. Las preguntas deben ser autónomas: no deben requerir que el alumno recuerde una práctica o un PDF que no se muestre.

## Enunciados

- En **escribir PHP**, se aporta el caso, los datos necesarios, qué se debe implementar y al menos un ejemplo de entrada y resultado esperado.
- En **interpretar PHP**, se muestra el fragmento de código completo y, después de responder, la salida concreta o el efecto real de ejecución. Si no hay `echo` ni `print`, se indica expresamente que no hay salida visible.
- En **desarrollo**, el caso dispone de un contexto que permite razonar sin consultar la actividad original y de una rúbrica para autoevaluarse.
- En **test**, la corrección enseña la opción o las opciones correctas expresamente, antes de la explicación. En selección múltiple puede haber varias soluciones.
- Las imágenes solo acompañan preguntas con el tema que realmente representan. La captura de configuración de Apache que se utilizó por error como diagrama de arrays y la captura de concatenación PHP que se utilizó como cliente web han sido desasociadas.

## Origen del temario

`audio` significa que la pregunta está relacionada con un concepto destacado en las grabaciones verificables, **no** que se trate de una pregunta literal que la profesora haya formulado. `temario` indica que procede del material y las actividades. No se utilizan contenidos de Despliegue.

## Ejemplos revisados

- **U2-28**: la tarea de talleres incorpora precios, sesiones, descuentos y condiciones de validación antes de preguntar por la distribución de archivos.
- **EXAM-U2-039**: el ejercicio de `range(-3, 0)` muestra el resultado `-3 -2 -1 0`, además del código de referencia.
- **EXAM-U2-118**: ya no muestra una captura de Apache; utiliza un array con claves no consecutivas como ejemplo.
- **ACT-017**: incluye las cinco empresas del IBEX indicadas por la profesora en el enunciado y calcula su media.

## Verificación

El validador `npm run check:bank` comprueba IDs únicos, respuestas de test, clasificaciones, rutas de imágenes y, para el banco DWCS, la existencia de contexto y ejemplos en los 66 ejercicios de escribir PHP, resultado previsto en los 71 de interpretación y contexto en las 29 preguntas de desarrollo.

Los ejercicios de escritura y desarrollo se comparan con una solución modelo y se autoevalúan: **ESTUDIO no ejecuta PHP dentro del navegador ni corrige automáticamente el código libre**.
