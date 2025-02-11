"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from 'next/navigation'; // Import useRouter

// Utility function to format price with currency
const formatPrice = (price: number, currency = "GHS") => {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency,
    }).format(price);
};

// Type definitions for component props
interface ProductCardProps {
    title: string;
    price: number;
    images: string | string[]; // Can accept single image or array of images
    slug: string;
    colors?: string | string[]; // Optional array of color options
    model?: string; // Optional model number/ID
    isNew?: boolean; // Flag for new products
}

export const ProductCard = ({
                                title,
                                price,
                                images,
                                slug,
                                colors = [], // Default to empty array if no colors provided
                                model = "", // Default to empty string if no model provided
                                isNew = false,
                            }: ProductCardProps) => {
    // State for hover and wishlist functionality
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);

    // Convert single items to arrays for consistent handling
    const imageArray = Array.isArray(images) ? images : [images];
    const colorArray = Array.isArray(colors) ? colors : [colors];
    const router = useRouter(); // Get router instance

    // Handler for wishlist button clicks
    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation(); // Prevent event bubbling
        setIsWishlist((prev) => !prev);
    };

    // Generate URL for color variants with query parameters
    const getColorLink = (color: string) => {
        const params = new URLSearchParams();
        if (color) params.append('color', color);
        if (model) params.append('model', model);
        return `/product/get-item/${slug}?${params.toString()}`;
    };

    const handleColorClick = (e: React.MouseEvent, color: string) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(getColorLink(color)); // Programmatically navigate
    };

    return (
        <Link
            href={`/product/${slug}`}
            className="group block w-full border border-gray-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative">
                {/* Primary Product Image */}
                <div className="relative aspect-square w-full">
                    <Image
                        src={imageArray[0]}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-opacity duration-300"
                        style={{ opacity: isHovered && imageArray.length > 1 ? 0 : 1 }}
                        priority={false}
                    />

                    {/* Secondary Image - Shows on hover if available */}
                    {imageArray.length > 1 && (
                        <Image
                            src={imageArray[1]}
                            alt={`${title} - alternate view`}
                            fill
                            sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-opacity duration-300"
                            style={{ opacity: isHovered ? 1 : 0 }}
                            priority={false}
                        />
                    )}
                </div>

                {/* New Product Badge */}
                {isNew && (
                    <div className="absolute left-0 top-0 bg-black px-2 py-1">
                        <span className="text-xs font-medium uppercase text-white">New</span>
                    </div>
                )}

                {/* Wishlist Toggle Button */}
                <button
                    onClick={handleWishlist}
                    className="absolute right-2 top-2 z-10"
                >
                    <Heart
                        className={`h-5 w-5 transition-colors duration-200 ${
                            isWishlist ? "fill-black text-black" : "text-gray-500"
                        }`}
                    />
                </button>
            </div>

            {/* Product Information Section */}
            <div className="border-t border-gray-200 p-4">
                {/* Product Title */}
                <h3 className="text-sm font-normal text-gray-900 mb-2">{title}</h3>

                {/* Price and Color Options Row */}
                <div className="flex items-center justify-between">
                    {/* Product Price */}
                    <p className="text-sm font-medium text-gray-900">
                        {formatPrice(price)}
                    </p>

                    {/* Color Variant Selector */}
                    {colorArray.length > 0 && (
                        <div className="flex gap-1">
                            {colorArray.map((color, index) => (
                                <div
                                    key={index}
                                    onClick={(e) => handleColorClick(e, color)}
                                    className="h-4 w-4 border border-gray-200 cursor-pointer hover:border-black transition-colors duration-200"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;