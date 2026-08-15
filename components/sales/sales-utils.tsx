import type { PaymentFrequency, SaleType } from "@/lib/sales/sales.client";

export function getInstallmentCount(
    months: number,
    frequency: PaymentFrequency,
    saleType: SaleType,
) {
    if (saleType === "CASH") return 0;

    if (frequency === "WEEKLY") {
        return months * 4;
    }

    if (frequency === "BIWEEKLY") {
        return months * 2;
    }

    return months;
}

export function parseCurrency(value: string) {
    return Number(value.replace(/\D/g, "")) || 0;
}

export function formatCurrencyInput(value: string) {
    const rawValue = value.replace(/\D/g, "");

    if (!rawValue) {
        return "";
    }

    return new Intl.NumberFormat("es-CO").format(
        Number(rawValue)
    );
}

export function onlyDigits(value: string) {
    return value.replace(/\D/g, "");
}

export function currency(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
}

export function frequencyLabel(
    frequency: PaymentFrequency
) {
    if (frequency === "WEEKLY") {
        return "Semanal";
    }

    if (frequency === "BIWEEKLY") {
        return "Quincenal";
    }

    return "Mensual";
}

export function getErrorMessage(error: unknown) {
    return error instanceof Error
        ? error.message
        : "No se pudo completar la operacion.";
}