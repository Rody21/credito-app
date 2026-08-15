import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    formatCashCategory,
    formatDate,
} from "@/lib/utils";

import type { CashMovement } from "@/types/database";

type RecentCashMovementsProps = {
    movements: CashMovement[];
};

function currency(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(Math.abs(value));
}

export default function RecentCashMovements({
    movements,
}: RecentCashMovementsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Movimientos recientes</CardTitle>
            </CardHeader>

            <CardContent>
                {movements.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No hay movimientos registrados.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {movements.map((movement) => {
                            const isExpense =
                                movement.movement_type === "EXPENSE";

                            return (
                                <div
                                    key={movement.id}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {movement.description ?? "Sin descripción"}
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            {formatCashCategory(movement.category)}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {formatDate(movement.movement_date)}
                                        </p>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="text-sm font-semibold">
                                            {isExpense ? "- " : "+ "}
                                            {currency(
                                                Number(movement.amount),
                                            )}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {isExpense
                                                ? "Egreso"
                                                : "Ingreso"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}