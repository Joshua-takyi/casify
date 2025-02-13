import React from 'react';
import { Check } from 'lucide-react';

interface ProductColorSelectorProps {
    product: {
        colors: string[];
    };
    selectedColor: string;
    setSelectedColor: (color: string) => void;
}

const ProductColorSelector = ({ product, selectedColor, setSelectedColor }: ProductColorSelectorProps) => {
    return (
        <div className="w-full max-w-md">
            <div className="flex flex-wrap items-center gap-3">
                {product.colors.map((color) => {
                    const colorName = color.charAt(0).toUpperCase() + color.slice(1);
                    const isWhite = color.toLowerCase() === 'white';
                    const isSelected = selectedColor === color;

                    return (
                        <div key={color} className="relative group">
                            <button
                                onClick={() => setSelectedColor(color)}
                                className={`
                                    relative w-8 h-8 rounded-full 
                                    transition-all duration-200 ease-in-out
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    hover:scale-110
                                    ${isSelected
                                    ? 'ring-2 ring-gray-900 ring-offset-2 scale-110'
                                    : 'ring-1 ring-gray-200'
                                }
                                `}
                                style={{
                                    backgroundColor: color,
                                    backgroundImage: isWhite
                                        ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)'
                                        : 'none',
                                    backgroundSize: isWhite ? '8px 8px' : 'auto',
                                    backgroundPosition: isWhite ? '0 0, 4px 4px' : 'auto'
                                }}
                                aria-label={`Select ${colorName} color`}
                                aria-pressed={isSelected}
                                title={colorName}
                            >
                                {isSelected && (
                                    <Check
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4
                                            ${isWhite || color.toLowerCase() === 'yellow'
                                            ? 'text-gray-700'
                                            : 'text-white'
                                        } drop-shadow-sm`}
                                        strokeWidth={3}
                                    />
                                )}
                            </button>

                            {/* Color name tooltip */}
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