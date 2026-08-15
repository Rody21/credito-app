import { createClient } from '@/lib/server';
import type { Customer, Product, Sale } from '@/types/database';

export type SaleWithDetails = Sale & {
  customer?: Customer;
  product?: Product;
};

export async function getSalesDashboardData() {
  const supabase = await createClient();

  const [salesResult, customersResult, productsResult, batchesResult] =
    await Promise.all([
      supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false }),

      supabase.from('customers').select('*').order('full_name'),

      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }),

      supabase
        .from('product_batches')
        .select('*')
        .order('purchase_date', { ascending: false }),
    ]);

  if (salesResult.error) throw salesResult.error;
  if (customersResult.error) throw customersResult.error;
  if (productsResult.error) throw productsResult.error;
  if (batchesResult.error) throw batchesResult.error;

  const customers = (customersResult.data ?? []) as Customer[];
  const products = (productsResult.data ?? []) as Product[];
  const batches = batchesResult.data ?? [];

  const productsWithBatches = products.map((product) => ({
    ...product,
    product_batches: batches.filter((batch) => batch.product_id === product.id),
  }));

  const customersById = new Map(
    customers.map((customer) => [customer.id, customer]),
  );

  const productsById = new Map(
    productsWithBatches.map((product) => [product.id, product]),
  );

  const sales = ((salesResult.data ?? []) as Sale[]).map((sale) => {
    return {
      ...sale,
      customer: customersById.get(sale.customer_id),
      product: productsById.get(sale.product_id),
    };
  });

  return {
    customers,
    products: productsWithBatches,
    sales,
  };
}