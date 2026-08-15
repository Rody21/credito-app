import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductsWithSaleStatus } from "@/lib/products/products.server";

export default async function ProductsPage() {
    const products = await getProductsWithSaleStatus();

    return (
        <main className="space-y-6 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Productos
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Catalogo y estado comercial de cada producto.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/dashboard/productos/nuevo">
                        Añadir producto
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {products.map((product) => (
                    <Card key={product.id}>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="font-semibold">
                                        {product.name}
                                    </div>

                                    <div className="mt-2 text-sm text-slate-600">
                                        Stock disponible: {product.stock} unidades
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${product.stock > 0
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-amber-100 text-amber-800"
                                            }`}
                                    >
                                        {product.stock > 0 ? "En inventario" : "Agotado"}
                                    </span>

                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/dashboard/productos/${product.id}`}>
                                            Ver detalle
                                        </Link>
                                    </Button>

                                    {product.stock > 0 && (
                                        <Button asChild size="sm">
                                            <Link href={`/dashboard/ventas?productId=${product.id}`}>
                                                Vender
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {products.length === 0 && (
                    <div className="rounded-3xl border p-6 text-sm text-slate-500">
                        Aun no hay productos registrados.
                    </div>
                )}
            </div>
        </main>
    );
}