# 1. Descripción de actores de Gestión de Clientes y Contratos
![!\[alt text\](image.png)](../images/CDU1/actores.png)

# caso de uso de alto nivel

![alt text](<../images/CDU1/dcu alto nivel.png>)

# Primera descomposicion
## Procesos Críticos Generales

CDU001 – Gestión de Clientes
CDU002 – Gestión de Contratos
CDU003 – Validación Financiera
CDU004 – Vinculación Operativa
CDU005 – Gestión de Historial y Desempeño

![alt text](<../images/CDU1/Primera descomposicion.png>)

# Casos expandidos

## CDU001 - Gestion de Clienes

CDU001.1 - Registrar clientes
CDU001.2 - Consultar Clientes
CDU001.3 - Modificar Cliente
CDU001.4 - Gestionar Credenciales
CDU001.5 - Bloquear / Desactivar Cliente


## diagrama de expandidos para el CDU001.1
![aqui se agrega diagrama](<../images/CDU1/CDU001.1 REGISTRAR CLIENTES.png>)

| Campo                 | Detalle                                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nombre**            | Registrar Cliente                                                                                                                                                                                 |
| **Código**            | CDU001.1                                                                                                                                                                                          |
| **Actores**           | Agente Operativo                                                                                                                                                                                  |
| **Descripción**       | Permite registrar en el sistema los datos fiscales, contactos clave y categoría de riesgo de un cliente corporativo.                                                                              |
| **Precondiciones**    | El cliente no debe estar previamente registrado.                                                                                                                                                  |
| **Postcondiciones**   | Cliente registrado correctamente o proceso cancelado.                                                                                                                                             |
| **Flujo Principal**   | 1. Ingresar NIT y razón social.<br>2. Registrar contactos clave.<br>3. Asignar categoría de riesgo.<br>4. Validar información obligatoria.<br>5. Guardar datos.<br>6. Confirmar registro exitoso. |
| **Flujos Alternos**   | **FA1:** NIT duplicado → Mostrar mensaje y cancelar.<br>**FA2:** Campos obligatorios vacíos → Solicitar corrección.                                                                               |
| **Reglas de Negocio** | NIT único y válido.<br>Categoría de riesgo obligatoria.                                                                                                                                           |
| **Reglas de Calidad** | Validación en tiempo real.<br>Tiempo de respuesta menor a 3 segundos.                                                                                                                             |



diagrama de expandidos para el CDU001.2
![aqui se agrega diagrama](<../images/CDU1/CDU001.2 Registrar Clientes.png>)


| Campo                 | Detalle                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Nombre**            | Consultar Cliente                                                                                           |
| **Código**            | CDU001.2                                                                                                    |
| **Actores**           | Agente Operativo, Área Contable, Gerencia                                                                   |
| **Descripción**       | Permite visualizar la información registrada de un cliente corporativo.                                     |
| **Precondiciones**    | Cliente previamente registrado.                                                                             |
| **Postcondiciones**   | Información mostrada correctamente.                                                                         |
| **Flujo Principal**   | 1. Ingresar criterio de búsqueda.<br>2. El sistema realiza consulta.<br>3. Mostrar información del cliente. |
| **Flujos Alternos**   | **FA1:** Cliente no encontrado → Mostrar mensaje.                                                           |
| **Reglas de Negocio** | Solo usuarios autorizados pueden consultar información.                                                     |
| **Reglas de Calidad** | Tiempo de respuesta menor a 2 segundos.                                                                     |


aqui se agrega grafico

| Campo                 | Detalle                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| **Nombre**            | Modificar Cliente                                                                                         |
| **Código**            | CDU001.3                                                                                                  |
| **Actores**           | Agente Operativo                                                                                          |
| **Descripción**       | Permite actualizar datos fiscales, contactos o categoría de riesgo del cliente.                           |
| **Precondiciones**    | Cliente registrado en el sistema.                                                                         |
| **Postcondiciones**   | Información actualizada correctamente.                                                                    |
| **Flujo Principal**   | 1. Consultar cliente.<br>2. Editar campos necesarios.<br>3. Validar cambios.<br>4. Guardar actualización. |
| **Flujos Alternos**   | **FA1:** Datos inválidos → Solicitar corrección.                                                          |
| **Reglas de Negocio** | No se permite modificar NIT si existe historial asociado.                                                 |
| **Reglas de Calidad** | Registro de auditoría de modificaciones.                                                                  |





agraegar diagrama aqui




| Campo                 | Detalle                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Nombre**            | Gestionar Credenciales                                                                                                        |
| **Código**            | CDU001.4                                                                                                                      |
| **Actores**           | Cliente Corporativo, Agente Operativo                                                                                         |
| **Descripción**       | Permite generar, actualizar o recuperar credenciales de acceso a la plataforma.                                               |
| **Precondiciones**    | Cliente registrado.                                                                                                           |
| **Postcondiciones**   | Credenciales generadas o actualizadas correctamente.                                                                          |
| **Flujo Principal**   | 1. Solicitar creación o recuperación.<br>2. Validar identidad.<br>3. Generar nuevas credenciales.<br>4. Notificar al cliente. |
| **Flujos Alternos**   | **FA1:** Validación fallida → Cancelar proceso.                                                                               |
| **Reglas de Negocio** | Contraseña debe cumplir política de seguridad.                                                                                |
| **Reglas de Calidad** | Credenciales almacenadas cifradas.                                                                                            |



diagrama agregar aqui


| Campo                 | Detalle                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Nombre**            | Bloquear o Desactivar Cliente                                                                         |
| **Código**            | CDU001.5                                                                                              |
| **Actores**           | Área Contable, Sistema                                                                                |
| **Descripción**       | Permite bloquear automáticamente o desactivar manualmente a un cliente por incumplimiento financiero. |
| **Precondiciones**    | Cliente con facturas vencidas o límite de crédito excedido.                                           |
| **Postcondiciones**   | Cliente bloqueado y sin posibilidad de generar nuevas órdenes.                                        |
| **Flujo Principal**   | 1. Detectar incumplimiento.<br>2. Cambiar estado a bloqueado.<br>3. Registrar evento en auditoría.    |
| **Flujos Alternos**   | **FA1:** Cliente regulariza deuda → Reactivar estado activo.                                          |
| **Reglas de Negocio** | No se permite generar órdenes si el cliente está bloqueado.                                           |
| **Reglas de Calidad** | El cambio de estado debe registrarse en bitácora.                                                     |
