"use client";

import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import type { SaleWithDetails } from "@/lib/sales/sales.server";

import { currency } from "./sales-utils";

type Props = {
    sales: SaleWithDetails[];
    selectedProductId?: string;
};

export default function SalesList({
    sales,
    selectedProductId = "",
}: Props) {

    const router = useRouter();

    const visibleSales = selectedProductId
        ? sales.filter(
            sale =>
                sale.product_id === selectedProductId
        )
        : sales;

    return (
        <Card>

            <CardHeader>
                <CardTitle>
                    Ventas registradas
                </CardTitle>
            </CardHeader>

            <CardContent>

                <div className="space-y-4">

                    {visibleSales.map((sale) => (

                        <div
                            key={sale.id}
                            className="rounded-2xl border p-5"
                        >

                            <div className="space-y-1">

                                <div className="font-semibold text-lg">
                                    {sale.customer?.full_name}
                                </div>

                                <div className="text-slate-500">
                                    {sale.product?.name}
                                </div>

                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-4">

                                <Metric
                                    label="Fecha"
                                    value={sale.sale_date}
                                />

                                <Metric
                                    label="Tipo"
                                    value={sale.sale_type}
                                />

                                <Metric
                                    label="Estado"
                                    value={sale.status}
                                />

                                <Metric
                                    label="Total"
                                    value={currency(Number(sale.total_sale_amount))}
                                />

                            </div>

                            <div className="mt-5 flex justify-end">

                                <Button
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/pagos?sale=${sale.id}`
                                        )
                                    }
                                >
                                    Ver detalle
                                </Button>

                            </div>

                        </div>

                    ))}

                </div>

            </CardContent>

        </Card>
    );
}

function Metric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {

    return (

        <div>

            <div className="text-sm text-slate-500">
                {label}
            </div>

            <div className="font-medium">
                {value}
            </div>

        </div>

    );

}