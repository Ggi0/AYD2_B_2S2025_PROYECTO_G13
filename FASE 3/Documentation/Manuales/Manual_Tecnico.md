# Manual Tecnico - LogiTrans Guatemala, S.A.
## GRUPO 13
- Giovanni Saul Concohá Cax 202100229
- Estiben Yair Lopez Leveron 202204578
- Evelio Marcos Josué Cruz Soliz 202010040
- Johan Moises Cardona Rosales 202201405
- Gonzalo Fernando Pérez Cazún 202211515
- Jens Jeremy Pablo Sosof 202102771

-----

## Introduccion
Este manual tecnico consolida el estado del proyecto LogiTrans a traves de FASE 1, FASE 2 y FASE 3. Su objetivo es documentar la implementacion real del sistema, su arquitectura, componentes, flujo tecnico y practicas de desarrollo para facilitar mantenimiento, evolucion y despliegue.

Figura 1. Vista general del sistema (dashboard o pantalla principal)
![Figura 1 - Vista general](./img/manuales/figura-01-vista-general.png)

## Alcance De Proyecto
El alcance tecnico cubre:
- Gestion de clientes, contratos y tarifarios
- Registro y seguimiento de ordenes de servicio
- Facturacion FEL simulada, pagos y cuentas por cobrar
- Notificaciones por correo y eventos en tiempo real
- Reporteria gerencial y dashboards
- Despliegue en contenedores (frontend y backend)
- Integraciones productivas con SAT/aduanas/bancos (se mantienen simulaciones)
- Pipeline CI/CD implementado en repositorio

## Funcionalidades
- Registro y autenticacion de usuarios por rol
- Validaciones de contrato, credito y rutas autorizadas
- Gestion operativa de ordenes (creacion, seguimiento, entrega)
- Gestion financiera (facturas, pagos, cobros)
- Dashboard gerencial de KPIs y alertas
- Notificaciones via correo y consulta de notificaciones en API

## Tecnologias Utilizadas
### Frontend
- React 19 + TypeScript
- Vite 8
- React 
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js + Express
- Socket.IO
- mssql (conector SQL Server)
- JWT (jsonwebtoken)
- Nodemailer
- Multer

### Base de Datos
- SQL Server

### Control de versiones
- Git
- Estrategia de ramas tipo Gitflow 

## Estructura del Proyecto
Raiz del repositorio:
- FASE 1: analisis, arquitectura, casos de uso y diseno
- FASE 2: implementacion funcional inicial de backend/frontend/database
- FASE 3: consolidacion tecnica, dockerizacion, pruebas y documentacion

## Flujo Tecnico General del Sistema
1. El usuario accede al frontend (React).
2. El frontend autentica contra backend y recibe JWT.
3. El frontend consume endpoints REST bajo /api.
4. El backend aplica middlewares de autenticacion/autorizacion y reglas de negocio.
5. Los servicios del backend consultan/actualizan SQL Server.
6. En eventos operativos se emiten actualizaciones por Socket.IO.
7. Para alertas y avisos se dispara el sistema de notificaciones por correo.

Figura 2. Flujo tecnico de una orden (inicio a entrega)
![Figura 2 - Flujo tecnico](./img/manuales/figura-02-flujo-tecnico.png)

## Backend - Diseno Tecnico
Arquitectura por capas dentro de src:
- routes: define endpoints por dominio
- controllers: orquesta request/response
- services: implementa logica de negocio
- models: acceso a datos
- middlewares: auth, validaciones y control de acceso
- utils/config: JWT, DB, correo, helpers

Dominios implementados en rutas:
- auth
- usuarios
- contratos
- orden
- facturacion
- tarifario
- gerencial
- notificaciones

Figura 3. Estructura del backend o evidencia de endpoints
![Figura 3 - Backend tecnico](./img/manuales/figura-03-backend-tecnico.png)

## Frontend - Diseno Tecnico
El frontend organiza vistas por rol/area de negocio en src/pages y protege rutas con ProtectedRoute + contexto de autenticacion.

