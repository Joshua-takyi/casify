"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
	ChevronDown,
	X,
	SlidersHorizontal,
	Check,
	RefreshCw,
} from "lucide-react";

// Configuration for filter options aligned with API parameters
const FILTER_CONFIG = {
	categories: [
		{ value: "phone-cases", label: "Phone Cases" },
		{ value: "airpod-cases", label: "Airpod Cases" },
		{ value: "chargers", label: "Chargers" },
		{ value: "headphones", label: "Headphones" },
		{ value: "watch-protection", label: "Watch Protection" },
		{ value: "watch-straps", label: "Watch Straps" },
	],
	priceRanges: [
		{ value: "0-50", label: "Under ₵50", min: 0, max: 50 },
		{ value: "50-100", label: "₵50 - ₵100", min: 50, max: 100 },
		{ value: "100-200", label: "₵100 - ₵200", min: 100, max: 200 },
		{ value: "200-500", label: "₵200 - ₵500", min: 200, max: 500 },
		{ value: "500+", label: "₵500+", min: 500, max: null },
	],
	sortOptions: [
		{ value: "createdAt:desc", label: "Newest" },
		{ value: "price:asc", label: "Price: Low to High" },
		{ value: "price:desc", label: "Price: High to Low" },
		{ value: "rating:desc", label: "Most Popular" },
	],
} as const;

// Type definition for filter state aligned with API parameters
type FilterState = {
	category: string[];
	minPrice?: number;
	maxPrice?: number;
	sortBy: string;
	sortOrder: string;
	isOnSale: boolean;
	isFeatured: boolean;
	type?: string;
	models?: string[];
	page: number;
	limit: number;
};

