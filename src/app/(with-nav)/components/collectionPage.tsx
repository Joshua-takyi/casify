"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Wrapper from "@/components/wrapper";
import Image from "next/image";
import ProductCard from "@/components/productCard";
import Loading from "@/app/loading";
import { useEffect, useState } from "react";

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

export default function CollectionPage() {
	const searchParams = useSearchParams();
	const category = searchParams.get("category") ?? "";
	const limit = Number(searchParams.get("limit") ?? 20);
	const page = Number(searchParams.get("page") ?? 1);
	const minPrice = Number(searchParams.get("minPrice")) || null;
	const maxPrice = Number(searchParams.get("maxPrice")) || null;
	const sortBy = searchParams.get("sortBy") ?? null;
	const onSale = searchParams.get("onSale") === "true";
	const isNew = searchParams.get("isNew") === "true";
	const model = searchParams.get("model") ?? null;
	const discountRange = Number(searchParams.get("discountRange")) || null;

	const [filters, setFilters] = useState({
		category: category,
		minPrice: minPrice,
		maxPrice: maxPrice,
		sortBy: sortBy,
		onSale: onSale,
		isNew: isNew,
		model: model,
		discountRange: discountRange,
	});

	useEffect(() => {
		setFilters({
			category: category,
			minPrice: minPrice,
			maxPrice: maxPrice,
			sortBy: sortBy,
			onSale: onSale,
			isNew: isNew,
			model: model,
			discountRange: discountRange,
		});
	}, [
		category,
		minPrice,
		maxPrice,
		sortBy,
		onSale,
		isNew,
		model,
		discountRange,
	]);

	const {
		data: products,
		isLoading,
		isError,
		error,
	} = useQuery<Product[], Error>({
		queryKey: ["data", filters],
		queryFn: async () => {
			// Build the URL based on the active filters
			let url = `${API_URL}/products/get-item?limit=${limit}&page=${page}`;

			if (category) url += `&category=${category}`;
			if (minPrice !== null) url += `&minPrice=${minPrice}`;
			if (maxPrice !== null) url += `&maxPrice=${maxPrice}`;
			if (sortBy) url += `&sortBy=${sortBy}`;
			if (onSale) url += `&onSale=${onSale}`;
			if (isNew) url += `&isNew=${isNew}`;
			if (model) url += `&model=${model}`;
			if (discountRange !== null) url += `&discountRange=${discountRange}`;

			const res = await axios.get(url, {
				headers: { Accept: "application/json" },
			});
			if (res.status === 200) {
				// Assume response shape is { data: Product[] }
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
					alt={`empty folder`}
					width={200}
					height={200}
					priority={true}
				/>
				<h1 className="capitalize text-xl">No products found.</h1>
			</div>
		);
	}

	return (
		<main className="@container md:py-12 sm:py-8">
			<Wrapper>
				{/*<FilterComponent*/}
				{/*    onFilterChange={handleFilterChange}*/}
				{/*    models={availableModels}*/}
				{/*    discounts={availableDiscounts}*/}
				{/*/>*/}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
