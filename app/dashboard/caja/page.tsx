import CashMovementDialog from "@/components/cash/cash-movement-dialog";
import CashMovementTable from "@/components/cash/cash-movement-table";
import {
    calculateCashSummary,
    getCashMovements,
} from "@/lib/cash/cash.server";

export default async function CajaPage() {
    const movements = await getCashMovements();
    const summary = calculateCashSummary(movements);

    return (
        <main className="space-y-6 p-6">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Caja
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Control de ingresos y egresos registrados en la caja.
                    </p>
                </div>

                <CashMovementDialog />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                    <div className="text-sm text-slate-500">
                        Ingresos
                    </div>

                    <div className="mt-2 text-xl font-bold">
                        {currency(summary.income)}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="text-sm text-slate-500">
                        Egresos
                    </div>

                    <div className="mt-2 text-xl font-bold">
                        {currency(summary.expenses)}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="text-sm text-slate-500">
                        Saldo actual
                    </div>

                    <div className="mt-2 text-xl font-bold">
                        {currency(summary.balance)}
                    </div>
                </div>
            </div>

            <CashMovementTable movements={movements} />
        </main>
    );
}

function currency(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
}