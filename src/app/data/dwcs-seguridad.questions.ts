import type { Question } from '../core/questions';

export const DWCS_SEGURIDAD: Question[] = [
  {
    "id": "CERT-2026-01",
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Según el aviso CERT-EU 2026-018 incluido en la actividad, ¿qué medida corrige realmente las vulnerabilidades de PHP descritas?",
    "options": [
      "Ocultar errores con display_errors=Off",
      "Actualizar a una versión corregida de PHP",
      "Cambiar únicamente el puerto de Apache",
      "Eliminar todos los formularios HTML"
    ],
    "correct": [
      1
    ],
    "solution": "La medida que realmente corrige las vulnerabilidades es actualizar a una versión parcheada de PHP. Los cambios de directivas descritos por CERT-EU son mitigaciones temporales y no equivalen a una corrección.",
    "code": "",
    "check": "",
    "activity": "Actividad 4 · Aviso CERT-EU 2026-018",
    "subjectId": "dwcs",
    "unit": 2,
    "image": ""
  },
  {
    "id": "CERT-2026-02",
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Según el aviso CERT-EU 2026-018, ¿qué cambios de directivas aparecen como mitigaciones temporales, condicionadas al contexto?",
    "options": [
      "Desactivar session.upload_progress.enabled (valor 0) y reiniciar trabajadores.",
      "Bajar post_max_size según las necesidades de subida.",
      "Establecer memory_limit=-1 de manera que la aplicación no pueda anularlo, considerando los riesgos.",
      "Activar display_errors para mostrar todos los fallos al usuario.",
      "En PHP 8.5, desactivar temporalmente fatal_error_backtraces (valor 0)."
    ],
    "correct": [
      0,
      1,
      2,
      4
    ],
    "solution": "El aviso menciona memory_limit=-1, límites bajos para post_max_size, desactivar session.upload_progress.enabled y, para PHP 8.5, fatal_error_backtraces=0. Son mitigaciones de exposición limitada; requieren estudiar la configuración y sus riesgos. La actualización es imprescindible para corregir las vulnerabilidades.",
    "code": "",
    "check": "",
    "activity": "Actividad 4 · Directivas de mitigación",
    "subjectId": "dwcs",
    "unit": 2,
    "image": ""
  },
  {
    "id": "CERT-2026-03",
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Por qué ocultar errores con error_reporting o display_errors no equivale a corregir una vulnerabilidad del intérprete PHP?",
    "options": [],
    "correct": [],
    "solution": "Estas directivas controlan qué errores se informan o muestran al usuario, pero no eliminan la causa de una vulnerabilidad. CERT-EU indica que ocultar diagnósticos no evita los problemas mencionados; hay que actualizar a una versión corregida.",
    "code": "",
    "check": "Diferenciar visibilidad de errores y corrección real de vulnerabilidades.",
    "activity": "Actividad 4 · Aviso CERT-EU",
    "subjectId": "dwcs",
    "unit": 2,
    "image": ""
  },
  {
    "id": "CERT-2026-04",
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "La actividad pide estudiar las mitigaciones del aviso CERT-EU 2026-018. Explica qué directivas se mencionan y por qué no deberían sustituir la actualización de PHP.",
    "options": [],
    "correct": [],
    "solution": "El aviso menciona, como mitigaciones temporales, memory_limit=-1 fijado en configuración que no puedan anular scripts (con precaución por agotamiento de recursos), límites bajos para post_max_size manteniendo upload_max_filesize por debajo, session.upload_progress.enabled=0 con reinicio de los workers y, en PHP 8.5, fatal_error_backtraces=0. No basta con ocultar errores. Cada medida afecta solo a determinadas vías de ataque y puede tener efectos secundarios; la solución es aplicar versiones corregidas y verificar el despliegue.",
    "code": "",
    "check": "Citar directivas relevantes; distinguir mitigación de parche; considerar ámbito de configuración y reinicio.",
    "activity": "Actividad 4 · Estudio del aviso de seguridad",
    "subjectId": "dwcs",
    "unit": 2,
    "image": "",
    "scenario": "Actividad sobre un aviso público de seguridad de PHP: se analizan directivas de configuración como medida temporal de mitigación y la actualización del intérprete como solución principal. Se pide razonar por qué una mitigación de configuración no equivale a corregir una vulnerabilidad."
  }
];
