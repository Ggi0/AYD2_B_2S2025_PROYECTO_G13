
# Preparación para el Salto a la Nube

Aunque el despliegue inicial pueda ejecutarse en infraestructura propia (on-premise), la arquitectura del sistema se diseña desde el inicio bajo el principio **cloud-ready**. Esto significa que todas las decisiones tecnológicas y estructurales se toman considerando una futura migración hacia proveedores de nube pública como AWS, Google Cloud o Azure, sin necesidad de rediseñar el sistema ni reescribir componentes críticos.

El objetivo de esta estrategia es evitar una dependencia permanente de servidores físicos locales y garantizar que el sistema pueda escalar o trasladarse a la nube cuando el crecimiento del negocio o las necesidades operativas lo requieran.

Para lograrlo, el diseño incorpora los siguientes principios arquitectónicos:

**1. Arquitectura desacoplada por capas**
El sistema se organiza en capas claramente separadas: presentación, API gateway, servicios de negocio y capa de datos. Esta separación permite migrar cada capa de forma independiente a la nube, manteniendo la interoperabilidad entre componentes.

**2. Backend stateless**
Los servicios de negocio están diseñados para ser sin estado (stateless). Esto permite que múltiples instancias del backend puedan ejecutarse simultáneamente detrás de un balanceador de carga en la nube sin requerir sincronización de sesión entre servidores.

**3. Uso de tecnologías compatibles con servicios gestionados en la nube**
Las tecnologías seleccionadas (Node.js, React y PostgreSQL) cuentan con soporte directo en los principales proveedores cloud. Esto permite migrar a servicios administrados como contenedores, plataformas serverless o bases de datos gestionadas sin modificar la lógica del sistema.

**4. Separación entre aplicación y almacenamiento de datos**
La base de datos PostgreSQL se mantiene como un servicio independiente del servidor de aplicaciones. Esto permite que, en una migración futura, la base de datos pueda trasladarse a un servicio gestionado de base de datos sin afectar el funcionamiento del backend.

**5. Despliegue basado en contenedores (preparado para futuro)**
Aunque inicialmente el sistema puede ejecutarse en servidores locales, la estructura del proyecto y la configuración del entorno están pensadas para poder empaquetarse en contenedores. Esto facilita una futura migración hacia plataformas de orquestación como Kubernetes o servicios equivalentes en la nube.

**6. Configuración mediante variables de entorno**
Todos los parámetros sensibles del sistema (conexión a base de datos, claves de API, endpoints externos) se gestionan mediante variables de entorno. Esto permite cambiar fácilmente los servicios subyacentes al migrar a la nube sin modificar el código fuente.

Con este enfoque, la arquitectura cumple con el requisito estratégico de la organización: **garantizar que el sistema pueda evolucionar hacia un entorno cloud sin generar dependencia tecnológica de la infraestructura local**.

---


## Justificación de Decisiones Arquitectónicas

### 1. Arquitectura Web Centralizada

Se decidió que todo el sistema funcione exclusivamente a través de aplicaciones web accesibles desde navegador. Esta decisión elimina la necesidad de desarrollar y mantener aplicaciones móviles o software instalado en dispositivos específicos. El enfoque web permite que cualquier usuario —interno o externo— pueda acceder al sistema desde diferentes equipos sin requerir instalación de software adicional. Además, facilita el mantenimiento del sistema, ya que todas las actualizaciones se realizan en el servidor y se reflejan inmediatamente para todos los usuarios.

---

### 2. Uso de React para el Frontend

El frontend del sistema se implementa utilizando React para construir una aplicación web de tipo SPA (Single Page Application). Este enfoque permite una experiencia de usuario más fluida, reduciendo recargas completas de página y mejorando la interacción con el sistema. React también facilita la organización del código mediante componentes reutilizables, lo que mejora la mantenibilidad del sistema a largo plazo. Otra ventaja es su amplia adopción en la industria, lo que garantiza disponibilidad de herramientas, soporte comunitario y facilidad para incorporar nuevos desarrolladores al proyecto.

---

### 3. Node.js como Plataforma Backend

