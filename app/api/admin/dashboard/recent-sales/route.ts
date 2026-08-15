import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error obteniendo ventas recientes:', error);

    return NextResponse.json(
      { error: 'Error obteniendo las ventas recientes' },
      { status: 500 },
    );
  }

  const sales = (data ?? []).map((sale) => ({
    id: sale.id,
    sale_date: sale.sale_date,
    sale_type: sale.sale_type,
    total_sale_amount: Number(sale.total_sale_amount),
    created_at: sale.created_at,
    customer: Array.isArray(sale.customer)
      ? (sale.customer[0] ?? null)
      : sale.customer,
    product: Array.isArray(sale.product)
      ? (sale.product[0] ?? null)
      : sale.product,
  }));

  return NextResponse.json(sales);
}
