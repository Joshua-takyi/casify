"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "@/components/productCard";
import Loading from "@/app/loading";
import EmptyWishlist from "../components/emptyWishlist";

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
		return (
			<div className="py-8">
				<Loading />
			</div>
		);
	}

	if (wishlistError) {
		return <div className="py-8">Error loading wishlist.</div>;
	}

	if (!wishlistItems || wishlistItems.length === 0) {
		return (
			<section>
				<EmptyWishlist />
			</section>
		);
	}

	return (
		<div className="py-8 px-4 md:px-8 lg:px-16">
			<h1 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h1>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{wishlistItems.map((item) => (
					<div key={item._id}>
						<ProductCard
							// id={item.productId._id}
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
