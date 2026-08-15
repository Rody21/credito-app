"use client";

import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        async function loadUser() {
            const { data } = await authClient.auth.getUser();
            setUser(data.user);
        }

        loadUser();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="flex w-64 flex-col border-r bg-white">
                <div className="border-b p-6">
                    <Image
                        src="/logo-plg.png"
                        alt="PLG Capital"
                        width={140}
                        height={50}
                    />
                </div>

                <nav className="space-y-1 p-4">
                    <MenuItem href="/dashboard" label="Inicio" />
                    <MenuItem href="/dashboard/clientes" label="Clientes" />
                    <MenuItem href="/dashboard/productos" label="Productos" />
                    <MenuItem href="/dashboard/ventas" label="Ventas" />
                    <MenuItem href="/dashboard/pagos" label="Pagos" />
                    <MenuItem href="/dashboard/caja" label="Caja" />
                    <MenuItem
                        href="/dashboard/configuracion"
                        label="Configuración de créditos"
                    />
                </nav>

                <div className="border-t p-4">
                    <div className="mb-3 text-sm">
                        <div className="font-medium">
                            {user?.user_metadata?.full_name || "Usuario"}
                        </div>

                        <div className="text-slate-500">
                            {user?.email || ""}
                        </div>
                    </div>

                    <LogoutButton />
                </div>
            </aside>

            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}

function MenuItem({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    return (
        <Link
            href={href}
            className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100"
        >
            {label}
        </Link>
    );
}

function LogoutButton() {
    const router = useRouter();

    async function logout() {
        await authClient.auth.signOut();
        router.push("/login");
    }

    return (
        <button
            onClick={logout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-left text-red-600 transition hover:bg-red-100"
        >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
        </button>
    );
}