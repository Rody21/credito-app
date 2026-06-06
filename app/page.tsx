"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [cost, setCost] = useState("0");
  const [profitPercentage, setProfitPercentage] = useState("40");
  const [initialPercentage, setInitialPercentage] = useState("30");
  const [hasInitialPayment, setHasInitialPayment] = useState(true);
  const [months, setMonths] = useState(12);
  const [productName, setProductName] = useState("");
  const [showWeekly, setShowWeekly] = useState(false);

  const results = useMemo(() => {
    const costNumber =
      Number(cost.replace(/\./g, "")) || 0;
    const profitNumber = Number(profitPercentage) || 0;
    const initialNumber = Number(initialPercentage) || 0;

    const salePrice =
      costNumber + costNumber * (profitNumber / 100);

    const initialPayment = hasInitialPayment
      ? salePrice * (initialNumber / 100)
      : 0;

    const balance = salePrice - initialPayment;

    const monthlyPayment =
      months > 0 ? balance / months : 0;

    const biweeklyPayment =
      months > 0 ? balance / (months * 2) : 0;

    const weeklyPayment =
      months > 0 ? balance / (months * 4) : 0;

    return {
      salePrice,
      initialPayment,
      balance,
      monthlyPayment,
      biweeklyPayment,
      weeklyPayment,
    };
  }, [
    cost,
    profitPercentage,
    hasInitialPayment,
    initialPercentage,
    months,
  ]);

  const currency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");

    return new Intl.NumberFormat("es-CO").format(
      Number(numbersOnly || 0)
    );
  };

  const summary = `
${productName || "Producto"}

Crédito ${months} meses: ${currency(results.salePrice)}
${hasInitialPayment
      ? `Inicial: ${currency(results.initialPayment)}`
      : "Sin cuota inicial"
    }
${showWeekly
      ? `Semanal: ${currency(results.weeklyPayment)}`
      : `Quincenal: ${currency(results.biweeklyPayment)}`
    }
`.trim()

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">
          Calculadora de Créditos
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <label className="mb-2 block text-sm">
                  Nombre del producto
                </label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm">
                  Costo del producto
                </label>
                <Input
                  type="text"
                  placeholder="500.000"
                  inputMode="numeric"
                  value={cost}
                  onChange={(e) => {
                    const rawValue =
                      e.target.value.replace(/\D/g, "");

                    setCost(
                      new Intl.NumberFormat("es-CO").format(
                        Number(rawValue || 0)
                      )
                    );
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">
                  % Utilidad
                </label>
                <Input
                  type="number"
                  value={profitPercentage}
                  onChange={(e) =>
                    setProfitPercentage(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={hasInitialPayment}
                  onCheckedChange={(checked) =>
                    setHasInitialPayment(checked === true)
                  }
                />
                <label>Con cuota inicial</label>
              </div>

              {hasInitialPayment && (
                <div>
                  <label className="mb-2 block text-sm">
                    % Cuota inicial
                  </label>
                  <Input
                    type="number"
                    value={initialPercentage}
                    onChange={(e) =>
                      setInitialPercentage(
                        e.target.value
                      )
                    }
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm">
                  Financiación
                </label>

                <div className="flex gap-2">
                  <button
                    className={`rounded-md border px-4 py-2 ${months === 6
                      ? "bg-slate-900 text-white"
                      : ""
                      }`}
                    onClick={() => setMonths(6)}
                  >
                    6 Meses
                  </button>

                  <button
                    className={`rounded-md border px-4 py-2 ${months === 12
                      ? "bg-slate-900 text-white"
                      : ""
                      }`}
                    onClick={() => setMonths(12)}
                  >
                    12 Meses
                  </button>
                </div>
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
              <ResultRow
                label="Valor venta"
                value={currency(results.salePrice)}
              />

              <ResultRow
                label="Cuota inicial"
                value={currency(results.initialPayment)}
              />

              <ResultRow
                label="Saldo financiado"
                value={currency(results.balance)}
              />

              <ResultRow
                label="Pago mensual"
                value={currency(
                  results.monthlyPayment
                )}
              />

              <ResultRow
                label="Pago quincenal"
                value={currency(
                  results.biweeklyPayment
                )}
              />

              {showWeekly && (
                <ResultRow
                  label="Pago semanal"
                  value={currency(
                    results.weeklyPayment
                  )}
                  active
                />
              )}

              {!productName.trim() && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  Debe ingresar el nombre del producto para generar el resumen.
                </div>
              )}

              <Button
                disabled={!productName.trim()}
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(summary);
                }}
              >
                Copiar resumen
              </Button>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Vista previa</CardTitle>
                </CardHeader>

                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm">
                    {summary}
                  </pre>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
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
      className={`flex items-center justify-between rounded-lg border p-3 ${active ? "border-slate-900" : ""
        }`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}