export default function FilterComponent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isOpen, setIsOpen] = useState(false);

	// Initialize filters from URL parameters with API-compatible structure
	const [filters, setFilters] = useState<FilterState>(() => {
		// Function to safely get and parse URL parameters
		const getParam = (key: string) => searchParams.get(key) || "";
		const getAllParams = (key: string) => searchParams.getAll(key);

		return {
			category: getAllParams("category"),
			minPrice: getParam("minPrice") ? Number(getParam("minPrice")) : undefined,
			maxPrice: getParam("maxPrice") ? Number(getParam("maxPrice")) : undefined,
			sortBy: getParam("sortBy") || "createdAt",
			sortOrder: getParam("sortOrder") || "desc",
			isOnSale: getParam("isOnSale") === "true",
			isFeatured: getParam("isFeatured") === "true",
			type: getParam("type") || undefined,
			models: getAllParams("models"),
			page: parseInt(getParam("page") || "1", 10),
			limit: parseInt(getParam("limit") || "10", 10),
		};
	});

	// Generic filter update function
	const updateFilters = useCallback(
		(key: keyof FilterState, value: FilterState[keyof FilterState]) => {
			setFilters((prev) => ({ ...prev, [key]: value }));
		},
		[setFilters]
	);

	// Apply filters and update URL with API-compatible parameters
	const applyFilters = useCallback(() => {
		const params = new URLSearchParams();

		// Add category parameters (supports multiple)
		filters.category.forEach((cat) => params.append("category", cat));

		// Add price range parameters
		if (filters.minPrice !== undefined)
			params.append("minPrice", filters.minPrice.toString());
		if (filters.maxPrice !== undefined)
			params.append("maxPrice", filters.maxPrice.toString());

		// Add sorting parameters
		params.append("sortBy", filters.sortBy);
		params.append("sortOrder", filters.sortOrder);

		// Add boolean filters
		if (filters.isOnSale) params.append("isOnSale", "true");
		if (filters.isFeatured) params.append("isFeatured", "true");

		// Add search type and models if present
		if (filters.type) params.append("type", filters.type);
		filters.models?.forEach((model) => params.append("models", model));

		// Add pagination parameters
		params.append("page", filters.page.toString());
		params.append("limit", filters.limit.toString());

		// Update URL and close filter panel
		router.push(`/collection?${params.toString()}`);
		setIsOpen(false);
	}, [filters, router]);

	// Reset all filters to default values
	const resetFilters = useCallback(() => {
		setFilters({
			category: [],
			minPrice: undefined,
			maxPrice: undefined,
			sortBy: "createdAt",
			sortOrder: "desc",
			isOnSale: false,
			isFeatured: false,
			type: undefined,
			models: [],
			page: 1,
			limit: 10,
		});
	}, [setFilters]);

	return (
		<div className="relative z-40">
			{/* Filter toggle button */}
			<button
				onClick={() => setIsOpen(true)}
				className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700
                 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:border-transparent transition-colors"
			>
				<SlidersHorizontal className="w-4 h-4 " />
				Filters
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/40 backdrop-blur-sm"
							onClick={() => setIsOpen(false)}
						/>

						{/* Filter panel */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
						>
							<div className="flex flex-col h-full">
								{/* Header */}
								<div className="flex items-center justify-between p-4 border-b">
									<h2 className="text-lg font-medium">Filters</h2>
									<button
										onClick={() => setIsOpen(false)}
										className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
									>
										<X className="w-5 h-5" />
									</button>
								</div>

								{/* Filter options */}
								<div className="flex-1 overflow-y-auto p-4 space-y-6">
									{/* Categories */}
									<div className="space-y-3">
										<h3 className="text-sm font-medium text-gray-900">
											Categories
										</h3>
										<div className="grid grid-cols-2 gap-2">
											{FILTER_CONFIG.categories.map((category) => (
												<button
													key={category.value}
													onClick={() =>
														updateFilters("category", [
															...(filters.category.includes(category.value)
																? filters.category.filter(
																		(c) => c !== category.value
																  )
																: [...filters.category, category.value]),
														])
													}
													className={`p-2.5 text-sm rounded-md border transition-all
                            ${
															filters.category.includes(category.value)
																? "border-blue-500 bg-blue-50 text-blue-600"
																: "border-gray-200 hover:border-gray-300"
														}`}
												>
													{category.label}
												</button>
											))}
										</div>
									</div>

									{/* Price Ranges */}
									<div className="space-y-3">
										<h3 className="text-sm font-medium text-gray-900">
											Price Range
										</h3>
										<div className="space-y-2">
											{FILTER_CONFIG.priceRanges.map((range) => (
												<button
													key={range.value}
													onClick={() => {
														updateFilters("minPrice", range.min);
														updateFilters("maxPrice", range.max ?? undefined);
													}}
													className={`flex items-center w-full p-2.5 text-sm rounded-md
                            ${
															filters.minPrice === range.min &&
															filters.maxPrice === (range.max ?? undefined)
																? "bg-blue-50 text-blue-600"
																: "hover:bg-gray-50"
														}`}
												>
													<Check
														className={`w-4 h-4 mr-2 transition-opacity
                              ${
																filters.minPrice === range.min &&
																filters.maxPrice === (range.max ?? undefined)
																	? "opacity-100"
																	: "opacity-0"
															}`}
													/>
													{range.label}
												</button>
											))}
										</div>
									</div>

									{/* Sort Options */}
									<div className="space-y-3">
										<h3 className="text-sm font-medium text-gray-900">
											Sort By
										</h3>
										<div className="relative">
											<select
												value={`${filters.sortBy}:${filters.sortOrder}`}
												onChange={(e) => {
													const [sortBy, sortOrder] = e.target.value.split(":");
													updateFilters("sortBy", sortBy);
													updateFilters("sortOrder", sortOrder);
												}}
												className="w-full appearance-none bg-white py-2 pl-3 pr-8 border rounded-md
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                 focus:border-transparent"
											>
												<option value="">Default</option>
												{FILTER_CONFIG.sortOptions.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
											<ChevronDown
												className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4
                                           text-gray-400 pointer-events-none"
											/>
										</div>
									</div>

									{/* Additional Filters */}
									<div className="space-y-3">
										<h3 className="text-sm font-medium text-gray-900">
											Additional Filters
										</h3>
										<div className="space-y-3">
											<label className="flex items-center space-x-2">
												<input
													type="checkbox"
													checked={filters.isOnSale}
													onChange={(e) =>
														updateFilters("isOnSale", e.target.checked)
													}
													className="w-4 h-4 text-blue-600 rounded border-gray-300
                                   focus:ring-blue-500"
												/>
												<span className="text-sm text-gray-700">On Sale</span>
											</label>
											<label className="flex items-center space-x-2">
												<input
													type="checkbox"
													checked={filters.isFeatured}
													onChange={(e) =>
														updateFilters("isFeatured", e.target.checked)
													}
													className="w-4 h-4 text-blue-600 rounded border-gray-300
                                   focus:ring-blue-500"
												/>
												<span className="text-sm text-gray-700">
													New Arrivals
												</span>
											</label>
										</div>
									</div>
								</div>

								<div className="p-4 border-t space-y-3">
									<button
										onClick={resetFilters}
										className="flex items-center justify-center w-full gap-2 p-2 text-sm
                             text-gray-600 hover:text-gray-900 transition-colors"
									>
										<RefreshCw className="w-4 h-4" />
										Reset Filters
									</button>
									<button
										onClick={applyFilters}
										className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-md
                             hover:bg-blue-700 focus:outline-none focus:ring-2
                             focus:ring-blue-500 focus:ring-offset-2 transition-colors"
									>
										Apply Filters
									</button>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
