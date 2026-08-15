"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { readCreditConfig, type CreditConfig } from "@/lib/credit-config";

export default function CreditCalculator({
    mode = "user",
}: {
    mode?: "user" | "admin";
}) {
    const [config, setConfig] = useState<CreditConfig | null>(null);

    const [cost, setCost] = useState("");
    const [hasInitialPayment, setHasInitialPayment] = useState(true);
    const [months, setMonths] = useState(12);
    const [productName, setProductName] = useState("");
    const [showWeekly, setShowWeekly] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function syncConfig() {
            const data = await readCreditConfig();
            if (isMounted) {
                setConfig(data);
            }
        }

        syncConfig();

        const interval = setInterval(() => {
            syncConfig();
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const results = useMemo(() => {
        if (!config) {
            return {
                salePrice: 0,
                initialPayment: 0,
                balance: 0,
                monthlyPayment: 0,
                biweeklyPayment: 0,
                weeklyPayment: 0,
            };
        }

        const costNumber = parseCurrency(cost);

        const salePrice = Math.round(
            costNumber + costNumber * (config.profitPercentage / 100),
        );

        const initialPayment = hasInitialPayment
            ? Math.round(salePrice * (config.initialPercentage / 100))
            : 0;

        const balance = salePrice - initialPayment;

        return {
            salePrice,
            initialPayment,
            balance,
            monthlyPayment: months > 0 ? Math.round(balance / months) : 0,
            biweeklyPayment: months > 0 ? Math.round(balance / (months * 2)) : 0,
            weeklyPayment: months > 0 ? Math.round(balance / (months * 4)) : 0,
        };
    }, [config, cost, hasInitialPayment, months]);

    const costNumber = parseCurrency(cost);

    if (!config) {
        return <div className="p-6">Cargando configuración...</div>;
    }

    const summary = costNumber > 0
        ? `
${productName || "Producto"}

Crédito ${months} ${months === 1 ? "mes" : "meses"}: ${currency(results.salePrice)}
${hasInitialPayment ? `Inicial: ${currency(results.initialPayment)}` : "Sin cuota inicial"}
${showWeekly ? `Semanal: ${currency(results.weeklyPayment)}` : `Quincenal: ${currency(results.biweeklyPayment)}`}
`.trim()
        : "Ingrese un costo para ver el resumen";

    return (
        <div className="bg-slate-50 p-4">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
                    Calculadora de Creditos
                </h1>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuracion</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <label className="block space-y-2 text-sm">
                                <span>Nombre del producto</span>
                                <Input
                                    value={productName}
                                    onChange={(event) => setProductName(event.target.value)}
                                />
                            </label>

                            <label className="block space-y-2 text-sm">
                                <span>Costo del producto</span>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="200.000"
                                    value={cost}
                                    onChange={(event) =>
                                        setCost(formatCurrencyInput(event.target.value))
                                    }
                                />
                            </label>

                            {mode === "admin" && (
                                <div className="rounded-md border p-3 text-sm text-slate-500">
                                    Modo administrador activo
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={hasInitialPayment}
                                    onCheckedChange={(checked) =>
                                        setHasInitialPayment(checked === true)
                                    }
                                />
                                <label>Con cuota inicial</label>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[1, 6, 12].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        className={`rounded-md border px-3 py-2 text-sm ${months === option ? "bg-slate-900 text-white" : ""
                                            }`}
                                        onClick={() => setMonths(option)}
                                    >
                                        {option} {option === 1 ? "Mes" : "Meses"}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={showWeekly}
                                    onCheckedChange={(checked) =>
                                        setShowWeekly(checked === true)
                                    }
                                />
                                <label>Mostrar pago semanal</label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resultados</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <ResultRow label="Valor venta" value={currency(results.salePrice)} />
                            <ResultRow label="Cuota inicial" value={currency(results.initialPayment)} />
                            <ResultRow label="Saldo financiado" value={currency(results.balance)} />
                            <ResultRow label="Pago mensual" value={currency(results.monthlyPayment)} />
                            <ResultRow label="Pago quincenal" value={currency(results.biweeklyPayment)} />

                            {showWeekly && (
                                <ResultRow
                                    label="Pago semanal"
                                    value={currency(results.weeklyPayment)}
                                    active
                                />
                            )}

                            <Button
                                disabled={costNumber <= 0}
                                className="w-full"
                                onClick={() => {
                                    navigator.clipboard.writeText(summary);
                                    toast.success("Resumen copiado");
                                }}
                            >
                                Copiar resumen
                            </Button>

                            <div className="mt-4 rounded-3xl border p-4">
                                <div className="mb-2 text-sm font-medium">Vista previa</div>
                                <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ResultRow({
    label,
    value,
    active = false,
}: {
    label: string;
    value: string;
    active?: boolean;
}) {
    return (
        <div
            className={`flex justify-between rounded-lg border p-3 ${active ? "border-slate-900" : ""
                }`}
        >
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
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

function currency(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
}