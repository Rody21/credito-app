import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export type CreditConfig = {
  profitPercentage: number;
  initialPercentage: number;
};

const DEFAULT_CONFIG: CreditConfig = {
  profitPercentage: 40,
  initialPercentage: 30,
};

export async function readCreditConfig() {
  const { data, error } = await supabase
    .from('credit_config')
    .select('profit_percentage, initial_percentage')
    .eq('id', 'global')
    .maybeSingle();
  if (error || !data) return DEFAULT_CONFIG;

  return {
    profitPercentage: data.profit_percentage,
    initialPercentage: data.initial_percentage,
  };
}

export async function saveCreditConfig(config: CreditConfig) {
  const response = await fetch('/api/admin/credit-config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Error saving config');
  }

  return response.json();
}
