// Updated type for QueryValue to allow an array for $or
type QueryValue =
	| string
	| number
	| boolean
	| Date
	| RegExp
	| { $regex: RegExp }
	| { $in: (RegExp | string)[] } // Allow RegExp or string in $in
	| { $gte?: number; $lte?: number }
	| Array<{ [key: string]: { $regex: RegExp } | { $in: (RegExp | string)[] } }>; //Correct the type array or object

export const BuildQuery = (
	searchParams: URLSearchParams
): Record<string, QueryValue> => {
	const query: Record<string, QueryValue> = {};

	// Helper function to add array conditions
	const addArrayCondition = (key: string, value: string | null) => {
		if (!value) return;
		const array = value.split(",").map((item) => item.trim());
		if (array.length === 0) return;
		query[key] = { $in: array };
	};

	// General search across multiple fields using the "type" parameter
	const search = searchParams.get("type");
	if (search) {
		const searchTerm = search.trim();
		if (searchTerm) {
			// Split search term into words, then allow an optional "s" after each word,
			// and allow any number of spaces or hyphens between words.
			const flexibleTerm = searchTerm
				.split(/\s+/)
				.map(word => word + "s?") // allow for optional plural 's'
				.join("[-\\s]*");
			const regex = new RegExp(flexibleTerm, "i");

			query.$or = [
				{ title: { $regex: regex } },
				{ description: { $regex: regex } },
				{ tags: { $in: [regex] } },
				{ models: { $in: [regex] } },
			];
		}
	}

	// Update category query parameter to handle single or multiple categories.
	const categoryParams = searchParams.getAll("category");
	if (categoryParams.length > 0) {
		const categories = categoryParams
			.flatMap((param) => param.split(","))
			.map((cat) => cat.trim())
			.filter(Boolean);

		if (categories.length === 1) {
			query.category = categories[0];
		} else if (categories.length > 1) {
			query.category = { $in: categories };
		}
	}

	// Numeric fields
	const handleNumericParam = (paramName: string) => {
		const paramValue = searchParams.get(paramName);
		if (paramValue) {
			query[paramName] = parseFloat(paramValue);
		}
	};

	handleNumericParam("price");
	handleNumericParam("rating");
	handleNumericParam("discount");

	// Boolean fields
	const handleBooleanParam = (paramName: string) => {
		const paramValue = searchParams.get(paramName);
		if (paramValue !== null) {
			query[paramName] = paramValue === "true";
		}
	};

	handleBooleanParam("isOnSale");
	handleBooleanParam("isFeatured");
	handleBooleanParam("isBestSeller");
	handleBooleanParam("available");

	// Date fields
	const handleDateParam = (paramName: string) => {
		const paramValue = searchParams.get(paramName);
		if (paramValue) {
			query[paramName] = new Date(paramValue);
		}
	};

	handleDateParam("salesStartAt");
	handleDateParam("salesEndAt");

	// Price filtering
	const minPrice = searchParams.get("minPrice");
	const maxPrice = searchParams.get("maxPrice");
	if (minPrice || maxPrice) {
		const priceFilter: { $gte?: number; $lte?: number } = {};
		if (minPrice) priceFilter.$gte = parseFloat(minPrice);
		if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
		query.price = priceFilter;
	}

	// Array-like fields for tags and models
	addArrayCondition("tags", searchParams.get("tags"));
	addArrayCondition("models", searchParams.get("models"));

	return query;
};

interface SortProps {
	sortBy: string;
	sortOrder: string;
}

export const BuildSort = ({
	sortBy,
	sortOrder,
}: SortProps): Record<string, 1 | -1> => {
	return { [sortBy]: sortOrder === "desc" ? -1 : 1 };
};
