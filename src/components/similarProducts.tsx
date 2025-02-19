"use client";

import ProductCard from "./productCard";
import { useQuery } from "@tanstack/react-query";
import { GetSimilarProducts } from "@/server/action";
import Loading from "@/app/loading";
import { ProductProps } from "@/app/(with-nav)/types/productProps";

export default function SimilarProducts({ slug }: { slug: string }) {
	const {
		data: products,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["similarProducts", slug],
		queryFn: async () => {
			const res = await GetSimilarProducts({ slug });
			if (!res.success) {
				console.error("API error:", res.message);
				return [];
			}
			return res.data || [];
		},
		staleTime: 5 * 60 * 1000,
	});

	if (isLoading) return <Loading />;
	if (error) return <div>Error loading similar products: {String(error)}</div>;
	if (!products) return <div>No products data received</div>;
	if (products.length === 0) return <div>No similar products found</div>;

	// Calculate visible products

	return (
		<section className="py-8 md:py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl font-bold mb-6">You may also like</h2>

				<div className="relative">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
						{products.map((product: ProductProps) => (
							<div key={product._id} className="w-full">
								<ProductCard
									title={product.title}
									price={product.price}
									images={product.images}
									slug={product.slug}
									colors={product.colors}
									isNew={product.isNewItem}
									className="border"
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
