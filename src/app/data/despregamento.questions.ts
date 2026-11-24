import type { Question } from '../core/questions';

export const DESPREGAMENTO_QUESTIONS: Question[] = [
  {
    "id": "DEP-U1-001",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Un portal tiene una interfaz Angular, una API Java y una base de datos PostgreSQL. ¿Qué asignación a las tres capas es correcta?",
    "solution": "La capa de presentación muestra la interfaz, la de negocio procesa las reglas y la de datos persiste información.",
    "options": [
      "Presentación: PostgreSQL; lógica: Angular; datos: Java",
      "Presentación: Java; lógica: PostgreSQL; datos: Angular",
      "Presentación: Angular; lógica: API Java; datos: PostgreSQL",
      "Presentación: Angular; lógica: PostgreSQL; datos: Java"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-002",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "En una web dinámica convencional desarrollada con PHP, ¿qué sucede habitualmente cuando el navegador solicita una página?",
    "solution": "En el modelo dinámico convencional, la respuesta HTML se produce en el servidor.",
    "options": [
      "El servidor solo envía CSS y nunca HTML.",
      "El servidor ejecuta la lógica y genera HTML para la respuesta.",
      "Se actualiza siempre la interfaz sin solicitar nuevos documentos.",
      "El navegador ejecuta PHP directamente."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-003",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué describe mejor una SPA después de la carga inicial?",
    "solution": "Una SPA mantiene cargado el documento y modifica la interfaz en el navegador mediante JavaScript.",
    "options": [
      "JavaScript actualiza la interfaz y puede solicitar datos a una API sin recargar toda la página.",
      "Un Service Worker genera siempre el HTML en el servidor.",
      "Cada clic exige descargar un nuevo documento HTML completo.",
      "La base de datos actualiza directamente el DOM."
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-004",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Una página recibe HTML ya generado desde el servidor y después se vuelve interactiva en el navegador. ¿Qué técnica se reconoce principalmente?",
    "solution": "SSR describe dónde se genera inicialmente el HTML; puede coexistir con JavaScript y otras estrategias.",
    "options": [
      "NFS: compartición de archivos.",
      "SSR: renderizado inicial en el servidor.",
      "Docker: creación de imágenes.",
      "SPA: necesariamente todos los elementos se crean solo en el cliente."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-005",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál de estos elementos permite describir cómo se instalará una PWA (nombre, iconos y modo de apertura)?",
    "solution": "El manifiesto proporciona metadatos para la instalación de la aplicación web.",
    "options": [
      "Archivo ports.conf",
      "Web App Manifest",
      "Dockerfile",
      "Cookie de sesión"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-006",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Dónde se ejecuta normalmente un Service Worker de una PWA?",
    "solution": "Un Service Worker no es el servidor web; es un script gestionado por el navegador.",
    "options": [
      "En el hipervisor de VirtualBox.",
      "En el entorno del navegador, separado del código principal de la página.",
      "En la base de datos del servidor.",
      "Exclusivamente en un proceso Apache en el backend."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-007",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Una tienda divide usuarios, inventario y pedidos en servicios independientes comunicados por API. ¿Qué arquitectura describe?",
    "solution": "Los microservicios separan dominios funcionales e interactúan mediante interfaces como APIs REST.",
    "options": [
      "Microservicios",
      "Servidor web estático",
      "Monolito de una sola capa",
      "PWA sin backend"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-008",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué modificación del DOM es típica en una SPA?",
    "solution": "La actualización dinámica del DOM en el navegador evita recargas completas frecuentes.",
    "options": [
      "El servidor cambia físicamente el monitor.",
      "JavaScript cambia partes del contenido visible después de recibir datos.",
      "El navegador reinicia siempre el sistema operativo.",
      "La base de datos reescribe el fichero HTML local."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-009",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "Se quiere mejorar la indexación por buscadores y servir HTML inicial al cliente. ¿Qué técnica del temario encaja mejor?",
    "solution": "SSR permite generar HTML inicial en el servidor, aunque no garantiza por sí solo el SEO.",
    "options": [
      "Contenedores exclusivamente",
      "NAT",
      "PWA sin caché",
      "SSR"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-010",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es la principal diferencia conceptual entre SPA y PWA?",
    "solution": "Una aplicación puede ser simultáneamente SPA y PWA.",
    "options": [
      "PWA exige siempre microservicios.",
      "SPA describe cómo se actualiza la interfaz; PWA describe capacidades web instalables y de funcionamiento mejorado.",
      "SPA se ejecuta siempre en el backend.",
      "SPA y PWA son nombres diferentes para la misma arquitectura."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-011",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Marca las afirmaciones correctas sobre las tres capas.",
    "solution": "El temario distingue presentación, lógica y datos como responsabilidades diferentes.",
    "options": [
      "La presentación puede utilizar Angular.",
      "La capa de presentación es siempre una base de datos.",
      "La lógica de negocio debe ejecutarse obligatoriamente en el navegador.",
      "La capa de datos permite almacenar y recuperar información.",
      "La lógica de negocio contiene validaciones y reglas de la aplicación."
    ],
    "correct": [
      0,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-012",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué posibilidades puede aportar un Service Worker según el temario?",
    "solution": "No todas las capacidades se activan automáticamente: dependen de la implementación y el soporte del navegador.",
    "options": [
      "Ejecutar el kernel del ordenador anfitrión.",
      "Interceptar peticiones de la aplicación.",
      "Sustituir obligatoriamente al servidor backend.",
      "Ayudar a que ciertos recursos funcionen sin conexión.",
      "Gestionar estrategias de caché."
    ],
    "correct": [
      1,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-013",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona afirmaciones correctas sobre microservicios.",
    "solution": "La independencia es una decisión de arquitectura; se requieren contratos de comunicación bien definidos.",
    "options": [
      "No se permite que un servicio consulte a otro.",
      "Cada servicio puede gestionar su propia lógica y datos.",
      "Pueden estar implementados con tecnologías distintas.",
      "Pueden comunicarse mediante API REST sobre HTTP.",
      "Todos tienen que utilizar el mismo lenguaje de programación."
    ],
    "correct": [
      1,
      2,
      3
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-014",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona ventajas o dificultades reales del modelo SPA descritas en el temario.",
    "solution": "Una SPA realiza peticiones posteriores a la API y necesita decisiones adicionales para caché/SEO/seguridad.",
    "options": [
      "La interfaz puede actualizarse sin recargar el documento completo.",
      "Debe considerarse la seguridad y, según el caso, el SEO.",
      "Una SPA no utiliza HTTP después de la primera carga.",
      "Toda SPA funciona desconectada automáticamente.",
      "La separación entre frontend y backend suele ser más clara."
    ],
    "correct": [
      0,
      1,
      4
    ],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-015",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Define arquitectura cliente-servidor e indica el sentido de la petición y la respuesta.",
    "solution": "El cliente inicia una petición HTTP/HTTPS; el servidor recibe la petición, la procesa y devuelve una respuesta al cliente.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-016",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Compara una web dinámica convencional con una SPA según quién genera o actualiza la interfaz.",
    "solution": "En la web dinámica convencional, el servidor genera HTML para cada respuesta relevante. En la SPA, JavaScript actualiza gran parte del DOM del navegador y puede pedir datos asíncronamente a una API.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-017",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia hay entre SSR y una SPA? ¿Pueden combinarse?",
    "solution": "SSR indica que el HTML inicial se genera en el servidor; SPA describe actualizaciones y navegación realizadas mayoritariamente en el cliente. Pueden combinarse con renderizado inicial en servidor y posteriores interacciones en navegador.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-018",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica qué es una PWA e identifica sus dos elementos característicos del temario.",
    "solution": "Una Progressive Web App es una aplicación web con capacidades próximas a una instalable. Sus elementos habituales son Service Worker (caché, peticiones y posibles funciones sin conexión) y Web App Manifest (nombre, iconos y presentación al instalar).",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-019",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Por qué no es correcto decir que el Service Worker es el servidor de aplicaciones?",
    "solution": "Porque se ejecuta en el entorno del navegador como intermediario para peticiones y caché; la lógica del backend se ejecuta en infraestructura servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-020",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Un microservicio de pedidos necesita saber si hay stock. Describe una forma de comunicarse.",
    "solution": "Puede realizar una petición HTTP a la API REST del microservicio de almacén, que devuelve información de disponibilidad. La comunicación depende del contrato de API.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web"
  },
  {
    "id": "DEP-U1-021",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona cada término con su función principal.",
    "solution": "SPA → Actualización de interfaz mediante JavaScript sin recarga completa habitual.; SSR → Generación del HTML inicial en el servidor.; PWA → Capacidades web instalables y uso de Service Worker.; Microservicios → Servicios separados por dominio funcional.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web",
    "pairs": [
      {
        "left": "SPA",
        "right": "Actualización de interfaz mediante JavaScript sin recarga completa habitual."
      },
      {
        "left": "SSR",
        "right": "Generación del HTML inicial en el servidor."
      },
      {
        "left": "PWA",
        "right": "Capacidades web instalables y uso de Service Worker."
      },
      {
        "left": "Microservicios",
        "right": "Servicios separados por dominio funcional."
      }
    ]
  },
  {
    "id": "DEP-U1-022",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona cada componente de una arquitectura en tres capas.",
    "solution": "Presentación → Interfaz y experiencia de usuario.; Lógica de negocio → Reglas, validaciones y procesamiento.; Datos → Persistencia y consultas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web",
    "pairs": [
      {
        "left": "Presentación",
        "right": "Interfaz y experiencia de usuario."
      },
      {
        "left": "Lógica de negocio",
        "right": "Reglas, validaciones y procesamiento."
      },
      {
        "left": "Datos",
        "right": "Persistencia y consultas."
      }
    ]
  },
  {
    "id": "DEP-U1-023",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "order",
    "level": "medio",
    "origin": "temario",
    "prompt": "Ordena el recorrido simplificado de una petición de una web dinámica convencional.",
    "solution": "El navegador envía la petición HTTP. → El servidor recibe la petición y ejecuta la lógica. → El servidor consulta datos si son necesarios. → El servidor genera la respuesta HTML. → El navegador interpreta y muestra el HTML.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "1. Arquitecturas web",
    "sequence": [
      "El navegador envía la petición HTTP.",
      "El servidor recibe la petición y ejecuta la lógica.",
      "El servidor consulta datos si son necesarios.",
      "El servidor genera la respuesta HTML.",
      "El navegador interpreta y muestra el HTML."
    ]
  },
  {
    "id": "DEP-U1-024",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Una academia quiere ofrecer consultas públicas indexables y una zona de ejercicios muy interactiva. Compara web dinámica convencional, SPA y SSR y razona qué elegirías para cada parte.",
    "solution": "La web convencional genera HTML en el servidor y simplifica una salida inicial. Una SPA actualiza la interfaz en el navegador y resulta adecuada para ejercicios muy interactivos. SSR permite entregar HTML inicial generado en el servidor y puede favorecer la indexación. Las técnicas se pueden combinar; ninguna exige por sí misma una arquitectura de microservicios.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Diferenciar dónde se genera el HTML, cómo se actualiza el DOM, ventajas e inconvenientes y justificar una elección realista.",
    "section": "1. Arquitecturas web",
    "scenario": "La academia dispone de un catálogo público de cursos y de una zona privada de simulacros con correcciones dinámicas."
  },
  {
    "id": "DEP-U1-025",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Diseña conceptualmente una plataforma de comercio electrónico con microservicios de usuarios, almacén y pedidos. Explica límites y comunicación.",
    "solution": "Separar autenticación/perfiles, stock/productos y gestión de pedidos. Cada servicio expone interfaces/API REST. El de pedidos consulta disponibilidad al de almacén e información del cliente al de usuarios. La implementación de cada uno puede usar tecnologías diferentes.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Identificar las tres responsabilidades, al menos dos llamadas entre servicios y ventajas o dificultades de coordinación.",
    "section": "1. Arquitecturas web",
    "scenario": "La empresa quiere escalar la gestión de pedidos sin desplegar obligatoriamente toda la aplicación."
  },
  {
    "id": "DEP-U1-026",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué componente permite a varias máquinas virtuales utilizar un mismo hardware físico?",
    "solution": "El hipervisor administra recursos virtualizados para las máquinas virtuales.",
    "options": [
      "Hipervisor",
      "Web App Manifest",
      "Módulo mod_ssl",
      "Service Worker"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-027",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué comparten normalmente los contenedores Linux en un mismo anfitrión Linux?",
    "solution": "Los contenedores tienen aislamiento de procesos y dependencias, pero usan el kernel anfitrión.",
    "options": [
      "Una base de datos idéntica y obligatoria",
      "El kernel del sistema anfitrión",
      "Las mismas contraseñas de todas las aplicaciones",
      "El kernel propio e independiente de cada contenedor"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-028",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es la diferencia entre imagen y contenedor Docker?",
    "solution": "De una misma imagen pueden crearse múltiples contenedores.",
    "options": [
      "Un contenedor no puede crearse desde una imagen.",
      "La imagen siempre contiene un kernel independiente.",
      "La imagen solo sirve para almacenar datos de un navegador.",
      "La imagen es la plantilla; el contenedor es una instancia en ejecución o creada desde ella."
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-029",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué servicio de AWS se utiliza en el temario para capacidad de cálculo mediante instancias virtuales?",
    "solution": "EC2 ofrece recursos de cómputo; S3 almacenamiento de objetos y RDS bases de datos administradas.",
    "options": [
      "EC2",
      "CloudFront",
      "S3",
      "RDS"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-030",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál de los siguientes pares AWS → utilidad es correcto?",
    "solution": "S3 se orienta al almacenamiento de objetos.",
    "options": [
      "RDS → distribución de hojas CSS únicamente",
      "S3 → almacenamiento de objetos",
      "EC2 → base de datos administrada",
      "S3 → kernel para contenedores"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-031",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona las afirmaciones correctas sobre máquinas virtuales y contenedores.",
    "solution": "La virtualización de hardware y el aislamiento de procesos presentan modelos distintos.",
    "options": [
      "Un contenedor Linux suele compartir el kernel del anfitrión.",
      "Los contenedores suelen iniciarse más rápidamente que una VM completa.",
      "Una máquina virtual ejecuta un sistema operativo propio.",
      "Cada contenedor Linux necesita un hipervisor independiente.",
      "Una imagen Docker equivale a un equipo físico."
    ],
    "correct": [
      0,
      1,
      2
    ],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-032",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué funciones corresponden al kernel de un sistema operativo?",
    "solution": "El kernel proporciona servicios básicos a las aplicaciones en espacio de usuario.",
    "options": [
      "Diseñar automáticamente los formularios HTML.",
      "Almacenar obligatoriamente todas las imágenes Docker.",
      "Proporcionar servicios de entrada/salida y red a los programas.",
      "Administrar el acceso a dispositivos y recursos.",
      "Gestionar memoria y CPU."
    ],
    "correct": [
      2,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-033",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Define virtualización e identifica qué recursos virtuales puede tener una VM.",
    "solution": "La virtualización permite ejecutar varios entornos sobre un mismo hardware, gestionados por un hipervisor. Una VM dispone de CPU, RAM, almacenamiento y red virtuales, y su propio sistema operativo.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-034",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica la diferencia entre kernel y espacio de usuario.",
    "solution": "El kernel gestiona CPU, memoria, dispositivos, ficheros y red; el espacio de usuario contiene aplicaciones, librerías y herramientas que solicitan servicios al kernel.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-035",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Por qué un contenedor suele consumir menos recursos que una máquina virtual completa?",
    "solution": "Porque comparte el kernel del anfitrión y contiene esencialmente procesos y dependencias, en vez de arrancar un sistema operativo completo con kernel independiente.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-036",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica la diferencia entre Docker image y Docker container con un ejemplo.",
    "solution": "Una imagen contiene aplicación y dependencias para arrancar. A partir de una imagen de Nginx se pueden crear dos contenedores separados, cada uno con su propio proceso y configuración.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-037",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Compara EC2, S3 y RDS según su función principal.",
    "solution": "EC2 proporciona cómputo (instancias), S3 almacenamiento de objetos y RDS bases de datos administradas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores"
  },
  {
    "id": "DEP-U1-038",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona cada concepto con su definición.",
    "solution": "Hipervisor → Capa de software que administra máquinas virtuales.; Kernel → Núcleo que gestiona recursos del sistema.; Imagen Docker → Paquete a partir del cual se crea un contenedor.; Contenedor → Entorno de procesos aislado con dependencias.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores",
    "pairs": [
      {
        "left": "Hipervisor",
        "right": "Capa de software que administra máquinas virtuales."
      },
      {
        "left": "Kernel",
        "right": "Núcleo que gestiona recursos del sistema."
      },
      {
        "left": "Imagen Docker",
        "right": "Paquete a partir del cual se crea un contenedor."
      },
      {
        "left": "Contenedor",
        "right": "Entorno de procesos aislado con dependencias."
      }
    ]
  },
  {
    "id": "DEP-U1-039",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona los servicios de AWS con su uso.",
    "solution": "EC2 → Máquinas y capacidad de cómputo.; S3 → Almacenamiento de objetos.; RDS → Bases de datos administradas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2. Virtualización, nube y contedores",
    "pairs": [
      {
        "left": "EC2",
        "right": "Máquinas y capacidad de cómputo."
      },
      {
        "left": "S3",
        "right": "Almacenamiento de objetos."
      },
      {
        "left": "RDS",
        "right": "Bases de datos administradas."
      }
    ]
  },
  {
    "id": "DEP-U1-040",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Una academia quiere desplegar cuatro entornos de prueba en una única máquina física. Compara usar cuatro máquinas virtuales con usar cuatro contenedores.",
    "solution": "VM: cada una tiene sistema operativo y kernel propios, con mayor aislamiento de sistema completo y mayor consumo. Contenedores: procesos y dependencias aislados sobre kernel compartido, arranque rápido y menor sobrecarga. La opción adecuada depende del aislamiento requerido y de compatibilidad del sistema.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Explicar hipervisor, kernel propio frente a compartido, consumo y límites de ambas alternativas.",
    "section": "2. Virtualización, nube y contedores",
    "scenario": "El equipo dispone de RAM limitada y quiere probar varias instancias de una aplicación web."
  },
  {
    "id": "DEP-U1-041",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué función define mejor un servidor web?",
    "solution": "Apache, Nginx e IIS pueden atender recursos estáticos y actuar como intermediarios.",
    "options": [
      "Compilar siempre Java del cliente.",
      "Gestionar el hardware como hipervisor.",
      "Recibir peticiones HTTP/HTTPS y enviar recursos o respuestas.",
      "Ejecutar necesariamente una base de datos integrada."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "3. Servidores web"
  },
  {
    "id": "DEP-U1-042",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál de estas tecnologías del temario es un servidor web y proxy inverso?",
    "solution": "Nginx puede servir contenido HTTP y reenviar peticiones a otros servicios.",
    "options": [
      "Nginx",
      "Angular",
      "Django",
      "PostgreSQL"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "3. Servidores web"
  },
  {
    "id": "DEP-U1-043",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "En una arquitectura con Apache, PHP y base de datos, ¿qué componente ejecuta el código PHP?",
    "solution": "PHP es lenguaje/runtime del lado servidor, no un servidor HTTP por sí mismo.",
    "options": [
      "El compilador CSS",
      "El runtime/intérprete de PHP",
      "El navegador por defecto",
      "La base de datos como servidor web"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "3. Servidores web"
  },
  {
    "id": "DEP-U1-044",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué plataforma del temario está orientada a ejecutar aplicaciones Java basadas en servlets?",
    "solution": "Tomcat es un contenedor de servlets y servidor web ligero para aplicaciones Java.",
    "options": [
      "Nginx como intérprete Java",
      "Docker Hub",
      "Microsoft IIS exclusivamente",
      "Apache Tomcat"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "4. Servidores de aplicacións"
  },
  {
    "id": "DEP-U1-045",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál se corresponde con un servidor de aplicaciones Jakarta EE?",
    "solution": "WildFly es un servidor de aplicaciones para Jakarta EE.",
    "options": [
      "Git Bash",
      "Cloudflare CDN",
      "IIS como único entorno Jakarta",
      "WildFly"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "4. Servidores de aplicacións"
  },
  {
    "id": "DEP-U1-046",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Señala las funciones que puede desempeñar un servidor web.",
    "solution": "La frontera web/aplicaciones puede variar según el software usado.",
    "options": [
      "Sustituir siempre a la base de datos.",
      "Recibir solicitudes HTTP/HTTPS.",
      "Garantizar que todo frontend esté escrito en PHP.",
      "Entregar recursos HTML/CSS/JS.",
      "Actuar como intermediario hacia una aplicación."
    ],
    "correct": [
      1,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "3. Servidores web"
  },
  {
    "id": "DEP-U1-047",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona ejemplos de servidores de aplicaciones enumerados en el temario.",
    "solution": "Se enumeran en el apartado dedicado a servidores de aplicaciones.",
    "options": [
      "Apache Tomcat",
      "WebLogic",
      "Visual Studio Code",
      "WildFly",
      "Amazon S3",
      "Payara"
    ],
    "correct": [
      0,
      1,
      3,
      5
    ],
    "code": "",
    "check": "",
    "section": "4. Servidores de aplicacións"
  },
  {
    "id": "DEP-U1-048",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica brevemente qué es Cloudflare y menciona dos funciones.",
    "solution": "Es una plataforma externa de servicios web que puede proporcionar CDN, proxy inverso y protección frente a DDoS; complementa al servidor de origen, no es simplemente un ejecutable Apache.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "3. Servidores web"
  },
  {
    "id": "DEP-U1-049",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Diferencia un servidor web de un servidor de aplicaciones con un ejemplo.",
    "solution": "El servidor web atiende HTTP y recursos (Apache/Nginx); el servidor de aplicaciones proporciona el entorno que ejecuta lógica de aplicación (Tomcat/WildFly). Pueden estar separados o integrados.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "3. Servidores web"
  },
  {
    "id": "DEP-U1-050",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué responsabilidades suelen ofrecer los servidores de aplicaciones además de ejecutar lógica?",
    "solution": "Pueden ofrecer gestión de sesiones, seguridad, autenticación, conexión a datos y administración de componentes/servicios.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "4. Servidores de aplicacións"
  },
  {
    "id": "DEP-U1-051",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona cada producto con su categoría principal en el temario.",
    "solution": "Apache HTTP Server → Servidor web.; Nginx → Servidor web y proxy inverso.; Microsoft IIS → Servidor web del ecosistema Windows.; Tomcat → Contenedor de servlets y servidor de aplicaciones ligero.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "3. Servidores web",
    "pairs": [
      {
        "left": "Apache HTTP Server",
        "right": "Servidor web."
      },
      {
        "left": "Nginx",
        "right": "Servidor web y proxy inverso."
      },
      {
        "left": "Microsoft IIS",
        "right": "Servidor web del ecosistema Windows."
      },
      {
        "left": "Tomcat",
        "right": "Contenedor de servlets y servidor de aplicaciones ligero."
      }
    ]
  },
  {
    "id": "DEP-U1-052",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "order",
    "level": "medio",
    "origin": "temario",
    "prompt": "Ordena los pasos de comunicación cuando un navegador solicita una página que requiere datos.",
    "solution": "El navegador envía una petición HTTP. → El servidor web recibe la petición. → La aplicación procesa la solicitud y consulta los datos necesarios. → El servidor envía la respuesta al navegador. → El navegador interpreta y muestra el resultado.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "3. Servidores web",
    "sequence": [
      "El navegador envía una petición HTTP.",
      "El servidor web recibe la petición.",
      "La aplicación procesa la solicitud y consulta los datos necesarios.",
      "El servidor envía la respuesta al navegador.",
      "El navegador interpreta y muestra el resultado."
    ]
  },
  {
    "id": "DEP-U1-053",
    "subjectId": "despregamento",
    "unit": 1,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Una empresa sirve imágenes con Nginx y operaciones de negocio con una aplicación Java. Explica cómo cooperan servidor web, servidor de aplicaciones y base de datos.",
    "solution": "Nginx recibe solicitudes, puede servir imágenes y CSS directamente y actuar como proxy inverso hacia el servidor de aplicaciones. Este ejecuta la lógica y consulta la base de datos cuando corresponda. La respuesta vuelve al navegador.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Identificar función de cada componente y que sus responsabilidades pueden integrarse según la arquitectura.",
    "section": "4. Servidores de aplicacións",
    "scenario": "La web muestra un catálogo y permite operaciones privadas de clientes."
  },
  {
    "id": "DEP-U2-001",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué código HTTP indica que el servidor no ha encontrado el recurso solicitado?",
    "solution": "404 significa que el recurso no ha sido localizado por el servidor.",
    "options": [
      "404 Not Found",
      "401 Unauthorized",
      "200 OK",
      "301 Moved Permanently"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "1. Introdución aos servidores web"
  },
  {
    "id": "DEP-U2-002",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué puerto utiliza HTTP por defecto en un servidor web convencional?",
    "solution": "HTTP utiliza habitualmente el puerto TCP 80; HTTPS suele usar 443.",
    "options": [
      "22/TCP",
      "389/TCP",
      "443/UDP obligatoriamente",
      "80/TCP"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "1. Introdución aos servidores web"
  },
  {
    "id": "DEP-U2-003",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué comando instala Apache en Ubuntu después de actualizar el índice de paquetes?",
    "solution": "apt install instala el paquete; a2ensite habilita sitios, no instala Apache.",
    "options": [
      "sudo a2ensite apache2",
      "sudo apt install apache2 -y",
      "sudo service install apache2",
      "sudo apt install nginx-conf"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2. Servidor web Apache"
  },
  {
    "id": "DEP-U2-004",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué comando verifica la sintaxis de la configuración de Apache sin reiniciar el servicio?",
    "solution": "apache2ctl -t y apache2ctl configtest comprueban la configuración.",
    "options": [
      "a2enmod syntax",
      "apache2ctl -S site",
      "service apache2 stop",
      "apache2ctl configtest"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.1. Iniciar, parar e reiniciar Apache"
  },
  {
    "id": "DEP-U2-005",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué operación vuelve a cargar la configuración sin detener completamente el servicio?",
    "solution": "reload aplica los cambios de configuración sin realizar una parada completa.",
    "options": [
      "reload",
      "disable",
      "stop",
      "purge"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.1. Iniciar, parar e reiniciar Apache"
  },
  {
    "id": "DEP-U2-006",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona los comandos válidos del temario para comprobar la configuración de Apache.",
    "solution": "Ambos comandos de Apache permiten verificar la sintaxis.",
    "options": [
      "apache2ctl configtest",
      "apache2ctl checkphp",
      "a2ensite -t",
      "sudo apache2 syntax",
      "apache2ctl -t"
    ],
    "correct": [
      0,
      4
    ],
    "code": "",
    "check": "",
    "section": "2.1. Iniciar, parar e reiniciar Apache"
  },
  {
    "id": "DEP-U2-007",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es la diferencia entre restart y reload?",
    "solution": "restart detiene y arranca de nuevo el servicio; reload vuelve a cargar la configuración, normalmente sin una parada completa.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.1. Iniciar, parar e reiniciar Apache"
  },
  {
    "id": "DEP-U2-008",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Indica dos comandos de Apache para inspeccionar módulos y sitios virtuales.",
    "solution": "apache2ctl -M muestra los módulos cargados; apache2ctl -S muestra la configuración de los sitios virtuales.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.1. Iniciar, parar e reiniciar Apache"
  },
  {
    "id": "DEP-U2-009",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe los comandos para comprobar la sintaxis y, solo si está correcta, recargar Apache dentro de un contenedor Ubuntu sin systemd.",
    "solution": "apache2ctl configtest\nservice apache2 reload",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Debe haber configtest antes de service apache2 reload.",
    "section": "2.1. Iniciar, parar e reiniciar Apache",
    "scenario": "Has editado un VirtualHost dentro de un contenedor Docker. El profesor pide que primero compruebes la configuración y después apliques los cambios.",
    "hints": [
      "Recuerda qué comando comprueba errores de configuración sin reiniciar.",
      "En el contenedor se trabajó con service, no con systemctl."
    ],
    "codeTask": "write",
    "exampleInput": "Configuración Apache editada; servicio apache2 ya iniciado.",
    "exampleOutput": "Si hay Syntax OK, Apache recarga la configuración."
  },
  {
    "id": "DEP-U2-010",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es el directorio base de configuración de Apache en Ubuntu 24 según el temario?",
    "solution": "La configuración principal está bajo /etc/apache2; el DocumentRoot por defecto es /var/www/html.",
    "options": [
      "/etc/apache2",
      "/usr/bin/httpd.conf",
      "/home/ubuntu/sites",
      "/var/www/html"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración"
  },
  {
    "id": "DEP-U2-011",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué archivo suele contener las directivas Listen de Apache en Ubuntu?",
    "solution": "ports.conf define la escucha de puertos; apache2.conf incorpora otras configuraciones.",
    "options": [
      "access.log",
      "envvars",
      "ports.conf",
      "000-default.html"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración"
  },
  {
    "id": "DEP-U2-012",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia tienen sites-available y sites-enabled?",
    "solution": "a2ensite suele crear enlaces de enabled hacia la configuración disponible.",
    "options": [
      "available contiene configuraciones disponibles y enabled enlaces simbólicos a sitios activados.",
      "Son directorios idénticos sin función distinta.",
      "enabled almacena los logs y available ejecutables PHP.",
      "Solo available contiene los recursos HTML."
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración"
  },
  {
    "id": "DEP-U2-013",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué comando habilita un módulo de Apache que está disponible pero no activo?",
    "solution": "a2enmod es para módulos; a2ensite para VirtualHosts y a2enconf para configuraciones adicionales.",
    "options": [
      "a2ensite",
      "a2dissite",
      "a2enmod",
      "a2enconf"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración"
  },
  {
    "id": "DEP-U2-014",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona afirmaciones correctas sobre los archivos de configuración de Apache.",
    "solution": "Algunos argumentos sí pueden distinguir mayúsculas/minúsculas; la barra invertida al fin de línea permite continuidad bajo condiciones concretas.",
    "options": [
      "Los comentarios pueden añadirse al final de cualquier directiva.",
      "apache2.conf es el archivo principal en Ubuntu.",
      "Los comentarios pueden empezar por # en una línea aparte.",
      "Los nombres de las directivas no distinguen mayúsculas/minúsculas.",
      "Los espacios en un argumento no requieren nunca comillas."
    ],
    "correct": [
      1,
      2,
      3
    ],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración"
  },
  {
    "id": "DEP-U2-015",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona los pares sites, mods y conf con el propósito de sus carpetas available/enabled.",
    "solution": "sites organiza VirtualHosts; mods gestiona módulos; conf organiza configuraciones adicionales. available almacena configuraciones y enabled referencias a las habilitadas.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración"
  },
  {
    "id": "DEP-U2-016",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona los ficheros o directorios de Apache con su función.",
    "solution": "apache2.conf → Configuración principal.; ports.conf → Puertos de escucha y Listen.; envvars → Variables de entorno de los scripts de Apache.; sites-enabled → Enlaces a VirtualHosts activados.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración",
    "pairs": [
      {
        "left": "apache2.conf",
        "right": "Configuración principal."
      },
      {
        "left": "ports.conf",
        "right": "Puertos de escucha y Listen."
      },
      {
        "left": "envvars",
        "right": "Variables de entorno de los scripts de Apache."
      },
      {
        "left": "sites-enabled",
        "right": "Enlaces a VirtualHosts activados."
      }
    ]
  },
  {
    "id": "DEP-U2-017",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona los comandos con su propósito.",
    "solution": "a2ensite → Activar sitio virtual.; a2dismod → Desactivar módulo.; a2enconf → Activar configuración adicional.; a2dissite → Desactivar sitio virtual.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración",
    "pairs": [
      {
        "left": "a2ensite",
        "right": "Activar sitio virtual."
      },
      {
        "left": "a2dismod",
        "right": "Desactivar módulo."
      },
      {
        "left": "a2enconf",
        "right": "Activar configuración adicional."
      },
      {
        "left": "a2dissite",
        "right": "Desactivar sitio virtual."
      }
    ]
  },
  {
    "id": "DEP-U2-018",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "order",
    "level": "medio",
    "origin": "temario",
    "prompt": "Ordena el procedimiento seguro para activar un nuevo sitio virtual en Apache.",
    "solution": "Crear su fichero de configuración en sites-available. → Habilitar el sitio con a2ensite. → Comprobar configuración mediante apache2ctl configtest. → Aplicar los cambios con reload. → Probar su respuesta HTTP en el navegador.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.2. Ficheiros de configuración",
    "sequence": [
      "Crear su fichero de configuración en sites-available.",
      "Habilitar el sitio con a2ensite.",
      "Comprobar configuración mediante apache2ctl configtest.",
      "Aplicar los cambios con reload.",
      "Probar su respuesta HTTP en el navegador."
    ]
  },
  {
    "id": "DEP-U2-019",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Has creado el archivo web1.conf en sites-available. Escribe los comandos para habilitar ese sitio, validar la sintaxis y recargar Apache.",
    "solution": "sudo a2ensite web1.conf\nsudo apache2ctl configtest\nsudo systemctl reload apache2",
    "options": [],
    "correct": [],
    "code": "",
    "check": "a2ensite, comprobación de sintaxis y reload deben aparecer en ese orden.",
    "section": "2.2. Ficheiros de configuración",
    "scenario": "Trabajas en una máquina virtual Ubuntu 24 con Apache en ejecución. La configuración del sitio ya existe.",
    "hints": [
      "Primero activa la configuración disponible.",
      "No apliques cambios sin comprobar la sintaxis."
    ],
    "codeTask": "write",
    "exampleInput": "Fichero /etc/apache2/sites-available/web1.conf",
    "exampleOutput": "El VirtualHost queda habilitado tras un Syntax OK y recarga."
  },
  {
    "id": "DEP-U2-020",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué permite un VirtualHost en Apache?",
    "solution": "Un servidor puede servir varios dominios mediante VirtualHosts, incluso con la misma IP.",
    "options": [
      "Iniciar varias máquinas virtuales Ubuntu.",
      "Alojar varios sitios con configuraciones y DocumentRoot propios en un mismo servidor.",
      "Cifrar todos los puertos automáticamente.",
      "Convertir PHP en un navegador."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.3. Sitios virtuais"
  },
  {
    "id": "DEP-U2-021",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué directiva establece dónde se buscan los archivos del sitio?",
    "solution": "DocumentRoot es la raíz de documentos web; ServerRoot es el directorio base de configuración.",
    "options": [
      "ErrorLog",
      "DocumentRoot",
      "ServerName",
      "ServerRoot"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.4. Directivas básicas"
  },
  {
    "id": "DEP-U2-022",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué directiva controla los nombres de archivo de inicio al visitar un directorio?",
    "solution": "DirectoryIndex permite buscar index.html, index.php, etc. en el orden indicado.",
    "options": [
      "Listen",
      "DirectoryIndex",
      "CustomLog",
      "DocumentRoot"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.4. Directivas básicas"
  },
  {
    "id": "DEP-U2-023",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué directiva permite asociar una URL con un directorio físico fuera de DocumentRoot?",
    "solution": "Alias realiza un mapeo URL a una ruta del sistema de archivos.",
    "options": [
      "Alias",
      "AuthName",
      "Options",
      "KeepAlive"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.4. Directivas básicas"
  },
  {
    "id": "DEP-U2-024",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué directiva devuelve una respuesta para que el navegador visite otra URL?",
    "solution": "Redirect provoca una nueva petición a otra URL; Alias no obliga a cambiar la URL visible.",
    "options": [
      "Redirect",
      "Alias",
      "DirectoryIndex",
      "ServerRoot"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.4. Directivas básicas"
  },
  {
    "id": "DEP-U2-025",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona afirmaciones correctas sobre las directivas básicas de Apache.",
    "solution": "Cada directiva actúa sobre una responsabilidad distinta.",
    "options": [
      "Alias y Redirect producen exactamente el mismo comportamiento en el navegador.",
      "DocumentRoot indica el directorio de configuración global.",
      "ErrorDocument permite personalizar páginas de error.",
      "ServerName identifica el nombre del servidor, pero no configura por sí mismo DNS.",
      "Listen determina puertos/IP donde Apache escucha."
    ],
    "correct": [
      2,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "2.4. Directivas básicas"
  },
  {
    "id": "DEP-U2-026",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica cómo elige Apache el VirtualHost cuando varios comparten una IP y puerto.",
    "solution": "Puede utilizar el nombre de dominio indicado en la petición HTTP (Host) para seleccionar el VirtualHost configurado con ese nombre. Si no hay coincidencia, se aplica el sitio por defecto de esa IP:puerto.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.3. Sitios virtuais"
  },
  {
    "id": "DEP-U2-027",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Compara Alias y Redirect indicando qué ocurre con la URL del navegador.",
    "solution": "Alias sirve internamente un recurso de otra ruta física manteniendo la URL solicitada; Redirect responde con un código de redirección para que el cliente haga una nueva petición a otra URL.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.4. Directivas básicas"
  },
  {
    "id": "DEP-U2-028",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia hay entre ServerRoot y DocumentRoot?",
    "solution": "ServerRoot es la base de configuración/archivos internos de Apache; DocumentRoot es el directorio desde donde se sirven documentos web.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.4. Directivas básicas"
  },
  {
    "id": "DEP-U2-029",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona cada directiva con su finalidad.",
    "solution": "ServerName → Nombre del servidor o sitio.; Listen → Puerto o IP de escucha.; DirectoryIndex → Archivos de inicio en directorios.; ErrorLog → Ruta de registro de errores.; ErrorDocument → Respuesta personalizada de error.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.4. Directivas básicas",
    "pairs": [
      {
        "left": "ServerName",
        "right": "Nombre del servidor o sitio."
      },
      {
        "left": "Listen",
        "right": "Puerto o IP de escucha."
      },
      {
        "left": "DirectoryIndex",
        "right": "Archivos de inicio en directorios."
      },
      {
        "left": "ErrorLog",
        "right": "Ruta de registro de errores."
      },
      {
        "left": "ErrorDocument",
        "right": "Respuesta personalizada de error."
      }
    ]
  },
  {
    "id": "DEP-U2-030",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Analiza esta configuración. ¿Qué archivo buscará Apache cuando el cliente visite / si ambos archivos existen?",
    "solution": "Buscará /var/www/html/index.html antes de index.php porque aparece primero en DirectoryIndex.",
    "options": [],
    "correct": [],
    "code": "DocumentRoot \"/var/www/html\"\nDirectoryIndex index.html index.php",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.4. Directivas básicas",
    "scenario": "El directorio /var/www/html contiene index.html e index.php.",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-031",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Interpreta la configuración y explica qué ocurre cuando se solicita /docs/info.html.",
    "solution": "Apache intentará servir /srv/manuales/info.html, sujeto a permisos y reglas de acceso; la URL /docs/info.html permanece igual.",
    "options": [],
    "correct": [],
    "code": "DocumentRoot /var/www/html\nAlias /docs/ /srv/manuales/",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.4. Directivas básicas",
    "scenario": "Existe el archivo /srv/manuales/info.html y los permisos permiten acceder.",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-032",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe un VirtualHost de Apache para www.tenda.test en el puerto 80, con DocumentRoot /var/www/tenda.",
    "solution": "<VirtualHost *:80>\n    ServerName www.tenda.test\n    DocumentRoot /var/www/tenda\n</VirtualHost>",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Incluir bloque VirtualHost, ServerName y DocumentRoot correctos.",
    "section": "2.3. Sitios virtuais",
    "scenario": "Tienes un servidor Apache Ubuntu que debe servir los ficheros de una tienda alojados en /var/www/tenda.",
    "hints": [
      "El bloque necesita la dirección y el puerto.",
      "El dominio se indica con ServerName, no con Listen."
    ],
    "codeTask": "write",
    "exampleInput": "Dominio: www.tenda.test; puerto: 80; raíz: /var/www/tenda.",
    "exampleOutput": "Apache utiliza ese VirtualHost para peticiones dirigidas a www.tenda.test cuando el nombre se resuelve hasta el servidor y los permisos permiten el acceso."
  },
  {
    "id": "DEP-U2-033",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Configura una página de error personalizada para las respuestas 404 de tu sitio Apache.",
    "solution": "ErrorDocument 404 /erros/404.html",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Debe usarse ErrorDocument, no Redirect.",
    "section": "2.4. Directivas básicas",
    "scenario": "En /var/www/html/erros/404.html existe una página creada para recursos no encontrados.",
    "hints": [
      "La respuesta personalizada no debe convertir 404 en 200."
    ],
    "codeTask": "write",
    "exampleInput": "Petición a /recurso-que-no-existe",
    "exampleOutput": "Se muestra la página /erros/404.html con estado 404 (si la configuración y el archivo son correctos)."
  },
  {
    "id": "DEP-U2-034",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué bloque de Apache permite definir reglas para rutas físicas del sistema de archivos?",
    "solution": "Directory selecciona rutas físicas; Location selecciona URLs.",
    "options": [
      "<Location>",
      "<ProxyUser>",
      "<VirtualHostName>",
      "<Directory>"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.5. Directivas de bloque"
  },
  {
    "id": "DEP-U2-035",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué bloque aplica reglas según el nombre de un archivo, sin importar su directorio dentro del ámbito configurado?",
    "solution": "Files compara el nombre del fichero; FilesMatch permite expresiones regulares.",
    "options": [
      "<Location>",
      "<KeepAlive>",
      "<Listen>",
      "<Files>"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.5. Directivas de bloque"
  },
  {
    "id": "DEP-U2-036",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué significa Require all denied?",
    "solution": "Require all denied es autorización, no un sistema completo de autenticación.",
    "options": [
      "Permitir solo archivos HTML.",
      "Denegar el acceso a todos los clientes para el recurso seleccionado.",
      "Pedir automáticamente usuario y contraseña por HTTP Basic.",
      "Mostrar un índice de directorios."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.5. Directivas de bloque"
  },
  {
    "id": "DEP-U2-037",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué efecto tiene Options -Indexes en un directorio sin archivo índice?",
    "solution": "Con Options -Indexes y sin index, normalmente habrá 403 para el listado, pero un fichero conocido puede ser accesible si la autorización lo permite.",
    "options": [
      "Deniega el acceso a cualquier fichero por nombre.",
      "Desactiva el listado automático del directorio; no prohíbe por sí solo acceder a archivos conocidos.",
      "Desactiva completamente HTTP.",
      "Borra todos los archivos del directorio."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.5. Directivas de bloque"
  },
  {
    "id": "DEP-U2-038",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Dónde puede aplicarse un bloque Directory si se quiere afectar globalmente a distintos sitios virtuales?",
    "solution": "La ubicación dentro o fuera de VirtualHost define el ámbito, no el nombre del archivo.",
    "options": [
      "Solo dentro del archivo web1.conf aunque esté dentro de VirtualHost.",
      "Fuera del bloque <VirtualHost>, en un contexto global admitido.",
      "En los comentarios al final de una línea.",
      "Dentro de cualquier etiqueta <Location> como regla general."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.6. Contexto das directivas"
  },
  {
    "id": "DEP-U2-039",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona las correspondencias correctas entre ámbitos Apache y recursos.",
    "solution": "La confusión entre rutas físicas y rutas URL es una de las distinciones principales del apartado.",
    "options": [
      "Location utiliza rutas URL.",
      "Directory identifica una URL aunque no exista ruta física.",
      "Directory utiliza rutas del sistema de archivos.",
      "Files selecciona nombres de archivo.",
      "Location siempre exige una ruta absoluta del disco."
    ],
    "correct": [
      0,
      2,
      3
    ],
    "code": "",
    "check": "",
    "section": "2.5. Directivas de bloque"
  },
  {
    "id": "DEP-U2-040",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona afirmaciones correctas sobre Options y Require.",
    "solution": "Las directivas Options y Require afectan a cuestiones distintas.",
    "options": [
      "Options -Indexes desactiva el listado de directorios sin índice.",
      "Require all denied deniega el acceso al recurso seleccionado.",
      "Options -Indexes equivale siempre a Require all denied.",
      "Require all granted permite el acceso desde la perspectiva de autorización Apache, sujeto a otros controles.",
      "Require all granted corrige automáticamente permisos de Linux."
    ],
    "correct": [
      0,
      1,
      3
    ],
    "code": "",
    "check": "",
    "section": "2.5. Directivas de bloque"
  },
  {
    "id": "DEP-U2-041",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica la diferencia entre Directory, Files y Location con un ejemplo de uso de cada uno.",
    "solution": "Directory aplica reglas a /var/www/html/privado (ruta física); Files protege un nombre como privado.html; Location afecta a una URL como /admin, independientemente del archivo físico.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.5. Directivas de bloque"
  },
  {
    "id": "DEP-U2-042",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué determina el ámbito de un bloque Directory: el nombre del archivo .conf o su ubicación dentro/fuera de VirtualHost?",
    "solution": "El ámbito lo determina el contexto donde se declara: si está dentro de VirtualHost se aplica a ese sitio; si está fuera, tiene ámbito global conforme a las reglas y precedencias de Apache.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.6. Contexto das directivas"
  },
  {
    "id": "DEP-U2-043",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Por qué Options -Indexes no impide descargar un archivo cuyo nombre se conoce?",
    "solution": "Porque solo desactiva el listado automático del directorio. Si la URL apunta a un fichero y Require/permisos no lo prohíben, puede seguir sirviéndose.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.7. Exemplo de contexto da directiva"
  },
  {
    "id": "DEP-U2-044",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué sucede cuando se pide /privado/ sin index.html y después /privado/info.txt?",
    "solution": "La petición al directorio /privado/ no muestra un listado y normalmente devuelve 403 si no hay índice; /privado/info.txt puede devolver 200 si existe y no hay otras restricciones.",
    "options": [],
    "correct": [],
    "code": "<Directory /var/www/html/privado>\n    Options -Indexes\n    Require all granted\n</Directory>",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.5. Directivas de bloque",
    "scenario": "Existen /var/www/html/privado/info.txt; no hay DirectoryIndex para el directorio. Los permisos de Linux permiten lectura.",
    "codeTask": "interpret",
    "expectedOutput": "Listado desactivado en /privado/; acceso al fichero concreto permitido si existe."
  },
  {
    "id": "DEP-U2-045",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué recursos bloquea la siguiente configuración?",
    "solution": "Deniega el acceso a archivos cuyos nombres terminan en .bak o .old en el ámbito donde se aplica, por ejemplo config.bak y web.old.",
    "options": [],
    "correct": [],
    "code": "<FilesMatch \"\\.(bak|old)$\">\n    Require all denied\n</FilesMatch>",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.5. Directivas de bloque",
    "scenario": "La directiva está en la configuración general y dentro de un contexto donde está permitida.",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-046",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "En la imagen se ve que se accede a un directorio compartido desde un sitio. Explica por qué un fichero conocido podría seguir abriéndose aunque el listado de directorios se bloquee.",
    "solution": "Options -Indexes evita enumerar archivos de un directorio sin índice, pero no deniega automáticamente las URLs de archivos individuales.",
    "options": [],
    "correct": [],
    "code": "<Directory /var/www/compartido>\n    Options -Indexes\n    Require all granted\n</Directory>",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.7. Exemplo de contexto da directiva",
    "scenario": "Imagen real del caso web1.test: se ve un recurso concreto solicitado por su URL.",
    "image": "despregamento-directory-1.png",
    "imageCaption": "Ejemplo de acceso a recurso de Apache /compartido/",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-047",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "En la captura aparecen nombres de sitios web y rutas. Explica qué efecto tendría mover Directory desde el interior del VirtualHost de web1 a un ámbito global.",
    "solution": "Dentro de web1 la regla afecta a ese VirtualHost; fuera, en contexto global, puede afectar también a otros VirtualHosts como web2 que utilicen ese directorio físico.",
    "options": [],
    "correct": [],
    "code": "<Directory /var/www/compartido>\n    Options -Indexes\n    Require all granted\n</Directory>",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.7. Exemplo de contexto da directiva",
    "scenario": "El mismo directorio /var/www/compartido se publica por web1.test y web2.test.",
    "image": "despregamento-directory-2.png",
    "imageCaption": "Ejemplo de visualización de la ruta /compartido/",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-048",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "La captura muestra que el mismo directorio compartido se presenta de forma distinta. ¿Puede Options -Indexes actuar solo en un sitio virtual y por qué?",
    "solution": "Sí, si la directiva se encuentra en Directory dentro del VirtualHost web1 se aplica a ese sitio; web2 puede mantener el listado si otras reglas permiten Indexes.",
    "options": [],
    "correct": [],
    "code": "<VirtualHost *:80>\n    ServerName web1.test\n    <Directory /var/www/compartido>\n        Options -Indexes\n    </Directory>\n</VirtualHost>",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.7. Exemplo de contexto da directiva",
    "scenario": "Comparas dos sitios que sirven el mismo recurso físico.",
    "image": "despregamento-directory-3.png",
    "imageCaption": "Captura del ejemplo Apache sobre directorio compartido",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-049",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "A partir de la captura de un recurso del directorio compartido, explica cómo comprobarías si un bloqueo afecta solo al listado del directorio o también al acceso a archivos conocidos.",
    "solution": "Probaría /compartido/ y /compartido/ficheiro1.txt por separado. Sin DirectoryIndex, la primera puede devolver 403 por la ausencia de listado; la segunda puede ser accesible si existe y no hay otras restricciones. Si la segunda también da 403, revisaría Require, permisos y configuración heredada.",
    "options": [],
    "correct": [],
    "code": "<Directory /var/www/compartido>\n    Options -Indexes\n    Require all granted\n</Directory>",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.7. Exemplo de contexto da directiva",
    "scenario": "El mismo directorio se publica por los dos VirtualHosts.",
    "image": "despregamento-directory-4.png",
    "imageCaption": "Captura del ejemplo de acceso al directorio compartido",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-050",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe un bloque Directory que deniegue todo acceso HTTP al directorio /var/www/html/privado y su contenido.",
    "solution": "<Directory /var/www/html/privado>\n    Require all denied\n</Directory>",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Usar una ruta física absoluta en Directory y Require all denied.",
    "section": "2.5. Directivas de bloque",
    "scenario": "En un sitio corporativo hay documentos internos que no deben servirse públicamente, incluso cuando se conoce el nombre del archivo.",
    "hints": [
      "No confundas ocultar el listado con denegar el acceso.",
      "La directiva de autorización del temario es Require."
    ],
    "codeTask": "write",
    "exampleInput": "Directorio físico /var/www/html/privado",
    "exampleOutput": "Toda petición a ese directorio queda denegada por la autorización Apache (normalmente 403)."
  },
  {
    "id": "DEP-U2-051",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe un bloque FilesMatch que bloquee archivos con extensión .bak o .old.",
    "solution": "<FilesMatch \"\\.(bak|old)$\">\n    Require all denied\n</FilesMatch>",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Usar FilesMatch, patrón con anclaje final y Require all denied.",
    "section": "2.5. Directivas de bloque",
    "scenario": "El equipo deja copias de seguridad de configuración en la carpeta web y quiere evitar que se descarguen.",
    "hints": [
      "La condición se refiere al nombre del archivo, no a la URL de una carpeta.",
      "El símbolo $ exige fin de nombre."
    ],
    "codeTask": "write",
    "exampleInput": "Rutas como /config.bak, /index.old y /index.html",
    "exampleOutput": "Las extensiones .bak y .old quedan denegadas; .html no coincide con ese patrón."
  },
  {
    "id": "DEP-U2-052",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué módulo de Apache se utiliza para HTTPS/TLS?",
    "solution": "mod_ssl gestiona funcionalidades TLS de Apache.",
    "options": [
      "mod_status",
      "mod_ssl",
      "mod_cache",
      "mod_userdir"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.8. Módulos de Apache"
  },
  {
    "id": "DEP-U2-053",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué módulo de Apache permite reescribir URLs mediante reglas?",
    "solution": "mod_rewrite ofrece reglas de reescritura y redirección de URL.",
    "options": [
      "mod_status",
      "mod_auth_basic",
      "mod_rewrite",
      "mod_deflate"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.8. Módulos de Apache"
  },
  {
    "id": "DEP-U2-054",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cuál es la finalidad habitual de mod_userdir?",
    "solution": "En el temario se menciona el directorio /home/usuario/public_html.",
    "options": [
      "Descifrar certificados TLS.",
      "Mostrar exclusivamente estadísticas de MPM.",
      "Comprimir ficheros PHP.",
      "Publicar sitios en rutas como /~usuario desde carpetas del usuario."
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.8. Módulos de Apache"
  },
  {
    "id": "DEP-U2-055",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Marca las correspondencias válidas entre módulos y funcionalidades.",
    "solution": "Apache amplía funcionalidades mediante módulos activables.",
    "options": [
      "mod_proxy → proxy inverso",
      "mod_rewrite → crear máquinas virtuales",
      "mod_userdir → sustituir la base de datos",
      "mod_ssl → HTTPS/TLS",
      "mod_status → estado del servidor",
      "mod_headers → cabeceras HTTP"
    ],
    "correct": [
      0,
      3,
      4,
      5
    ],
    "code": "",
    "check": "",
    "section": "2.8. Módulos de Apache"
  },
  {
    "id": "DEP-U2-056",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia hay entre mods-available y mods-enabled?",
    "solution": "mods-available contiene módulos y configuraciones disponibles; mods-enabled incluye enlaces a los módulos habilitados que Apache carga según su configuración.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.8. Módulos de Apache"
  },
  {
    "id": "DEP-U2-057",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe los comandos para habilitar el módulo ssl en Apache y comprobar la configuración antes de recargar.",
    "solution": "sudo a2enmod ssl\nsudo apache2ctl configtest\nsudo systemctl reload apache2",
    "options": [],
    "correct": [],
    "code": "",
    "check": "a2enmod ssl, configtest y reload.",
    "section": "2.8. Módulos de Apache",
    "scenario": "Acabas de preparar HTTPS en una máquina virtual Ubuntu y necesitas habilitar mod_ssl.",
    "hints": [
      "Activar un módulo no se hace con a2ensite."
    ],
    "codeTask": "write",
    "exampleInput": "Módulo mod_ssl disponible",
    "exampleOutput": "mod_ssl se habilita y sus cambios se aplican si Syntax OK."
  },
  {
    "id": "DEP-U2-058",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué tipo de criptografía utiliza la misma clave para cifrar y descifrar?",
    "solution": "La clave simétrica debe compartirse de forma segura.",
    "options": [
      "Asimétrica de clave pública y privada",
      "Firma digital exclusivamente",
      "Hashing unidireccional",
      "Simétrica"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.9. Fundamentos de criptografía"
  },
  {
    "id": "DEP-U2-059",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "En una firma digital, ¿con qué clave firma el emisor?",
    "solution": "La firma se verifica con la clave pública correspondiente.",
    "options": [
      "La clave de sesión TLS de cualquier usuario",
      "La clave pública del receptor",
      "Una contraseña compartida en la URL",
      "Su clave privada"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.9. Fundamentos de criptografía"
  },
  {
    "id": "DEP-U2-060",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué garantiza por sí mismo un certificado autoasinado aceptado manualmente, sin CA de confianza?",
    "solution": "El navegador muestra una advertencia de confianza si no conoce una CA que avale el certificado.",
    "options": [
      "Equivale a un certificado emitido por una CA pública reconocida.",
      "Impide todos los ataques de red.",
      "Puede permitir cifrado, pero no aporta validación automática de identidad por una CA reconocida.",
      "Garantiza que el dominio es legítimo para todos los navegadores."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.9. Fundamentos de criptografía"
  },
  {
    "id": "DEP-U2-061",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué puerto es habitual para HTTPS?",
    "solution": "HTTPS sobre TLS utiliza habitualmente el puerto 443.",
    "options": [
      "22/UDP",
      "389/TCP",
      "443/TCP",
      "80/UDP"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.9. Fundamentos de criptografía"
  },
  {
    "id": "DEP-U2-062",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué extensión de un certificado identifica los nombres de dominio para los que es válido actualmente?",
    "solution": "La validación moderna de nombres de dominio se basa en SAN, no solo en CN.",
    "options": [
      "DocumentRoot",
      "ServerRoot",
      "KeepAliveTimeout",
      "subjectAltName (SAN)"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.10. Creación dun certificado dixital"
  },
  {
    "id": "DEP-U2-063",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué archivo contiene la clave privada generada con -keyout en el ejemplo de OpenSSL?",
    "solution": "El fichero .key es privado; el .crt contiene el certificado que se presenta a los navegadores.",
    "options": [
      "ports.conf",
      "apache-https.crt",
      "index.html",
      "apache-https.key"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.10. Creación dun certificado dixital"
  },
  {
    "id": "DEP-U2-064",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona afirmaciones correctas sobre TLS y certificados.",
    "solution": "El establecimiento de TLS incorpora autenticación y negociación de claves; luego se emplean claves simétricas de sesión.",
    "options": [
      "El navegador verifica la validez del certificado y el dominio solicitado.",
      "HTTPS funciona con una clave pública enviando todos los datos en abierto.",
      "Un certificado autoasinado es automáticamente de confianza para cualquier navegador.",
      "La criptografía simétrica se utiliza para cifrar los datos durante la comunicación.",
      "TLS protege la comunicación HTTPS."
    ],
    "correct": [
      0,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "2.9. Fundamentos de criptografía"
  },
  {
    "id": "DEP-U2-065",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué parámetros y significados del comando openssl req del temario son correctos?",
    "solution": "-nodes evita cifrar la clave con passphrase en el ejemplo presentado.",
    "options": [
      "-nodes almacena la clave con una contraseña obligatoria.",
      "-keyout indica la ruta de salida de la clave privada.",
      "-out guarda siempre el registro access.log.",
      "-x509 genera un certificado autofirmado directamente.",
      "-days 365 establece una validez de 365 días."
    ],
    "correct": [
      1,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "2.10. Creación dun certificado dixital"
  },
  {
    "id": "DEP-U2-066",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Diferencia cifrado simétrico, asimétrico y hash en una frase cada uno.",
    "solution": "Simétrico: misma clave para cifrar y descifrar. Asimétrico: par de claves pública/privada con funciones complementarias. Hash: genera una huella para comprobar integridad, no para descifrar.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.9. Fundamentos de criptografía"
  },
  {
    "id": "DEP-U2-067",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Describe de forma resumida cómo se verifica una firma digital.",
    "solution": "El emisor firma con su clave privada; el receptor verifica la firma con la clave pública del emisor y detecta si los datos se han alterado.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.9. Fundamentos de criptografía"
  },
  {
    "id": "DEP-U2-068",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia hay entre CN y SAN de un certificado TLS actual?",
    "solution": "El CN es un nombre común del titular; para comprobar los dominios cubiertos se usa la extensión SAN con uno o varios nombres DNS.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.10. Creación dun certificado dixital"
  },
  {
    "id": "DEP-U2-069",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona los argumentos de OpenSSL con su efecto.",
    "solution": "-x509 → Emitir directamente certificado autofirmado.; -days 365 → Fijar validez de 365 días.; -keyout → Ruta de la clave privada.; -out → Ruta del certificado de salida.; -addext → Añadir extensión como subjectAltName.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.10. Creación dun certificado dixital",
    "pairs": [
      {
        "left": "-x509",
        "right": "Emitir directamente certificado autofirmado."
      },
      {
        "left": "-days 365",
        "right": "Fijar validez de 365 días."
      },
      {
        "left": "-keyout",
        "right": "Ruta de la clave privada."
      },
      {
        "left": "-out",
        "right": "Ruta del certificado de salida."
      },
      {
        "left": "-addext",
        "right": "Añadir extensión como subjectAltName."
      }
    ]
  },
  {
    "id": "DEP-U2-070",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "order",
    "level": "medio",
    "origin": "temario",
    "prompt": "Ordena las fases habituales para solicitar un certificado a una CA.",
    "solution": "Generar una clave privada protegida. → Crear una CSR con la clave pública y datos del dominio. → Enviar la solicitud a una autoridad certificadora. → La CA verifica el dominio y emite un certificado firmado. → Instalar el certificado en el servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.10. Creación dun certificado dixital",
    "sequence": [
      "Generar una clave privada protegida.",
      "Crear una CSR con la clave pública y datos del dominio.",
      "Enviar la solicitud a una autoridad certificadora.",
      "La CA verifica el dominio y emite un certificado firmado.",
      "Instalar el certificado en el servidor."
    ]
  },
  {
    "id": "DEP-U2-071",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Lee el comando de OpenSSL e identifica: duración, tipo/tamaño de clave, dominios cubiertos y ficheros de salida.",
    "solution": "Crea certificado autoasinado válido 365 días con clave RSA 2048 bits. La clave privada se guarda en .key y el certificado en .crt. Los SAN cubren web1.test y web2.test. -nodes deja la clave privada sin contraseña.",
    "options": [],
    "correct": [],
    "code": "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-https.key -out /etc/ssl/certs/apache-https.crt -subj \"/CN=web1.test\" -addext \"subjectAltName=DNS:web1.test,DNS:web2.test\"",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.10. Creación dun certificado dixital",
    "scenario": "El comando se ejecuta en Ubuntu con permisos suficientes.",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-072",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Explica cómo protege HTTPS la conexión de una tienda online y qué papel desempeñan certificado, CA, claves asimétricas y claves de sesión.",
    "solution": "El servidor presenta un certificado con clave pública e identidad. El cliente comprueba cadena de confianza, dominio y vigencia; el protocolo TLS autentica al servidor y negocia claves de sesión. La comunicación posterior se cifra mediante criptografía simétrica. Los certificados autoasinados no son fiables automáticamente para el navegador.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Hablar de verificación de certificado, autenticación de servidor y cifrado con claves de sesión; distinguir firma/cifrado y CA.",
    "section": "2.9. Fundamentos de criptografía",
    "scenario": "Una tienda desea proteger las credenciales que los usuarios envían al iniciar sesión."
  },
  {
    "id": "DEP-U2-073",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué código HTTP utiliza Apache Basic Authentication para solicitar credenciales?",
    "solution": "La respuesta 401 suele incluir WWW-Authenticate para activar el diálogo de autenticación.",
    "options": [
      "301 Moved Permanently",
      "204 No Content",
      "404 Not Found",
      "401 Unauthorized"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-074",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Cómo se envían las credenciales con HTTP Basic?",
    "solution": "Base64 es codificación, no cifrado.",
    "options": [
      "En Authorization: Basic con datos codificados en Base64, por lo que requieren HTTPS para proteger el transporte.",
      "Cifradas de extremo a extremo por Base64 sin TLS.",
      "Como identificador de sesión en una imagen.",
      "Solo en parámetros URL llamados contraseña."
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-075",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué directiva permite acceder a cualquier usuario autenticado correctamente?",
    "solution": "Require valid-user controla quién accede; AuthBasicProvider establece dónde verificar credenciales.",
    "options": [
      "Require all denied",
      "Require valid-user",
      "Options +Indexes",
      "AuthName valid-user"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-076",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué autoriza Require ip 192.168.1.0/24?",
    "solution": "Require ip permite condiciones de acceso basadas en la IP de cliente.",
    "options": [
      "Peticiones desde direcciones de esa red, sujeto al resto de controles.",
      "Únicamente peticiones POST con Base64.",
      "Solo al usuario llamado 192.168.1.0.",
      "Todo Internet sin limitación."
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-077",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿En qué caso debe usarse <LimitExcept GET POST> con Require all denied?",
    "solution": "LimitExcept aplica su bloque a todos los métodos que no se enumeran.",
    "options": [
      "Cuando se quiere denegar los métodos HTTP distintos de GET y POST.",
      "Cuando se pretende habilitar el índice de una carpeta.",
      "Cuando se necesita cifrar HTTPS.",
      "Cuando se quiere denegar únicamente GET y POST."
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-078",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona afirmaciones correctas sobre Basic Authentication.",
    "solution": "El origen de credenciales puede ser fichero, LDAP u otro proveedor sin cambiar el mecanismo HTTP Basic.",
    "options": [
      "El navegador envía Authorization en solicitudes posteriores.",
      "Base64 es un algoritmo moderno de cifrado equivalente a TLS.",
      "Require valid-user comprueba por sí mismo la contraseña sin un proveedor configurado.",
      "Las credenciales en Base64 necesitan HTTPS para confidencialidad.",
      "La respuesta de desafío puede incluir WWW-Authenticate."
    ],
    "correct": [
      0,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-079",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Relaciona correctamente autenticación y autorización.",
    "solution": "Verificar identidad y decidir permiso son procesos distintos.",
    "options": [
      "Require user ana: limitar el acceso a una identidad autenticada concreta.",
      "AuthName: establecer la IP del navegador.",
      "Autorización: decidir si tiene permiso para un recurso.",
      "Autenticación: comprobar quién es la persona.",
      "Require all denied: verificar una contraseña válida."
    ],
    "correct": [
      0,
      2,
      3
    ],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-080",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Diferencia AuthType Basic, AuthUserFile y Require valid-user en una configuración.",
    "solution": "AuthType Basic selecciona el mecanismo HTTP de autenticación; AuthUserFile indica el archivo de credenciales cuando se usa el proveedor file; Require valid-user permite acceder a cualquier identidad autenticada correctamente.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-081",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Compara Limit GET POST y LimitExcept GET POST.",
    "solution": "Limit aplica las reglas internas solo a GET y POST; LimitExcept las aplica a todos los métodos salvo GET y POST. No autentican por sí solos.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso"
  },
  {
    "id": "DEP-U2-082",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Una petición usa DELETE sobre este directorio. ¿La bloquea la configuración mostrada? ¿Y una petición GET?",
    "solution": "DELETE está denegado por Require all denied dentro de LimitExcept; GET queda fuera de esta restricción, aunque otras reglas y permisos pueden afectarlo.",
    "options": [],
    "correct": [],
    "code": "<Directory /var/www/html>\n    <LimitExcept GET POST>\n        Require all denied\n    </LimitExcept>\n</Directory>",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.11. Autenticación e control de acceso",
    "scenario": "Apache recibe ambas solicitudes y la configuración está habilitada.",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-083",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe un bloque Directory con HTTP Basic que use /etc/apache2/.htpasswd y permita entrar a cualquier usuario autenticado.",
    "solution": "<Directory /var/www/html/privado>\n    AuthType Basic\n    AuthName \"Zona privada\"\n    AuthBasicProvider file\n    AuthUserFile /etc/apache2/.htpasswd\n    Require valid-user\n</Directory>",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Incluir AuthType, AuthName, proveedor, ruta de fichero y Require valid-user.",
    "section": "2.11. Autenticación e control de acceso",
    "scenario": "La intranet necesita proteger /var/www/html/privado mediante credenciales almacenadas en un fichero fuera de DocumentRoot. HTTPS estará activado para proteger el envío.",
    "hints": [
      "La autenticación Basic usa un proveedor de credenciales.",
      "La autorización se expresa con Require."
    ],
    "codeTask": "write",
    "exampleInput": "Un usuario existente en .htpasswd solicita /privado/",
    "exampleOutput": "Apache responde 401 hasta recibir credenciales válidas; con ellas permite el acceso sujeto a permisos."
  },
  {
    "id": "DEP-U2-084",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Una academia quiere que solo un alumno concreto entre a su carpeta privada. Explica cómo combinar autenticación y autorización en Apache y por qué HTTPS es necesario.",
    "solution": "Configurar HTTP Basic con AuthType, AuthName, proveedor y fichero o LDAP. Luego Require user alumno1 para limitar al usuario autenticado. En HTTP Basic la cabecera Authorization lleva credenciales codificadas Base64; HTTPS protege su transporte.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Separar mecanismo de autenticación, fuente de usuarios, autorización del usuario y seguridad del transporte.",
    "section": "2.11. Autenticación e control de acceso",
    "scenario": "El directorio /var/www/html/alumnos/privado contiene notas de un alumno."
  },
  {
    "id": "DEP-U2-085",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué log de Apache registra solicitudes HTTP atendidas?",
    "solution": "El access log registra peticiones y respuestas; el error log guarda errores y avisos.",
    "options": [
      "Access log",
      "Certificado .crt",
      "Error log exclusivamente",
      "Archivo ports.conf"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros"
  },
  {
    "id": "DEP-U2-086",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "En un LogFormat combinado, ¿qué representa %>s?",
    "solution": "Por ejemplo, 200, 401 o 404.",
    "options": [
      "Nombre del archivo solicitado.",
      "Usuario de Linux que creó el certificado.",
      "IP de origen.",
      "Código de estado HTTP final de la respuesta."
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros"
  },
  {
    "id": "DEP-U2-087",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué campo del LogFormat guarda la petición HTTP completa (método, recurso y versión)?",
    "solution": "%r es la línea de petición; %u es usuario autenticado y %t fecha/hora.",
    "options": [
      "%r",
      "%O",
      "%t",
      "%u"
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros"
  },
  {
    "id": "DEP-U2-088",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué herramienta del temario genera informes estadísticos analizando logs de acceso?",
    "solution": "GoAccess analiza registros, mientras Grafana visualiza métricas de diversas fuentes.",
    "options": [
      "VirtualBox",
      "GoAccess",
      "OpenSSL",
      "PHP-FPM"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros"
  },
  {
    "id": "DEP-U2-089",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué MPM utiliza procesos independientes y un worker por proceso que atiende una petición a la vez?",
    "solution": "Prefork utiliza procesos; worker y event combinan procesos con hilos.",
    "options": [
      "event",
      "mod_proxy",
      "worker",
      "prefork"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.13. Módulo de monitorización: mod_status"
  },
  {
    "id": "DEP-U2-090",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué MPM reduce la ocupación de hilos por conexiones persistentes keep-alive frente a worker?",
    "solution": "El MPM event gestiona las conexiones keep-alive con mayor eficiencia.",
    "options": [
      "prefork",
      "mod_userdir",
      "event",
      "mod_deflate"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.13. Módulo de monitorización: mod_status"
  },
  {
    "id": "DEP-U2-091",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué significa Idle workers en mod_status?",
    "solution": "Busy workers atienden peticiones; idle workers están libres.",
    "options": [
      "Número de certificados expirados.",
      "Módulos Apache pendientes de instalar.",
      "Número de usuarios autenticados.",
      "Workers libres y disponibles para atender nuevas peticiones."
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.13. Módulo de monitorización: mod_status"
  },
  {
    "id": "DEP-U2-092",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona los campos correctamente interpretados de un LogFormat combined.",
    "solution": "La fuente muestra el formato combined y el significado de sus campos.",
    "options": [
      "%h indica IP o nombre del cliente.",
      "%u indica usuario autenticado cuando lo hay.",
      "%>s es siempre el tamaño de un archivo.",
      "%O indica la clave privada del certificado.",
      "%{User-Agent}i contiene información del agente cliente.",
      "%t indica fecha y hora."
    ],
    "correct": [
      0,
      1,
      4,
      5
    ],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros"
  },
  {
    "id": "DEP-U2-093",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona datos que se pueden consultar con mod_status según el temario.",
    "solution": "La página de mod_status muestra actividad y carga, no secretos del servidor.",
    "options": [
      "Idle workers",
      "Requests currently being processed",
      "Total accesses",
      "Contraseña de acceso al LDAP",
      "Clave privada RSA del servidor",
      "Estado individual de un worker"
    ],
    "correct": [
      0,
      1,
      2,
      5
    ],
    "code": "",
    "check": "",
    "section": "2.13. Módulo de monitorización: mod_status"
  },
  {
    "id": "DEP-U2-094",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Diferencia ErrorLog, CustomLog y LogFormat.",
    "solution": "ErrorLog indica dónde se guardan errores; CustomLog establece ruta/formato del registro de accesos; LogFormat define un patrón nombrado de campos para registrar solicitudes.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros"
  },
  {
    "id": "DEP-U2-095",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué significan en un log combinado %u, %>s y %O?",
    "solution": "%u es el usuario autenticado, si se conoce; %>s es el estado HTTP final; %O son los bytes enviados incluida la cabecera según el módulo de log utilizado.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros"
  },
  {
    "id": "DEP-U2-096",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica la diferencia entre Busy workers e Idle workers.",
    "solution": "Busy workers están atendiendo peticiones; Idle workers están libres y disponibles. En prefork suelen representar procesos independientes.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.13. Módulo de monitorización: mod_status"
  },
  {
    "id": "DEP-U2-097",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué configura MaxRequestWorkers y qué permite observar mod_status?",
    "solution": "MaxRequestWorkers limita la concurrencia atendida por los workers; mod_status permite observar workers ocupados, libres, solicitudes y actividad real del servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.13. Módulo de monitorización: mod_status"
  },
  {
    "id": "DEP-U2-098",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona cada campo LogFormat con su significado.",
    "solution": "%h → Dirección o nombre del cliente.; %r → Línea de petición HTTP.; %>s → Estado final HTTP.; %O → Bytes enviados incluido el encabezado.; %u → Usuario autenticado.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros",
    "pairs": [
      {
        "left": "%h",
        "right": "Dirección o nombre del cliente."
      },
      {
        "left": "%r",
        "right": "Línea de petición HTTP."
      },
      {
        "left": "%>s",
        "right": "Estado final HTTP."
      },
      {
        "left": "%O",
        "right": "Bytes enviados incluido el encabezado."
      },
      {
        "left": "%u",
        "right": "Usuario autenticado."
      }
    ]
  },
  {
    "id": "DEP-U2-099",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "match",
    "level": "medio",
    "origin": "temario",
    "prompt": "Relaciona los MPM con su gestión de workers.",
    "solution": "prefork → Procesos independientes, una petición por worker.; worker → Procesos con varios hilos de atención.; event → Gestión eficiente de keep-alive con procesos e hilos.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.13. Módulo de monitorización: mod_status",
    "pairs": [
      {
        "left": "prefork",
        "right": "Procesos independientes, una petición por worker."
      },
      {
        "left": "worker",
        "right": "Procesos con varios hilos de atención."
      },
      {
        "left": "event",
        "right": "Gestión eficiente de keep-alive con procesos e hilos."
      }
    ]
  },
  {
    "id": "DEP-U2-100",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Interpreta la línea de registro. Indica método, recurso, estado HTTP y agente de usuario si aparece.",
    "solution": "Método GET, recurso /privado/, HTTP/1.1, estado 401 Unauthorized, agente Firefox. El campo con alumno1 representa un usuario registrado en la línea, pero el registro por sí solo no demuestra un login correcto en esa petición.",
    "options": [],
    "correct": [],
    "code": "192.168.1.20 - alumno1 [24/Nov/2026:17:00:00 +0100] \"GET /privado/ HTTP/1.1\" 401 612 \"-\" \"Firefox\"",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.12. Xestión de rexistros",
    "scenario": "Ejemplo ilustrativo del formato combined.",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-101",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Observa la imagen de mod_status. Explica qué significan las columnas Client, VHost y Request y qué permite deducir el estado de los workers.",
    "solution": "Client es la IP del solicitante; VHost identifica el sitio virtual atendido; Request indica método y recurso. Los indicadores Busy/Idle y los símbolos del scoreboard permiten observar carga y disponibilidad, no la identidad real de cada persona.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.13. Módulo de monitorización: mod_status",
    "scenario": "Captura del panel server-status mostrada en el temario.",
    "image": "despregamento-mod-status.png",
    "imageCaption": "Captura de Apache mod_status (server-status)"
  },
  {
    "id": "DEP-U2-102",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Un sitio Apache responde lentamente bajo carga. Explica cómo usarías mod_status, MaxRequestWorkers y el MPM para analizar el problema.",
    "solution": "Comprobaría total accesses, peticiones en proceso, busy/idle workers y scoreboard. Revisaría MaxRequestWorkers y los límites del MPM empleado (prefork usa procesos, worker/event procesos e hilos). Relacionaría consumo de memoria, concurrencia y KeepAliveTimeout antes de aumentar límites.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Citar mod_status, workers, diferencia de MPM y riesgo de aumentar concurrencia sin memoria suficiente.",
    "section": "2.13. Módulo de monitorización: mod_status",
    "scenario": "El monitor muestra continuamente un número muy alto de Busy workers y casi ninguno Idle."
  },
  {
    "id": "DEP-U2-103",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué directiva de Apache impide que los archivos .htaccess modifiquen la configuración de un directorio?",
    "solution": "AllowOverride None evita sobreescrituras mediante .htaccess en ese contexto.",
    "options": [
      "Options +Indexes",
      "DirectoryIndex none",
      "AllowOverride None",
      "CustomLog None"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-104",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué directiva fija el máximo de peticiones que Apache puede atender simultáneamente mediante sus workers?",
    "solution": "Un valor alto puede consumir demasiada memoria; uno bajo puede limitar la capacidad.",
    "options": [
      "KeepAlive",
      "DirectoryIndex",
      "MaxFileUploads",
      "MaxRequestWorkers"
    ],
    "correct": [
      3
    ],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-105",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué cabecera informa al cliente de que una respuesta usa compresión gzip?",
    "solution": "El navegador puede anunciar formatos aceptados mediante Accept-Encoding y el servidor usa Content-Encoding.",
    "options": [
      "Referer",
      "Content-Encoding",
      "WWW-Authenticate",
      "Host"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-106",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué directiva limita el tamaño del cuerpo de una petición HTTP en Apache?",
    "solution": "LimitRequestBody se expresa en bytes; en el temario 1048576 equivale a 1 MiB.",
    "options": [
      "MaxRequestWorkers",
      "upload_max_filesize",
      "LimitRequestBody",
      "Content-Length de forma global"
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-107",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué módulo de Apache ofrece mecanismos de compresión gzip del contenido de respuesta?",
    "solution": "mod_deflate puede aplicar compresión a recursos como HTML, CSS y JSON.",
    "options": [
      "mod_status",
      "mod_deflate",
      "mod_userdir",
      "mod_authnz_ldap"
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-108",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Marca acciones de seguridad y optimización recomendadas en el temario.",
    "solution": "Se recomienda defensa por capas y control de recursos.",
    "options": [
      "Abrir todos los puertos de firewall para evitar errores.",
      "Desactivar HTTPS para que las contraseñas se envíen más deprisa.",
      "Mantener registros y monitorización.",
      "Controlar AllowOverride cuando no se usan .htaccess.",
      "Deshabilitar módulos que no se necesitan.",
      "Actualizar Apache y sus módulos."
    ],
    "correct": [
      2,
      3,
      4,
      5
    ],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-109",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona afirmaciones correctas sobre KeepAlive y compresión.",
    "solution": "La compresión y las conexiones persistentes reducen costes de transferencia, pero requieren ajuste.",
    "options": [
      "KeepAliveTimeout cifra los datos de HTTP.",
      "PNG y JPEG siempre deben comprimirse otra vez con gzip para ahorrar más.",
      "Gzip suele ser especialmente útil para recursos de texto.",
      "KeepAliveTimeout define el tiempo de espera de la siguiente petición.",
      "KeepAlive permite reutilizar conexiones TCP."
    ],
    "correct": [
      2,
      3,
      4
    ],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-110",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Por qué no conviene activar módulos innecesarios en Apache?",
    "solution": "Porque pueden consumir recursos y ampliar la superficie de ataque; conviene cargar los necesarios para cada sitio.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-111",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué diferencia existe entre mod_expires, mod_headers y mod_cache?",
    "solution": "mod_expires configura caducidad de recursos; mod_headers modifica cabeceras HTTP; mod_cache proporciona mecanismos de caché en el servidor.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-112",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Explica el riesgo de un MaxRequestWorkers demasiado bajo o demasiado alto.",
    "solution": "Demasiado bajo deja peticiones esperando sin capacidad; demasiado alto puede agotar RAM o degradar el rendimiento, según MPM y consumo de cada worker.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.14. Directivas de seguridade e optimización"
  },
  {
    "id": "DEP-U2-113",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué límite impone esta directiva al cuerpo de la petición y en qué unidad está escrito?",
    "solution": "Establece un límite de 1 MiB, es decir, 1.048.576 bytes, para el cuerpo de las peticiones en ese contexto.",
    "options": [],
    "correct": [],
    "code": "<Directory /var/www/html>\n    LimitRequestBody 1048576\n</Directory>",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.14. Directivas de seguridade e optimización",
    "scenario": "Una web permite subir archivos y el administrador desea un límite en Apache.",
    "codeTask": "interpret",
    "expectedOutput": "Límite de 1 MiB en el cuerpo de la petición."
  },
  {
    "id": "DEP-U2-114",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "¿Qué efecto tienen estas dos directivas cuando se sirven recursos de una página?",
    "solution": "Permiten reutilizar una conexión TCP y establecen un tiempo de espera de hasta 5 segundos para la siguiente solicitud en una conexión persistente, sujeto a la configuración y protocolo.",
    "options": [],
    "correct": [],
    "code": "KeepAlive On\nKeepAliveTimeout 5",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.14. Directivas de seguridade e optimización",
    "scenario": "Un sitio sirve HTML y varios recursos relacionados.",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-115",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe un bloque Directory que prohíba .htaccess y autorice el acceso público a /var/www/html.",
    "solution": "<Directory /var/www/html>\n    AllowOverride None\n    Require all granted\n</Directory>",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Incluir AllowOverride None y Require all granted.",
    "section": "2.14. Directivas de seguridade e optimización",
    "scenario": "La aplicación no utiliza .htaccess y la configuración central del sitio ya gestiona todas las opciones.",
    "hints": [
      "AllowOverride controla las sobrescrituras locales, no el permiso de acceso."
    ],
    "codeTask": "write",
    "exampleInput": "Ruta física /var/www/html",
    "exampleOutput": "Los .htaccess no pueden modificar esa configuración y Apache permite el acceso al directorio sujeto a permisos."
  },
  {
    "id": "DEP-U2-116",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Configura Apache para activar KeepAlive y establecer un tiempo de espera de cinco segundos.",
    "solution": "KeepAlive On\nKeepAliveTimeout 5",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Usar KeepAlive y KeepAliveTimeout con 5.",
    "section": "2.14. Directivas de seguridade e optimización",
    "scenario": "Un sitio sirve HTML, CSS y varias imágenes; se quiere permitir reutilizar conexiones con una espera moderada.",
    "hints": [
      "Una directiva habilita la función; otra establece el tiempo."
    ],
    "codeTask": "write",
    "exampleInput": "Conexiones HTTP persistentes del cliente",
    "exampleOutput": "Se intenta reutilizar la conexión antes de cerrarla tras un tiempo de espera de 5 segundos."
  },
  {
    "id": "DEP-U2-117",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "En AuthLDAPURL, ¿qué identifica el puerto 389 en ldap://127.0.0.1:389?",
    "solution": "El puerto habitual de LDAPS (TLS implícito) es 636.",
    "options": [
      "Puerto HTTPS.",
      "Puerto habitual de LDAP sin TLS implícito.",
      "Puerto de Apache mod_status.",
      "Puerto estándar de SSH."
    ],
    "correct": [
      1
    ],
    "code": "",
    "check": "",
    "section": "2.15. Configuración do LDAP"
  },
  {
    "id": "DEP-U2-118",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué representa ou=usuarios,dc=empresa,dc=test en AuthLDAPURL?",
    "solution": "ou indica unidad organizativa y dc componentes de dominio.",
    "options": [
      "Directiva de carga de mod_ssl.",
      "URL del formulario HTML.",
      "Base de búsqueda en el árbol de directorio LDAP.",
      "Nombre del archivo de usuarios .htpasswd."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.15. Configuración do LDAP"
  },
  {
    "id": "DEP-U2-119",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué representa ?uid?sub? en la URL LDAP del temario?",
    "solution": "uid indica atributo y sub alcance de búsqueda LDAP.",
    "options": [
      "Atributo para identificar al usuario y búsqueda desde la base por todos los subniveles.",
      "Solo un filtro de archivos HTTP.",
      "La IP del navegador y su sistema operativo.",
      "Contraseña y nombre del certificado."
    ],
    "correct": [
      0
    ],
    "code": "",
    "check": "",
    "section": "2.15. Configuración do LDAP"
  },
  {
    "id": "DEP-U2-120",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "single",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Qué función tiene AuthLDAPBindDN?",
    "solution": "La cuenta de consulta se diferencia del usuario final; AuthLDAPBindPassword contiene su credencial.",
    "options": [
      "Reescribir todas las URL del sitio.",
      "Determinar el usuario que se está autenticando en el navegador.",
      "Indicar la identidad de la cuenta con la que Apache consulta el directorio LDAP.",
      "Establecer el puerto TCP de Apache a 80."
    ],
    "correct": [
      2
    ],
    "code": "",
    "check": "",
    "section": "2.15. Configuración do LDAP"
  },
  {
    "id": "DEP-U2-121",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "multi",
    "level": "alto",
    "origin": "temario",
    "prompt": "Selecciona interpretaciones correctas de la configuración LDAP del temario.",
    "solution": "La URL LDAP combina host, base de búsqueda, atributo, alcance y filtro.",
    "options": [
      "sub permite buscar en la base y subniveles.",
      "AuthLDAPBindDN indica necesariamente el nombre del visitante que escribe el formulario.",
      "uid es el atributo usado para buscar al usuario.",
      "ou=usuarios indica el puerto usado por LDAP.",
      "(objectClass=inetOrgPerson) filtra entradas de usuario."
    ],
    "correct": [
      0,
      2,
      4
    ],
    "code": "",
    "check": "",
    "section": "2.15. Configuración do LDAP"
  },
  {
    "id": "DEP-U2-122",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "Define DN, OU y DC dentro de un directorio LDAP.",
    "solution": "DN es el nombre distinguido completo de una entrada; OU indica unidad organizativa; DC indica componentes de dominio.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.15. Configuración do LDAP"
  },
  {
    "id": "DEP-U2-123",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "short",
    "level": "medio",
    "origin": "temario",
    "prompt": "¿Por qué la cuenta de consulta LDAP de Apache no es lo mismo que el usuario que inicia sesión?",
    "solution": "Apache usa una cuenta de servicio (BindDN) para buscar entradas; la persona que se autentica proporciona otra identidad y contraseña que deben verificarse mediante el directorio.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.15. Configuración do LDAP"
  },
  {
    "id": "DEP-U2-124",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Explica cada parte de la siguiente configuración de búsqueda LDAP, sin inventar ninguna contraseña.",
    "solution": "El servidor LDAP es localhost puerto 389; la base es ou=usuarios,dc=empresa,dc=test; busca por uid en todos los subniveles y solo entradas inetOrgPerson. Se necesitan otras directivas para indicar credenciales de consulta y política de autorización.",
    "options": [],
    "correct": [],
    "code": "AuthLDAPURL \"ldap://127.0.0.1:389/ou=usuarios,dc=empresa,dc=test?uid?sub?(objectClass=inetOrgPerson)\"",
    "check": "Identificar el comportamiento y justificar qué directiva o línea lo provoca.",
    "section": "2.15. Configuración do LDAP",
    "scenario": "Apache y LDAP se ejecutan en el mismo contenedor. No se pide iniciar sesión con ninguna cuenta real.",
    "codeTask": "interpret"
  },
  {
    "id": "DEP-U2-125",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "code",
    "level": "alto",
    "origin": "temario",
    "prompt": "Escribe AuthLDAPURL para buscar usuarios por uid, con ámbito sub y filtro inetOrgPerson en un LDAP local cuya base sea ou=usuarios,dc=empresa,dc=test.",
    "solution": "AuthLDAPURL \"ldap://127.0.0.1:389/ou=usuarios,dc=empresa,dc=test?uid?sub?(objectClass=inetOrgPerson)\"",
    "options": [],
    "correct": [],
    "code": "",
    "check": "La sintaxis debe incluir host, puerto, base, atributo, alcance y filtro.",
    "section": "2.15. Configuración do LDAP",
    "scenario": "Apache se conecta a un directorio LDAP local mediante una cuenta de servicio ya configurada. No escribas ninguna contraseña en la respuesta.",
    "hints": [
      "La URL LDAP usa signos ? para separar atributos de búsqueda.",
      "sub indica que se recorren subniveles."
    ],
    "codeTask": "write",
    "exampleInput": "Servidor 127.0.0.1:389; base ou=usuarios,dc=empresa,dc=test",
    "exampleOutput": "Apache dispone de una URL de búsqueda de usuarios por uid en todos los subniveles."
  },
  {
    "id": "DEP-U2-126",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "develop",
    "level": "alto",
    "origin": "temario",
    "prompt": "Compara autenticación Basic de Apache contra un fichero .htpasswd y contra LDAP. Identifica lo que no cambia y lo que cambia.",
    "solution": "En ambos casos el mecanismo HTTP Basic envía un desafío 401 y el cliente responde con Authorization: Basic, por lo que se necesita HTTPS. Cambia el proveedor de verificación: mod_authn_file con AuthUserFile frente a mod_authnz_ldap con AuthLDAPURL y credenciales de consulta BindDN/BindPassword. Require define a quién se permite entrar.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "Mecanismo HTTP, proveedores, directivas clave, necesidad de HTTPS y separación de autenticación/autorización.",
    "section": "2.15. Configuración do LDAP",
    "scenario": "Una intranet migra usuarios locales de .htpasswd a un directorio corporativo LDAP."
  },
  {
    "id": "DEP-U2-127",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "order",
    "level": "medio",
    "origin": "temario",
    "prompt": "Ordena el recorrido de una autenticación HTTP Basic con Apache y un archivo de usuarios.",
    "solution": "El cliente solicita un recurso protegido. → Apache responde 401 con WWW-Authenticate. → El navegador pide credenciales y envía Authorization: Basic. → Apache verifica las credenciales con el proveedor configurado. → Apache autoriza o deniega la solicitud según Require.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.11. Autenticación e control de acceso",
    "sequence": [
      "El cliente solicita un recurso protegido.",
      "Apache responde 401 con WWW-Authenticate.",
      "El navegador pide credenciales y envía Authorization: Basic.",
      "Apache verifica las credenciales con el proveedor configurado.",
      "Apache autoriza o deniega la solicitud según Require."
    ]
  },
  {
    "id": "DEP-U2-128",
    "subjectId": "despregamento",
    "unit": 2,
    "kind": "order",
    "level": "medio",
    "origin": "temario",
    "prompt": "Ordena el ciclo de diagnóstico al cambiar un VirtualHost que falla.",
    "solution": "Identificar el síntoma y la ruta solicitada. → Revisar la configuración del sitio y sus registros de error/acceso. → Comprobar sintaxis con apache2ctl configtest. → Recargar Apache si la sintaxis es correcta. → Repetir la petición y observar logs/estado HTTP.",
    "options": [],
    "correct": [],
    "code": "",
    "check": "",
    "section": "2.12. Xestión de rexistros",
    "sequence": [
      "Identificar el síntoma y la ruta solicitada.",
      "Revisar la configuración del sitio y sus registros de error/acceso.",
      "Comprobar sintaxis con apache2ctl configtest.",
      "Recargar Apache si la sintaxis es correcta.",
      "Repetir la petición y observar logs/estado HTTP."
    ]
  }
];
