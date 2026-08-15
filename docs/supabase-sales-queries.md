# Supabase Sales Queries

These are the database operations expected by the sales module. The current frontend/backend helpers call Supabase table APIs directly. For production financial integrity, the write flows should be moved into Postgres RPC functions so sale, installments, payments and cash movements are updated atomically.

## Official installment table

Use:

```sql
installments
```

Do not write new data to:

```sql
sale_installments
```

## Create a credit sale

Required transaction:

```sql
insert into sales (
  customer_id,
  product_id,
  sale_type,
  sale_date,
  down_payment,
  financed_amount,
  total_sale_amount,
  status
) values (
  :customer_id,
  :product_id,
  'CREDIT',
  :sale_date,
  :down_payment,
  :financed_amount,
  :total_sale_amount,
  'ACTIVE'
) returning *;
```

Then insert generated installments:

```sql
insert into installments (
  sale_id,
  installment_number,
  due_date,
  original_amount,
  paid_amount,
  pending_amount,
  status
) values
  (:sale_id, :number, :due_date, :amount, 0, :amount, 'PENDING');
```

If there is a down payment:

```sql
insert into payments (
  sale_id,
  installment_id,
  amount,
  payment_method
) values (
  :sale_id,
  null,
  :down_payment,
  :payment_method
) returning *;
```

And create the cash movement:

```sql
insert into cash_movements (
  movement_type,
  category,
  amount,
  reference_id,
  description
) values (
  'INCOME',
  'DOWN_PAYMENT',
  :down_payment,
  :payment_id,
  'Cuota inicial'
);
```

## Create a cash sale

Required transaction:

```sql
insert into sales (
  customer_id,
  product_id,
  sale_type,
  sale_date,
  down_payment,
  financed_amount,
  total_sale_amount,
  status
) values (
  :customer_id,
  :product_id,
  'CASH',
  :sale_date,
  0,
  0,
  :total_sale_amount,
  'PAID'
) returning *;
```

Then create payment and cash movement:

```sql
insert into payments (
  sale_id,
  installment_id,
  amount,
  payment_method
) values (
  :sale_id,
  null,
  :total_sale_amount,
  :payment_method
) returning *;
```

```sql
insert into cash_movements (
  movement_type,
  category,
  amount,
  reference_id,
  description
) values (
  'INCOME',
  'SALE_CASH',
  :total_sale_amount,
  :payment_id,
  'Venta de contado'
);
```

## Register a partial payment

Find open installments:

```sql
select *
from installments
where sale_id = :sale_id
  and pending_amount > 0
order by due_date asc, installment_number asc;
```

Apply payment to the selected installment or oldest pending installments:

```sql
insert into payments (
  sale_id,
  installment_id,
  amount,
  payment_method
) values (
  :sale_id,
  :installment_id,
  :amount_to_apply,
  :payment_method
) returning *;
```

```sql
update installments
set
  paid_amount = paid_amount + :amount_to_apply,
  pending_amount = pending_amount - :amount_to_apply,
  status = case
    when pending_amount - :amount_to_apply = 0 then 'PAID'
    else 'PARTIAL'
  end
where id = :installment_id;
```

```sql
insert into cash_movements (
  movement_type,
  category,
  amount,
  reference_id,
  description
) values (
  'INCOME',
  'INSTALLMENT_PAYMENT',
  :amount_to_apply,
  :payment_id,
  :description
);
```

Update sale status:

```sql
update sales
set status = case
  when exists (
    select 1
    from installments
    where sale_id = :sale_id
      and pending_amount > 0
  )
  then 'ACTIVE'
  else 'PAID'
end
where id = :sale_id;
```

## Recommended RPCs

Recommended production functions:

- `create_cash_sale(payload jsonb)`
- `create_credit_sale(payload jsonb)`
- `register_sale_payment(payload jsonb)`

These RPCs should run inside a single Postgres transaction and enforce:

- payment amount > 0
- payment amount <= pending balance
- installment totals equal financed amount
- every payment has one matching cash movement
- sale status matches the remaining balance
