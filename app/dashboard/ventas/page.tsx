import SalesForm from "@/components/sales/sales-form";
import SalesList from "@/components/sales/sales-list";
import { getSalesDashboardData } from "@/lib/sales/sales.server";

export default async function SalesPage({
    searchParams,
}: {
    searchParams?: Promise<{ productId?: string }>;
}) {
    const {
        customers,
        products,
        sales,
    } = await getSalesDashboardData();

    const params = await searchParams;

    const selectedProductId =
        params?.productId ?? "";

    return (
        <main className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Ventas
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Registra ventas y administra pagos.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
                <SalesForm
                    customers={customers}
                    products={products}
                />

                <SalesList
                    sales={sales}
                    selectedProductId={selectedProductId}
                />
            </div>
        </main>
    );
}