Figura 4. Navegacion frontend por roles
![Figura 4 - Frontend tecnico](./img/manuales/figura-04-frontend-tecnico.png)

### Listas Implementadas
Listas principales implementadas en UI:
- Lista de contratos (logistico)
- Lista de clientes (logistico)
- Lista de ordenes del cliente
- Lista de facturas del cliente
- Lista de pagos/cobros (finanzas)
- Bitacora y vistas de ordenes para piloto/operativo

Figura 5. Ejemplo de listas implementadas
![Figura 5 - Listas implementadas](./img/manuales/figura-05-listas.png)

## Gitflow
Modelo recomendado de ramas:
- main: rama estable de produccion
- develop: rama de integracion
- feature/<nombre>: nuevas funcionalidades
- release/<version>: estabilizacion previa a salida
- hotfix/<nombre>: correcciones urgentes en produccion

Reglas base:
- PR obligatorio para integrar cambios
- Revisiones de codigo antes de merge
- Build y pruebas exitosas como criterio de aceptacion

Figura 6. Diagrama de ramas Gitflow
![Figura 6 - Gitflow](./img/manuales/figura-06-gitflow.png)

## Modulos Implementados en el Sistema
Backend:
- Autenticacion y autorizacion
- Usuarios
- Contratos
- Tarifario
- Ordenes
- Facturacion
- Notificaciones
- Reporteria gerencial

Frontend:
- Registro y login
- Cliente
- Operativo
- Logistico
- Finanzas
- Gerencia
- Piloto
- Patio

## Pruebas Implementadas
En FASE 3 se identifican:
- Prueba automatizada: backend/tests/dashboard.service.test.js
- Pruebas unitarias: backend/tests/pruebas_unitarias/
- Pruebas de integracion: backend/tests/pruebas_integracion/
- Pruebas end-to-end: backend/tests/pruebas_e2e/
- Pruebas de carga: backend/tests/pruebas_carga/
- Pruebas de estres: backend/tests/pruebas_estres/

Estado observado:
- Existe evidencia estructural de tipos de prueba por carpeta
- El archivo unitarias_docu.md esta presente pero vacio

Figura 7. Evidencia de ejecucion de pruebas
![Figura 7 - Pruebas](./img/manuales/figura-07-pruebas.png)


## 1. Descripcion general del sistema
LogiTrans es una plataforma web para gestionar el ciclo operativo y financiero del transporte de carga:
- Gestion de clientes y contratos
- Parametrizacion de tarifas
- Creacion y seguimiento de ordenes de servicio
- Facturacion electronica FEL (simulada en esta etapa)
- Registro de pagos y cuentas por cobrar
- Dashboard gerencial con KPIs y alertas

La evolucion por fases del proyecto es:
- FASE 1: definicion arquitectonica, drivers y modelos de alto nivel
- FASE 2: implementacion funcional base de backend/frontend
- FASE 3: despliegue con contenedores, pruebas y consolidacion documental

## 2. Arquitectura del sistema
### 2.1 Vision arquitectonica (FASE 1)
En FASE 1 se documenta una arquitectura por capas:
- Capa de presentacion (SPA web)
- Capa de logica de negocio (servicios de dominio)
- Capa de persistencia (repositorios + base de datos)

Tambien se define orientacion cloud-ready y soporte para integraciones externas (SAT/FEL, aduanas, ERP, banca).

### 2.2 Implementacion tecnica (FASE 2 y FASE 3)
Arquitectura implementada:
- Frontend: React + TypeScript + Vite, servido por Nginx en produccion
- Backend: Node.js + Express + Socket.IO
- Base de datos: SQL Server (driver mssql)
- Comunicacion: REST bajo prefijo /api y eventos en tiempo real con Socket.IO
- Contenedores: Docker + Docker Compose (frontend y backend)

Nota: en FASE 1 aparece referencia a PostgreSQL en documentos de arquitectura. La implementacion de FASE 2/3 usa SQL Server.

