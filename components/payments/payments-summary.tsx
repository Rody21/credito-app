import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import type { PaymentsSummary } from "@/lib/payments/payments.server";
import { currency } from "./payments-utils";

type Props = {
    summary: PaymentsSummary;
};

export default function PaymentsSummary({
    summary,
}: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Créditos activos
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold">
                        {summary.totalCredits}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Pendiente por cobrar
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold text-red-600">
                        {currency(summary.totalPending)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Cobrado
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold text-emerald-600">
                        {currency(summary.totalCollected)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Cuotas vencidas
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold text-amber-600">
                        {summary.overdueInstallments}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}