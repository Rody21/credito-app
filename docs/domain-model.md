# Domain Model - PLG Capital

Este documento describe los conceptos principales del dominio de PLG Capital y sus reglas de negocio esperadas. Algunas entidades ya existen en codigo o documentacion; otras estan pendientes de implementacion.

---

## Producto

Responsabilidad:

- Representa un bien disponible para venta.
- Define el costo base de adquisicion.
- Puede servir como punto de partida para calcular precio de contado y precio financiado.

Relaciones:

- Un producto puede aparecer en muchas ventas.
- Una venta pertenece a un producto.

Reglas de negocio:

- Todo producto debe tener nombre, costo y precio de contado.
- El costo debe ser mayor a cero.
- El precio total de venta no debe ser menor al costo.
- Un producto puede estar activo o inactivo.
- Los productos inactivos no deberian estar disponibles para nuevas ventas.
- El precio de contado y el precio financiado pueden usar porcentajes de utilidad diferentes.
- El precio aplicado en una venta debe quedar guardado como historico, aunque el producto cambie despues.

---

## Cliente

Responsabilidad:

- Representa a la persona que compra o financia un producto.
- Centraliza datos de contacto, identificacion y direccion.
- Permite consultar su historial de ventas, creditos, pagos y cartera.

Relaciones:

- Un cliente puede tener muchas ventas.
- Una venta pertenece a un cliente.
- Los pagos se asocian indirectamente al cliente por medio de la venta.

Reglas de negocio:

- Todo cliente debe tener nombre completo.
- Documento, telefono y direccion son opcionales en el estado actual.
- Conviene evitar clientes duplicados por documento, telefono o combinacion de datos.
- El cliente puede tener multiples creditos activos.
- La vista de cliente deberia mostrar creditos vigentes, pagos realizados y saldo pendiente.

---

## Venta

Responsabilidad:

- Registra la transaccion comercial entre PLG Capital y un cliente.
- Define si la operacion es de contado o credito.
- Conserva los valores financieros aplicados en el momento de la venta.

Relaciones:

- Pertenece a un cliente.
- Pertenece a un producto.
- Puede tener muchas cuotas si es a credito.
- Puede tener muchos pagos.
- Puede generar movimientos de caja.
- Puede generar utilidad distribuible a inversionistas.

Reglas de negocio:

- Toda venta debe asociarse a un cliente y a un producto.
- Una venta puede ser `CASH` o `CREDIT`.
- Las ventas se crean en estado `ACTIVE`.
- Una venta de contado se considera pagada al registrarse.
- Una venta de contado no genera cuotas.
- Una venta a credito puede tener cuota inicial.
- El valor financiado se calcula como: valor total de venta - cuota inicial.
- El valor total vendido nunca debe ser menor al costo del producto.
- La utilidad bruta se calcula como: valor vendido - costo.
- El plazo de financiacion no modifica el valor total vendido.
- La venta debe guardar los porcentajes y valores aplicados para no depender de cambios futuros en producto o configuracion.

---

## Cuota

Responsabilidad:

- Representa una obligacion programada de pago dentro de una venta a credito.
- Permite organizar fechas de vencimiento, valores y estado de recaudo.
- Sirve como base para reportes de cartera y mora.

Relaciones:

- Pertenece a una venta.
- Puede tener uno o varios pagos asociados.
- Se refleja indirectamente en caja a traves de pagos.

Reglas de negocio:

- Una venta a credito genera cuotas programadas.
- Cada cuota debe tener numero, fecha de vencimiento, valor y estado.
- Una cuota inicia en estado `PENDING`.
- Una cuota puede recibir pagos parciales.
- Una cuota pasa a `PAID` cuando el valor pagado cubre el valor de la cuota.
- El valor pagado no debe superar el saldo pendiente de la cuota.
- Las cuotas vencidas generan mora si la regla de mora esta configurada.
- Las cuotas son una programacion de cobro; los pagos pueden requerir distribucion flexible contra el saldo total de la venta.

---

## Pago

Responsabilidad:

- Registra dinero recibido de un cliente.
- Reduce el saldo pendiente de una venta y, cuando aplica, de una cuota.
- Dispara la actualizacion financiera de cartera y caja.

