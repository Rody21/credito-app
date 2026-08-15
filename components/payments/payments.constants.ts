export const PAYMENT_METHODS = [
  'Efectivo',
  'Transferencia',
  'Nequi',
  'Daviplata',
] as const;

export const PAYMENT_TYPES = [
  {
    value: 'INSTALLMENT',
    label: 'Pago de cuota',
  },
  {
    value: 'FULL',
    label: 'Pago total',
  },
  {
    value: 'CUSTOM',
    label: 'Otro valor',
  },
] as const;
