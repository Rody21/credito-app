"use client";

import { useMemo, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { DatePicker } from "@/components/ui/date-picker";

import type { CashMovement } from "@/types/database";
import { formatCashCategory } from "@/lib/utils";

import type { DateRange } from "react-day-picker";

export default function CashMovementTable({
    movements,
}: {
    movements: CashMovement[];
}) {
    const [typeFilter, setTypeFilter] = useState<
        "ALL" | "INCOME" | "EXPENSE"
    >("ALL");

    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const categories = useMemo(() => {
        const uniqueCategories = new Map<string, string>();

        movements.forEach((movement) => {
            const category = movement.category;

            if (!uniqueCategories.has(category)) {
                uniqueCategories.set(
                    category,
                    formatCashCategory(category)
                );
            }
        });

        return Array.from(uniqueCategories.entries());
    }, [movements]);

    const hasActiveFilters =
        typeFilter !== "ALL" ||
        categoryFilter !== "ALL" ||
        dateRange?.from !== undefined ||
        dateRange?.to !== undefined;
    const activeFilterCount = [
        typeFilter !== "ALL",
        categoryFilter !== "ALL",
        dateRange?.from !== undefined ||
        dateRange?.to !== undefined,
    ].filter(Boolean).length;

    const filteredMovements = useMemo(() => {
        const startDateValue = formatDateForFilter(
            dateRange?.from
        );

        const endDateValue = formatDateForFilter(
            dateRange?.to
        );

        return movements.filter((movement) => {
            const matchesType =
                typeFilter === "ALL" ||
                movement.movement_type === typeFilter;

            const matchesCategory =
                categoryFilter === "ALL" ||
                movement.category === categoryFilter;

            const movementDate =
                movement.created_at.slice(0, 10);

            const matchesStartDate =
                !startDateValue ||
                movementDate >= startDateValue;

            const matchesEndDate =
                !endDateValue ||
                movementDate <= endDateValue;

            return (
                matchesType &&
                matchesCategory &&
                matchesStartDate &&
                matchesEndDate
            );
        });
    }, [
        movements,
        typeFilter,
        categoryFilter,
        dateRange,
    ]);

    function clearFilters() {
        setTypeFilter("ALL");
        setCategoryFilter("ALL");
        setDateRange(undefined);
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Categoría
                    </label>

                    <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                    >
                        <SelectTrigger className="h-11 w-45 rounded-xl">
                            <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="ALL">
                                Todas
                            </SelectItem>

                            {categories.map(([value, label]) => (
                                <SelectItem
                                    key={value}
                                    value={value}
                                >
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Tipo
                    </label>

                    <Select
                        value={typeFilter}
                        onValueChange={(value) =>
                            setTypeFilter(
                                value as "ALL" | "INCOME" | "EXPENSE"
                            )
                        }
                    >
                        <SelectTrigger className="h-11 w-45 rounded-xl">
                            <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="ALL">
                                Todos
                            </SelectItem>

                            <SelectItem value="INCOME">
                                Ingresos
                            </SelectItem>

                            <SelectItem value="EXPENSE">
                                Egresos
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Fecha
                    </label>

                    <DatePicker
                        mode="range"
                        date={dateRange}
                        setDate={setDateRange}
                        maxDate={new Date()}
                    />
                </div>

                <div className="flex h-11 items-center gap-3">
                    {hasActiveFilters && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {activeFilterCount}{" "}
                            {activeFilterCount === 1
                                ? "filtro activo"
                                : "filtros activos"}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className={`rounded-md border px-3 py-2 text-sm font-medium transition ${hasActiveFilters
                            ? "cursor-pointer border-slate-300 bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                            }`}
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            <div className="text-sm text-slate-500">
                Mostrando {filteredMovements.length} de {movements.length} movimientos
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Monto</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredMovements.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="py-8 text-center text-sm text-slate-500"
                            >
                                No hay movimientos que coincidan con los filtros.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredMovements.map((movement) => (
                            <TableRow key={movement.id}>
                                <TableCell>
                                    {formatDate(movement.movement_date)}
                                </TableCell>

                                <TableCell>
                                    {movement.movement_type === "INCOME"
                                        ? "Ingreso"
                                        : "Egreso"}
                                </TableCell>

                                <TableCell>
                                    {formatCashCategory(movement.category)}
                                </TableCell>

                                <TableCell>
                                    {movement.description ?? "Sin descripción"}
                                </TableCell>

                                <TableCell>
                                    {movement.movement_type === "EXPENSE"
                                        ? "-"
                                        : "+"}
                                    {currency(Number(movement.amount))}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function currency(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-CO").format(
        new Date(value)
    );
}

function formatDateForFilter(date: Date | undefined) {
    if (!date) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}