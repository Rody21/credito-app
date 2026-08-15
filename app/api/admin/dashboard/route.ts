import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const [
    { count: clientes },
    { count: clientesActivos },
    { data: products, error: productsError },
    { data: sales, error: salesError },
    { data: cashMovements, error: cashError },
  ] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),

    supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('active', true),

    supabase.from('products').select(`
                id,
                active,
                product_batches (
                    remaining_quantity
                )
            `),

    supabase
      .from('sales')
      .select(
        `
                id,
                sale_date,
                sale_type,
                total_sale_amount,
                created_at,
                customer:customers (
                    id,
                    full_name
                ),
                product:products (
                    id,
                    name
                )
            `,
      )
      .order('created_at', { ascending: false }),

    supabase
      .from('cash_movements')
      .select(
        `
                id,
                movement_type,
                category,
                amount,
                reference_id,
                description,
                movement_date,
                created_at
            `,
      )
      .order('movement_date', { ascending: false })
      .order('created_at', { ascending: false }),
  ]);

  if (cashError) {
    console.error('Error obteniendo movimientos de caja:', cashError);

    return NextResponse.json(
      { error: 'Error obteniendo los movimientos de caja' },
      { status: 500 },
    );
  }

  if (productsError) {
    console.error('Error obteniendo productos:', productsError);

    return NextResponse.json(
      { error: 'Error obteniendo los productos' },
      { status: 500 },
    );
  }

  if (salesError) {
    console.error('Error obteniendo ventas:', salesError);

    return NextResponse.json(
      { error: 'Error obteniendo las ventas' },
      { status: 500 },
    );
  }

  const clientesTotal = clientes ?? 0;
  const clientesActivosTotal = clientesActivos ?? 0;

  const caja = (cashMovements ?? []).reduce(
    (summary, movement) => {
      const amount = Number(movement.amount ?? 0);

      if (movement.movement_type === 'EXPENSE') {
        summary.egresos += amount;
        summary.saldo -= amount;
      } else {
        summary.ingresos += amount;
        summary.saldo += amount;
      }

      return summary;
    },
    {
      ingresos: 0,
      egresos: 0,
      saldo: 0,
    },
  );

  const productosTotal = products?.length ?? 0;

  let productosDisponibles = 0;
  let productosAgotados = 0;
  let productosDesactivados = 0;

  for (const product of products ?? []) {
    if (!product.active) {
      productosDesactivados++;
      continue;
    }

    const remainingQuantity = (product.product_batches ?? []).reduce(
      (total, batch) => total + Number(batch.remaining_quantity ?? 0),
      0,
    );

    if (remainingQuantity > 0) {
      productosDisponibles++;
    } else {
      productosAgotados++;
    }
  }

  const ventasTotal = sales?.length ?? 0;

  const ventasContado =
    sales?.filter((sale) => sale.sale_type === 'CASH').length ?? 0;

  const ventasCredito =
    sales?.filter((sale) => sale.sale_type === 'CREDIT').length ?? 0;

  const valorVentas = (sales ?? []).reduce(
    (total, sale) => total + Number(sale.total_sale_amount ?? 0),
    0,
  );

  const ventasRecientes = (sales ?? []).slice(0, 5).map((sale) => ({
    id: sale.id,
    sale_date: sale.sale_date,
    sale_type: sale.sale_type,
    total_sale_amount: Number(sale.total_sale_amount ?? 0),
    created_at: sale.created_at,
    customer: Array.isArray(sale.customer)
      ? (sale.customer[0] ?? null)
      : sale.customer,
    product: Array.isArray(sale.product)
      ? (sale.product[0] ?? null)
      : sale.product,
  }));

  const movimientosCajaRecientes = (cashMovements ?? []).slice(0, 5);

  return NextResponse.json({
    clientes: clientesTotal,
    clientesActivos: clientesActivosTotal,
    clientesInactivos: clientesTotal - clientesActivosTotal,

    productos: productosTotal,
    productosDisponibles,
    productosAgotados,
    productosDesactivados,

    ventas: ventasTotal,
    ventasContado,
    ventasCredito,
    valorVentas,
    ventasRecientes,

    saldoCaja: caja.saldo,
    ingresosCaja: caja.ingresos,
    egresosCaja: caja.egresos,
    movimientosCajaRecientes,
  });
}
