# Database Analysis - PLG Capital

Este documento analiza el modelo de datos conocido del proyecto. La informacion se basa en:

- `docs/database-schema.md`
- `docs/business-rules.md`
- `types/database.ts`
- Accesos reales desde la aplicacion en `lib/customers.ts` y `lib/products.ts`
- Pantallas actuales de dashboard, ventas, pagos, caja y configuracion

Cuando una tabla aparece en la documentacion pero no en el codigo actual, se marca como disenada o pendiente de uso.

---

## 1. Tablas

### `customers`

Estado: confirmada en documentacion, tipos y codigo.

Responsabilidad: almacenar la informacion base del cliente.

Campos documentados:

| Campo | Uso actual | Observacion |
| --- | --- | --- |
| `id` | Usado | Identificador principal. |
| `document` | Usado parcialmente | Se captura y se muestra, pero no se valida unicidad. |
| `full_name` | Usado | Campo obligatorio de negocio. |
| `phone` | Usado | Se captura, se lista y se muestra. |
| `address` | Usado | Se captura y se muestra. |
| `email` | No usado en codigo | Aparece en `docs/database-schema.md`, no en `types/database.ts`. |
| `notes` | No usado en codigo | Aparece en `docs/database-schema.md`, no en `types/database.ts`. |
| `created_at` | Usado indirectamente | Existe en tipos/documentacion, no se muestra en UI. |

Riesgos:

- Clientes duplicados por documento, telefono o nombre.
- Falta de normalizacion para documentos y telefonos.
- Si `document` es opcional, no puede ser el unico criterio de identidad.

### `products`

Estado: confirmada en documentacion, tipos y codigo.

Responsabilidad: catalogo de productos disponibles para venta.

Campos documentados:

| Campo | Uso actual | Observacion |
| --- | --- | --- |
| `id` | Usado | Identificador principal. |
| `name` | Usado | Se lista y se crea desde helpers. |
| `cost_price` | Usado | Costo de adquisicion. |
| `cash_price` | Usado | Precio de contado mostrado en UI. |
| `active` | No usado en codigo actual | Existe en tipos/documentacion, pero no filtra productos. |
| `created_at` | Usado para orden | `getProducts()` ordena por fecha de creacion. |

Riesgos:

- `active` no se respeta en nuevas ventas.
- `cash_price` puede quedar desalineado frente a reglas configurables de utilidad.
- No hay campos para utilidad de contado, utilidad de credito, mora o configuracion historica por venta.

### `sales`

Estado: documentada y tipada, pero no usada aun por codigo de persistencia.

Responsabilidad: registro principal de una venta de contado o credito.

Campos documentados:

| Campo | Uso actual | Observacion |
| --- | --- | --- |
| `id` | Pendiente | Identificador principal. |
| `customer_id` | Pendiente | Debe relacionar la venta con un cliente. |
| `product_id` | Pendiente | Debe relacionar la venta con un producto. |
| `sale_type` | Pendiente | Valores esperados: `CASH`, `CREDIT`. |
| `sale_date` | Pendiente | Fecha contractual de venta. |
| `down_payment` | Pendiente | Cuota inicial. |
| `financed_amount` | Pendiente | Saldo financiado. |
| `total_sale_amount` | Pendiente | Valor total vendido. |
| `status` | Pendiente | Estado esperado inicial: `ACTIVE`. |
| `created_at` | Pendiente | Auditoria minima. |

Riesgos:

- No hay persistencia real de ventas en la app actual.
- No se conserva el porcentaje de utilidad usado en cada venta.
- No se conserva el plazo, frecuencia de pago ni numero de cuotas.
- Si el precio del producto cambia luego, la venta necesita guardar sus propios valores historicos.

### `sale_installments`

Estado: documentada, no tipada en `types/database.ts`, no usada por codigo actual.

Responsabilidad: programacion de cuotas asociadas a una venta.

