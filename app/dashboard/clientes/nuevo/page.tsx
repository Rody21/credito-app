"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/lib/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

export default function NuevoClientePage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [document, setDocument] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!fullName.trim()) {
            toast.error("Nombre obligatorio");
            return;
        }

        if (!document.trim()) {
            toast.error("Documento obligatorio");
            return;
        }

        if (!phone.trim()) {
            toast.error("Teléfono obligatorio");
            return;
        }

        if (!address.trim()) {
            toast.error("Dirección obligatoria");
            return;
        }

        try {
            setLoading(true);

            await createCustomer({
                full_name: fullName,
                document,
                phone,
                address,
                email,
                notes,
            });

            toast.success("Cliente creado");

            router.push("/dashboard/clientes");
        } catch {
            toast.error("Error al guardar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>
                                Nuevo Cliente
                            </CardTitle>

                            <CardDescription>
                                Registra la información básica del cliente.
                            </CardDescription>
                        </div>

                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2"
                            onClick={() => router.push("/dashboard/clientes")}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            placeholder="Nombre completo *"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                        />

                        <Input
                            placeholder="Documento *"
                            value={document}
                            onChange={(e) =>
                                setDocument(e.target.value)
                            }
                        />

                        <Input
                            placeholder="Teléfono *"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                        />

                        <Input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>

                    <Input
                        className="mt-4"
                        placeholder="Dirección *"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                    />
                    <Textarea
                        className="mt-4"
                        placeholder="Notas del cliente (opcional)"
                        value={notes}
                        onChange={(e) =>
                            setNotes(e.target.value)
                        }
                    />
                    <Button
                        className="cursor-pointer mt-6 w-full"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading
                            ? "Guardando..."
                            : "Guardar Cliente"}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}