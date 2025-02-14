"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Helper Functions
const formatPrice = (price: number, currency = "GHS"): string => {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency,
	}).format(price);
};

const formatName = (title: string): string => {
	return title.length > 20 ? `${title.slice(0, 20)}...` : title;
};

// Props Interface
export interface ProductCardProps {
	title: string;
	price: number;
	images: string | string[];
	slug: string;
	colors?: string | string[];
	model?: string;
	isNew?: boolean;
}

// Updated ProductCard Component
const ProductCard = ({
	title,
	price,
	images,
	slug,
	colors = [],
	model = "",
	isNew = false,
}: ProductCardProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const imageArray = Array.isArray(images) ? images : [images];
	const colorArray = Array.isArray(colors) ? colors : colors ? [colors] : [];
	const router = useRouter();

	// Function to generate a URL for a given color and model
	const getColorLink = (color: string): string => {
		const params = new URLSearchParams();
		if (color) params.append("color", color);
		if (model) params.append("model", model);
		return `/product/get-item/${slug}?${params.toString()}`;
	};

	// Handler for clicking a color dot
	const handleColorClick = (e: React.MouseEvent, color: string) => {
		e.preventDefault();
		e.stopPropagation();
		router.push(getColorLink(color));
	};

	return (
		<Link
			href={`/product/${slug}`}
			className="group relative block w-full border border-gray-200 bg-white rounded-md overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="relative">
				<div className="relative aspect-square w-full overflow-hidden">
					<Image
						src={imageArray[0]}
						alt={title}
						fill
						sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
						className="object-cover transition-opacity duration-300"
						style={{ opacity: isHovered && imageArray.length > 1 ? 0 : 1 }}
						priority={false}
					/>
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

				{isNew && (
					<div className="absolute left-0 top-0 bg-black px-2 py-1">
						<span className="text-xs font-medium uppercase text-white">
							New
						</span>
					</div>
				)}
			</div>

			<div className="border-t border-gray-200 p-4">
				<h3 className="text-sm font-normal text-gray-900 mb-2">
					{formatName(title)}
				</h3>
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-gray-900">
						{formatPrice(price)}
					</p>
					{colorArray.length > 0 && (
						<div className="flex gap-1">
							{colorArray.map((color, index) => (
								<div
									key={index}
									role="button"
									onClick={(e) => handleColorClick(e, color)}
									className="h-4 w-4 border border-gray-200 cursor-pointer hover:border-black transition-colors duration-200 rounded-full"
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
