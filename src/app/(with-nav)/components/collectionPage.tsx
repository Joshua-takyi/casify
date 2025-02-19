"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Wrapper from "@/components/wrapper";
import Image from "next/image";
import ProductCard from "@/components/productCard";
import Loading from "@/app/loading";
import FilterComponent from "@/components/filter";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProductCardProps {
	_id: string;
	title: string;
	price: number;
	image: string[];
	slug: string;
	colors: string[];
	images: string[];
	isNewItem: boolean;
	// other fields like category, etc.
}

const buildUrl = (
	filters: {
		category: string;
		minPrice: number | null;
		maxPrice: number | null;
		sortBy: string | null;
		onSale: boolean;
		isNew: boolean;
		model: string | null;
		featured: boolean;
		discountRange: number | null;
	},
	limit: number,
	page: number
): string => {
	let url = `${API_URL}/products/get-item?limit=${limit}&page=${page}`;
	if (filters.category) url += `&category=${filters.category}`;
	if (filters.minPrice !== null) url += `&minPrice=${filters.minPrice}`;
	if (filters.maxPrice !== null) url += `&maxPrice=${filters.maxPrice}`;
	if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
	if (filters.onSale) url += `&onSale=true`;
	if (filters.isNew) url += `&isNew=true`;
	if (filters.model) url += `&model=${filters.model}`;
	if (filters.discountRange !== null)
		url += `&discountRange=${filters.discountRange}`;
	if (filters.featured) url += `&featured=true`;
	return url;
};

export default function CollectionPage() {
	const searchParams = useSearchParams();

	// Derive parameters from searchParams
	const category = searchParams.get("category") ?? "";
	const limit = Number(searchParams.get("limit") ?? 20);
	const minPrice = searchParams.get("minPrice")
		? Number(searchParams.get("minPrice"))
		: null;
	const maxPrice = searchParams.get("maxPrice")
		? Number(searchParams.get("maxPrice"))
		: null;
	const sortBy = searchParams.get("sortBy") || null;
	const onSale = searchParams.get("onSale") === "true";
	const isNew = searchParams.get("isNew") === "true";
	const model = searchParams.get("model") || null;
	const featured = searchParams.get("featured") === "true";
	const discountRange = searchParams.get("discountRange")
		? Number(searchParams.get("discountRange"))
		: null;

	const filters = {
		category,
		minPrice,
		maxPrice,
		sortBy,
		onSale,
		featured,
		isNew,
		model,
		discountRange,
	};

	// Infinite query to load products
	const {
		data: response,
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["products", filters, limit],
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => {
			const url = buildUrl(filters, limit, pageParam);
			const res = await axios.get(url, {
				headers: { Accept: "application/json" },
			});
			return res.data;
		},
		getNextPageParam: (lastPage, pages) => {
			if (pages.length < lastPage.pagination.totalPages) {
				return pages.length + 1;
			}
			return undefined;
		},
	});

	// Intersection Observer to load next page
	const { ref, inView } = useInView({ threshold: 0 });
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isLoading) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col justify-center items-center min-h-[500px]"
			>
				<Loading />
			</motion.div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[500px] text-red-500">
				Error: {(error as AxiosError)?.message || "Failed to fetch data"}
			</div>
		);
	}

	// Flatten pages array
	const products: ProductCardProps[] = response
		? response.pages.flatMap((page) => page.data)
		: [];

	if (!products || products.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[500px]">
				<Image
					src={`/images/empty-folder.png`}
					alt="Empty folder"
					width={200}
					height={200}
					priority={true}
				/>
				<h1 className="capitalize text-xl">No products found.</h1>
			</div>
		);
	}

	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="md:py-12 py-8"
		>
			<Wrapper>
				<motion.section
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="md:py-5"
				>
					<FilterComponent />
				</motion.section>

				<AnimatePresence mode="wait">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
					>
						{products.map((product, index) => (
							<motion.div
								key={product._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<ProductCard
									className={`border`}
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
				</AnimatePresence>

				{/* Observer element with animation */}
				<motion.div
					ref={ref}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="flex justify-center py-4"
				>
					{isFetchingNextPage && <Loading />}
				</motion.div>
			</Wrapper>
		</motion.main>
	);
}
