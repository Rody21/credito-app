"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible";

import {
    Select,
    SelectTrigger,
    SelectItem,
    SelectContent,
    SelectValue
} from "@/components/ui/select"


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { DatePicker } from "@/components/ui/date-picker";

import {
    currency,
    formatCurrencyInput,
    getErrorMessage,
} from "@/components/payments/payments-utils";

import { registerPartialPayment } from "@/lib/payments/payments.client";

import type {
    SalePaymentSummary,
} from "@/lib/payments/payments.server";

import { PAYMENT_METHODS, PAYMENT_TYPES } from "./payments.constants";

import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Props = {
    sale: SalePaymentSummary;
};


export default function PaymentCard({
    sale,
}: Props) {
    const [isPending, startTransition] = useTransition();

    const [paymentAmount, setPaymentAmount] = useState("");

    const [paymentType, setPaymentType] = useState<
        "INSTALLMENT" | "FULL" | "CUSTOM"
    >("INSTALLMENT");

    const [paymentMethod, setPaymentMethod] = useState("Efectivo");

    const [paymentDate, setPaymentDate] = useState<Date | undefined>(
        new Date()
    );

    const [notes, setNotes] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const nextPendingInstallment = sale.installments.find(
        (installment) =>
            Number(installment.pending_amount) > 0
    );

    const installmentAmount =
        Number(nextPendingInstallment?.pending_amount ?? 0);

    const totalPending =
        sale.pending_amount;

    const paymentValue =
        paymentType === "INSTALLMENT"
            ? installmentAmount
            : paymentType === "FULL"
                ? totalPending
                : Number(
                    paymentAmount.replace(/\D/g, "")
                ) || 0;

    async function handleRegisterPayment() {
        if (!paymentDate) {
            toast.error("La fecha del pago es obligatoria.");
            return;
        }

        const amount = paymentValue;

        startTransition(async () => {
            try {
                await registerPartialPayment({
                    saleId: sale.id,
                    amount,
                    paymentMethod,
                    paymentDate: paymentDate.toISOString().split("T")[0],
                    notes,
                });
                setPaymentAmount("");

                router.refresh();
                toast.success("Pago registrado");
            } catch (error) {
                toast.error(
                    getErrorMessage(error)
                );
            }
        });
    }

    return (
        <Card>

            <CardHeader className="space-y-5">

                <div className="flex items-start justify-between">

                    <div>

                        <CardTitle className="text-xl">
                            {sale.customer?.full_name}
                        </CardTitle>

                        <p className="mt-1 text-sm text-slate-500">
                            {sale.product?.name}
                        </p>

                    </div>

                    {sale.hasOverdueInstallments ? (
                        <Badge variant="destructive">
                            Vencido
                        </Badge>
                    ) : (
                        <Badge variant="secondary">
                            Al día
                        </Badge>
                    )}

                </div>

                <div className="space-y-2">

                    <div className="flex justify-between text-sm">

                        <span>
                            Progreso del crédito
                        </span>

                        <span className="font-semibold">
                            {sale.progressPercentage}%
                        </span>

                    </div>

                    <Progress value={sale.progressPercentage} />

                </div>

                <div className="grid gap-4 md:grid-cols-3">

                    <div>

                        <p className="text-xs uppercase text-slate-500">
                            Total
                        </p>

                        <p className="font-semibold">
                            {currency(Number(sale.total_sale_amount))}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs uppercase text-slate-500">
                            Pagado
                        </p>

                        <p className="font-semibold text-emerald-600">
                            {currency(sale.paid_amount)}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs uppercase text-slate-500">
                            Pendiente
                        </p>

                        <p className="font-semibold text-red-600">
                            {currency(sale.pending_amount)}
                        </p>

                    </div>

                </div>

                {sale.nextInstallment && (
                    <div className="rounded-lg border bg-slate-50 p-3">

                        <p className="text-xs uppercase text-slate-500">
                            Próxima cuota
                        </p>

                        <p className="mt-1 font-medium">
                            Cuota {sale.nextInstallment.installment_number}
                        </p>

                        <p className="text-sm text-slate-500">
                            {sale.nextInstallment.due_date}
                        </p>

                    </div>
                )}

            </CardHeader>

            <CardContent>

                <div className="flex justify-end">

                    <Button
                        variant="outline"
                        onClick={() => setIsOpen((value) => !value)}
                    >
                        {isOpen ? "Ocultar detalle" : "Ver detalle"}
                    </Button>

                </div>

                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                >

                    <CollapsibleContent className="space-y-6 pt-6">

                        <div className="space-y-6">

                            <div className="rounded-lg border bg-slate-50 px-4 py-3">

                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    El pago se aplicará a
                                </p>

                                {nextPendingInstallment ? (

                                    <div className="mt-1">

                                        <p className="font-medium">
                                            Cuota {nextPendingInstallment.installment_number}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            Vence {nextPendingInstallment.due_date}
                                        </p>

                                        <p className="mt-1 text-sm font-semibold">
                                            Pendiente{" "}
                                            {currency(
                                                Number(
                                                    nextPendingInstallment.pending_amount
                                                )
                                            )}
                                        </p>

                                    </div>

                                ) : (

                                    <p className="mt-1 text-sm text-emerald-600">
                                        Crédito completamente pagado
                                    </p>

                                )}

                            </div>

                            <div className="grid gap-4 md:grid-cols-2">

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Tipo de pago
                                    </label>

                                    <Select
                                        value={paymentType}
                                        onValueChange={(value) => {
                                            setPaymentType(
                                                value as "INSTALLMENT" | "FULL" | "CUSTOM"
                                            );

                                            setPaymentAmount("");
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {PAYMENT_TYPES.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Valor del pago
                                    </label>

                                    {paymentType === "CUSTOM" ? (

                                        <Input
                                            inputMode="numeric"
                                            placeholder="Valor del pago"
                                            value={paymentAmount}
                                            onChange={(event) =>
                                                setPaymentAmount(
                                                    formatCurrencyInput(
                                                        event.target.value
                                                    )
                                                )
                                            }
                                        />

                                    ) : (

                                        <Input
                                            readOnly
                                            value={currency(paymentValue)}
                                        />

                                    )}

                                </div>

                            </div>

                            <div className="grid gap-4 md:grid-cols-2">

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Método de pago
                                    </label>

                                    <Select
                                        value={paymentMethod}
                                        onValueChange={setPaymentMethod}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar método" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {PAYMENT_METHODS.map((method) => (
                                                <SelectItem
                                                    key={method}
                                                    value={method}
                                                >
                                                    {method}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Fecha del pago
                                    </label>

                                    <DatePicker
                                        date={paymentDate}
                                        setDate={setPaymentDate}
                                    />

                                </div>

                            </div>

                            <div className="space-y-2">

                                <label className="text-sm font-medium">
                                    Observaciones
                                </label>

                                <Input
                                    placeholder="Ej: Abono realizado por transferencia"
                                    value={notes}
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
                                />

                            </div>

                            <div className="flex justify-end">

                                <Button
                                    className="w-full md:w-auto"
                                    disabled={
                                        isPending ||
                                        sale.pending_amount <= 0 ||
                                        paymentValue <= 0
                                    }
                                    onClick={handleRegisterPayment}
                                >
                                    Registrar pago
                                </Button>

                            </div>

                        </div>

                        <div className="max-h-80 overflow-y-auto rounded-md border">
                            <Table>

                                <TableHeader className="sticky top-0 z-10 bg-white">

                                    <TableRow>

                                        <TableHead>
                                            Cuota
                                        </TableHead>

                                        <TableHead>
                                            Vence
                                        </TableHead>

                                        <TableHead>
                                            Valor
                                        </TableHead>

                                        <TableHead>
                                            Pagado
                                        </TableHead>

                                        <TableHead>
                                            Pendiente
                                        </TableHead>

                                        <TableHead>
                                            Estado
                                        </TableHead>

                                    </TableRow>

                                </TableHeader>

                                <TableBody>

                                    {sale.installments.map(
                                        (installment) => (

                                            <TableRow
                                                key={installment.id}
                                            >

                                                <TableCell>
                                                    {installment.installment_number}
                                                </TableCell>

                                                <TableCell>
                                                    {installment.due_date}
                                                </TableCell>

                                                <TableCell>
                                                    {currency(
                                                        Number(
                                                            installment.original_amount
                                                        )
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {currency(
                                                        Number(
                                                            installment.paid_amount
                                                        )
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {currency(
                                                        Number(
                                                            installment.pending_amount
                                                        )
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {installment.status}
                                                </TableCell>

                                            </TableRow>

                                        )
                                    )}

                                </TableBody>

                            </Table>
                        </div>

                    </CollapsibleContent>

                </Collapsible>

            </CardContent>

        </Card>
    );
}