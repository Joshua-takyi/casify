"use client";
import React from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

interface ModelSelectProps {
    itemModel: string[];
    value: string;
    onChange: (value: string) => void;
    title?: string;
}

export default function SelectPhoneModel({
                                             itemModel = [],
                                             value,
                                             onChange,
                                         }: ModelSelectProps) {
    // Sorting logic
    const sortedModels = React.useMemo(() => {
        return itemModel.sort((a, b) => {
            // Prioritize 'pro max', then 'pro', then alphabetical
            const priorityOrder = ["pro max", "pro"];

            for (const priority of priorityOrder) {
                const aHasPriority = a.includes(priority);
                const bHasPriority = b.includes(priority);

                if (aHasPriority && !bHasPriority) return -1;
                if (!aHasPriority && bHasPriority) return 1;
            }

            return a.localeCompare(b);
        });
    }, [itemModel]);

    // Format model name
    const formatModelName = (model: string) => {
        return model
            .replace("iphone", "")
            .trim()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div className="">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                    <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent className="rounded-md border border-gray-300 bg-white shadow-sm">
                    {sortedModels.map((model) => (
                        <SelectItem
                            key={model}
                            value={model}
                            className="text-sm text-gray-700 hover:bg-gray-50"
                        >
                            {formatModelName(model)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}