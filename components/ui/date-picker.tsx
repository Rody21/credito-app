"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import type { DateRange } from "react-day-picker";

type DatePickerProps =
    | {
        mode?: "single";
        date: Date | undefined;
        setDate: (date: Date | undefined) => void;
        maxDate?: Date;
    }
    | {
        mode: "range";
        date: DateRange | undefined;
        setDate: (date: DateRange | undefined) => void;
        maxDate?: Date;
    };

export function DatePicker(props: DatePickerProps) {
    if (props.mode === "range") {
        const { date, setDate, maxDate } = props;

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "h-11 w-full justify-start rounded-xl text-left font-normal",
                            !date?.from && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />

                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd/MM/yyyy")} -{" "}
                                    {format(date.to, "dd/MM/yyyy")}
                                </>
                            ) : (
                                format(date.from, "dd/MM/yyyy")
                            )
                        ) : (
                            "Selecciona un rango"
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                >
                    <Calendar
                        mode="range"
                        selected={date}
                        onSelect={setDate}
                        disabled={
                            maxDate
                                ? { after: maxDate }
                                : undefined
                        }
                    />
                </PopoverContent>
            </Popover>
        );
    }

    const { date, setDate, maxDate } = props;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "h-11 w-full justify-start rounded-xl text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {date ? (
                        format(date, "dd/MM/yyyy")
                    ) : (
                        "Selecciona una fecha"
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0"
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={
                        maxDate
                            ? { after: maxDate }
                            : undefined
                    }
                />
            </PopoverContent>
        </Popover>
    );
}