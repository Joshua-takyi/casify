"use client";
import React from "react";
import { Check } from "lucide-react";

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
		<div className="w-full  px-4">
			<div className="flex flex-wrap items-center justify-center gap-3">
				{product.colors.map((color) => {
					const colorName = color.charAt(0).toUpperCase() + color.slice(1);
					const isWhite = color.toLowerCase() === "white";
					const isSelected = selectedColor === color;

					return (
						<div key={color} className="relative group">
							<button
								onClick={() => setSelectedColor(color)}
								className={`relative rounded-full transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  hover:scale-110 ${
										isSelected
											? "ring-2 ring-gray-900 ring-offset-2 scale-110"
											: "ring-1 ring-gray-200"
									} w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12`}
								style={{
									backgroundColor: color,
									backgroundImage: isWhite
										? "linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)"
										: "none",
									backgroundSize: isWhite ? "8px 8px" : "auto",
									backgroundPosition: isWhite ? "0 0, 4px 4px" : "auto",
								}}
								aria-label={`Select ${colorName} color`}
								aria-pressed={isSelected}
								title={colorName}
							>
								{isSelected && (
									<Check
										className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-3 h-3 sm:w-4 sm:h-4 ${
												isWhite || color.toLowerCase() === "yellow"
													? "text-gray-700"
													: "text-white"
											} drop-shadow-sm`}
										strokeWidth={3}
									/>
								)}
							</button>

							{/* Tooltip */}
							<span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
								{colorName}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ProductColorSelector;
