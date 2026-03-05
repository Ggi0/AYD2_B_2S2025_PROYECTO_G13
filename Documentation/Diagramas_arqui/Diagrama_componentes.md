# Descripción de Componentes

## Capa de Presentación (Frontend)

Toda la interacción con el sistema se realiza a través de **aplicaciones web accesibles desde navegador**, eliminando la necesidad de aplicaciones móviles o dispositivos dedicados.

### Portal Web Cliente

Interfaz web dirigida a los clientes corporativos que utilizan los servicios de transporte de la empresa.

**Módulo Autenticación Cliente**
Gestiona el acceso de clientes externos al sistema mediante autenticación segura. Permite iniciar sesión, cerrar sesión y recuperar contraseñas en caso de pérdida de credenciales.

**Módulo Gestión de Órdenes Cliente**
Permite a los clientes crear solicitudes de transporte y consultar el estado de sus órdenes activas o históricas. Este módulo sustituye los procesos manuales basados en correo electrónico o llamadas telefónicas.

**Módulo Seguimiento de Envíos**
Proporciona visibilidad del estado actual de cada orden de transporte, permitiendo a los clientes conocer el progreso de sus envíos dentro del sistema.

**Módulo Documentos y Facturas**
Permite a los clientes acceder a su expediente digital, donde pueden consultar y descargar facturas electrónicas certificadas y documentos relacionados con cada servicio.

---

### Panel Interno (Backoffice)

Aplicación web utilizada por el personal interno de la organización para gestionar las operaciones del negocio.

**Módulo Autenticación Interna**
Gestiona el acceso al sistema para los usuarios internos, aplicando control de acceso basado en roles (RBAC) para diferenciar permisos entre agentes operativos, contabilidad, supervisores y gerencia.

**Módulo Gestión de Clientes**
Permite registrar, consultar y actualizar la información de clientes corporativos, incluyendo datos fiscales, contactos principales y clasificación comercial.

**Módulo Contratos y Tarifas**
Gestiona los contratos comerciales con los clientes, así como el tarifario asociado a rutas, pesos de carga y tipos de vehículo.

**Módulo Operaciones y Despacho**
Permite gestionar la planificación de servicios de transporte, la asignación de recursos y el control del proceso operativo de despacho.

**Módulo Facturación Electrónica**
Proporciona la interfaz para revisar, validar y emitir facturas electrónicas certificadas conforme a la normativa fiscal.

**Módulo Gestión de Pagos**
Permite registrar pagos recibidos por parte de los clientes y asociarlos con las facturas correspondientes.

**Módulo Reportes y Dashboard**
Ofrece visualizaciones de indicadores clave de desempeño (KPIs), reportes operativos y métricas financieras relevantes para la toma de decisiones gerenciales.

---

## Capa de API Gateway

**API Gateway / Orquestador**
Actúa como punto único de entrada para todas las solicitudes provenientes de las aplicaciones web. Centraliza el enrutamiento hacia los diferentes servicios de negocio, desacoplando el frontend del backend.

**Módulo Autenticación JWT**
Gestiona la validación de tokens de autenticación en cada petición, garantizando que únicamente usuarios autorizados puedan acceder a los servicios del sistema.

---

## Capa de Servicios de Negocio

### Servicio de Identidad y Seguridad

**Componente Registro y Login**
Gestiona el proceso de autenticación de usuarios, tanto internos como externos.

**Componente Gestión de Credenciales**
Administra el almacenamiento seguro de contraseñas mediante mecanismos de hash y controla el ciclo de vida de las credenciales.

**Componente Recuperación de Contraseña**
Permite restablecer el acceso al sistema mediante flujos seguros de recuperación de credenciales.

---

### Servicio de Clientes

**Componente Registro de Cliente**
Captura y mantiene la información fiscal y operativa de cada cliente.

**Componente Perfilamiento y Riesgo**
Permite clasificar a los clientes según criterios de riesgo operativo o financiero.

