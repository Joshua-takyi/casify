"use client";

import { useRouter } from "next/navigation";
import { GetBy } from "@/server/action";
import { ProductCardProps } from "@/app/(with-nav)/components/collectionPage";
import ProductCard from "@/components/productCard";
import Wrapper from "@/components/wrapper";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

interface ProductSectionProps {
	title: string;
	category: string;
	tags?: string;
}

const MAX_ITEMS = 8; // Maximum products to display initially

const ProductSection = ({
	title,
	category,
	tags = "",
}: ProductSectionProps) => {
	const router = useRouter();

	// Fetch products with a limit of MAX_ITEMS
	const { data, isLoading, error } = useQuery({
		queryKey: ["products", category, MAX_ITEMS, tags],
		queryFn: async () => {
			const res = await GetBy({ category, limit: MAX_ITEMS, tags });
			return res.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes cache
		gcTime: 30 * 60 * 1000, // 30 minutes before garbage collection
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	// Redirect to the collection page when clicking "View All"
	const handleViewAll = () => {
		router.push(`/collection?category=${category}&limit=10&tags=${tags}`);
	};

	// Handle error state
	if (error) {
		return (
			<div className="flex items-center justify-center p-4 text-red-500">
				Error loading products: {error.message}
			</div>
		);
	}

	// Show loading state
	if (isLoading) return <Loading />;

	// Show "No products found" message if data is empty
	if (!data || data.length === 0) {
		return (
			<div className="flex items-center justify-center p-4 text-gray-500">
				No products found
			</div>
		);
	}

	return (
		<section className="md:py-10">
			<Wrapper>
				{/* Section Header */}
				<div className="mb-8 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<h2 className="text-2xl font-bold tracking-tight text-gray-900 capitalize">
							{title}
						</h2>
						<div className="h-[2px] w-20 bg-gray-200 rounded-full" />
					</div>

					{/* "View All" button if more than MAX_ITEMS exist */}
					{data.length > MAX_ITEMS && (
						<button
							onClick={handleViewAll}
							className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
						>
							View All
							<ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
						</button>
					)}
				</div>

				{/* Product Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
					{data.slice(0, MAX_ITEMS).map((product: ProductCardProps) => (
						<ProductCard key={product._id} {...product} className={`border`} />
					))}
				</div>
			</Wrapper>
		</section>
	);
};

export default ProductSection;
