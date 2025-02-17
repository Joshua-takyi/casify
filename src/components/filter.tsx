// import React, { useState } from "react";

// const filterCategory = [
// 	"phone-cases",
// 	"charging-cables",
// 	"car-mounts",
// 	"airpod-cases",
// 	"camera-lenses",
// 	"memory-cards",
// 	"smart-watches",
// 	"cleaning-kits",
// ];

// const discountRanges = ["0-10", "11-20", "21-30", "31-40", "41-50", "50+"];

// const sortOptions = ["price", "name", "date"];

// interface FilterProps {
// 	category?: string;
// 	discount?: string;
// 	isOnSale?: boolean;
// 	isNew?: boolean;
// 	sortBy?: string;
// 	sortOrder?: string;
// }

// export default function FilterComponent({
// 	onFilterChange,
// }: {
// 	onFilterChange: (filters: FilterProps) => void;
// }) {
// 	const [filters, setFilters] = useState<FilterProps>({
// 		category: "",
// 		discount: "",
// 		isOnSale: false,
// 		isNew: false,
// 		sortBy: "",
// 		sortOrder: "asc",
// 	});

// 	const handleChange = (field: keyof FilterProps, value: string | boolean) => {
// 		const newFilters = {
// 			...filters,
// 			[field]: value,
// 		};
// 		setFilters(newFilters);
// 		onFilterChange(newFilters);
// 	};

// 	const handleReset = () => {
// 		const resetFilters = {
// 			category: "",
// 			discount: "",
// 			isOnSale: false,
// 			isNew: false,
// 			sortBy: "",
// 			sortOrder: "asc",
// 		};
// 		setFilters(resetFilters);
// 		onFilterChange(resetFilters);
// 	};

// 	return (
// 		<div className="w-full border rounded-lg p-4">
// 			<form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// 				<div className="space-y-2">
// 					<label className="block text-sm">Category</label>
// 					<select
// 						className="w-full border rounded-md p-2"
// 						value={filters.category}
// 						onChange={(e) => handleChange("category", e.target.value)}
// 					>
// 						<option value="">Select a category</option>
// 						{filterCategory.map((category) => (
// 							<option key={category} value={category}>
// 								{category.replace(/-/g, " ")}
// 							</option>
// 						))}
// 					</select>
// 				</div>

// 				<div className="space-y-2">
// 					<label className="block text-sm">Discount</label>
// 					<select
// 						className="w-full border rounded-md p-2"
// 						value={filters.discount}
// 						onChange={(e) => handleChange("discount", e.target.value)}
// 					>
// 						<option value="">Select discount range</option>
// 						{discountRanges.map((range) => (
// 							<option key={range} value={range}>
// 								{range}% off
// 							</option>
// 						))}
// 					</select>
// 				</div>

// 				<div className="space-y-2">
// 					<label className="block text-sm">Sort By</label>
// 					<select
// 						className="w-full border rounded-md p-2"
// 						value={filters.sortBy}
// 						onChange={(e) => handleChange("sortBy", e.target.value)}
// 					>
// 						<option value="">Sort by</option>
// 						{sortOptions.map((option) => (
// 							<option key={option} value={option}>
// 								{option}
// 							</option>
// 						))}
// 					</select>
// 				</div>

// 				<div className="space-y-2">
// 					<label className="block text-sm" htmlFor="">Sort Order</label>
// 					<select
// 						className="w-full border rounded-md p-2"
// 						value={filters.sortOrder}
// 						onChange={(e) => handleChange("sortOrder", e.target.value)}
// 					>
// 						<option value="asc">Ascending</option>
// 						<option value="desc">Descending</option>
// 					</select>
// 				</div>

// 				<div className="flex items-center gap-4">
// 					<label className="flex items-center gap-2">
// 						<input
// 							type="checkbox"
// 							className="rounded border-gray-300"
// 							checked={filters.isOnSale}
// 							onChange={(e) => handleChange("isOnSale", e.target.checked)}
// 						/>
// 						On Sale
// 					</label>
// 					<label className="flex items-center gap-2">
// 						<input
// 							type="checkbox"
// 							className="rounded border-gray-300"
// 							checked={filters.isNew}
// 							onChange={(e) => handleChange("isNew", e.target.checked)}
// 						/>
// 						New Arrivals
// 					</label>
// 				</div>

// 				<div className="flex items-center">
// 					<button
// 						type="button"
// 						className="border rounded-md px-4 py-2"
// 						onClick={handleReset}
// 					>
// 						Reset Filters
// 					</button>
// 				</div>
// 			</form>
// 		</div>
// 	);
// }
