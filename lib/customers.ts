import { supabase } from '@/lib/supabase-browser';

export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('active', true)
    .order('full_name');

  if (error) {
    throw error;
  }

  return data;
}

export async function createCustomer(payload: {
  full_name: string;
  document?: string;
  phone?: string;
  address?: string;
  email?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('customers')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCustomer(
  id: string,
  payload: {
    full_name: string;
    document: string;
    phone: string;
    address: string;
    email?: string;
  },
) {
  const { data, error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCustomerNotes(id: string, notes: string) {
  return supabase
    .from('customers')
    .update({
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deactivateCustomer(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .update({
      active: false,
      disabled_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function hasActiveCredits(customerId: string) {
  const { count, error } = await supabase
    .from('sales')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('customer_id', customerId)
    .in('status', ['pending', 'overdue']);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}

export async function hasActiveSales(customerId: string) {
  const { count, error } = await supabase
    .from('sales')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('customer_id', customerId)
    .eq('status', 'ACTIVE');

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}

export async function activateCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .update({ active: true })
    .eq('id', id);

  if (error) throw error;
}
