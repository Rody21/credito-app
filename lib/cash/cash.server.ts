import { createClient } from '@/lib/server';
import type { CashMovement } from '@/types/database';

export type CashSummary = {
  income: number;
  expenses: number;
  balance: number;
};

export function calculateCashSummary(movements: CashMovement[]): CashSummary {
  return movements.reduce(
    (summary, movement) => {
      const amount = Number(movement.amount);

      if (movement.movement_type === 'EXPENSE') {
        summary.expenses += amount;
        summary.balance -= amount;
      } else {
        summary.income += amount;
        summary.balance += amount;
      }

      return summary;
    },
    {
      income: 0,
      expenses: 0,
      balance: 0,
    },
  );
}

export async function getCashMovements() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cash_movements')
    .select('*')
    .order('movement_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []) as CashMovement[];
}

export async function createCashMovement(input: {
  movement_type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description?: string;
  movement_date: Date;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cash_movements')
    .insert({
      movement_type: input.movement_type,
      category: input.category,
      amount: Math.round(input.amount),
      description: input.description ?? null,
      movement_date: input.movement_date.toISOString().slice(0, 10),
      reference_id: null,
    })
    .select()
    .single();

  if (error) throw error;

  return data as CashMovement;
}
