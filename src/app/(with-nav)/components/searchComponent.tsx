"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/app/loading";
import Wrapper from "@/components/wrapper";
import { Product } from "@/app/(with-nav)/components/collectionPage";
import ProductCard from "@/components/productCard";

// Define our primary color
// const PRIMARY_COLOR = "#868b92";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SearchCom() {
	const [mobile, setMobile] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchInput, setSearchInput] = useState("");

	// Get query and convert to lowercase for case-insensitive comparison
	const query = (searchParams.get("type") || "").toLowerCase();

	const {
		data: products = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["search", query],
		queryFn: async () => {
			if (!query) return [];
			try {
				const { data } = await axios.get(
					`${API_URL}/products/get-item?type=${encodeURIComponent(
						query
					)}&sortBy=price&sortOrder=desc&page=1&limit=10`
				);
				return data.data || [];
			} catch (err) {
				console.error("Error fetching products:", err);
				throw err;
			}
		},
		enabled: !!query,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		setSearchInput(query);
		const handleResize = () => setMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, [query]);

	const handleSearch = () => {
		if (!searchInput.trim()) return;
		router.push(
			`/search?type=${encodeURIComponent(
				searchInput.toLowerCase()
			)}&sortBy=price&sortOrder=desc&page=1&limit=10`
		);
	};

	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	if (isLoading) return <Loading />;

	if (isError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center p-8">
					<p className="text-[#868b92] mb-4">Error: {error.message}</p>
					<button
						onClick={() => router.push("/")}
						className="px-4 py-2 rounded-md bg-[#868b92] text-white"
					>
						Return Home
					</button>
				</div>
			</div>
		);
	}

	const productCount = products.length;

	return (
		<div className="min-h-screen">
			<Wrapper>
				<div className="w-full md:h-[30dvh] flex justify-center items-center py-8 md:py-0">
					<div className="flex flex-col gap-y-6 items-center justify-between w-full max-w-2xl px-4">
						<h1 className="md:text-3xl text-2xl font-medium text-[#868b92]">
							Results for &quot;{query}&quot;
						</h1>
						<div className="w-full flex flex-col md:flex-row gap-3">
							<div className="relative flex-1">
								<input
									type="text"
									placeholder="Search products..."
									value={searchInput}
									onChange={handleSearchInput}
									onKeyPress={handleKeyPress}
									className="w-full h-11 px-4 rounded-md border border-[#868b92] outline-none"
								/>
								<MagnifyingGlassIcon className="h-5 w-5 absolute top-3 right-3 text-[#868b92]" />
							</div>
							<button
								onClick={handleSearch}
								className={`h-11 rounded-md cursor-pointer bg-[#868b92] text-white ${
									mobile ? "px-4" : "px-6"
								}`}
							>
								Search
							</button>
						</div>
						<p className="text-[#868b92] text-sm">
							{`Products (${productCount})`}
						</p>
					</div>
				</div>

				<section className="py-8">
					{productCount > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{products.map((product: Product) => (
								<ProductCard
									key={product._id}
									title={product.title}
									price={product.price}
									images={product.images}
									slug={product.slug}
									colors={product.colors}
									isNew={product.isNewItem}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-16">
							<div className="text-center">
								<p className="text-xl text-[#868b92] mb-4">
									No items found for &quot;{query}&quot;
								</p>
								<p className="text-[#868b92] mb-6">
									Try checking your spelling or using different keywords.
								</p>
								<button
									onClick={() => router.push("/")}
									className="px-6 py-2 bg-[#868b92] text-white rounded-md cursor-pointer"
								>
									Browse All Products
								</button>
							</div>
						</div>
					)}
				</section>
			</Wrapper>
		</div>
	);
}
