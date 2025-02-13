"use client";
import React, { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

interface AddQuantityProps {
    onQuantityChange: (quantity: number) => void;
    max?: number;
}

export const AddQuantity: React.FC<AddQuantityProps> = ({
                                                            onQuantityChange,
                                                            max = 99
                                                        }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        onQuantityChange(quantity);
    }, [quantity, onQuantityChange]);

    const handleIncrement = () => {
        setQuantity((prev) => prev < max ? prev + 1 : prev);
    };

    const handleDecrement = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            if (value > max) {
                setQuantity(max);
            } else if (value < 1) {
                setQuantity(1);
            } else {
                setQuantity(value);
            }
        }
    };

    return (
        <div className="relative flex items-center justify-between w-full max-w-[140px] h-10 bg-white border border-gray-200 rounded-lg overflow-hidden group hover:border-gray-300 transition-colors duration-200">
            <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="flex items-center justify-center w-10 h-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                aria-label="Decrease quantity"
            >
                <Minus size={16} />
            </button>

            <input
                type="number"
                value={quantity}
                onChange={handleDirectInput}
                className="w-12 h-full text-center text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
                min="1"
                max={max}
            />

            <button
                onClick={handleIncrement}
                disabled={quantity >= max}
                className="flex items-center justify-center w-10 h-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                aria-label="Increase quantity"
            >
                <Plus size={16} />
            </button>
        </div>
    );
};

export default AddQuantity;