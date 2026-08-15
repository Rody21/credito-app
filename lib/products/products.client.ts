import { supabase } from '@/lib/supabase-browser';

type CreateProductInput = {
  name: string;
  quantity: number;
  cost_price: number;
  purchase_date?: Date;
  purchase_method: 'CASH' | 'CARD';
  card_installments?: number | null;
};

export async function createProduct(payload: CreateProductInput) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: payload.name,
    })
    .select()
    .single();

  if (productError) {
    throw productError;
  }

  const { error: batchError } = await supabase.from('product_batches').insert({
    product_id: product.id,
    quantity: payload.quantity,
    remaining_quantity: payload.quantity,
    cost_price: payload.cost_price,
    purchase_date: payload.purchase_date,
    purchase_method: payload.purchase_method,
    card_installments: payload.card_installments,
  });

  if (batchError) {
    console.error(batchError);
    throw batchError;
  }

  return product;
}

export async function addInventory(
  productId: string,
  payload: {
    quantity: number;
    cost_price: number;
    purchase_date?: Date;
    purchase_method: 'CASH' | 'CARD';
    card_installments: number | null;
  },
) {
  const { error } = await supabase.from('product_batches').insert({
    product_id: productId,
    quantity: payload.quantity,
    remaining_quantity: payload.quantity,
    cost_price: payload.cost_price,
    purchase_date: payload.purchase_date,
    purchase_method: payload.purchase_method,
    card_installments: payload.card_installments,
  });

  if (error) {
    throw error;
  }
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      active,
      product_batches (
        id,
        quantity,
        remaining_quantity,
        cost_price,
        purchase_date,
        purchase_method
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}