## 3. Requisitos del entorno
### 3.1 Requisitos minimos recomendados
- SO: Windows, Linux o macOS
- Node.js: 20.x recomendado
- npm: 10.x recomendado
- Docker y Docker Compose (para despliegue contenedorizado)
- SQL Server accesible por red

### 3.2 Variables de entorno backend (obligatorias)
Base de datos:
- DB_SERVER
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

Autenticacion:
- JWT_SECRET
- JWT_EXPIRES_IN (opcional, por defecto 8h)

Correo/notificaciones:
- EMAIL_USER
- EMAIL_PASS
- EMAIL_FROM (opcional)
- NODE_ENV

## 4. Configuracion e instalacion
### 4.1 Ejecucion local (sin Docker)
1. Backend
```bash
cd "FASE 3/backend"
npm install
npm start
```
Backend por defecto en puerto 3001.

2. Frontend
```bash
cd "FASE 3/frontend"
npm install
npm run dev
```
Frontend en modo desarrollo con Vite.

3. Base de datos
- Crear esquema usando:
```bash
FASE 3/database/logitrans_ddl.sql
```
- Verificar conectividad desde backend con variables DB_*.

### 4.2 Ejecucion con Docker Compose (FASE 3)
```bash
cd "FASE 3"
docker compose up --build -d
```
Servicios esperados:
- frontend publicado en puerto 5173 (host) -> 80 (contenedor)
- backend en red interna del compose (servicio backend, puerto 3001)

Nota: el archivo compose actual no define servicio de base de datos; se asume SQL Server externo.

## 5. Estructura del repositorio
Estructura principal:
- FASE 1/: documentacion de analisis, arquitectura, casos de uso y prototipos
- FASE 2/: primera implementacion funcional de backend, frontend y base de datos
- FASE 3/: version consolidada con dockerizacion, pruebas y documentacion ampliada

En FASE 3:
- backend/: API, servicios, middlewares, modelos, pruebas
- frontend/: SPA React, build Vite, Nginx para produccion
- database/: script DDL principal
- Documentation/: artefactos funcionales y arquitectonicos

## 6. Pipeline CI/CD
### 6.1 Estado actual
En la revision de FASE 1, FASE 2 y FASE 3 no se encontro carpeta .github/workflows ni pipelines declarados en repositorio.

### 6.2 Pipeline recomendado
Pipeline minimo sugerido:
1. CI Backend
- npm ci
- lint (si aplica)
- unit tests

2. CI Frontend
- npm ci
- npm run build
- lint (si aplica)

3. Build de imagenes Docker
- build backend
- build frontend

4. CD (ambiente objetivo)
- pull de imagenes
- docker compose up -d
- smoke tests de salud (/ y /api)

Figura 8. Evidencia o esquema CI/CD (actual/propuesto)
![Figura 8 - CI-CD](./img/manuales/figura-08-cicd.png)

## 7. Estrategia de git-flow
### 7.1 Estado actual
No se encontro una guia formal de git-flow documentada en FASE 1/2/3.

### 7.2 Estrategia propuesta para el equipo
Ramas:
- main: produccion estable
- develop: integracion continua de funcionalidades
- feature/<nombre>: desarrollo de requerimientos
- release/<version>: estabilizacion antes de despliegue
- hotfix/<nombre>: correcciones urgentes sobre main

Reglas recomendadas:
- PR obligatorio para merge a develop/main
- 1+ aprobaciones de codigo
- tests y build obligatorios antes de merge
- versionado semantico para releases

## 8. Documentacion de pruebas
En FASE 3 se identifican evidencias de pruebas en:
- backend/tests/dashboard.service.test.js
- backend/tests/pruebas_unitarias/unitarias_docu.md (archivo presente, actualmente vacio)
- backend/tests/pruebas_integracion/integracion_docu.md
- backend/tests/pruebas_e2e/e2e_docu.md
- backend/tests/pruebas_carga/
- backend/tests/pruebas_estres/

