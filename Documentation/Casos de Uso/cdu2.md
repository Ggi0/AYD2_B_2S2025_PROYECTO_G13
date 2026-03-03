
# DCU 2 - Registro y seguimiento de Órdenes de servicio

## 1. Descripción de actores del sistema
Analizando el flujo completo (desde que se genera la orden hasta su cierre administrativo), los actores que interactúan con el sistema son:

|| **Representación** |           **Actor**          | **Descripción** |
|:-:|:------------------:|:----------------------------:|:---------------:|
|1|![actor.png](../images/DCU_2/DCU2_actor.png)| Cliente Corporativo          |Empresa (importadora, exportadora o comercio) que contrata los servicios de transporte de LogiTrans y opera dentro de la plataforma.|
|2|![actor.png](../images/DCU_2/DCU2_actor.png)| Agente Logístico             |Colaborador interno de LogiTrans responsable de la planificación operativa de cada orden de transporte.|
|3|![actor.png](../images/DCU_2/DCU2_actor.png)| Encargado de Patio           |Colaborador interno que opera físicamente en las instalaciones de carga y es responsable de formalizar la salida de la unidad.|
|4|![actor.png](../images/DCU_2/DCU2_actor.png)| Piloto                       |Conductor asignado a la unidad de transporte, responsable del traslado de la mercancía de origen a destino.|
|5|![actor.png](../images/DCU_2/DCU2_actor.png)| Agente financiero  |Colaborador del área financiera responsable de procesar la facturación a partir de las órdenes completadas.|
|6|![actor.png](../images/DCU_2/DCU2_actor.png)| Gerencia                     |Usuario estratégico de LogiTrans que consume información consolidada para la toma de decisiones.|


    Nota: en el Agente financiero solo recibe una notificación automática,lo cual es una interacción pasiva muy limitada. Sin embargo, sí es válido mantenerlo como actor porque en UML, un actor que recibe información del sistema cuenta como interacción.

## 2. Caso de uso de alto nivel

Permite administrar el ciclo completo de una orden de transporte de mercancías, 
desde su creación hasta su cierre administrativo, asegurando planificación, 
trazabilidad en ruta, confirmación de entrega y generación de información para control operativo y financiero.

![actor.png](../images/DCU_2/DCU2_altoNivel.png)


## 3. Primera descomposición
* CDU001: Gestión de Órdenes de Servicio
* CDU002: Planificación y Asignación de Recursos
* CDU003: Gestión de Carga y Despacho
* CDU004: Monitoreo y Seguimiento en Ruta
* CDU005: Gestión de Entrega y Documentación
* CDU006: Cierre y Evaluación de Servicio

![actor.png](../images/DCU_2/DCU2_1raDescomposicion.png)


## 4. Caso de uso expandidos

## 5. Matriz de trazabilidad


