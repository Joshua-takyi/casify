"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProductCard from "@/components/productCard";
import Wrapper from "@/components/wrapper";
import Loading from "@/app/loading";
import { GetFeatured } from "@/server/action";
import { useEffect } from "react";
import { ProductProps } from "../types/productProps";

export default function FeaturedProducts() {
	const queryClient = useQueryClient();

	// Prefetch the data
	useEffect(() => {
		queryClient.prefetchQuery({
			queryKey: ["featuredProducts"],
			queryFn: async () => {
				const res = await GetFeatured();
				return res.data;
			},
		});
	}, [queryClient]);

	const { data: products, isLoading } = useQuery({
		queryKey: ["featuredProducts"],
		queryFn: async () => {
			const res = await GetFeatured();
			return res.data;
		},
		staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
		gcTime: 1000 * 60 * 30, // Cache the data for 30 minutes
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	if (isLoading) return <Loading />;

	return (
		<section className="py-1">
			<Wrapper>
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Featured Products</h2>
					<p className="text-gray-600">
						Discover our most popular phone accessories
					</p>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
					{products?.map((product: ProductProps) => (
						<ProductCard
							key={product._id}
							title={product.title}
							price={product.price}
							images={product.images}
							slug={product.slug}
							colors={product.colors}
							isNew={product.isNewItem}
							className="border"
						/>
					))}
				</div>
			</Wrapper>
		</section>
	);
}
