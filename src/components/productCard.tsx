"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const formatPrice = (price: number, currency = "GHS") => {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency,
	}).format(price);
};

export interface ProductCardProps {
	title: string;
	price: number;
	images: string | string[];
	slug: string;
	colors?: string | string[];
	model?: string;
	isNew?: boolean;
}

const formatName = (title: string) => {
	if (title.length > 20) {
		return title.slice(0, 20) + "...";
	}
	return title;
};

export const ProductCard = ({
	title,
	price,
	images,
	slug,
	colors = [],
	model = "",
	isNew = false,
}: ProductCardProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isWishlist, setIsWishlist] = useState(false);
	const imageArray = Array.isArray(images) ? images : [images];
	const colorArray = Array.isArray(colors) ? colors : [colors];
	const router = useRouter();

	const handleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsWishlist((prev) => !prev);
	};

	const getColorLink = (color: string) => {
		const params = new URLSearchParams();
		if (color) params.append("color", color);
		if (model) params.append("model", model);
		return `/product/get-item/${slug}?${params.toString()}`;
	};

	const handleColorClick = (e: React.MouseEvent, color: string) => {
		e.preventDefault();
		e.stopPropagation();
		router.push(getColorLink(color));
	};

	return (
		<Link
			href={`/product/${slug}`}
			className="group relative block w-full border border-gray-200 bg-white"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Image Container */}
			<div className="relative">
				{/* Primary Product Image */}
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

					{/* Secondary Image */}
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
						<span className="text-xs font-medium uppercase text-white">
							New
						</span>
					</div>
				)}

				{/* Bookmark Button */}
				<button
					onClick={handleWishlist}
					className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-all duration-200 hover:bg-white cursor-pointer"
					aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
				>
					<BookmarkIcon
						className={`h-5 w-5 transition-colors duration-200 ${
							isWishlist ? "fill-black text-black " : "text-gray-600"
						}`}
					/>
				</button>
			</div>

			{/* Product Information */}
			<div className="border-t border-gray-200 p-4">
				<h3 className="text-sm font-normal text-gray-900 mb-2">
					{formatName(title)}
				</h3>

				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-gray-900">
						{formatPrice(price)}
					</p>

					{/* Color Options */}
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
