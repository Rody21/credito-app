import PaymentsView from "@/components/payments/payments-view";
import { getPaymentsDashboardData } from "@/lib/payments/payments.server";

export default async function PagosPage() {
    const data = await getPaymentsDashboardData();

    return (
        <main className="space-y-6 p-6">

            <div>

                <h1 className="text-3xl font-bold">
                    Pagos
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Administra los abonos y consulta el estado de las ventas a crédito.
                </p>

            </div>

            <PaymentsView data={data} />

        </main>
    );
}