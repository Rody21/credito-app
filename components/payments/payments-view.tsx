"use client";

import { useMemo, useState } from "react";

import PaymentsFilters from "./payments-filters";
import PaymentsList from "./payments-list";
import PaymentsSummary from "./payments-summary";
import { currency } from "./payments-utils";

import type {
    PaymentsDashboardData,
} from "@/lib/payments/payments.server";


type Props = {
    data: PaymentsDashboardData;
};

export default function PaymentsView({
    data,
}: Props) {

    const [search, setSearch] = useState("");

    const [status, setStatus] =
        useState("all");

    const [sort, setSort] = useState("debt-desc");

    const filteredSales = useMemo(() => {

        let sales = [...data.sales];

        const term = search
            .trim()
            .toLowerCase();

        if (term) {

            sales = sales.filter((sale) => {

                const customer =
                    sale.customer?.full_name?.toLowerCase() ?? "";

                const product =
                    sale.product?.name?.toLowerCase() ?? "";

                return (
                    customer.includes(term) ||
                    product.includes(term)
                );

            });

        }

        switch (status) {

            case "pending":

                sales = sales.filter(
                    (sale) => sale.pending_amount > 0
                );

                break;

            case "paid":

                sales = sales.filter(
                    (sale) => sale.pending_amount <= 0
                );

                break;

            case "overdue":

                sales = sales.filter(
                    (sale) => sale.hasOverdueInstallments
                );

                break;

            default:
                break;

        }

        switch (sort) {

            case "debt-desc":

                sales.sort(
                    (a, b) =>
                        b.pending_amount - a.pending_amount
                );

                break;

            case "debt-asc":

                sales.sort(
                    (a, b) =>
                        a.pending_amount - b.pending_amount
                );

                break;

            case "customer-asc":

                sales.sort((a, b) =>
                    (a.customer?.full_name ?? "").localeCompare(
                        b.customer?.full_name ?? ""
                    )
                );

                break;

            case "customer-desc":

                sales.sort((a, b) =>
                    (b.customer?.full_name ?? "").localeCompare(
                        a.customer?.full_name ?? ""
                    )
                );

                break;

            case "recent":

                sales.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );

                break;

            case "oldest":

                sales.sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                );

                break;
        }

        return sales;

    }, [data.sales, search, status, sort]);

    const filteredPendingAmount = useMemo(
        () =>
            filteredSales.reduce(
                (total, sale) => total + sale.pending_amount,
                0
            ),
        [filteredSales]
    );

    return (
        <div className="space-y-6">

            <PaymentsSummary
                summary={data.summary}
            />

            <PaymentsFilters
                value={search}
                onChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                sort={sort}
                onSortChange={setSort}
            />

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                    {filteredSales.length}{" "}
                    {filteredSales.length === 1
                        ? "resultado"
                        : "resultados"}
                </p>

                <p className="text-sm font-medium">
                    Pendiente: {currency(filteredPendingAmount)}
                </p>

            </div>

            <PaymentsList
                sales={filteredSales}
            />

        </div>
    );

}