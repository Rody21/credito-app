'use client';

import { supabase } from '@/lib/supabase-browser';
import type { Installment, Payment } from '@/types/database';

const INSTALLMENTS_TABLE = 'installments';

export type RegisterPaymentInput = {
  saleId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  notes: string;
};

async function getOpenInstallments(saleId: string) {
  const query = supabase
    .from(INSTALLMENTS_TABLE)
    .select('*')
    .eq('sale_id', saleId)
    .gt('pending_amount', 0)
    .order('due_date', { ascending: true })
    .order('installment_number', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as Installment[];
}

function roundCurrency(value: number) {
  return Math.round(value);
}

export async function registerPartialPayment(input: RegisterPaymentInput) {
  if (!input.saleId) throw new Error('La venta es obligatoria.');

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('El pago debe ser mayor a cero.');
  }

  const installments = await getOpenInstallments(input.saleId);

  const totalPending = installments.reduce(
    (t, i) => t + Number(i.pending_amount),
    0,
  );

  if (totalPending <= 0) {
    throw new Error('La venta no tiene cuotas pendientes.');
  }

  let remaining = roundCurrency(input.amount);

  for (const installment of installments) {
    if (remaining <= 0) break;

    const pending = Number(installment.pending_amount);
    const apply = Math.min(remaining, pending);

    await createPaymentAndCashMovement({
      saleId: input.saleId,
      installmentId: installment.id,
      amount: apply,
      paymentMethod: input.paymentMethod,
      paymentDate: input.paymentDate,
      notes: input.notes,
      category: 'INSTALLMENT_PAYMENT',
      description: `Pago cuota ${installment.installment_number}`,
    });

    await supabase
      .from(INSTALLMENTS_TABLE)
      .update({
        paid_amount: roundCurrency(Number(installment.paid_amount) + apply),
        pending_amount: roundCurrency(pending - apply),
        status: pending - apply === 0 ? 'PAID' : 'PARTIAL',
      })
      .eq('id', installment.id);

    remaining = roundCurrency(remaining - apply);
  }

  await refreshSaleStatus(input.saleId);
}

async function refreshSaleStatus(saleId: string) {
  const installments = await getOpenInstallments(saleId);
  const { error } = await supabase
    .from('sales')
    .update({
      status: installments.length === 0 ? 'PAID' : 'ACTIVE',
    })
    .eq('id', saleId);

  if (error) throw error;
}

async function createPaymentAndCashMovement({
  saleId,
  installmentId,
  amount,
  paymentMethod,
  paymentDate,
  notes,
  category,
  description,
}: {
  saleId: string;
  installmentId: string | null;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  notes: string;
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
      payment_date: paymentDate,
      notes,
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
      reference_id: (payment as Payment).id,
      description,
    });

  if (movementError) throw movementError;
}

export async function getPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('payment_date', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}
