"use client";
import React from "react";
import { formattedPrice } from "@/utils/format";

interface HeaderComponentProps {
    title: string;
    price: number;
    discount?: number;
}

export default function HeaderComponent({
                                            title,
                                            price,
                                            discount,
                                        }: HeaderComponentProps) {
    const discountedPrice = discount ? price - (price * discount) / 100 : price;

    return (
        <div className="w-full px-4 py-6 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Main Container */}
                <div className="flex flex-col gap-4">
                    {/* Title Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                            {title}
                        </h1>
                    </div>

                    {/* Price Section */}
                    <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-4 py-3">
                            <span className="text-xl  font-semibold text-gray-900">
                                {formattedPrice(discountedPrice)}
                            </span>
                            {discount ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-lg text-gray-400 line-through">
                                        {formattedPrice(price)}
                                    </span>
                                    <span className="px-3 py-1.5 text-sm font-bold text-red-600 bg-red-50 rounded-full ring-1 ring-red-100">
                                        {discount}% OFF
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}