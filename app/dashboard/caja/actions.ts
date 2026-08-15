'use server';

import { createCashMovement } from '@/lib/cash/cash.server';

export async function createCashMovementAction(input: {
  movement_type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description?: string;
  movement_date: Date;
}) {
  return await createCashMovement(input);
}
