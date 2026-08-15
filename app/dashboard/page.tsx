"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import RecentCashMovements from "@/components/dashboard/recent-cash-movements";
import RecentSales from "@/components/dashboard/recent-sales";
import type { CashMovement } from "@/types/database";

type DashboardData = {
    clientes: number;
    clientesActivos: number;
    clientesInactivos: number;
    productos: number;
    productosDisponibles: number;
    productosAgotados: number;
    productosDesactivados: number;
    ventas: number;
    ventasContado: number;
    ventasCredito: number;
    valorVentas: number;
    saldoCaja: number;
    ingresosCaja: number;
    egresosCaja: number;
    ventasRecientes: RecentSale[];
    movimientosCajaRecientes: CashMovement[];
};

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

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData>({
        clientes: 0,
        clientesActivos: 0,
        clientesInactivos: 0,
        productos: 0,
        productosDisponibles: 0,
        productosAgotados: 0,
        productosDesactivados: 0,
        ventas: 0,
        ventasContado: 0,
        ventasCredito: 0,
        valorVentas: 0,
        saldoCaja: 0,
        ingresosCaja: 0,
        egresosCaja: 0,
        ventasRecientes: [],
        movimientosCajaRecientes: [],
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    async function fetchData(): Promise<DashboardData> {
        const res = await fetch("/api/admin/dashboard", {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Error cargando el dashboard");
        }

        return res.json();
    }

    useEffect(() => {
        let isMounted = true;

        async function loadInitial() {
            const json = await fetchData();
            if (isMounted) {
                setData(json);
            }
        }

        loadInitial();

        intervalRef.current = setInterval(async () => {
            const json = await fetchData();
            setData(json);
        }, 10000);

        return () => {
            isMounted = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card> <CardContent className="pt-6"> <div className="text-sm text-slate-500"> Clientes </div> <div className="text-3xl font-bold"> {data.clientes} </div> <div className="mt-2 text-sm text-slate-500"> {data.clientesActivos} activos · {data.clientesInactivos} inactivos </div> </CardContent> </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-slate-500">
                            Productos
                        </div>

                        <div className="text-3xl font-bold">
                            {data.productos}
                        </div>

                        <div className="mt-2 text-sm text-slate-500">
                            {data.productosDisponibles} disponibles ·{' '}
                            {data.productosAgotados} agotados
                        </div>

                        {data.productosDesactivados > 0 && (
                            <div className="mt-1 text-sm text-slate-500">
                                {data.productosDesactivados} desactivados
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-slate-500">
                            Ventas
                        </div>

                        <div className="text-3xl font-bold">
                            {data.ventas}
                        </div>

                        <div className="mt-2 text-sm text-slate-500">
                            {data.ventasContado} contado · {data.ventasCredito} crédito
                        </div>

                        <div className="mt-1 text-sm font-medium">
                            {currency(data.valorVentas)} vendidos
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-slate-500">
                            Saldo de caja
                        </div>

                        <div className="text-3xl font-bold">
                            {currency(data.saldoCaja)}
                        </div>

                        <div className="mt-2 text-sm text-slate-500">
                            Ingresos {currency(data.ingresosCaja)} · Egresos{' '}
                            {currency(data.egresosCaja)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <RecentSales sales={data.ventasRecientes} />

                <RecentCashMovements
                    movements={data.movimientosCajaRecientes}
                />
            </div>
        </div>
    );
}

function currency(value: number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(value);
}