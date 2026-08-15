# Business Rules

# Objetivo

PLG Capital administra ventas de productos de contado y crédito, el recaudo de cuotas y el control financiero del negocio.

---

# Productos

## BR-001

Todo producto debe tener:

* Nombre
* Costo
* Precio de contado

## BR-002

No se permite crear productos con costo igual o menor a cero.

## BR-003

Los productos pueden marcarse como activos o inactivos.

Los productos inactivos no deben aparecer para nuevas ventas.

---

# Clientes

## BR-010

Todo cliente debe tener nombre completo.

## BR-011

Documento, teléfono y dirección son opcionales.

## BR-012

Un cliente puede tener múltiples ventas.

---

# Ventas

## BR-020

Toda venta debe estar asociada a:

* Un cliente
* Un producto

## BR-021

Una venta puede ser:

* CASH
* CREDIT

## BR-022

Las ventas se crean con estado:

ACTIVE

## BR-023

El valor total de venta nunca puede ser menor al costo del producto.

---

# Ventas de Contado

## BR-030

Las ventas de contado se consideran pagadas al momento de registrarse.

## BR-031

No generan cuotas.

---

# Ventas a Crédito

## BR-040

Toda venta a crédito puede tener cuota inicial.

## BR-041

El valor financiado se calcula como:

valor_total_venta - cuota_inicial

## BR-042

Una venta a crédito genera cuotas programadas.

## BR-043

Cada cuota tiene:

* Número
* Fecha de vencimiento
* Valor
* Estado

---

# Cuotas

## BR-050

Una cuota inicia en estado:

PENDING

## BR-051

Una cuota pasa a estado:

PAID

cuando el valor pagado sea igual al valor de la cuota.

## BR-052

Una cuota puede recibir pagos parciales.

## BR-053

El valor pagado nunca puede superar el saldo pendiente.

---

# Pagos

## BR-060

Todo pago debe estar asociado a una venta.

## BR-061

Un pago puede asociarse a una cuota específica.

## BR-062

Al registrar un pago debe actualizarse:

* Saldo de la cuota
* Estado de la cuota
* Estado de la venta cuando corresponda

---

# Caja

## BR-070

Todo ingreso o egreso debe generar un movimiento de caja.

## BR-071

Los pagos recibidos generan movimientos de ingreso.

## BR-072

Los gastos generan movimientos de egreso.

---

# Reportes

## BR-080

El sistema debe poder calcular:

* Total vendido
* Total recaudado
* Cartera pendiente
* Utilidad estimada

# Reglas Financieras

## BR-100

El precio financiado se calcula aplicando un porcentaje de utilidad sobre el costo del producto.

## BR-101

El plazo de financiación no modifica el valor total vendido.

## BR-102

La utilidad bruta se calcula como:

Utilidad = Valor Total Vendido - Costo del Producto

## BR-103

Los pagos parciales reducen directamente el saldo total pendiente de la venta.

## BR-104

Las cuotas representan una programación de cobro y no una obligación rígida de pago individual.

## BR-105

Las cuotas vencidas generan mora.

La mora debe ser configurable por producto.

## BR-106

La utilidad generada podrá distribuirse entre inversionistas mediante porcentajes configurables.

Por defecto:

* Inversionista 1: 60%
* Inversionista 2: 30%
* Inversionista 3: 10%

# Reglas de Precio y Utilidad

## BR-110

El costo del producto representa únicamente el valor de adquisición.

## BR-111

La utilidad es configurable al momento de realizar una venta.

## BR-112

El porcentaje de utilidad para contado y crédito puede ser diferente.

## BR-113

El precio de contado se calcula como:

Precio Contado = Costo + (Costo × % Utilidad Contado)

## BR-114

El precio financiado se calcula como:

Precio Financiado = Costo + (Costo × % Utilidad Crédito)

## BR-115

El plazo de financiación no modifica el precio financiado.

## BR-116

Las cuotas se calculan dividiendo el valor financiado entre el número de cuotas acordadas.

## BR-117

La utilidad bruta de una venta se calcula como:

Utilidad = Valor Vendido - Costo

## BR-118

La utilidad real se reconoce proporcionalmente a medida que el cliente realiza pagos.

## BR-119

El vendedor puede definir diferentes porcentajes de utilidad para una misma referencia de producto en distintas ventas.

---

# Reglas Pendientes

* Inversionistas
* Distribución de utilidades
* Mora por atraso
* Gastos operativos
* Roles y permisos
