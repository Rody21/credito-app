"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    value: string;
    onChange: (value: string) => void;

    status: string;
    onStatusChange: (value: string) => void;

    sort: string;
    onSortChange: (value: string) => void;
};

export default function PaymentsFilters({
    value,
    onChange,
    status,
    onStatusChange,
    sort,
    onSortChange,
}: Props) {
    return (
        <div className="space-y-4">

            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">

                <div className="relative">

                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <Input
                        className="pl-10"
                        placeholder="Buscar cliente o producto..."
                        value={value}
                        onChange={(event) =>
                            onChange(event.target.value)
                        }
                    />

                </div>

                <Select
                    value={sort}
                    onValueChange={onSortChange}
                >

                    <SelectTrigger>

                        <SelectValue />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="debt-desc">
                            Mayor deuda
                        </SelectItem>

                        <SelectItem value="debt-asc">
                            Menor deuda
                        </SelectItem>

                        <SelectItem value="customer-asc">
                            Cliente A-Z
                        </SelectItem>

                        <SelectItem value="customer-desc">
                            Cliente Z-A
                        </SelectItem>

                        <SelectItem value="recent">
                            Más reciente
                        </SelectItem>

                        <SelectItem value="oldest">
                            Más antiguo
                        </SelectItem>

                    </SelectContent>

                </Select>

            </div>

            <Tabs
                value={status}
                onValueChange={onStatusChange}
            >
                <TabsList>

                    <TabsTrigger value="all">
                        Todos
                    </TabsTrigger>

                    <TabsTrigger value="pending">
                        Pendientes
                    </TabsTrigger>

                    <TabsTrigger value="overdue">
                        Vencidos
                    </TabsTrigger>

                    <TabsTrigger value="paid">
                        Pagados
                    </TabsTrigger>

                </TabsList>

            </Tabs>

        </div>
    );
}