Cobertura observada:
- Prueba automatizada puntual de dashboard service
- Documentacion de categorias de prueba (unitaria, integracion, e2e, carga, estres)

Recomendacion:
- Integrar ejecucion automatica de pruebas en CI
- Completar contenido faltante de pruebas unitarias documentadas

## 9. Infraestructura en la nube
### 9.1 Lineamiento de arquitectura
Desde FASE 1 se establece despliegue inicial on-premise con diseno cloud-ready para escalar a operacion regional.

### 9.2 Implementacion actual en FASE 3
- Contenedores Docker para backend y frontend
- Reverse proxy Nginx para frontend y proxy /api al backend
- Red privada de Docker Compose entre servicios
- Separacion de responsabilidades por servicio

Detalle tecnico implementado en FASE 3:
- Balanceador HTTP: Nginx dentro del contenedor frontend
- Ruta web: / -> recursos estaticos React (build Vite)
- Ruta API: /api -> proxy interno hacia servicio backend:3001
- Publicacion externa: host 5173 -> contenedor frontend:80
- Exposicion del backend: solo red interna Docker (no publico)

Componentes involucrados:
- docker-compose.yml: define servicios backend/frontend y red app_network
- frontend/nginx.conf: comportamiento de balanceo HTTP y proxy inverso
- frontend/Dockerfile: build de React y empaquetado en Nginx
- backend/Dockerfile: empaquetado de API Node.js para entorno productivo

### 9.3 Cobertura de la asignacion (balanceador + contenedores)
La asignacion de infraestructura queda cubierta con estos entregables:
- Balanceador en nube (capa HTTP): Nginx en frontend
- Contenedores backend y frontend: imagenes Docker independientes
- Interconexion por red privada: trafico interno entre servicios
- Punto de entrada unico: acceso por frontend, sin exponer backend al exterior

Flujo operativo:
1. Usuario entra al puerto publicado del frontend.
2. Nginx sirve el build de React para navegacion web.
3. Solicitudes /api se redirigen internamente a backend:3001.
4. Backend procesa logica y responde por la misma ruta proxied.

### 9.4 Procedimiento de validacion de infraestructura
Levantar infraestructura:
```bash
cd "FASE 3"
docker compose up --build -d
```

Validar estado de contenedores:
```bash
docker compose ps
```

Validar punto de entrada del balanceador (frontend):
```bash
curl http://localhost:5173
```

Validar que la API no se publica directamente (esperado: cerrado/no accesible):
```bash
curl http://localhost:3001
```

Escalado recomendado para defensa tecnica (opcional):
```bash
docker compose up --build -d --scale backend=2
```

Nota de operacion:
- En entorno cloud administrado, este balanceo Nginx puede colocarse detras de un Load Balancer del proveedor (ALB/Application Gateway/HTTP LB) para alta disponibilidad.

### 9.5 Ruta de evolucion cloud
Evolucion sugerida:
- Registro de imagenes en un container registry
- Orquestacion en Kubernetes o servicio administrado equivalente
- Base de datos administrada (SQL Server administrado)
- Observabilidad centralizada (logs, metricas, alertas)

## 10. Configuracion del sistema de notificaciones
El backend implementa notificaciones por correo con Nodemailer.

Componentes:
- utils/mailer.js: transporter SMTP singleton y funciones de envio
- utils/notificaciones.js: casos de negocio (bloqueos, expiraciones, cuentas vencidas, activacion/desactivacion)
- utils/formato_correo/: plantillas correcto, incorrecto e informativo

Configuracion requerida en .env:
- EMAIL_USER
- EMAIL_PASS
- EMAIL_FROM (opcional)
- NODE_ENV

Comportamiento:
- Verifica conexion SMTP en desarrollo
- Emite logs de envio y errores
- Soporta notificaciones de exito, error e informativas

## 11. Solucion de problemas comunes
### 11.1 Error de conexion a base de datos
Sintoma:
- Excepcion de variables DB faltantes o fallo de conexion

Validaciones:
- Confirmar DB_SERVER, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- Verificar puerto y firewall de SQL Server
- Confirmar credenciales y permisos de usuario