Campos documentados:

| Campo | Uso actual | Observacion |
| --- | --- | --- |
| `id` | Pendiente | Identificador principal. |
| `sale_id` | Pendiente | Relacion con `sales`. |
| `installment_number` | Pendiente | Numero de cuota. |
| `due_date` | Pendiente | Fecha de vencimiento. |
| `amount` | Pendiente | Valor programado de la cuota. |
| `paid_amount` | Pendiente | Valor pagado acumulado. |
| `status` | Pendiente | Estado esperado inicial: `PENDING`. |
| `created_at` | Pendiente | Auditoria minima. |

Riesgos:

- Duplicidad con `installments`.
- `paid_amount` acumulado debe cuadrar con la suma real de pagos.
- Si se permite abonar libremente a la venta, debe definirse como se distribuye entre cuotas.

### `installments`

Estado: documentada como tabla alternativa existente. No aparece en `types/database.ts` ni en codigo actual.

Responsabilidad probable: cuotas con saldos explicitos.

Campos documentados:

| Campo | Uso actual | Observacion |
| --- | --- | --- |
| `id` | Pendiente | Identificador principal. |
| `sale_id` | Pendiente | Relacion con `sales`. |
| `installment_number` | Pendiente | Numero de cuota. |
| `due_date` | Pendiente | Fecha de vencimiento. |
| `original_amount` | Pendiente | Valor original de la cuota. |
| `paid_amount` | Pendiente | Valor pagado acumulado. |
| `pending_amount` | Pendiente | Saldo pendiente de la cuota. |
| `status` | Pendiente | Estado de la cuota. |
| `created_at` | Pendiente | Auditoria minima. |

Riesgos:

- Compite directamente con `sale_installments`.
- Tener `paid_amount` y `pending_amount` puede generar inconsistencias si no se actualizan en una misma transaccion.

### `payments`

Estado: documentada, no tipada en `types/database.ts`, no usada por codigo actual.

Responsabilidad: registrar pagos recibidos de clientes.

Campos documentados:

| Campo | Uso actual | Observacion |
| --- | --- | --- |
| `id` | Pendiente | Identificador principal. |
| `sale_id` | Pendiente | Relacion obligatoria con venta. |
| `installment_id` | Pendiente | Relacion opcional con cuota. |
| `amount` | Pendiente | Valor pagado. |
| `payment_method` | Pendiente | Metodo de pago. |
| `payment_date` | Pendiente | Fecha/hora de pago. |

Riesgos:

- Si `installment_id` apunta a `sale_installments`, pero se decide usar `installments`, la FK quedaria mal disenada.
- No hay soporte documentado para reversos, anulaciones, pagos parciales distribuidos o pagos en exceso.
- Debe existir transaccion atomica entre pago, cuota, venta y caja.

### `cash_movements`

Estado: documentada, no tipada en `types/database.ts`, no usada por codigo actual.

Responsabilidad: libro de ingresos y egresos de caja.

Campos documentados:

| Campo | Uso actual | Observacion |
| --- | --- | --- |
| `id` | Pendiente | Identificador principal. |
| `movement_type` | Pendiente | Entrada o salida. |
| `category` | Pendiente | Pago, gasto, ajuste, etc. |
| `amount` | Pendiente | Valor del movimiento. |
| `reference_id` | Pendiente | Referencia generica. |
| `description` | Pendiente | Descripcion libre. |
| `created_at` | Pendiente | Fecha de registro. |

Riesgos:

- `reference_id` generico no indica a que tabla apunta.
- Sin `reference_type`, no hay integridad referencial fuerte.
- No hay modelo de cierre de caja, usuario responsable, anulacion o conciliacion.

### Tablas propuestas pendientes

Estas aparecen como pendientes en la documentacion:

- `investors`
- `investor_investments`
- `profit_distributions`
- `expenses`
- `audit_logs`

No hay tipos ni codigo actual que las use.