**Componente Historial y Desempeño**
Mantiene el registro histórico de operaciones realizadas por cada cliente y su comportamiento de pago.

---

### Servicio de Contratos y Tarifas

**Componente Generación de Contrato**
Formaliza contratos digitales que definen condiciones comerciales, rutas autorizadas y límites de crédito.

**Componente Gestión de Tarifario**
Administra las tarifas aplicables según peso, distancia y tipo de vehículo.

**Componente Validación Vigencia y Crédito**
Verifica si un cliente tiene contrato vigente y capacidad de crédito antes de aceptar nuevas órdenes.

**Componente Vinculación Contrato-Orden**
Asocia automáticamente cada nueva orden con el contrato y la tarifa correspondiente.

---

### Servicio de Órdenes de Servicio

**Componente Creación de Orden**
Registra solicitudes de transporte especificando origen, destino, tipo de carga y características del servicio.

**Componente Asignación de Recursos**
Gestiona la asignación de unidades de transporte y personal operativo.

**Componente Proceso de Carga y Validación Operativa**
Verifica los parámetros operativos de la orden antes de su ejecución.

**Componente Gestión de Estados de Orden**
Administra el ciclo de vida de cada orden desde su creación hasta su cierre.

**Componente Confirmación de Entrega**
Registra la confirmación de entrega del servicio y habilita la generación de la factura correspondiente.

**Componente Cierre y KPIs de Orden**
Consolida la información final de la orden para análisis operativo y generación de indicadores.

---

### Servicio de Facturación Electrónica

**Componente Generación de Borrador**
Genera automáticamente el borrador de factura basado en la información de la orden completada.

**Componente Validación Fiscal**
Verifica que la factura cumpla con las reglas fiscales requeridas para su certificación.

**Componente Certificación de Factura**
Envía el documento al certificador externo para obtener la autorización oficial.

**Componente Emisión y Notificación**
Distribuye la factura certificada al cliente y la almacena en su expediente digital.

**Componente Sincronización Contable**
Actualiza el estado financiero del cliente dentro del sistema.

---

### Servicio de Pagos

**Componente Registro de Pago**
Permite registrar pagos recibidos por diferentes medios.

**Componente Validación de Monto y Forma**
Verifica la correspondencia entre pagos registrados y facturas emitidas.

**Componente Gestión Bancaria**
Registra información bancaria relevante para pagos por transferencia o cheque.

**Componente Actualización de Cuenta Cliente**
Actualiza el saldo pendiente del cliente y su capacidad de crédito.

---

### Servicio de Reportes y Analítica

**Componente Consolidación de Operaciones**
Agrupa la información operativa diaria para análisis posterior.

**Componente Medición de KPIs**
Calcula indicadores clave relacionados con tiempos de entrega, volumen de operaciones y eficiencia operativa.

**Componente Análisis de Rentabilidad**
Evalúa la rentabilidad por cliente, contrato y tipo de servicio.

**Componente Motor de Alertas**
Detecta anomalías o desviaciones relevantes en la operación.

**Componente Planificación de Capacidad**
Proporciona información histórica para apoyar la planificación estratégica del negocio.

---

## Capa de Datos e Infraestructura

**Base de Datos Relacional (PostgreSQL)**
El sistema utiliza una única base de datos relacional PostgreSQL como repositorio central de información. En esta base se almacenan todos los datos estructurados del sistema, incluyendo clientes, contratos, tarifas, órdenes de servicio, facturas y pagos.

PostgreSQL se selecciona por su robustez, soporte para transacciones ACID y compatibilidad con servicios de base de datos gestionados en la nube.

**Módulo de Cifrado de Datos Sensibles**
Implementa mecanismos de protección para credenciales de usuarios y datos sensibles del sistema, garantizando la confidencialidad de la información crítica del negocio.

![alt text](img/diagrama_componetes.jpg)
