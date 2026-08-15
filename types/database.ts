export interface Customer {
  id: string;
  document: string;
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
  email: string | null;
}

export type ProductBatch = {
  id: string;
  quantity: number;
  remaining_quantity: number;
  cost_price: number;
  purchase_date: string;
  purchase_method: 'CASH' | 'CARD';
};

export type Product = {
  id: string;
  name: string;
  active: boolean;
  product_batches: ProductBatch[];
};

export interface Sale {
  id: string;
  customer_id: string;
  product_id: string;
  sale_type: string;
  sale_date: string;
  down_payment: number;
  financed_amount: number;
  total_sale_amount: number;
  status: string;
  created_at: string;
}

export interface Installment {
  id: string;
  sale_id: string;
  installment_number: number;
  due_date: string;
  original_amount: number;
  paid_amount: number;
  pending_amount: number;
  status: string;
  created_at: string;
}

export interface Payment {
  id: string;
  sale_id: string;
  installment_id: string | null;
  amount: number;
  payment_method: string | null;
  payment_date: string;
}

export interface CashMovement {
  id: string;
  movement_type: string;
  category: string;
  amount: number;
  reference_id: string | null;
  description: string | null;
  movement_date: string;
  created_at: string;
}
