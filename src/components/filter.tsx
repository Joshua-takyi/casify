"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Check, RefreshCw } from "lucide-react";

// Configuration for filter options with standardized API parameter mapping
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
		{ value: "createdAt", order: "desc", label: "Newest" },
		{ value: "price", order: "asc", label: "Price: Low to High" },
		{ value: "price", order: "desc", label: "Price: High to Low" },
		{ value: "rating", order: "desc", label: "Most Popular" },
	],
};

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
	page: number;
	limit: number;
};

export default function FilterComponent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isOpen, setIsOpen] = useState(false);

	// Initialize filters from URL parameters
	const [filters, setFilters] = useState<FilterState>(() => {
		// Parse URL parameters safely
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
			page: parseInt(getParam("page") || "1", 10),
			limit: parseInt(getParam("limit") || "10", 10),
		};
	});

	// Update filter state
	const updateFilter = useCallback(
		<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
			setFilters((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	// Handle category selection/deselection
	const toggleCategory = useCallback((categoryValue: string) => {
		setFilters((prev) => {
			const isSelected = prev.category.includes(categoryValue);
			const updatedCategories = isSelected
				? prev.category.filter((c) => c !== categoryValue)
				: [...prev.category, categoryValue];

			return { ...prev, category: updatedCategories };
		});
	}, []);

	// Handle price range selection
	const selectPriceRange = useCallback((min: number, max: number | null) => {
		setFilters((prev) => ({
			...prev,
			minPrice: min,
			maxPrice: max ?? undefined,
		}));
	}, []);

	// Handle sort option selection
	const handleSortChange = useCallback((sortBy: string, sortOrder: string) => {
		setFilters((prev) => ({
			...prev,
			sortBy,
			sortOrder,
		}));
	}, []);

	// Apply filters to URL and update route
	const applyFilters = useCallback(() => {
		const params = new URLSearchParams();

		// Add active filter parameters
		filters.category.forEach((cat) => params.append("category", cat));

		if (filters.minPrice !== undefined) {
			params.append("minPrice", filters.minPrice.toString());
		}

		if (filters.maxPrice !== undefined) {
			params.append("maxPrice", filters.maxPrice.toString());
		}

		// Add sort parameters separately - important for API compatibility
		params.append("sortBy", filters.sortBy);
		params.append("sortOrder", filters.sortOrder);

		// Add boolean filters
		if (filters.isOnSale) params.append("isOnSale", "true");
		if (filters.isFeatured) params.append("isFeatured", "true");

		// Add search parameter if present
		if (filters.type) params.append("type", filters.type);

		// Add pagination
		params.append("page", filters.page.toString());
		params.append("limit", filters.limit.toString());

		// Update URL and close filter panel
		router.push(`/collection?${params.toString()}`);
		setIsOpen(false);
	}, [filters, router]);

	// Reset filters to default values
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
			page: 1,
			limit: 10,
		});
	}, []);

	// Close filter panel on Escape key press
	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		};

		window.addEventListener("keydown", handleEscKey);
		return () => window.removeEventListener("keydown", handleEscKey);
	}, [isOpen]);

	// Helper to determine if a specific sort option is active
	const isSortActive = useCallback(
		(sortBy: string, sortOrder: string) => {
			return filters.sortBy === sortBy && filters.sortOrder === sortOrder;
		},
		[filters.sortBy, filters.sortOrder]
	);

	// Helper to determine if a price range is active
	const isPriceRangeActive = useCallback(
		(min: number, max: number | null) => {
			return (
				filters.minPrice === min && filters.maxPrice === (max ?? undefined)
			);
		},
		[filters.minPrice, filters.maxPrice]
	);

	return (
		<div className="relative z-40">
			{/* Filter toggle button */}
			<button
				onClick={() => setIsOpen(true)}
				className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700
        bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent transition-colors"
			>
				<SlidersHorizontal className="w-4 h-4" />
				Filters
			</button>

			{/* Filter modal */}
			{isOpen && (
				<>
					{/* Backdrop overlay */}
					<div
						className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
						onClick={() => setIsOpen(false)}
					/>

					{/* Filter panel */}
					<div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50">
						<div className="flex flex-col h-full">
							{/* Header */}
							<div className="flex items-center justify-between p-4 border-b">
								<h2 className="text-lg font-medium">Filters</h2>
								<button
									onClick={() => setIsOpen(false)}
									className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
								>
									<X className="w-5 h-5" />
								</button>
							</div>

							{/* Filter content */}
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
												onClick={() => toggleCategory(category.value)}
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
												onClick={() => selectPriceRange(range.min, range.max)}
												className={`flex items-center w-full p-2.5 text-sm rounded-md
                          ${
														isPriceRangeActive(range.min, range.max)
															? "bg-blue-50 text-blue-600"
															: "hover:bg-gray-50"
													}`}
											>
												<Check
													className={`w-4 h-4 mr-2 transition-opacity
                            ${
															isPriceRangeActive(range.min, range.max)
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
									<h3 className="text-sm font-medium text-gray-900">Sort By</h3>
									<div className="space-y-2">
										{FILTER_CONFIG.sortOptions.map((option) => (
											<button
												key={`${option.value}-${option.order}`}
												onClick={() =>
													handleSortChange(option.value, option.order)
												}
												className={`flex items-center w-full p-2.5 text-sm rounded-md
                          ${
														isSortActive(option.value, option.order)
															? "bg-blue-50 text-blue-600"
															: "hover:bg-gray-50"
													}`}
											>
												<Check
													className={`w-4 h-4 mr-2 transition-opacity
                            ${
															isSortActive(option.value, option.order)
																? "opacity-100"
																: "opacity-0"
														}`}
												/>
												{option.label}
											</button>
										))}
									</div>
								</div>

								{/* Additional Filters */}
								<div className="space-y-3">
									<h3 className="text-sm font-medium text-gray-900">
										Additional Filters
									</h3>
									<div className="space-y-3">
										<label className="flex items-center space-x-2 cursor-pointer">
											<input
												type="checkbox"
												checked={filters.isOnSale}
												onChange={(e) =>
													updateFilter("isOnSale", e.target.checked)
												}
												className="w-4 h-4 text-blue-600 rounded border-gray-300
                        focus:ring-blue-500"
											/>
											<span className="text-sm text-gray-700">On Sale</span>
										</label>
										<label className="flex items-center space-x-2 cursor-pointer">
											<input
												type="checkbox"
												checked={filters.isFeatured}
												onChange={(e) =>
													updateFilter("isFeatured", e.target.checked)
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

							{/* Action buttons */}
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
					</div>
				</>
			)}
		</div>
	);
}
