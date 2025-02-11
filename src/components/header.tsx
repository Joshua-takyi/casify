"use client";
import React from "react";
import { formattedPrice } from "@/utils/format";

interface HeaderComponentProps {
    title: string;
    price: number;
    stock?: number;
    discount?: number;
}

export default function HeaderComponent({
                                            title,
                                            price,
                                            stock,
                                            discount,
                                        }: HeaderComponentProps) {
    // Calculate the discounted price if a discount is provided
    const discountedPrice = discount ? price - (price * discount) / 100 : price;

    return (
        <div className="w-full font-family-apercu-pro">
            {/* Main Container */}
            <div className="flex flex-col gap-2">
                {/* Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900  leading-tight">
                        {title}
                    </h1>
                </div>

                {/* Price Section */}
                <div className="flex flex-col">
                    <div className="flex gap-4 items-center py-2">
            <span className="md:text-[1.5rem]">
              {formattedPrice(discountedPrice)}
            </span>
                        {discount ? (
                            <div className="flex items-center space-x-2">
                <span className="text-lg text-black/50 line-through animate-pulse transition-all ease-in">
                  {formattedPrice(price)}
                </span>
                                <span className="px-2 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded">
                  {discount}% OFF
                </span>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex items-center space-x-2 text-[1.3rem]">
                        {/*{*/}
                        {/*    stock <= 12 ? (*/}
                        {/*        <div className="flex items-center space-x-2 text-red-400 ">*/}
                        {/*            ({stock}) low on stock*/}
                        {/*        </div>*/}
                        {/*    ):(*/}
                        {/*        <div className="flex items-center space-x-2 text-green-200">*/}
                        {/*            {stock}*/}
                        {/*        </div>*/}
                        {/*    )*/}
                        {/*}*/}
                    </div>
                </div>
            </div>
        </div>
    );
}
