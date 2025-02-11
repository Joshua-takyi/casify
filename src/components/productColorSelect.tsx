import React from 'react';

interface ProductColorSelectorProps {
    product: {
        colors: string[];
    };
    selectedColor: string;
    setSelectedColor: (color: string) => void;
}

const ProductColorSelector = ({ product, selectedColor, setSelectedColor }: ProductColorSelectorProps) => {
    return (
        <div className="px-4 py-2 ">
            <div className="space-y-3">
                {/* Color Buttons */}
                <div className="flex flex-wrap  justify-evenly items-center gap-2 ">
                    {product.colors.map((color) => {
                        const colorName = color.charAt(0).toUpperCase() + color.slice(1); // Capitalize color name

                        return (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`
                                    relative w-6 h-6 rounded-full border border-gray-300 transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                                    ${selectedColor === color
                                    ? 'ring-2 ring-gray-900 ring-offset-2 scale-110'
                                    : 'hover:scale-105 hover:shadow-sm'
                                }
                                `}
                                style={{
                                    backgroundColor: color,
                                    backgroundImage: color.toLowerCase() === 'white'
                                        ? 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0), linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0)'
                                        : 'none',
                                    backgroundSize: color.toLowerCase() === 'white' ? '10px 10px' : 'auto',
                                    backgroundPosition: color.toLowerCase() === 'white' ? '0 0, 5px 5px' : 'auto'
                                }}
                                aria-label={`Select ${colorName} color`}
                                aria-pressed={selectedColor === color}
                                title={colorName}
                            >
                                {/* Check mark for selected color */}
                                {selectedColor === color && (
                                    <svg
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white drop-shadow-md"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductColorSelector;