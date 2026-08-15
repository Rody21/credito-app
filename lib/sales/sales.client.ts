import { supabase } from '@/lib/supabase-browser';
import type { CashMovement, Sale } from '@/types/database';

export type SaleType = 'CASH' | 'CREDIT';
export type PaymentFrequency = 'MONTHLY' | 'BIWEEKLY' | 'WEEKLY';

type CreateSaleInput = {
  customerId: string;
  productId: string;
  productBatchId: string;
  saleType: SaleType;
  saleDate: string;
  profitPercentage: number;
  downPaymentPercentage: number;
  months: number;
  frequency: PaymentFrequency;
  paymentMethod: string;
};

const INSTALLMENTS_TABLE = 'installments';

export async function getCashMovements() {
  const { data, error } = await supabase
    .from('cash_movements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []) as CashMovement[];
}

async function createInstallments({
  saleId,
  financedAmount,
  months,
  frequency,
  startDate,
}: {
  saleId: string;
  financedAmount: number;
  months: number;
  frequency: PaymentFrequency;
  startDate: string;
}) {
  const installmentCount = getInstallmentCount(months, frequency);
  const amounts = distributeAmount(financedAmount, installmentCount);
  const rows = amounts.map((amount, index) => ({
    sale_id: saleId,
    installment_number: index + 1,
    due_date: getDueDate(startDate, index + 1, frequency),
    original_amount: amount,
    paid_amount: 0,
    pending_amount: amount,
    status: 'PENDING',
  }));

  const { error } = await supabase.from(INSTALLMENTS_TABLE).insert(rows);

  if (error) throw error;
}

function validateCreateSaleInput(input: CreateSaleInput) {
  if (!input.customerId) throw new Error('El cliente es obligatorio.');
  if (!input.productId) throw new Error('El producto es obligatorio.');
  if (!input.productBatchId) throw new Error('El lote es obligatorio.');
  if (input.saleType === 'CREDIT' && input.months <= 0) {
    throw new Error('El plazo debe ser mayor a cero.');
  }
}

async function createPaymentAndCashMovement({
  saleId,
  installmentId,
  amount,
  paymentMethod,
  category,
  description,
}: {
  saleId: string;
  installmentId: string | null;
  amount: number;
  paymentMethod: string;
  category: string;
  description: string;
}) {
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      sale_id: saleId,
      installment_id: installmentId,
      amount: roundCurrency(amount),
      payment_method: paymentMethod,
    })
    .select()
    .single();

  if (paymentError) throw paymentError;

  const { error: movementError } = await supabase
    .from('cash_movements')
    .insert({
      movement_type: 'INCOME',
      category,
      amount: roundCurrency(amount),
      reference_id: payment.id,
      description,
    });

  if (movementError) throw movementError;
}

async function getProductBatch(productBatchId: string) {
  const { data, error } = await supabase
    .from('product_batches')
    .select('*')
    .eq('id', productBatchId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Lote no encontrado.');

  return data;
}

export async function createSale(input: CreateSaleInput) {
  validateCreateSaleInput(input);

  const batch = await getProductBatch(input.productBatchId);

  const saleDate = input.saleDate || new Date().toISOString().slice(0, 10);

  const cost = Number(batch.cost_price);

  const totalSaleAmount =
    input.saleType === 'CASH'
      ? Number(batch.cash_price)
      : roundCurrency(cost + cost * (input.profitPercentage / 100));

  const downPayment =
    input.saleType === 'CREDIT'
      ? roundCurrency(totalSaleAmount * (input.downPaymentPercentage / 100))
      : 0;

  const financedAmount =
    input.saleType === 'CREDIT'
      ? roundCurrency(totalSaleAmount - downPayment)
      : 0;

  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert({
      customer_id: input.customerId,
      product_id: input.productId,
      sale_type: input.saleType,
      sale_date: saleDate,
      down_payment: downPayment,
      financed_amount: financedAmount,
      total_sale_amount: totalSaleAmount,
      status: input.saleType === 'CASH' ? 'PAID' : 'ACTIVE',
    })
    .select()
    .single();

  if (saleError) throw saleError;

  const nextQuantity = batch.remaining_quantity - 1;

  if (nextQuantity < 0) {
    throw new Error('No hay inventario disponible.');
  }

  const { error: inventoryError } = await supabase
    .from('product_batches')
    .update({
      remaining_quantity: nextQuantity,
    })
    .eq('id', input.productBatchId);

  if (inventoryError) throw inventoryError;

  if (input.saleType === 'CASH') {
    await createPaymentAndCashMovement({
      saleId: sale.id,
      installmentId: null,
      amount: totalSaleAmount,
      paymentMethod: input.paymentMethod,
      category: 'SALE_CASH',
      description: 'Venta de contado',
    });
  }

  if (input.saleType === 'CREDIT') {
    if (downPayment > 0) {
      await createPaymentAndCashMovement({
        saleId: sale.id,
        installmentId: null,
        amount: downPayment,
        paymentMethod: input.paymentMethod,
        category: 'DOWN_PAYMENT',
        description: 'Cuota inicial',
      });
    }

    await createInstallments({
      saleId: sale.id,
      financedAmount,
      months: input.months,
      frequency: input.frequency,
      startDate: saleDate,
    });
  }

  return sale as Sale;
}

function roundCurrency(value: number) {
  return Math.round(value);
}

function getInstallmentCount(months: number, frequency: PaymentFrequency) {
  if (frequency === 'WEEKLY') return months * 4;
  if (frequency === 'BIWEEKLY') return months * 2;
  return months;
}

function distributeAmount(totalAmount: number, count: number) {
  const normalizedTotal = roundCurrency(totalAmount);
  const baseAmount = Math.floor(normalizedTotal / count);
  let remainder = normalizedTotal - baseAmount * count;

  return Array.from({ length: count }, () => {
    const extra = remainder > 0 ? 1 : 0;
    remainder -= extra;
    return baseAmount + extra;
  });
}

function getDueDate(
  startDate: string,
  installmentNumber: number,
  frequency: PaymentFrequency,
) {
  const date = new Date(`${startDate}T00:00:00`);

  if (frequency === 'WEEKLY') {
    date.setDate(date.getDate() + installmentNumber * 7);
  } else if (frequency === 'BIWEEKLY') {
    date.setDate(date.getDate() + installmentNumber * 15);
  } else {
    date.setMonth(date.getMonth() + installmentNumber);
  }

  return date.toISOString().slice(0, 10);
}
