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
import NoResultsFound from "./emptySearch";
import { motion, AnimatePresence } from "framer-motion";

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
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen"
		>
			<Wrapper>
				<motion.div
					initial={{ y: 20 }}
					animate={{ y: 0 }}
					className="w-full md:h-[30dvh] flex justify-center items-center py-8 md:py-0"
				>
					<div className="flex flex-col gap-y-6 items-center justify-between w-full max-w-2xl px-4">
						<motion.h1
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="md:text-4xl text-3xl font-medium text-[#868b92]"
						>
							Results for &quot;{query}&quot;
						</motion.h1>
						<motion.div
							initial={{ y: 10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="w-full flex flex-col md:flex-row gap-3"
						>
							<div className="relative flex-1">
								<input
									type="text"
									placeholder="Search products..."
									value={searchInput}
									onChange={handleSearchInput}
									onKeyPress={handleKeyPress}
									className="w-full h-12 px-4 rounded-md border border-[#868b92] outline-none transition-all duration-200 focus:border-black focus:shadow-sm"
								/>
								<MagnifyingGlassIcon className="h-5 w-5 absolute top-3.5 right-3 text-[#868b92]" />
							</div>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={handleSearch}
								className={`h-12 rounded-md cursor-pointer bg-[#868b92] text-white transition-colors hover:bg-black ${
									mobile ? "px-4" : "px-6"
								}`}
							>
								Search
							</motion.button>
						</motion.div>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-[#868b92] text-sm"
						>
							{`Products (${productCount})`}
						</motion.p>
					</div>
				</motion.div>

				<motion.section
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="py-8"
				>
					<AnimatePresence mode="wait">
						{productCount > 0 ? (
							<motion.div
								key="results"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="grid grid-cols-2 md:grid-cols-4 gap-4"
							>
								{products.map((product: Product, index: number) => (
									<motion.div
										key={product._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<ProductCard
											title={product.title}
											price={product.price}
											images={product.images}
											slug={product.slug}
											colors={product.colors}
											isNew={product.isNewItem}
										/>
									</motion.div>
								))}
							</motion.div>
						) : (
							<motion.section
								key="no-results"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<NoResultsFound onBrowseAll={handleSearch} query={query} />
							</motion.section>
						)}
					</AnimatePresence>
				</motion.section>
			</Wrapper>
		</motion.div>
	);
}