---

## 2. Relaciones

Relaciones confirmadas por documentacion:

- `customers.id` -> `sales.customer_id`
- `products.id` -> `sales.product_id`
- `sales.id` -> `sale_installments.sale_id`
- `sales.id` -> `installments.sale_id`
- `sales.id` -> `payments.sale_id`
- `sale_installments.id` -> `payments.installment_id`

Relacion problematica:

- `payments.installment_id` apunta a `sale_installments.id`, pero existe una tabla alternativa `installments`. Antes de implementar pagos se debe elegir una sola tabla oficial de cuotas.

Relaciones recomendadas:

- `cash_movements.payment_id` -> `payments.id`, cuando el movimiento viene de un pago.
- `cash_movements.expense_id` -> `expenses.id`, si se agregan gastos.
- `sales.created_by` -> usuario autenticado, si se necesita auditoria.
- `payments.created_by` -> usuario autenticado.
- `investor_investments.investor_id` -> `investors.id`.
- `profit_distributions.investor_id` -> `investors.id`.
- `profit_distributions.sale_id` -> `sales.id` o `payment_id`, segun si la utilidad se reconoce al vender o al recaudar.

---

## 3. Campos no utilizados

Campos documentados pero no usados en codigo actual:

- `customers.email`
- `customers.notes`
- `products.active`
- Todos los campos de `sales`
- Todos los campos de `sale_installments`
- Todos los campos de `installments`
- Todos los campos de `payments`
- Todos los campos de `cash_movements`

Campos tipados pero sin uso completo:

- `Customer.created_at`
- `Product.active`
- `Sale` completo

Campos usados en UI/calculadora pero no persistidos:

- Porcentaje de utilidad.
- Porcentaje de cuota inicial.
- Numero de meses.
- Frecuencia de cobro: mensual, quincenal o semanal.
- Nombre de producto digitado en el simulador cuando no se elige un producto del catalogo.
- Valor de cuota mensual, quincenal o semanal.

---

## 4. Tablas duplicadas

### `sale_installments` vs `installments`

Duplicidad: alta.

Ambas representan cuotas de una venta.

Diferencia principal:

- `sale_installments` guarda `amount` y `paid_amount`.
- `installments` guarda `original_amount`, `paid_amount` y `pending_amount`.

Recomendacion:

- Elegir una sola tabla oficial.
- Preferir un nombre simple como `installments`, siempre que se ajuste la FK de `payments`.
- Mantener el saldo pendiente como dato calculado cuando sea posible: `original_amount - paid_amount`.
- Si se persiste `pending_amount`, actualizarlo solo mediante transacciones o funciones de base de datos.

### `cash_movements` y futura `expenses`

Duplicidad potencial: media.

`cash_movements` registra entradas y salidas. Una futura tabla `expenses` podria duplicar salidas si no se define bien.

Recomendacion:

- Usar `expenses` como documento operacional del gasto.
- Usar `cash_movements` como libro contable/caja.
- Relacionar ambos con FK explicita.

---

## 5. Posibles mejoras de diseno

### Unificar cuotas

Definir una sola tabla oficial de cuotas antes de implementar pagos. Esta decision desbloquea:

- Estado correcto de cartera.
- Aplicacion de pagos parciales.
- Mora.
- Reportes de vencimiento.

### Guardar snapshot de venta

La venta deberia guardar valores historicos, no depender del producto actual:

- Nombre del producto al momento de venta.
- Costo del producto al momento de venta.
- Precio de contado aplicado.
- Precio financiado aplicado.
- Porcentaje de utilidad aplicado.
- Porcentaje de cuota inicial aplicado.
- Plazo.
- Frecuencia de pago.

### Separar precio de contado y precio financiado

Las reglas de negocio ya indican que la utilidad de contado y credito puede ser diferente. El modelo actual solo tiene `cash_price` en producto y `total_sale_amount` en venta.

