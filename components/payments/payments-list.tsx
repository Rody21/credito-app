"use client";

import PaymentCard from "@/components/payments/payments-card"

import type { SalePaymentSummary } from "@/lib/payments/payments.server";

type Props = {
    sales: SalePaymentSummary[];
};

export default function PaymentsList({
    sales,
}: Props) {
    if (sales.length === 0) {
        return (
            <div className="rounded-lg border bg-card p-10 text-center text-slate-500">
                No hay créditos registrados.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {sales.map((sale) => (
                <PaymentCard
                    key={sale.id}
                    sale={sale}
                />
            ))}
        </div>
    );
}