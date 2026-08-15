"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin() {
        try {
            setLoading(true);

            const { error } = await authClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                alert(error.message);
                return;
            }

            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md rounded-xl border bg-white p-8">
                <div className="mb-4">
                    <Link
                        href="/"
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
                <h1 className="mb-6 text-center text-3xl font-bold">
                    Iniciar Sesión
                </h1>

                <div className="space-y-4">
                    <Input
                        placeholder="Correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-10"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    <Button
                        className="w-full"
                        disabled={loading}
                        onClick={handleLogin}
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </Button>
                </div>
            </div>
        </main>
    );
}