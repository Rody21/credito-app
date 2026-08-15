import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    formatDate,
    formatSaleType,
} from "@/lib/utils";

type RecentSale = {
    id: string;
    sale_date: string;
    sale_type: string;
    total_sale_amount: number;
    created_at: string;
    customer: {
        id: string;
        full_name: string;
    } | null;
    product: {
        id: string;
        name: string;
    } | null;
};

type RecentSalesProps = {
    sales: RecentSale[];
};

function currency(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function RecentSales({
    sales,
}: RecentSalesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ventas recientes</CardTitle>
            </CardHeader>

            <CardContent>
                {sales.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No hay ventas registradas.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {sales.map((sale) => (
                            <div
                                key={sale.id}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {sale.customer?.full_name ??
                                            "Cliente desconocido"}
                                    </p>

                                    <p className="truncate text-sm text-slate-500">
                                        {sale.product?.name ??
                                            "Producto desconocido"}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {formatDate(sale.sale_date)}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-semibold">
                                        {currency(
                                            sale.total_sale_amount,
                                        )}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {formatSaleType(
                                            sale.sale_type,
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}