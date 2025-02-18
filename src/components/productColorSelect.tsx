"use client";
import React from "react";
// import { Check } from "lucide-react";

interface ProductColorSelectorProps {
	product: {
		colors: string[];
	};
	selectedColor: string;
	setSelectedColor: (color: string) => void;
}

const ProductColorSelector: React.FC<ProductColorSelectorProps> = ({
	product,
	selectedColor,
	setSelectedColor,
}) => {
	return (
		<div className="flex gap-4">
			{product.colors.map((color) => (
				<div key={color} className="relative">
					<button
						onClick={() => setSelectedColor(color)}
						className={`w-7 h-7 rounded-full transition-all duration-200
                            ${
															selectedColor === color
																? "ring-2 ring-offset-2 ring-black"
																: "ring-1 ring-gray-200"
														}
                        `}
						style={{ backgroundColor: color }}
						aria-label={`Select ${color} color`}
					/>
				</div>
			))}
		</div>
	);
};
export default ProductColorSelector;
