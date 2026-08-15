"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { createCashMovementAction } from "@/app/dashboard/caja/actions";

import {
    EXPENSE_CATEGORIES,
    INCOME_CATEGORIES,
} from "./cash.constants";

import { formatCashCategory } from "@/lib/utils";

import { DatePicker } from "@/components/ui/date-picker";

export default function CashMovementDialog() {
    const [movementType, setMovementType] = useState<
        "INCOME" | "EXPENSE"
    >("EXPENSE");

    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [open, setOpen] = useState(false);

    const router = useRouter();

    const [movementDate, setMovementDate] = useState<
        Date | undefined
    >(new Date());

    async function handleSubmit() {
        setError("");

        const numericAmount = Number(amount);

        if (!category) {
            setError("Selecciona una categoría.");
            return;
        }

        if (!numericAmount || numericAmount <= 0) {
            setError("El monto debe ser mayor que cero.");
            return;
        }

        if (!movementDate) {
            setError("Selecciona una fecha.");
            return;
        }

        setLoading(true);

        try {
            await createCashMovementAction({
                movement_type: movementType,
                category,
                amount: numericAmount,
                description: description || undefined,
                movement_date: movementDate,
            });
            resetForm();
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            setError("No fue posible guardar el movimiento.");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setMovementType("EXPENSE");
        setCategory("");
        setAmount("");
        setDescription("");
        setMovementDate(new Date());
        setError("");
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button>
                    Nuevo movimiento
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Nuevo movimiento de caja
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tipo
                        </label>

                        <Select
                            value={movementType}
                            onValueChange={(value) => {
                                setMovementType(
                                    value as "INCOME" | "EXPENSE"
                                );
                                setCategory("");
                            }}
                        >
                            <SelectTrigger className="h-11 w-full rounded-xl">
                                <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="EXPENSE">
                                    Egreso
                                </SelectItem>

                                <SelectItem value="INCOME">
                                    Ingreso
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Categoría
                        </label>

                        <Select
                            value={category}
                            onValueChange={setCategory}
                        >
                            <SelectTrigger className="h-11 w-full rounded-xl">
                                <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>

                            <SelectContent>
                                {(
                                    movementType === "EXPENSE"
                                        ? EXPENSE_CATEGORIES
                                        : INCOME_CATEGORIES
                                ).map((item) => (
                                    <SelectItem
                                        key={item}
                                        value={item}
                                    >
                                        {formatCashCategory(item)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm">
                            Monto
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            className="mt-1 w-full rounded-md border p-2"
                            value={
                                amount
                                    ? new Intl.NumberFormat("es-CO").format(
                                        Number(amount)
                                    )
                                    : ""
                            }
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setAmount(value);
                            }}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Descripción
                        </label>

                        <textarea
                            className="mt-1 w-full rounded-md border p-2"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Fecha del movimiento
                        </label>

                        <DatePicker
                            date={movementDate}
                            setDate={setMovementDate}
                            maxDate={new Date()}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Guardando..."
                            : "Guardar movimiento"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}