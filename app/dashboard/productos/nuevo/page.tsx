"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createProduct } from "@/lib/products/products.client";
import { ArrowLeft } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export default function NuevoProductoPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [quantity, setQuantity] = useState("1");
    const [name, setName] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [purchaseMethod, setPurchaseMethod] = useState<"CASH" | "CARD">("CASH");
    const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(
        new Date()
    );
    const [installments, setInstallments] = useState("1");

    async function handleSubmit() {
        if (saving) return;

        const cost = parseCurrency(costPrice);

        if (!name.trim()) {
            toast.error("El nombre es obligatorio");
            return;
        }

        if (cost <= 0) {
            toast.error("El costo debe ser mayor a cero");
            return;
        }

        setSaving(true);

        try {
            await createProduct({
                name: name.trim(),
                quantity: Number(quantity),
                cost_price: cost,
                purchase_method: purchaseMethod,
                purchase_date: purchaseDate,
                card_installments:
                    purchaseMethod === "CARD"
                        ? Number(installments)
                        : null,
            });

            toast.success("Producto creado");

            router.push("/dashboard/productos");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "No se pudo crear el producto"
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="mx-auto max-w-xl p-6">
            <Card>
                <CardHeader className="space-y-0">
                    <div className="flex items-center justify-between">
                        <CardTitle>Nuevo producto</CardTitle>

                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 hover:bg-slate-100"
                            onClick={() =>
                                router.push("/dashboard/productos")
                            }
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                        <span>Nombre</span>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del producto"
                        />
                    </div>

                    <div className="space-y-2 text-sm">
                        <span>Costo</span>
                        <Input
                            inputMode="numeric"
                            value={costPrice}
                            onChange={(e) =>
                                setCostPrice(formatCurrencyInput(e.target.value))
                            }
                            placeholder="500.000"
                        />
                    </div>
                    <div className="space-y-2 text-sm">
                        <span>Cantidad</span>
                        <Input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 text-sm">
                        <span>Fecha de compra</span>
                        <DatePicker date={purchaseDate} setDate={setPurchaseDate} />
                    </div>
                    <div className="space-y-2 text-sm">
                        <span>Método de compra</span>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={purchaseMethod === "CASH" ? "default" : "outline"}
                                onClick={() => setPurchaseMethod("CASH")}
                            >
                                Efectivo
                            </Button>

                            <Button
                                type="button"
                                variant={purchaseMethod === "CARD" ? "default" : "outline"}
                                onClick={() => setPurchaseMethod("CARD")}
                            >
                                Tarjeta
                            </Button>
                        </div>

                        {purchaseMethod === "CARD" && (
                            <div className="space-y-2 text-sm">
                                <span>Cuotas</span>

                                <Input
                                    type="number"
                                    min={1}
                                    value={installments}
                                    onChange={(e) => setInstallments(e.target.value)}
                                    placeholder="12"
                                />
                            </div>
                        )}
                    </div>

                    <Button
                        type="button"
                        className="w-full cursor-pointer"
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? "Guardando..." : "Guardar producto"}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}

function parseCurrency(value: string) {
    return Number(value.replace(/\D/g, "")) || 0;
}

function formatCurrencyInput(value: string) {
    const raw = value.replace(/\D/g, "");
    if (!raw) return "";
    return new Intl.NumberFormat("es-CO").format(Number(raw));
}