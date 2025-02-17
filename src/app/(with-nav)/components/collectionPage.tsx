"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Wrapper from "@/components/wrapper";
import Image from "next/image";
import ProductCard from "@/components/productCard";
import Loading from "@/app/loading";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
	_id: string;
	title: string;
	price: number;
	image: string[];
	slug: string;
	colors: string[];
	images: string[];
	isNewItem: boolean;
	// other properties...
}

// Helper function to build the API URL based on filters
const buildUrl = (
	filters: {
		category: string;
		minPrice: number | null;
		maxPrice: number | null;
		sortBy: string | null;
		onSale: boolean;
		isNew: boolean;
		model: string | null;
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
	return url;
};

export default function CollectionPage() {
	const searchParams = useSearchParams();

	// Derive all query parameters directly from searchParams
	const category = searchParams.get("category") ?? "";
	const limit = Number(searchParams.get("limit") ?? 20);
	const page = Number(searchParams.get("page") ?? 1);
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
	const discountRange = searchParams.get("discountRange")
		? Number(searchParams.get("discountRange"))
		: null;

	const filters = {
		category,
		minPrice,
		maxPrice,
		sortBy,
		onSale,
		isNew,
		model,
		discountRange,
	};

	const {
		data: products,
		isLoading,
		isError,
		error,
	} = useQuery<Product[], Error>({
		queryKey: ["products", filters, limit, page],
		queryFn: async () => {
			const url = buildUrl(filters, limit, page);
			const res = await axios.get(url, {
				headers: { Accept: "application/json" },
			});
			if (res.status === 200) {
				// Assuming the response shape is: { data: Product[] }
				return res.data.data;
			}
			throw new Error("Failed to get data");
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col justify-center items-center h-screen text-red-500">
				Error: {error?.message || "Failed to fetch data"}
			</div>
		);
	}

	if (!Array.isArray(products) || products.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
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
		<main className=" md:py-12 py-8">
			<Wrapper>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ">
					{products.map((product) => (
						<div key={product._id}>
							<ProductCard
								title={product.title}
								price={product.price}
								images={product.images}
								slug={product.slug}
								colors={product.colors}
								isNew={product.isNewItem}
							/>
						</div>
					))}
				</div>
			</Wrapper>
		</main>
	);
}
