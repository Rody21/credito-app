import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCashMovementType(movementType: string) {
  const types: Record<string, string> = {
    INCOME: 'Ingreso',
    EXPENSE: 'Egreso',
  };

  return types[movementType] ?? movementType;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function formatCashCategory(category: string) {
  const categories: Record<string, string> = {
    SALE_CASH: 'Venta contado',
    DOWN_PAYMENT: 'Cuota inicial',
    INSTALLMENT_PAYMENT: 'Pago de cuota',
    TRANSPORT: 'Transporte',
    INVENTORY: 'Inventario',
    SERVICES: 'Servicios',
    STATIONERY: 'Papelería',
    MAINTENANCE: 'Mantenimiento',
    OTHER: 'Otros',
    OTHER_INCOME: 'Otros ingresos',
  };

  return categories[category] ?? category;
}

export function formatSaleType(saleType: string) {
  const types: Record<string, string> = {
    CASH: 'Contado',
    CREDIT: 'Crédito',
  };

  return types[saleType] ?? saleType;
}
