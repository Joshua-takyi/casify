"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

// -----------------------
// Helper Functions
// -----------------------

const formatPrice = (price: number, currency = "GHS"): string => {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency,
	}).format(price);
};

const formatName = (title: string): string => {
	return title.length > 20 ? `${title.slice(0, 20)}...` : title;
};

// -----------------------
// Props Interface
// -----------------------
export interface ProductCardProps {
	id?: string;
	title: string;
	price: number;
	images: string | string[];
	slug: string;
	colors?: string | string[];
	model?: string;
	isNew?: boolean;
}

// -----------------------
// ProductCard Component
// -----------------------
const ProductCard = ({
	id,
	title,
	price,
	images,
	slug,
	colors = [],
	model = "",
	isNew = false,
}: ProductCardProps) => {
	// State for hover effect
	const [isHovered, setIsHovered] = useState(false);

	// Convert images and colors to arrays for consistent handling
	const imageArray = Array.isArray(images) ? images : [images];
	const colorArray = Array.isArray(colors) ? colors : colors ? [colors] : [];

	const router = useRouter();
	const queryClient = useQueryClient();

	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	useEffect(() => {
		axios.defaults.withCredentials = true;
	}, []);

	// Fetch wishlist data
	const {
		data: wishlistData,
		isLoading: wishlistLoading,
		isError: wishlistError,
	} = useQuery({
		queryKey: ["wishlistData"],
		queryFn: async () => {
			try {
				const response = await axios.get(`${API_URL}/wishlist/get-wishlist`, {
					withCredentials: true,
				});
				return response.data.data;
			} catch (error) {
				// Handle error appropriately
				console.error("Error fetching wishlist:", error);
				throw error;
			}
		},
		// Add error handling and retry options
		retry: 2,
		retryDelay: 1000,
	});

	interface WishlistItem {
		productId: {
			_id: string;
		};
	}

	const isInWishlist: boolean =
		wishlistData?.some((item: WishlistItem) => item.productId._id === id) ??
		false;

	// Wishlist mutations
	const { mutate: addToWishlist } = useMutation({
		mutationKey: ["wishlist"],
		mutationFn: async (productId: string) => {
			try {
				const res = await axios.post(
					`${API_URL}/wishlist/add-wishlist`,
					{ productId },
					{ withCredentials: true }
				);

				if (res.status === 201) {
					return res.data;
				}
				throw new Error(`Failed to add product. Status: ${res.status}`);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					const axiosError = error as AxiosError<{ message?: string }>;
					throw new Error(
						axiosError.response?.data?.message ||
							"Failed to add product to wishlist"
					);
				}
				throw new Error("Failed to add product to wishlist");
			}
		},
		onSuccess: () => {
			toast.success("Product added to wishlist", {
				richColors: false,
				duration: 1500,
			});
			queryClient.invalidateQueries({ queryKey: ["wishlistData"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "An error occurred");
		},
	});

	const { mutate: removeFromWishlist } = useMutation({
		mutationKey: ["wishlist"],
		mutationFn: async (productId: string) => {
			try {
				const res = await axios.delete(`${API_URL}/wishlist/remove-wishlist`, {
					withCredentials: true,
					data: { productId },
				});

				if (res.status === 200) {
					return res.data;
				}
				throw new Error(`Failed to remove product. Status: ${res.status}`);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					const axiosError = error as AxiosError<{ message?: string }>;
					throw new Error(
						axiosError.response?.data?.message ||
							"Failed to remove product from wishlist"
					);
				}
				throw new Error("Failed to remove product from wishlist");
			}
		},
		onSuccess: () => {
			toast.success("Product removed from wishlist", {
				richColors: false,
				duration: 1500,
			});
			queryClient.invalidateQueries({ queryKey: ["wishlistData"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "An error occurred");
		},
	});

	const handleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!id) {
			toast.error("Product ID is required for wishlist operations");
			return;
		}

		if (!isInWishlist) {
			addToWishlist(id);
		} else {
			removeFromWishlist(id);
		}
	};

	const getColorLink = (color: string): string => {
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

	if (wishlistLoading) {
		return (
			<div className="w-full border border-gray-200 bg-white p-4">
				<div className="animate-pulse">
					<div className="aspect-square w-full bg-gray-200" />
					<div className="mt-4 h-4 w-2/3 bg-gray-200" />
					<div className="mt-2 h-4 w-1/3 bg-gray-200" />
				</div>
			</div>
		);
	}

	if (wishlistError) {
		console.error("Wishlist error:", wishlistError);
		// Continue rendering the product card without wishlist functionality
	}

	return (
		<Link
			href={`/product/${slug}`}
			className="group relative block w-full border border-gray-200 bg-white"
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

				<button
					onClick={handleWishlist}
					className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-all duration-200 hover:bg-white cursor-pointer"
					aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
				>
					<BookmarkIcon
						className={`h-5 w-5 transition-colors duration-200 ${
							isInWishlist ? "fill-black text-black" : "text-gray-600"
						}`}
					/>
				</button>
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
