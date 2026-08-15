# Financial Source of Truth

## Decision

`installments` is the official table for scheduled installments.

`sale_installments` must be treated as deprecated. It should not receive new writes, and existing data should be migrated into `installments` before payments are implemented at scale.

Reason:

- `installments` models the current operational need better: original amount, paid amount, pending amount and status.
- `sale_installments` and `installments` represent the same business concept.
- Keeping both makes payments, reports, overdue logic and cash reconciliation ambiguous.

## Real debt vs scheduled installments

The real debt belongs to the sale.

- `sales.total_sale_amount` is the total commercial value of the sale.
- `sales.down_payment` is paid outside the installment schedule.
- `sales.financed_amount` is the principal receivable scheduled into installments.
- Real pending debt is calculated from payments and/or open installments.

The installments are the collection schedule.

- They split `sales.financed_amount` into due dates.
- They should not redefine the sale amount.
- Their sum of `original_amount` must equal `sales.financed_amount`.
- Their sum of `pending_amount` should equal the unpaid financed balance.

Recommended invariant:

```text
sum(installments.original_amount where sale_id = sale.id) = sales.financed_amount
sum(installments.paid_amount) + sum(installments.pending_amount) = sales.financed_amount
sale pending balance = sum(installments.pending_amount)
```

For cash sales:

- `sales.sale_type = CASH`
- `sales.financed_amount = 0`
- no rows in `installments`
- one payment and one cash movement are created for the total sale amount

For credit sales:

- `sales.sale_type = CREDIT`
- optional down payment is recorded as a payment without installment
- the financed amount is split into `installments`
- later payments reduce installments

## Partial payments

Partial payments follow this rule:

1. The payment must be greater than zero.
2. The payment cannot exceed the pending balance unless an explicit overpayment rule is added.
3. If the user selects an installment, the payment applies to that installment.
4. If no installment is selected, the payment applies to the oldest pending installments first.
5. Each applied amount creates:
   - a `payments` row
   - a matching `cash_movements` row
   - an update to `installments.paid_amount`
   - an update to `installments.pending_amount`
   - an update to `installments.status`
6. When all installments are paid, `sales.status` becomes `PAID`.

Installment status rules:

- `PENDING`: no money applied.
- `PARTIAL`: some money applied, but pending amount remains.
- `PAID`: pending amount is zero.
- `OVERDUE`: pending amount remains after due date. This can be calculated or materialized later.

## Final model

Core tables:

- `customers`
- `products`
- `sales`
- `installments`
- `payments`
- `cash_movements`

Deprecated:

- `sale_installments`

Future tables:

- `investors`
- `investor_investments`
- `profit_distributions`
- `expenses`
- `audit_logs`

## Required financial invariants

- A sale must have one customer and one product.
- A cash sale must not have installments.
- A credit sale must have installments if `financed_amount > 0`.
- The total installment original amount must equal the sale financed amount.
- Payments must always create cash movements.
- Payment application and cash movement creation must be atomic in the database.
- Sale status must reflect its real pending balance.
- Historical sale values must not depend on later product price changes.
