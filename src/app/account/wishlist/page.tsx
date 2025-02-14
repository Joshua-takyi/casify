"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "@/components/productCard";

// -----------------------
// Interface
// -----------------------
interface WishlistItem {
	_id: string;
	productId: {
		_id: string;
		title: string;
		description: string;
		price: number;
		images: string[];
		slug: string;
		colors: string[];
		// ... other properties of the product
	};
	slug: string;
}

const WishList = () => {
	const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const {
		data: wishlistData,
		isLoading: wishlistLoading,
		isError: wishlistError,
	} = useQuery({
		queryKey: ["wishlistData"],
		queryFn: async () => {
			const response = await axios.get(`${API_URL}/wishlist/get-wishlist`, {
				withCredentials: true,
			});
			return response.data.data; // Access the data property
		},
	});

	useEffect(() => {
		if (wishlistData) {
			setWishlistItems(wishlistData);
		}
	}, [wishlistData]);

	if (wishlistLoading) {
		return <div className="py-8">Loading wishlist...</div>;
	}

	if (wishlistError) {
		return <div className="py-8">Error loading wishlist.</div>;
	}

	if (!wishlistItems || wishlistItems.length === 0) {
		return (
			<div className="py-8 flex flex-col items-center justify-center">
				<p className="text-gray-500 text-lg mb-4">Your wishlist is empty.</p>
				<Link
					href="/collections"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Continue Shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="py-8 px-4 md:px-8 lg:px-16">
			<h1 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h1>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{wishlistItems.map((item) => (
					<div key={item._id}>
						<ProductCard
							id={item.productId._id}
							title={item.productId.title}
							price={item.productId.price}
							images={item.productId.images}
							slug={item.productId.slug}
							colors={item.productId.colors}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default WishList;
