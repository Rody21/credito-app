import { createClient } from '@/lib/server';

import type {
  Customer,
  Installment,
  Payment,
  Product,
  Sale,
} from '@/types/database';

export type SalePaymentDetails = Sale & {
  customer?: Customer;
  product?: Product;
  installments: Installment[];
  payments: Payment[];
  paid_amount: number;
  pending_amount: number;
};

export type PaymentsSummary = {
  totalCredits: number;
  totalPending: number;
  totalCollected: number;
  overdueInstallments: number;
  dueToday: number;
};

export type SalePaymentSummary = SalePaymentDetails & {
  progressPercentage: number;
  nextInstallment?: Installment;
  hasOverdueInstallments: boolean;
};

export type PaymentsDashboardData = {
  summary: PaymentsSummary;
  sales: SalePaymentSummary[];
};

export async function getPaymentsDashboardData(): Promise<PaymentsDashboardData> {
  const supabase = await createClient();

  const [
    salesResult,
    customersResult,
    productsResult,
    installmentsResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from('sales')
      .select('*')
      .eq('sale_type', 'CREDIT')
      .order('created_at', { ascending: false }),

    supabase.from('customers').select('*').order('full_name'),

    supabase.from('products').select('*'),

    supabase.from('installments').select('*').order('installment_number'),

    supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false }),
  ]);

  if (salesResult.error) throw salesResult.error;
  if (customersResult.error) throw customersResult.error;
  if (productsResult.error) throw productsResult.error;
  if (installmentsResult.error) throw installmentsResult.error;
  if (paymentsResult.error) throw paymentsResult.error;

  const customers = customersResult.data ?? [];
  const products = productsResult.data ?? [];
  const installments = installmentsResult.data ?? [];
  const payments = paymentsResult.data ?? [];

  const customersById = new Map(
    customers.map((customer) => [customer.id, customer]),
  );

  const productsById = new Map(
    products.map((product) => [product.id, product]),
  );

  const installmentsBySale = groupInstallments(installments);
  const paymentsBySale = groupPayments(payments);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const summary: PaymentsSummary = {
    totalCredits: 0,
    totalPending: 0,
    totalCollected: 0,
    overdueInstallments: 0,
    dueToday: 0,
  };

  const sales = ((salesResult.data ?? []) as Sale[]).map((sale) => {
    const saleInstallments = installmentsBySale.get(sale.id) ?? [];

    const salePayments = paymentsBySale.get(sale.id) ?? [];

    const pendingAmount = saleInstallments.reduce(
      (total, installment) => total + Number(installment.pending_amount),
      0,
    );

    const installmentsPaid = saleInstallments.reduce(
      (total, installment) => total + Number(installment.paid_amount),
      0,
    );

    const nextInstallment = saleInstallments.find(
      (installment) => Number(installment.pending_amount) > 0,
    );

    const hasOverdueInstallments = saleInstallments.some((installment) => {
      if (Number(installment.pending_amount) <= 0) {
        return false;
      }

      return new Date(installment.due_date) < today;
    });

    const overdueInstallments = saleInstallments.filter((installment) => {
      if (Number(installment.pending_amount) <= 0) {
        return false;
      }

      return new Date(installment.due_date) < today;
    }).length;

    const dueToday = saleInstallments.filter((installment) => {
      if (Number(installment.pending_amount) <= 0) {
        return false;
      }

      const dueDate = new Date(installment.due_date);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate.getTime() === today.getTime();
    }).length;

    const paidAmount = Number(sale.down_payment) + installmentsPaid;

    const progressPercentage =
      Number(sale.total_sale_amount) === 0
        ? 0
        : Math.round((paidAmount / Number(sale.total_sale_amount)) * 100);

    summary.totalCredits++;

    summary.totalPending += pendingAmount;

    summary.totalCollected += paidAmount;

    summary.overdueInstallments += overdueInstallments;

    summary.dueToday += dueToday;

    return {
      ...sale,
      customer: customersById.get(sale.customer_id),
      product: productsById.get(sale.product_id),
      installments: saleInstallments,
      payments: salePayments,
      paid_amount: paidAmount,
      pending_amount: pendingAmount,
      progressPercentage,
      nextInstallment,
      hasOverdueInstallments,
    };
  });

  return {
    summary,
    sales,
  };
}

function groupInstallments(installments: Installment[]) {
  const map = new Map<string, Installment[]>();

  for (const installment of installments) {
    const current = map.get(installment.sale_id) ?? [];

    current.push(installment);

    map.set(installment.sale_id, current);
  }

  return map;
}

function groupPayments(payments: Payment[]) {
  const map = new Map<string, Payment[]>();

  for (const payment of payments) {
    const current = map.get(payment.sale_id) ?? [];

    current.push(payment);

    map.set(payment.sale_id, current);
  }

  return map;
}