Campos recomendables en venta:

- `cash_price_snapshot`
- `credit_price_snapshot`
- `profit_percentage`
- `sale_price`

### Configuracion persistente

`creditConfig` vive en memoria del cliente y no persiste. Conviene mover esa configuracion a una tabla, por ejemplo:

- `credit_settings`
- `product_financing_rules`

Si los porcentajes pueden cambiar por venta, la configuracion debe ser solo valor sugerido; la venta debe guardar el valor final aplicado.

### Estados controlados

Usar estados consistentes y restringidos:

- Venta: `ACTIVE`, `PAID`, `CANCELLED`, `DEFAULTED`
- Cuota: `PENDING`, `PARTIAL`, `PAID`, `OVERDUE`, `CANCELLED`
- Pago: `APPLIED`, `VOIDED`, `REVERSED`
- Movimiento de caja: `INCOME`, `EXPENSE`, `ADJUSTMENT`

### Integridad de caja

Los movimientos de caja no deberian depender solo de `reference_id`. Conviene usar:

- `reference_type`
- `reference_id`
- o FKs especificas como `payment_id`, `expense_id`, `sale_id`

### Auditoria

Para un sistema financiero, agregar:

- `created_by`
- `updated_by`
- `updated_at`
- `deleted_at` si se requiere borrado logico
- `audit_logs` para acciones sensibles

---

## 6. Riesgos de integridad

### Riesgo: cuotas duplicadas o inconsistentes

Origen: existen `sale_installments` e `installments`.

Impacto:

- Pagos aplicados a una tabla mientras reportes leen otra.
- Cartera incorrecta.
- Estados de venta incorrectos.

Mitigacion:

- Definir tabla oficial de cuotas.
- Eliminar o migrar la tabla duplicada.

### Riesgo: pagos no atomicos

Origen: registrar pago implica actualizar varias entidades.

Impacto:

- Pago existe, pero cuota no cambia.
- Caja no refleja el ingreso.
- Venta queda activa aunque este pagada.

Mitigacion:

- Usar transacciones o funciones RPC en Supabase/Postgres.
- Registrar pago, actualizar cuota, actualizar venta y crear movimiento de caja en una sola operacion.

### Riesgo: valores financieros negativos o imposibles

Origen: falta de constraints visibles.

Impacto:

- Costos en cero.
- Pagos mayores al saldo.
- Cuotas iniciales mayores al total.
- Ventas por debajo del costo.

Mitigacion:

- Constraints `CHECK`.
- Validacion de servidor.
- Validacion UI como apoyo, no como unica defensa.

### Riesgo: perdida de historico de precios

Origen: venta depende de producto/configuracion actual.

Impacto:

- Cambiar un producto podria distorsionar reportes historicos.
- No se podria auditar la utilidad aplicada en una venta pasada.

Mitigacion:

- Guardar snapshots financieros en `sales`.

### Riesgo: clientes duplicados

Origen: `document` es opcional y no hay unicidad documentada.

Impacto:

- Cartera fragmentada por cliente.
- Dificultad para recaudo y reportes.

Mitigacion:

- Normalizar documento/telefono.
- Definir reglas de unicidad cuando aplique.

### Riesgo: caja sin trazabilidad

Origen: `cash_movements.reference_id` generico.

Impacto:

- No se puede verificar de donde sale cada movimiento.
- Dificultad en conciliacion.

Mitigacion:

- Usar referencias tipadas o FKs especificas.
- Registrar usuario responsable y estado de anulacion/reverso.

### Riesgo: inversionistas sin modelo contable claro

Origen: inversionistas y distribucion de utilidad estan pendientes.

Impacto:

- Distribuciones manuales o inconsistentes.
- No se distingue capital invertido, utilidad causada y utilidad pagada.

Mitigacion:

- Modelar inversionistas, aportes, participaciones, distribuciones y retiros antes de reportar utilidad por inversionista.
