"use client";
import React, { useState, useEffect } from "react";

interface AddQuantityProps {
	onQuantityChange: (quantity: number) => void;
	max?: number;
}

const AddQuantity: React.FC<AddQuantityProps> = ({
	onQuantityChange,
	max = 99,
}) => {
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		onQuantityChange(quantity);
	}, [quantity, onQuantityChange]);

	const handleIncrement = () => {
		setQuantity((prev) => (prev < max ? prev + 1 : prev));
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
		<div className="flex flex-col gap-2">
			<span className="text-gray-600 text-sm">Quantity</span>
			<div className="inline-flex items-center">
				<button
					onClick={handleDecrement}
					disabled={quantity <= 1}
					className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Decrease quantity"
				>
					−
				</button>
				<input
					type="number"
					value={quantity}
					onChange={handleDirectInput}
					className="w-14 h-10 text-center text-gray-900 bg-gray-50 border-y border-gray-200 [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
					min="1"
					max={max}
				/>
				<button
					onClick={handleIncrement}
					disabled={quantity >= max}
					className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Increase quantity"
				>
					+
				</button>
			</div>
		</div>
	);
};

export default AddQuantity;
