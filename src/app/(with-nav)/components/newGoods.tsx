"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import ProductCard from "@/components/productCard";
import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import { GetIsOnSale } from "@/server/action";

// Types
export interface ProductProps {
	_id: string;
	title: string;
	price: number;
	images: string[];
	slug: string;
	colors: string[];
	isNewItem: boolean;
	salesStartAt?: string;
	salesEndAt?: string;
}

// Animation variants
const animations = {
	container: {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	},
	item: {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring", stiffness: 300 },
		},
	},
};

export default function Promotion() {
	const [limit, setLimit] = useState(10);
	const queryClient = useQueryClient();

	// Query setup
	const { data, isLoading, isError } = useQuery({
		queryKey: ["isOnSale", limit],
		queryFn: () => GetIsOnSale(limit),
		staleTime: 60 * 1000,
	});

	// Prefetch next page
	const prefetchNextPage = async () => {
		await queryClient.prefetchQuery({
			queryKey: ["isOnSale", limit + 10],
			queryFn: () => GetIsOnSale(limit + 10),
		});
	};
	// Filter and sort products
	const now = new Date();
	const productsWithSaleTimes =
		data?.data?.filter((p: ProductProps) => p.salesStartAt && p.salesEndAt) ||
		[];

	// Get active sales (current time is between start and end dates)
	const activeProducts = productsWithSaleTimes.filter((p: ProductProps) => {
		const start = new Date(p.salesStartAt!);
		const end = new Date(p.salesEndAt!);
		return now >= start && now < end;
	});

	// Get upcoming sales (start date is in the future)
	const upcomingSales = productsWithSaleTimes.filter(
		(p: ProductProps) => new Date(p.salesStartAt!) > now
	);

	// If there are no active sales and no upcoming sales, or if we're still loading, don't show anything
	if (isLoading || (!activeProducts.length && !upcomingSales.length)) {
		return null;
	}

	// If there are only upcoming sales but no active ones, don't show the promotion section
	if (!activeProducts.length && upcomingSales.length > 0) {
		return null;
	}
	const handleLoadMore = () => {
		setLimit((prev) => {
			const newLimit = prev + 10;
			prefetchNextPage();
			return newLimit;
		});
	};

	return (
		<section className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white py-12 md:py-20">
			<Wrapper>
				<motion.div
					className="flex flex-col gap-10"
					variants={animations.container}
					initial="hidden"
					animate="visible"
				>
					{/* Header Section */}
					<motion.header className="space-y-6" variants={animations.item}>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Sparkles className="w-6 h-6 text-indigo-500" />
								<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
									Special Promotions
								</h1>
							</div>
							<p className="text-sm text-gray-500 ml-8">
								Exclusive deals curated just for you
							</p>
						</div>

						<div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
							<p className="text-lg font-medium text-gray-700">
								Discover Your Style - New Arrivals Every Week
							</p>
						</div>
					</motion.header>

					{/* Content Section */}
					<AnimatePresence mode="wait">
						{isLoading ? (
							<LoadingState />
						) : (
							<>
								{isError && <ErrorState />}
								{!upcomingSales.length && (
									<ProductGrid
										products={activeProducts}
										data={{ data: data?.data, length: data?.data?.length }}
										limit={limit}
										isFetchingNextPage={false}
										onLoadMore={handleLoadMore}
										onPrefetch={prefetchNextPage}
									/>
								)}
							</>
						)}
					</AnimatePresence>
				</motion.div>
			</Wrapper>
		</section>
	);
}

// Component for loading state
function LoadingState() {
	return (
		<motion.div
			className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
			variants={animations.item}
		>
			{Array(4)
				.fill(0)
				.map((_, i) => (
					<div
						key={i}
						className="aspect-square bg-gray-100 rounded-xl animate-pulse"
					/>
				))}
		</motion.div>
	);
}

// Component for error state
function ErrorState() {
	return (
		<motion.div
			variants={animations.item}
			className="text-center py-12 bg-red-50 rounded-xl"
		>
			<p className="text-red-500">
				Failed to load products. Please refresh the page.
			</p>
		</motion.div>
	);
}

// Component for product grid
interface ProductGridProps {
	readonly products: ProductProps[];
	readonly data: {
		data?: ProductProps[];
		length?: number;
	};
	readonly limit: number;
	readonly isFetchingNextPage: boolean;
	readonly onLoadMore: () => void;
	readonly onPrefetch: () => void;
}

function ProductGrid({
	products,
	data,
	limit,
	isFetchingNextPage,
	onLoadMore,
	onPrefetch,
}: ProductGridProps) {
	return (
		<>
			<motion.div
				className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
				variants={animations.container}
			>
				{products.map((product) => (
					<motion.div
						key={product._id}
						variants={animations.item}
						whileHover={{ y: -5 }}
						className="transform transition-all duration-200"
					>
						<ProductCard
							images={product.images}
							title={product.title}
							price={product.price}
							slug={product.slug}
							colors={product.colors}
							isNew={product.isNewItem}
						/>
					</motion.div>
				))}
			</motion.div>

			{data?.data && data.data.length >= limit && (
				<motion.div
					className="flex justify-center mt-8"
					variants={animations.item}
				>
					<Button
						onClick={onLoadMore}
						onMouseEnter={onPrefetch}
						disabled={isFetchingNextPage}
						className="px-8 py-6 bg-black hover:bg-gray-800 text-white rounded-xl 
                                 transition-all duration-200 hover:shadow-lg disabled:bg-gray-300"
					>
						{isFetchingNextPage ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							"Load More Products"
						)}
					</Button>
				</motion.div>
			)}
		</>
	);
}