### 11.2 Backend levanta pero frontend no consume API
Sintoma:
- Errores de red o 404 en llamadas /api

Validaciones:
- Revisar si se ejecuta con Vite local o con Nginx Docker
- En Docker, confirmar que Nginx proxya /api a backend:3001
- Verificar que backend este corriendo y responda en /api

### 11.3 Error de JWT o acceso denegado
Sintoma:
- 401/403 en endpoints protegidos

Validaciones:
- Revisar JWT_SECRET consistente entre sesiones
- Verificar cabecera Authorization: Bearer <token>
- Verificar rol requerido en middlewares de autorizacion

### 11.4 Correos no se envian
Sintoma:
- Logs de error SMTP en mailer

Validaciones:
- Revisar EMAIL_USER y EMAIL_PASS
- Validar politica del proveedor SMTP (Gmail/app password)
- Probar conectividad de red hacia SMTP
- Revisar NODE_ENV y logs de verify/sendMail

### 11.5 Build de frontend falla en contenedor
Sintoma:
- Error en npm run build

Validaciones:
- Verificar lockfile y version de Node
- Reinstalar dependencias y limpiar cache
- Revisar errores de TypeScript o ESLint

## Despliegue
El despliegue del sistema se realizo con dos enfoques: ejecucion local para desarrollo y despliegue contenedorizado para un entorno mas estable y reproducible. En desarrollo, el frontend y el backend se ejecutan de forma independiente con su propio proceso de arranque, mientras la base de datos SQL Server se conecta mediante variables de entorno.

Para la etapa consolidada (FASE 3), se uso Docker y Docker Compose para construir y levantar los servicios principales. El frontend queda servido por Nginx y se comunica con el backend por proxy en la red interna de contenedores. Esta estrategia reduce diferencias entre entornos, simplifica la puesta en marcha y facilita futuras migraciones a infraestructura cloud.

El proceso general de despliegue contempla tres momentos tecnicos: preparacion del entorno (dependencias, variables y acceso a BD), publicacion/arranque de servicios (local o contenedorizado) y validacion funcional (disponibilidad de frontend, respuesta de API, autenticacion por roles y flujo base del sistema).

En produccion, el despliegue requiere endurecimiento de configuracion: uso de entorno productivo, restriccion de CORS, gestion segura de secretos, politicas de respaldo de base de datos y trazabilidad de versiones de imagenes. Como mejora prioritaria, se recomienda formalizar CI/CD para automatizar build, pruebas y liberaciones.

Figura 9. Evidencia de despliegue en Docker Compose
![Figura 9 - Despliegue](./img/manuales/figura-09-despliegue.png)

## Conclusiones Tecnicas
- La solucion implementada en FASE 3 consolida una arquitectura web desacoplada (frontend y backend) con una base de datos relacional robusta, adecuada para crecimiento gradual.
- El uso de Docker y Docker Compose mejora la portabilidad del despliegue y reduce diferencias entre entornos de desarrollo y ejecucion.
- El sistema cubre los dominios clave del negocio (comercial, operativo, financiero y gerencial) con separacion tecnica por rutas, controladores, servicios y modelos.
- La seguridad base esta soportada por autenticacion JWT y control de acceso por roles, lo que permite proteger funcionalidades por perfil de usuario.
- El canal de notificaciones y la capa de tiempo real con Socket.IO agregan capacidad operativa para seguimiento y eventos de negocio.
- Existe una base de pruebas en FASE 3, pero la madurez del aseguramiento de calidad depende de ampliar cobertura automatizada e integrar ejecucion continua.
- El principal gap tecnico actual es la ausencia de pipeline CI/CD versionado en el repositorio; su incorporacion es prioritaria para calidad, trazabilidad y despliegues confiables.
- La arquitectura definida en FASE 1 y materializada en FASE 2/3 deja al proyecto en una posicion viable para evolucionar a un entorno cloud administrado y para integrar servicios externos productivos en una siguiente etapa.

