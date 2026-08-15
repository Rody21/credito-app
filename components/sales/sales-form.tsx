"use client";

import {
    createSale,
    type PaymentFrequency,
    type SaleType,
} from "@/lib/sales/sales.client";
import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { readCreditConfig } from "@/lib/credit-config";

import type { Customer, Product } from "@/types/database";

import { DatePicker } from "@/components/ui/date-picker";

import {
    currency,
    frequencyLabel,
    getErrorMessage,
    getInstallmentCount,
    onlyDigits,
    parseCurrency,
    formatCurrencyInput,
} from "@/components/sales/sales-utils";


type Props = {
    customers: Customer[];
    products: Product[];
};


const paymentMethods = [
    "Efectivo",
    "Transferencia",
    "Tarjeta",
];


export default function SalesForm({
    customers,
    products,
}: Props) {

    const router = useRouter();

    const [
        isPending,
        startTransition,
    ] = useTransition();


    const [
        customerId,
        setCustomerId,
    ] = useState(
        customers[0]?.id ?? ""
    );


    const [
        productBatchId,
        setProductBatchId,
    ] = useState("");


    const [
        manualCost,
        setManualCost,
    ] = useState("");


    const [
        saleType,
        setSaleType,
    ] = useState<SaleType>(
        "CREDIT"
    );


    const [
        saleDate,
        setSaleDate,
    ] = useState<Date | undefined>(
        new Date()
    );


    const [
        profitPercentage,
        setProfitPercentage,
    ] = useState("40");


    const [
        hasInitialPayment,
        setHasInitialPayment,
    ] = useState(true);


    const [
        downPaymentPercentage,
        setDownPaymentPercentage,
    ] = useState("30");


    const [
        months,
        setMonths,
    ] = useState(12);


    const [
        frequency,
        setFrequency,
    ] = useState<PaymentFrequency>(
        "BIWEEKLY"
    );


    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState(
        paymentMethods[0]
    );


    useEffect(() => {

        const syncConfig = async () => {

            const config =
                await readCreditConfig();

            setProfitPercentage(
                String(config.profitPercentage)
            );

            setDownPaymentPercentage(
                String(config.initialPercentage)
            );
        };


        void syncConfig();


        window.addEventListener(
            "credit-config-updated",
            syncConfig
        );


        window.addEventListener(
            "storage",
            syncConfig
        );


        return () => {

            window.removeEventListener(
                "credit-config-updated",
                syncConfig
            );


            window.removeEventListener(
                "storage",
                syncConfig
            );
        };

    }, []);



    const productOptions = useMemo(
        () =>
            products.flatMap(
                (product) =>
                    (product.product_batches ?? [])
                        .filter(
                            (batch) =>
                                batch.remaining_quantity > 0
                        )
                        .map(
                            (batch) => ({
                                id: batch.id,
                                productId: product.id,
                                name: product.name,
                                quantity: batch.quantity,
                                available:
                                    batch.remaining_quantity,
                                cost_price:
                                    batch.cost_price,
                                purchase_date:
                                    batch.purchase_date,
                                purchase_method:
                                    batch.purchase_method,
                            })
                        )
            ),
        [products]
    );


    const selectedBatch = useMemo(
        () =>
            productOptions.find(
                (item) =>
                    item.id === productBatchId
            ),
        [
            productOptions,
            productBatchId,
        ]
    );



    const salePreview = useMemo(() => {

        const cost =
            selectedBatch
                ? Number(selectedBatch.cost_price)
                : parseCurrency(manualCost);


        const profit =
            Number(profitPercentage) || 0;


        const initial =
            hasInitialPayment
                ? Number(downPaymentPercentage) || 0
                : 0;


        const total =
            Math.round(
                cost +
                cost * (profit / 100)
            );


        const downPayment =
            saleType === "CREDIT"
                ? Math.round(
                    total *
                    (initial / 100)
                )
                : 0;


        const financed =
            saleType === "CREDIT"
                ? total - downPayment
                : 0;


        const installmentCount =
            getInstallmentCount(
                months,
                frequency,
                saleType
            );


        const installmentAmount =
            installmentCount > 0
                ? Math.round(
                    financed /
                    installmentCount
                )
                : 0;


        return {
            cost,
            total,
            downPayment,
            financed,
            installmentCount,
            installmentAmount,
        };

    }, [
        selectedBatch,
        manualCost,
        profitPercentage,
        hasInitialPayment,
        downPaymentPercentage,
        saleType,
        months,
        frequency,
    ]);



    const hasValidPreview =
        Number.isFinite(
            salePreview.cost
        ) &&
        Number.isFinite(
            salePreview.total
        ) &&
        Number.isFinite(
            salePreview.downPayment
        ) &&
        Number.isFinite(
            salePreview.financed
        );



    const summary = `
${selectedBatch?.name ?? "Producto sin registrar"}

${saleType === "CASH"
            ? "Contado"
            : `Credito ${months} ${months === 1 ? "mes" : "meses"}`
        }: ${currency(salePreview.total)}

${saleType === "CREDIT" && hasInitialPayment
            ? `Inicial: ${currency(salePreview.downPayment)}`
            : ""}

${saleType === "CREDIT"
            ? `${frequencyLabel(frequency)}: ${currency(salePreview.installmentAmount)}`
            : ""}
`.trim();



    async function handleCreateSale(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();


        if (!selectedBatch) {

            toast.error(
                "Selecciona un lote válido."
            );

            return;
        }


        startTransition(
            async () => {

                try {

                    await createSale({

                        customerId,

                        productId:
                            selectedBatch.productId,

                        productBatchId:
                            selectedBatch.id,

                        saleType,

                        saleDate:
                            saleDate
                                ? saleDate
                                    .toISOString()
                                    .slice(0, 10)
                                : new Date()
                                    .toISOString()
                                    .slice(0, 10),

                        profitPercentage:
                            Number(profitPercentage) || 0,

                        downPaymentPercentage:
                            hasInitialPayment
                                ? Number(
                                    downPaymentPercentage
                                ) || 0
                                : 0,

                        months,

                        frequency,

                        paymentMethod,

                    });


                    toast.success(
                        "Venta registrada"
                    );


                    router.refresh();


                } catch (error) {

                    toast.error(
                        getErrorMessage(error)
                    );
                }
            }
        );
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Nueva venta o cálculo
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleCreateSale}
                    className="space-y-4"
                >

                    <Field label="Cliente">
                        <Select
                            value={customerId}
                            onValueChange={setCustomerId}
                        >
                            <SelectTrigger className="h-11 w-full rounded-xl">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>


                    <Field label="Producto para registrar venta">

                        <Select
                            value={
                                productBatchId || "none"
                            }
                            onValueChange={(value) =>
                                setProductBatchId(
                                    value === "none"
                                        ? ""
                                        : value
                                )
                            }
                        >

                            <SelectTrigger className="h-11 w-full rounded-xl">
                                <SelectValue>
                                    {selectedBatch?.name ?? "Seleccionar producto"}
                                </SelectValue>
                            </SelectTrigger>


                            <SelectContent>

                                <SelectItem value="none">
                                    Sin producto
                                </SelectItem>


                                {productOptions.map(
                                    (item) => (

                                        <SelectItem
                                            key={item.id}
                                            value={item.id}
                                            textValue={item.name}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {item.name}
                                                </span>

                                                <span className="text-xs text-slate-500">
                                                    Cantidad: {item.quantity}
                                                    {" | "}
                                                    Disponible: {item.available}
                                                </span>

                                                <span className="text-xs text-slate-500">
                                                    Costo: {currency(Number(item.cost_price))}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    )
                                )}

                            </SelectContent>

                        </Select>

                    </Field>



                    {!selectedBatch && (

                        <Field label="Costo manual para calcular">

                            <Input
                                inputMode="numeric"
                                value={manualCost}
                                onChange={(event) =>
                                    setManualCost(
                                        formatCurrencyInput(
                                            event.target.value
                                        )
                                    )
                                }
                                placeholder="500.000"
                            />

                        </Field>

                    )}



                    <div className="grid grid-cols-2 gap-3">

                        <Field label="Tipo">

                            <Select
                                value={saleType}
                                onValueChange={(value) =>
                                    setSaleType(
                                        value as SaleType
                                    )
                                }
                            >

                                <SelectTrigger className="h-11 w-full rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>


                                <SelectContent>

                                    <SelectItem value="CREDIT">
                                        Crédito
                                    </SelectItem>


                                    <SelectItem value="CASH">
                                        Contado
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </Field>


                        <Field label="Fecha de venta">

                            <DatePicker
                                date={saleDate}
                                setDate={setSaleDate}
                            />

                        </Field>

                    </div>



                    <div className="grid grid-cols-2 gap-3">

                        <Field label="Utilidad (%)">

                            <Input
                                inputMode="numeric"
                                value={profitPercentage}
                                onChange={(event) =>
                                    setProfitPercentage(
                                        onlyDigits(
                                            event.target.value
                                        )
                                    )
                                }
                            />

                        </Field>


                        <Field label="Cuota inicial (%)">

                            <Input
                                inputMode="numeric"
                                value={downPaymentPercentage}
                                disabled={
                                    saleType === "CASH" ||
                                    !hasInitialPayment
                                }
                                onChange={(event) =>
                                    setDownPaymentPercentage(
                                        onlyDigits(
                                            event.target.value
                                        )
                                    )
                                }
                            />

                        </Field>

                    </div>



                    <div className="flex items-center gap-2">

                        <Checkbox
                            checked={hasInitialPayment}
                            disabled={
                                saleType === "CASH"
                            }
                            onCheckedChange={(checked) =>
                                setHasInitialPayment(
                                    checked === true
                                )
                            }
                        />

                        <label>
                            Con cuota inicial
                        </label>

                    </div>



                    <div>

                        <label className="mb-2 block text-sm text-slate-600">
                            Plazo
                        </label>


                        <div className="grid grid-cols-3 gap-2">

                            {[1, 6, 12].map((option) => (

                                <button
                                    key={option}
                                    type="button"
                                    disabled={
                                        saleType === "CASH"
                                    }
                                    className={`rounded-md border px-3 py-2 text-sm ${months === option
                                        ? "bg-slate-900 text-white"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setMonths(option)
                                    }
                                >

                                    {option}
                                    {" "}
                                    {option === 1
                                        ? "Mes"
                                        : "Meses"}

                                </button>

                            ))}

                        </div>

                    </div>



                    <Field label="Frecuencia">

                        <Select
                            value={frequency}
                            disabled={
                                saleType === "CASH"
                            }
                            onValueChange={(value) =>
                                setFrequency(
                                    value as PaymentFrequency
                                )
                            }
                        >

                            <SelectTrigger className="h-11 w-full rounded-xl">
                                <SelectValue />
                            </SelectTrigger>


                            <SelectContent>

                                <SelectItem value="MONTHLY">
                                    Mensual
                                </SelectItem>


                                <SelectItem value="BIWEEKLY">
                                    Quincenal
                                </SelectItem>


                                <SelectItem value="WEEKLY">
                                    Semanal
                                </SelectItem>

                            </SelectContent>

                        </Select>

                    </Field>



                    <Field label="Método de pago inicial">

                        <Select
                            value={paymentMethod}
                            onValueChange={
                                setPaymentMethod
                            }
                        >

                            <SelectTrigger className="h-11 w-full rounded-xl">
                                <SelectValue />
                            </SelectTrigger>


                            <SelectContent>

                                {paymentMethods.map(
                                    (method) => (

                                        <SelectItem
                                            key={method}
                                            value={method}
                                        >
                                            {method}
                                        </SelectItem>

                                    )
                                )}

                            </SelectContent>

                        </Select>

                    </Field>



                    <div className="grid gap-2 rounded-3xl border p-4 text-sm">

                        <SummaryRow
                            label="Costo base"
                            value={currency(
                                salePreview.cost
                            )}
                        />


                        <SummaryRow
                            label="Total venta"
                            value={currency(
                                salePreview.total
                            )}
                        />


                        <SummaryRow
                            label="Cuota inicial"
                            value={currency(
                                salePreview.downPayment
                            )}
                        />


                        <SummaryRow
                            label="Saldo financiado"
                            value={currency(
                                salePreview.financed
                            )}
                        />


                        <SummaryRow
                            label="Cuotas"
                            value={`${salePreview.installmentCount} x ${currency(
                                salePreview.installmentAmount
                            )}`}
                        />

                    </div>



                    <div className="grid gap-2 sm:grid-cols-2">

                        <Button
                            type="button"
                            variant="outline"
                            disabled={
                                salePreview.cost <= 0
                            }
                            onClick={() => {

                                navigator.clipboard.writeText(
                                    summary
                                );

                                toast.success(
                                    "Resumen copiado al portapapeles"
                                );

                            }}
                        >
                            Copiar resumen
                        </Button>



                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                customers.length === 0 ||
                                !productBatchId ||
                                !hasValidPreview
                            }
                        >
                            Registrar venta
                        </Button>

                    </div>

                </form>
            </CardContent>
        </Card>
    );
}



function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {

    return (
        <label className="block space-y-2 text-sm">

            <span className="text-slate-600">
                {label}
            </span>

            {children}

        </label>
    );
}



function SummaryRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {

    return (
        <div className="flex items-center justify-between gap-3">

            <span className="text-slate-500">
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}