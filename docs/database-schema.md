# Database Schema - PLG Capital

## Descripción General

La base de datos está diseñada para gestionar:

* Clientes
* Productos
* Ventas
* Cuotas
* Pagos
* Movimientos de caja

---

# Tabla: customers

Información de los clientes.

| Campo      | Tipo         | Nulo |
| ---------- | ------------ | ---- |
| id         | uuid         | No   |
| document   | varchar(50)  | Sí   |
| full_name  | varchar(255) | No   |
| phone      | varchar(50)  | Sí   |
| address    | text         | Sí   |
| email      | varchar(255) | Sí   |
| notes      | text         | Sí   |
| created_at | timestamptz  | Sí   |

### Relaciones

Actualmente no posee claves foráneas salientes.

---

# Tabla: products

Catálogo de productos disponibles para venta.

| Campo      | Tipo          | Nulo |
| ---------- | ------------- | ---- |
| id         | uuid          | No   |
| name       | varchar(255)  | No   |
| cost_price | numeric(12,2) | No   |
| cash_price | numeric(12,2) | No   |
| active     | boolean       | Sí   |
| created_at | timestamptz   | Sí   |

### Relaciones

Actualmente no posee claves foráneas salientes.

---

# Tabla: sales

Registro principal de ventas.

| Campo             | Tipo          | Nulo |
| ----------------- | ------------- | ---- |
| id                | uuid          | No   |
| customer_id       | uuid          | No   |
| product_id        | uuid          | No   |
| sale_type         | varchar(20)   | No   |
| sale_date         | date          | No   |
| down_payment      | numeric(12,2) | Sí   |
| financed_amount   | numeric(12,2) | No   |
| total_sale_amount | numeric(12,2) | No   |
| status            | varchar(20)   | Sí   |
| created_at        | timestamptz   | Sí   |

### Relaciones

* customer_id → customers.id
* product_id → products.id

### Estados conocidos

* ACTIVE

### Tipos conocidos

* CASH
* CREDIT

---

# Tabla: sale_installments

Cuotas asociadas a una venta.

| Campo              | Tipo          | Nulo |
| ------------------ | ------------- | ---- |
| id                 | uuid          | No   |
| sale_id            | uuid          | No   |
| installment_number | integer       | No   |
| due_date           | date          | No   |
| amount             | numeric(12,2) | No   |
| paid_amount        | numeric(12,2) | Sí   |
| status             | varchar(20)   | Sí   |
| created_at         | timestamptz   | Sí   |

### Relaciones

* sale_id → sales.id

### Eliminación

ON DELETE CASCADE

### Estados conocidos

* PENDING

---

# Tabla: installments

Tabla alternativa de cuotas actualmente existente en la base de datos.

| Campo              | Tipo          | Nulo |
| ------------------ | ------------- | ---- |
| id                 | uuid          | No   |
| sale_id            | uuid          | No   |
| installment_number | integer       | No   |
| due_date           | date          | No   |
| original_amount    | numeric(12,2) | No   |
| paid_amount        | numeric(12,2) | No   |
| pending_amount     | numeric(12,2) | No   |
| status             | varchar(20)   | No   |
| created_at         | timestamptz   | Sí   |

### Relaciones

* sale_id → sales.id

### Observación

Debe verificarse si esta tabla reemplaza o complementa a sale_installments.

---

# Tabla: payments

Pagos realizados por los clientes.

| Campo          | Tipo          | Nulo |
| -------------- | ------------- | ---- |
| id             | uuid          | No   |
| sale_id        | uuid          | No   |
| installment_id | uuid          | Sí   |
| amount         | numeric(12,2) | No   |
| payment_method | varchar(50)   | Sí   |
| payment_date   | timestamptz   | Sí   |

### Relaciones

* sale_id → sales.id
* installment_id → sale_installments.id

---

# Tabla: cash_movements

Libro de movimientos de caja.

| Campo         | Tipo          | Nulo |
| ------------- | ------------- | ---- |
| id            | uuid          | No   |
| movement_type | varchar(20)   | No   |
| category      | varchar(50)   | No   |
| amount        | numeric(12,2) | No   |
| reference_id  | uuid          | Sí   |
| description   | text          | Sí   |
| created_at    | timestamptz   | Sí   |

### Uso esperado

Registro de:

* Entradas de dinero
* Salidas de dinero
* Pagos recibidos
* Gastos operativos

---

# Diagrama Relacional

customers

└── sales

    ├── products

    ├── sale_installments

    │

    └── payments

cash_movements

(independiente)

---

# Pendientes de Diseño

## Inversionistas

Tabla propuesta:

* investors

## Inversiones

Tabla propuesta:

* investor_investments

## Distribución de utilidades

Tabla propuesta:

* profit_distributions

## Gastos

Tabla propuesta:

* expenses

## Auditoría

Tabla propuesta:

* audit_logs

---

# Observaciones Técnicas

1. Existe posible duplicidad entre:

   * sale_installments
   * installments

2. Debe identificarse cuál es la tabla oficial utilizada por la aplicación.

3. Se recomienda migrar todos los cambios futuros mediante scripts SQL versionados en:

supabase/migrations
