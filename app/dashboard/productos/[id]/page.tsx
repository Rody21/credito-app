import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductById } from "@/lib/products/products.server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let product;

    try {
        product = await getProductById(id);
    } catch {
        notFound();
    }

    return (
        <main className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{product.name}</h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Stock disponible: {product.stock} unidades
                    </p>
                </div>

                <Button asChild variant="outline">
                    <Link href="/dashboard/productos">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Historial de lotes</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {product.product_batches.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No hay lotes registrados.
                        </p>
                    ) : (
                        product.product_batches.map((batch) => (
                            <div
                                key={batch.id}
                                className="rounded-xl border p-4"
                            >
                                <div className="grid gap-1 text-sm">
                                    <div>
                                        <strong>Cantidad:</strong> {batch.quantity}
                                    </div>

                                    <div>
                                        <strong>Disponible:</strong>{" "}
                                        {batch.remaining_quantity}
                                    </div>

                                    <div>
                                        <strong>Costo:</strong>{" "}
                                        {currency(Number(batch.cost_price))}
                                    </div>

                                    <div>
                                        <strong>Fecha compra:</strong>{" "}
                                        {formatDate(batch.purchase_date)}
                                    </div>

                                    <div>
                                        <strong>Método:</strong>{" "}
                                        {batch.purchase_method === "CASH"
                                            ? "Efectivo"
                                            : "Tarjeta"}
                                    </div>
                                    {batch.purchase_method === "CARD" &&
                                        batch.card_installments && (
                                            <div>
                                                <strong>Cuotas:</strong>{" "}
                                                {batch.card_installments}
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
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

function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
    }).format(new Date(date));
}