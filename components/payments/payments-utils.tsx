export function getErrorMessage(error: unknown) {
    return error instanceof Error
        ? error.message
        : "No se pudo completar la operacion.";
}


export function currency(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
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