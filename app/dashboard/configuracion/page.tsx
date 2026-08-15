"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { readCreditConfig, saveCreditConfig } from "@/lib/credit-config";

export default function ConfigPage() {
    const [profit, setProfit] = useState("");
    const [initial, setInitial] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const config = await readCreditConfig();
            setProfit(String(config.profitPercentage));
            setInitial(String(config.initialPercentage));
            setLoading(false);
        }

        load();
    }, []);

    const saveConfig = async () => {
        setSaving(true);

        try {
            await saveCreditConfig({
                profitPercentage: Number(profit) || 0,
                initialPercentage: Number(initial) || 0,
            });

            toast.success("Configuración actualizada");
        } catch {
            toast.error("Error al guardar configuración");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6">Cargando configuración...</div>;
    }

    return (
        <div className="mx-auto max-w-xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración de créditos</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <label className="block space-y-2 text-sm">
                        <span>Utilidad (%)</span>
                        <Input
                            inputMode="numeric"
                            value={profit}
                            onChange={(e) => setProfit(onlyDigits(e.target.value))}
                        />
                    </label>

                    <label className="block space-y-2 text-sm">
                        <span>Cuota inicial (%)</span>
                        <Input
                            inputMode="numeric"
                            value={initial}
                            onChange={(e) => setInitial(onlyDigits(e.target.value))}
                        />
                    </label>

                    <Button onClick={saveConfig} className="w-full" disabled={saving}>
                        {saving ? "Guardando..." : "Guardar configuración"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function onlyDigits(value: string) {
    return value.replace(/\D/g, "");
}