Relaciones:

- Pertenece a una venta.
- Puede pertenecer a una cuota especifica.
- Genera un movimiento de caja de ingreso.
- Puede contribuir al reconocimiento de utilidad real.

Reglas de negocio:

- Todo pago debe estar asociado a una venta.
- Un pago puede asociarse a una cuota especifica.
- El monto pagado debe ser mayor a cero.
- El pago no debe superar el saldo pendiente, salvo que exista una regla explicita para excedentes.
- Al registrar un pago se debe actualizar saldo de cuota, estado de cuota y estado de venta cuando corresponda.
- Los pagos parciales reducen directamente el saldo total pendiente de la venta.
- La utilidad real se reconoce proporcionalmente a medida que el cliente paga.
- Pagos, actualizacion de saldos y caja deben registrarse en una operacion atomica.

---

## Caja

Responsabilidad:

- Registra entradas y salidas de dinero.
- Permite controlar recaudos, gastos, ajustes y saldo operativo.
- Sirve como base para reportes financieros y conciliacion.

Relaciones:

- Recibe movimientos de ingreso desde pagos.
- Puede recibir movimientos de ingreso desde ventas de contado.
- Puede registrar egresos por gastos operativos.
- Puede relacionarse con distribuciones o retiros de inversionistas.

Reglas de negocio:

- Todo ingreso o egreso debe generar un movimiento de caja.
- Los pagos recibidos generan movimientos de ingreso.
- Los gastos generan movimientos de egreso.
- Cada movimiento debe tener tipo, categoria, monto, fecha y descripcion o referencia.
- El monto debe ser mayor a cero; el signo debe derivarse del tipo de movimiento.
- Los movimientos deben ser trazables hacia su origen: pago, venta, gasto, ajuste o distribucion.
- Para integridad financiera, los movimientos no deberian editarse libremente; se prefieren reversos o ajustes.

---

## Inversionista

Responsabilidad:

- Representa a una persona o entidad que aporta capital al negocio.
- Participa en la distribucion de utilidades segun porcentajes o acuerdos.
- Permite reportar capital invertido, utilidad generada, utilidad pagada y saldo por pagar.

Relaciones:

- Un inversionista puede tener una o varias inversiones.
- Una inversion puede financiar la operacion general o ventas especificas, segun el diseno elegido.
- Un inversionista puede recibir distribuciones de utilidad.
- Las distribuciones pueden relacionarse con ventas, pagos o periodos contables.
- Los pagos de utilidades o retiros pueden generar movimientos de caja.

Reglas de negocio:

- La distribucion de utilidades esta pendiente de implementacion.
- La regla documentada por defecto propone tres inversionistas con participaciones 60%, 30% y 10%.
- La suma de participaciones activas deberia ser 100% para una bolsa o periodo de distribucion.
- Debe distinguirse capital aportado, utilidad causada, utilidad reconocida y utilidad pagada.
- Si la utilidad se reconoce con el recaudo, las distribuciones deben basarse en pagos recibidos, no solo en ventas creadas.
- Toda distribucion pagada debe quedar trazada en caja.
- Cambios de porcentaje deben versionarse para no alterar distribuciones historicas.

---

## Vista relacional resumida

```text
Cliente 1---N Venta N---1 Producto
Venta 1---N Cuota
Venta 1---N Pago
Cuota 1---N Pago
Pago 1---1 Movimiento de caja
Inversionista 1---N Inversion
Inversionista 1---N Distribucion de utilidad
Distribucion de utilidad N---1 Venta o Pago
Distribucion pagada 1---1 Movimiento de caja
```

---

## Reglas transversales

- Los valores financieros deben validarse en servidor y base de datos, no solo en UI.
- Las operaciones que tocan pago, cuota, venta y caja deben ser atomicas.
- Los reportes deben diferenciar valor vendido, valor recaudado, cartera pendiente y utilidad.
- Los cambios de configuracion no deben modificar ventas historicas.
- Las entidades financieras sensibles necesitan auditoria de creacion, modificacion, anulacion y usuario responsable.
