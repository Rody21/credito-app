import { useMemo } from 'react';

export function useCreditCalculator({
  cost,
  profitPercentage,
  initialPercentage,
  hasInitialPayment,
  months,
}: {
  cost: string;
  profitPercentage: string;
  initialPercentage: string;
  hasInitialPayment: boolean;
  months: number;
}) {
  return useMemo(() => {
    const costNumber = Number(cost.replace(/\./g, '')) || 0;
    const profitNumber = Number(profitPercentage) || 0;
    const initialNumber = Number(initialPercentage) || 0;

    const salePrice = costNumber + costNumber * (profitNumber / 100);

    const initialPayment = hasInitialPayment
      ? salePrice * (initialNumber / 100)
      : 0;

    const balance = salePrice - initialPayment;

    const monthlyPayment = months > 0 ? balance / months : 0;
    const biweeklyPayment = months > 0 ? balance / (months * 2) : 0;
    const weeklyPayment = months > 0 ? balance / (months * 4) : 0;

    return {
      salePrice,
      initialPayment,
      balance,
      monthlyPayment,
      biweeklyPayment,
      weeklyPayment,
    };
  }, [cost, profitPercentage, initialPercentage, hasInitialPayment, months]);
}