Se eligió Node.js como entorno de ejecución para el backend debido a su eficiencia en el manejo de múltiples solicitudes concurrentes y su modelo de entrada/salida no bloqueante. Estas características lo hacen adecuado para sistemas web que deben atender múltiples usuarios simultáneamente. Adicionalmente, utilizar JavaScript tanto en frontend como en backend permite mantener coherencia tecnológica en el proyecto, simplificando el desarrollo y reduciendo la complejidad del stack tecnológico.

---

### 4. Arquitectura Basada en Servicios

La lógica del sistema se organiza en servicios de negocio separados (identidad, clientes, contratos, órdenes, facturación, pagos y reportes). Esta separación permite mantener responsabilidades claras dentro del sistema, facilitando el mantenimiento y la evolución de la plataforma. Cada servicio se encarga de un dominio específico del negocio, lo que permite modificar o extender funcionalidades sin afectar otras partes del sistema. Esta estructura también prepara el sistema para una posible evolución hacia microservicios en el futuro si el crecimiento del negocio lo requiere.

---

### 5. API Gateway como Punto Único de Entrada

La arquitectura incorpora un API Gateway que actúa como punto único de acceso a los servicios del backend. Esta capa centraliza la autenticación, el control de acceso y el enrutamiento de solicitudes hacia los diferentes servicios de negocio. Al concentrar estas responsabilidades en un solo componente, se simplifica la seguridad del sistema y se evita que los servicios internos estén expuestos directamente a los clientes. Además, este enfoque facilita futuras integraciones con otros sistemas externos o con nuevas interfaces de usuario.

---

### 6. Autenticación Basada en JWT

Se utiliza autenticación basada en tokens JWT (JSON Web Tokens) para gestionar las sesiones de usuario. Este mecanismo permite mantener una arquitectura sin estado en el servidor, ya que la información de autenticación se encuentra dentro del propio token. Como resultado, el sistema puede escalar horizontalmente en el futuro sin necesidad de sincronizar sesiones entre servidores. Esta característica es especialmente importante considerando el objetivo de preparar la plataforma para una posible migración a la nube.

---

### 7. PostgreSQL como Base de Datos Principal

El sistema utiliza PostgreSQL como base de datos relacional principal para almacenar toda la información estructurada. Este motor fue seleccionado por su estabilidad, robustez y soporte para transacciones ACID, lo cual es fundamental para procesos financieros como facturación y gestión de pagos. PostgreSQL también permite definir relaciones y restricciones entre tablas, garantizando la integridad de los datos dentro del sistema. Además, es una solución open source ampliamente utilizada y compatible con servicios de bases de datos gestionadas en entornos de nube.

---

### 8. Separación entre Lógica de Negocio y Persistencia de Datos

La arquitectura separa claramente la lógica de negocio de la capa de acceso a datos. Esta decisión permite modificar o migrar la infraestructura de almacenamiento sin afectar el funcionamiento del resto del sistema. Por ejemplo, si en el futuro se decide migrar la base de datos a un servicio gestionado en la nube, el impacto en la aplicación será mínimo, ya que los servicios interactúan con la base de datos a través de interfaces bien definidas.

---

### 9. Seguridad y Protección de Datos Sensibles

Se implementan mecanismos de protección para datos sensibles, especialmente en el manejo de credenciales de usuario y en la información financiera del sistema. Las contraseñas se almacenan utilizando algoritmos de hash seguros, evitando el almacenamiento de credenciales en texto plano. Además, el acceso a los servicios del sistema se controla mediante autenticación y autorización basada en roles, garantizando que cada usuario solo pueda acceder a las funciones permitidas según su perfil.

---

### 10. Diseño Preparado para Migración a la Nube

Todas las decisiones tecnológicas del sistema se toman considerando una futura migración hacia infraestructura en la nube. El uso de servicios desacoplados, backend sin estado, configuración mediante variables de entorno y tecnologías ampliamente soportadas permite trasladar el sistema a plataformas cloud sin necesidad de rediseñar la arquitectura. De esta manera, la organización evita quedar dependiente de infraestructura física y mantiene la flexibilidad necesaria para escalar o migrar el sistema cuando el crecimiento del negocio lo requiera.

![alt text](img/diagrama_despliegue.jpg)
