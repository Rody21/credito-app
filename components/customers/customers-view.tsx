"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { ConfirmDialog } from "../shared/confirm-dialog";
import { toast } from "sonner";
import {
    activateCustomer,
    deactivateCustomer,
    hasActiveSales,
    updateCustomer,
    updateCustomerNotes
} from "@/lib/customers";

type Customer = {
    id: string;
    full_name: string;
    document: string | null;
    phone: string | null;
    address: string | null;
    email: string | null;
    notes: string | null;
    active: boolean;
};

interface Props {
    initialCustomers: Customer[];
}

export default function CustomersView({ initialCustomers }: Props) {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        initialCustomers.length > 0 ? initialCustomers[0] : null
    );

    const [fullName, setFullName] = useState(selectedCustomer?.full_name ?? "");
    const [document, setDocument] = useState(selectedCustomer?.document ?? "");
    const [phone, setPhone] = useState(selectedCustomer?.phone ?? "");
    const [address, setAddress] = useState(selectedCustomer?.address ?? "");
    const [email, setEmail] = useState(selectedCustomer?.email ?? "");
    const [notes, setNotes] = useState(selectedCustomer?.notes ?? "");

    const [search, setSearch] = useState("");
    const [view, setView] = useState<"active" | "inactive">("active");

    const [editingInfo, setEditingInfo] = useState(false);
    const [editingNotes, setEditingNotes] = useState(false);

    const [savingInfo, setSavingInfo] = useState(false);
    const [savingNotes, setSavingNotes] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const isActive = (c: Customer) => c.active === true;

    const filteredCustomers = useMemo(() => {
        return customers
            .filter(c => view === "active" ? isActive(c) : !isActive(c))
            .filter(c =>
                c.full_name.toLowerCase().includes(search.toLowerCase())
            );
    }, [customers, search, view]);

    function handleSelectCustomer(customer: Customer) {
        setSelectedCustomer(customer);

        setFullName(customer.full_name ?? "");
        setDocument(customer.document ?? "");
        setPhone(customer.phone ?? "");
        setAddress(customer.address ?? "");
        setEmail(customer.email ?? "");
        setNotes(customer.notes ?? "");

        setEditingInfo(false);
        setEditingNotes(false);
    }

    async function handleUpdateCustomer() {
        if (!selectedCustomer) return;

        if (!fullName.trim()) return toast.error("Nombre obligatorio");
        if (!document.trim()) return toast.error("Documento obligatorio");
        if (!phone.trim()) return toast.error("Teléfono obligatorio");
        if (!address.trim()) return toast.error("Dirección obligatoria");

        try {
            setSavingInfo(true);

            const updated = await updateCustomer(selectedCustomer.id, {
                full_name: fullName,
                document,
                phone,
                address,
                email
            });

            const merged: Customer = {
                ...selectedCustomer,
                ...updated
            };

            setCustomers(prev =>
                prev.map(c => (c.id === merged.id ? merged : c))
            );

            setSelectedCustomer(merged);
            setEditingInfo(false);

            toast.success("Cliente actualizado");
        } catch {
            toast.error("Error actualizando cliente");
        } finally {
            setSavingInfo(false);
        }
    }

    async function handleUpdateNotes() {
        if (!selectedCustomer) return;

        try {
            setSavingNotes(true);

            await updateCustomerNotes(selectedCustomer.id, notes);

            const updated: Customer = {
                ...selectedCustomer,
                notes
            };

            setCustomers(prev =>
                prev.map(c => (c.id === updated.id ? updated : c))
            );

            setSelectedCustomer(updated);
            setEditingNotes(false);

            toast.success("Notas actualizadas");
        } catch {
            toast.error("Error actualizando notas");
        } finally {
            setSavingNotes(false);
        }
    }

    async function handleDeactivateCustomer() {
        if (!selectedCustomer) return;

        try {
            setLoadingAction(true);

            const hasActive = await hasActiveSales(selectedCustomer.id);

            if (hasActive) {
                toast.error("Tiene créditos activos");
                return;
            }

            await deactivateCustomer(selectedCustomer.id);

            const updated: Customer = {
                ...selectedCustomer,
                active: false
            };

            setCustomers(prev =>
                prev.map(c =>
                    c.id === updated.id
                        ? updated
                        : c
                )
            );

            setSelectedCustomer(null);

            toast.success("Cliente desactivado");
        } catch {
            toast.error("Error desactivando cliente");
        } finally {
            setLoadingAction(false);
        }
    }

    async function handleActivateCustomer() {
        if (!selectedCustomer) return;

        try {
            setLoadingAction(true);

            await activateCustomer(selectedCustomer.id);

            const updated: Customer = {
                ...selectedCustomer,
                active: true
            };

            setCustomers(prev =>
                prev.map(c =>
                    c.id === updated.id
                        ? updated
                        : c
                )
            );

            setSelectedCustomer(null);

            toast.success("Cliente activado");
        } catch {
            toast.error("Error activando cliente");
        } finally {
            setLoadingAction(false);
        }
    }

    return (
        <main className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Clientes</h1>

                <div className="flex gap-2">
                    <Button
                        variant={view === "active" ? "default" : "outline"}
                        onClick={() => {
                            setView("active");
                            setSelectedCustomer(null);
                            setEditingInfo(false);
                            setEditingNotes(false);
                        }}
                    >
                        Activos
                    </Button>

                    <Button
                        variant={view === "inactive" ? "default" : "outline"}
                        onClick={() => {
                            setView("inactive");
                            setSelectedCustomer(null);
                            setEditingInfo(false);
                            setEditingNotes(false);
                        }}
                    >
                        Inactivos
                    </Button>
                </div>

                <Button asChild>
                    <Link href="/dashboard/clientes/nuevo">
                        Nuevo Cliente
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[350px_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Clientes</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Input
                            placeholder="Buscar cliente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div className="mt-4 space-y-2">
                            {filteredCustomers.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => handleSelectCustomer(customer)}
                                    className={`w-full rounded-lg border p-3 text-left ${selectedCustomer?.id === customer.id
                                        ? "border-slate-900"
                                        : ""
                                        }`}
                                >
                                    <div className="font-medium">
                                        {customer.full_name}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {customer.phone}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalle Cliente</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {!selectedCustomer ? (
                            <div>Selecciona un cliente</div>
                        ) : (
                            <div className="space-y-4">
                                {!editingInfo ? (
                                    <>
                                        <div><strong>Nombre:</strong> {selectedCustomer.full_name}</div>
                                        <div><strong>Documento:</strong> {selectedCustomer.document}</div>
                                        <div><strong>Teléfono:</strong> {selectedCustomer.phone}</div>
                                        <div><strong>Dirección:</strong> {selectedCustomer.address}</div>
                                        <div><strong>Correo:</strong> {selectedCustomer.email}</div>

                                        <div className="flex gap-2">
                                            <Button onClick={() => setEditingInfo(true)}>
                                                Editar
                                            </Button>

                                            {view === "active" ? (
                                                <ConfirmDialog
                                                    title="Desactivar"
                                                    description="El cliente pasará a inactivos"
                                                    onConfirm={handleDeactivateCustomer}
                                                    trigger={
                                                        <Button variant="destructive" disabled={loadingAction}>
                                                            Desactivar
                                                        </Button>
                                                    }
                                                />
                                            ) : (
                                                <Button
                                                    onClick={handleActivateCustomer}
                                                    disabled={loadingAction}
                                                >
                                                    Activar
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Nombre</label>
                                            <Input
                                                value={fullName}
                                                onChange={e => setFullName(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Documento</label>
                                            <Input
                                                value={document}
                                                onChange={e => setDocument(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Teléfono</label>
                                            <Input
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Dirección</label>
                                            <Input
                                                value={address}
                                                onChange={e => setAddress(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Correo</label>
                                            <Input
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleUpdateCustomer}
                                                disabled={savingInfo}
                                            >
                                                Guardar
                                            </Button>

                                            <Button
                                                variant="outline"
                                                onClick={() => setEditingInfo(false)}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <strong>Notas</strong>

                                    {!editingNotes ? (
                                        <>
                                            <div className="mt-2 rounded-md border bg-slate-50 p-3 text-sm whitespace-pre-wrap">
                                                {selectedCustomer.notes || "Sin notas"}
                                            </div>

                                            <Button size="sm" className="mt-3" onClick={() => setEditingNotes(true)}>
                                                Editar
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />

                                            <div className="flex gap-2 mt-2">
                                                <Button onClick={handleUpdateNotes} disabled={savingNotes}>
                                                    Guardar
                                                </Button>

                                                <Button variant="outline" onClick={() => setEditingNotes(false)}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}