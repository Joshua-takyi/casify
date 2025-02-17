"use client";
import React, { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

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
		<div className="flex items-center justify-between w-full  h-10 border border-gray-300 rounded-md">
			<button
				onClick={handleDecrement}
				disabled={quantity <= 1}
				className="flex items-center justify-center w-8 md:w-10 h-full text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Decrease quantity"
			>
				<Minus size={16} />
			</button>

			<input
				type="number"
				value={quantity}
				onChange={handleDirectInput}
				className="w-12 h-full text-center text-gray-900 border-none focus:outline-none  bg-transparent"
				min="1"
				max={max}
			/>

			<button
				onClick={handleIncrement}
				disabled={quantity >= max}
				className="flex items-center justify-center w-8 md:w-10 h-full text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Increase quantity"
			>
				<Plus size={16} />
			</button>
		</div>
	);
};

export default AddQuantity;
