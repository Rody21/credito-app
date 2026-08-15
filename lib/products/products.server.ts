import { createClient } from '@/lib/server';

export async function getProductById(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      active,
      created_at,
      product_batches (
        id,
        quantity,
        remaining_quantity,
        cost_price,
        purchase_date,
        purchase_method,
        card_installments,
        created_at
      )
    `,
    )
    .eq('id', productId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Producto no encontrado');

  const stock =
    data.product_batches?.reduce(
      (sum, batch) => sum + batch.remaining_quantity,
      0,
    ) ?? 0;

  return {
    ...data,
    stock,
  };
}

export async function getProductsWithSaleStatus() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('products').select(`
      id,
      name,
      active,
      product_batches (
        remaining_quantity
      )
    `);

  if (error) {
    throw error;
  }

  return data.map((product) => {
    const stock =
      product.product_batches?.reduce(
        (sum, batch) => sum + Number(batch.remaining_quantity),
        0,
      ) ?? 0;

    return {
      id: product.id,
      name: product.name,
      stock,
      sale_status: stock > 0 ? 'AVAILABLE' : 'SOLD',
    };
  });
}
