"use client";
import React, { useState, useEffect } from "react";

interface AddQuantityProps {
    onQuantityChange: (quantity: number) => void; // Callback function
}

export const AddQuantity: React.FC<AddQuantityProps> = ({ onQuantityChange }) => {
    const [quantity, setQuantity] = useState(1);

    // Call onQuantityChange after quantity is updated
    useEffect(() => {
        onQuantityChange(quantity);
    }, [quantity, onQuantityChange]);

    const handleIncrement = () => {
        setQuantity((prev) => prev + 1); // Increment quantity
    };

    const handleDecrement = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Decrement quantity (minimum 1)
    };

    return (
        <div className="flex items-center justify-center border border-gray-300 rounded-md md:w-[15rem] w-full">
            <button
                onClick={handleDecrement}
                className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                aria-label="Decrement quantity"
            >
                -
            </button>

            <span className="text-gray-700 font-medium px-2">
                {quantity}
            </span>

            <button
                onClick={handleIncrement}
                className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                aria-label="Increment quantity"
            >
                +
            </button>
        </div>
    );
};