import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CreditCalculator from "@/components/calculator/credit-calculator";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Image
            src="/logo-plg.png"
            alt="PLG Capital"
            width={180}
            height={60}
            priority
          />

          <Button asChild>
            <Link href="/login">
              Iniciar Sesión
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-5xl font-bold text-slate-900">
              Financiamiento simple y transparente
            </h1>

            <p className="mb-8 text-lg text-slate-600">
              En PLG Capital ofrecemos soluciones de crédito diseñadas para
              ayudarte a adquirir productos y alcanzar tus metas con cuotas
              flexibles y condiciones claras.
            </p>

            <Button asChild size="lg">
              <a href="#simulador">
                Simular Crédito
              </a>
            </Button>
          </div>

          <div className="flex justify-center">
            <Image
              src="/logo-plg.png"
              alt="PLG Capital"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">
            ¿Por qué elegir PLG Capital?
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Proceso Ágil
              </h3>

              <p className="text-slate-600">
                Evaluaciones rápidas y atención personalizada para cada cliente.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Pagos Flexibles
              </h3>

              <p className="text-slate-600">
                Diferentes alternativas de pago adaptadas a cada necesidad.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Transparencia
              </h3>

              <p className="text-slate-600">
                Condiciones claras desde el inicio y sin sorpresas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="simulador"
        className="mx-auto max-w-7xl px-6 py-20"
      >
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Simulador de Crédito
          </h2>

          <p className="text-slate-600">
            Calcula cuotas, valor financiado e inicial en segundos.
          </p>
        </div>

        <CreditCalculator />
      </section>

      <footer className="border-t bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 text-center text-slate-600">
          © {new Date().getFullYear()} PLG Capital. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}