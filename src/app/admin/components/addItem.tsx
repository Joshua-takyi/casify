"use client";

import { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { SelectCategories, SelectedTags } from "@/database/db";
import { AddProduct } from "@/server/action";
import Wrapper from "@/components/wrapper";
import { FormCheckbox } from "@/components/checkBox";
import { FormTextarea } from "@/components/textarea";
import { FormSelect } from "@/components/select";
import { FormDateTimeInput } from "@/components/timeSelect";
import { FormColors } from "@/components/colorSelect";
import { FormDynamicList } from "@/components/dynamicList";
import { FormImageUpload } from "@/components/imageUpload";
import { ProductPropsForDb } from "@/types/products";
import { FormInput } from "@/components/formInput";

// Custom error types
type ApiError = {
	code?: number;
	message: string;
	details?: string;
};

const productSchema = z
	.object({
		title: z
			.string()
			.min(3, "Title must be at least 3 characters")
			.max(100, "Title cannot exceed 100 characters"),
		price: z
			.number()
			.min(0.01, "Price must be greater than 0")
			.max(1000000, "Price cannot exceed 1,000,000"),
		description: z
			.string()
			.min(10, "Description must be at least 10 characters")
			.max(2000, "Description cannot exceed 2000 characters"),
		isOnSale: z.boolean(),
		isNewItem: z.boolean(),
		isBestSeller: z.boolean(),
		stock: z
			.number()
			.int("Stock must be a whole number")
			.min(0, "Stock cannot be negative"),
		salesStartAt: z.string().nullable().optional(), // Make it optional and nullable
		salesEndAt: z.string().nullable().optional(), // Make it optional and nullable
		images: z
			.array(z.string().url("Invalid image URL"))
			.min(1, "At least one image is required")
			.max(10, "Cannot exceed 10 images"),
		details: z.array(z.string()).min(1, "At least one detail is required"),
		features: z.array(z.string()).min(1, "At least one feature is required"),
		materials: z.array(z.string()).min(1, "At least one material is required"),
		colors: z.array(z.string()).min(1, "At least one color is required"),
		models: z.array(z.string()).min(1, "At least one model is required"),
		tags: z.array(z.string()).min(1, "At least one tag is required"),
		category: z.array(z.string()).min(1, "At least one category is required"),
		discount: z
			.number()
			.min(0, "Discount cannot be negative")
			.max(100, "Discount cannot exceed 100%"),
	})
	.refine(
		(data) => {
			// Validate sales dates only if isOnSale is true
			if (data.isOnSale) {
				// Check if both dates are provided
				if (!data.salesStartAt || !data.salesEndAt) {
					return false;
				}

				// Validate the date format
				const isStartDateValid = !isNaN(Date.parse(data.salesStartAt));
				const isEndDateValid = !isNaN(Date.parse(data.salesEndAt));

				return isStartDateValid && isEndDateValid;
			}
			return true; // Skip validation if isOnSale is false
		},
		{
			message:
				"Sale start and end dates are required and must be valid when the product is on sale.",
			path: ["salesStartAt", "salesEndAt"], // Specify the fields to highlight in the error
		}
	);

type ProductFormData = z.infer<typeof productSchema>;

const initialValues: ProductFormData = {
	title: "",
	price: 0,
	description: "",
	isOnSale: false,
	isNewItem: false,
	isBestSeller: false,
	stock: 0,
	salesStartAt: "",
	salesEndAt: "",
	images: [],
	details: [],
	features: [],
	materials: [],
	colors: [],
	models: [],
	tags: [],
	category: [],
	discount: 0,
};

export default function ProductForm() {
	const [data, setData] = useState<ProductFormData>(initialValues);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { mutate } = useMutation({
		mutationKey: ["addProduct"],
		mutationFn: async (formData: ProductFormData) => {
			try {
				// Convert date strings to Date objects or undefined
				const salesStartAt = formData.salesStartAt
					? new Date(formData.salesStartAt)
					: undefined;
				const salesEndAt = formData.salesEndAt
					? new Date(formData.salesEndAt)
					: undefined;

				// Create a new object with the converted dates
				const formattedData: ProductPropsForDb = {
					title: formData.title,
					description: formData.description,
					price: formData.price,
					discount: formData.discount,
					category: formData.category,
					details: formData.details,
					features: formData.features,
					stock: formData.stock,
					isOnSale: formData.isOnSale,
					tags: formData.tags,
					models: formData.models,
					images: formData.images,
					materials: formData.materials,
					colors: formData.colors,
					salesStartAt: salesStartAt,
					salesEndAt: salesEndAt,
				};

				const response = await AddProduct(formattedData);
				return response.data;
			} catch (error) {
				const apiError = error as ApiError;
				if (apiError.code === 11000) {
					throw new Error(
						"A product with this title already exists. Please choose a different title."
					);
				}
				throw new Error(apiError.message || "Failed to create product");
			}
		},
		onMutate: () => {
			setIsSubmitting(true);
		},
		onSuccess: () => {
			toast.success("Product added successfully");
			setData(initialValues);
			setIsSubmitting(false);
		},
		onError: (error: Error) => {
			toast.error(error.message);
			setIsSubmitting(false);
		},
	});

	

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Validate form data
			const validatedData = productSchema.parse(data);
			mutate(validatedData);
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.errors.forEach((err) => {
					toast.error(`${err.path.join(".")}: ${err.message}`);
				});
			} else {
				toast.error("Failed to validate form data");
			}
		}
	};

	const handleFieldChange = <K extends keyof ProductFormData>(
		field: K,
		value: ProductFormData[K]
	) => {
		setData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleUploadSuccess = (secure_url: string) => {
		setData((prev) => ({
			...prev,
			images: [...prev.images, secure_url], // Append the new image URL to the existing array
		}));
		toast.success("Image uploaded successfully!");
	};

	// Handle deleting an image
	const handleDeleteImage = (index: number) => {
		setData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index), // Remove the image at the specified index
		}));
		toast.success("Image deleted!");
	};

	return (
		<main className="min-h-screen">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-6">
					<h1 className="text-2xl font-semibold mb-2">Add New Product</h1>
					<p className="text-gray-500 text-sm">Enter product details below</p>
				</div>

				<Wrapper>
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Basic Information */}
						<section>
							<h2 className="text-lg font-medium mb-4">Basic Information</h2>
							<div className="space-y-6">
								<div className="grid md:grid-cols-2 gap-6">
									<FormInput
										label="Title"
										name="title"
										value={data.title}
										onChange={(e) => handleFieldChange("title", e.target.value)}
										required
									/>
									<div className="flex gap-6 items-center">
										<FormCheckbox
											label="On Sale"
											name="isOnSale"
											checked={data.isOnSale}
											onChange={(e) =>
												handleFieldChange("isOnSale", e.target.checked)
											}
										/>
										<FormCheckbox
											label="New Item"
											name="isNewItem"
											checked={data.isNewItem}
											onChange={(e) =>
												handleFieldChange("isNewItem", e.target.checked)
											}
										/>
										<FormCheckbox
											label="Best Seller"
											name="isBestSeller"
											checked={data.isBestSeller}
											onChange={(e) =>
												handleFieldChange("isBestSeller", e.target.checked)
											}
										/>
									</div>
								</div>

								<FormTextarea
									label="Description"
									name="description"
									value={data.description}
									onChange={(e) =>
										handleFieldChange("description", e.target.value)
									}
								/>

								<div className="grid md:grid-cols-3 gap-6">
									<FormInput
										label="Price"
										name="price"
										type="number"
										value={data.price}
										onChange={(e) =>
											handleFieldChange("price", Number(e.target.value))
										}
									/>
									<FormInput
										label="Stock"
										name="stock"
										type="number"
										value={data.stock}
										onChange={(e) =>
											handleFieldChange("stock", Number(e.target.value))
										}
									/>
									<FormInput
										label="Discount (%)"
										name="discount"
										type="number"
										value={data.discount}
										onChange={(e) =>
											handleFieldChange("discount", Number(e.target.value))
										}
									/>
								</div>
							</div>
						</section>

						{/* Categories and Tags */}
						<section>
							<h2 className="text-lg font-medium mb-4">Categories and Tags</h2>
							<div className="grid md:grid-cols-2 gap-6">
								<FormSelect
									label="Categories"
									options={SelectCategories}
									value={data.category}
									onChange={(value) => handleFieldChange("category", value)}
									isMulti
									required
								/>
								<FormSelect
									label="Tags"
									options={SelectedTags}
									value={data.tags}
									onChange={(value) => handleFieldChange("tags", value)}
									isMulti
									required
								/>
							</div>
						</section>

						{data.isOnSale && (
							<section>
								<h2 className="text-lg font-medium mb-4">Sale Information</h2>
								<div className="grid md:grid-cols-2 gap-6">
									<FormDateTimeInput
										label="Sale Start"
										value={(data.isOnSale && data.salesStartAt) || ""}
										onChange={(value) =>
											handleFieldChange("salesStartAt", value)
										}
									/>
									<FormDateTimeInput
										label="Sale End"
										value={(data.isOnSale && data.salesEndAt) || ""}
										onChange={(value) => handleFieldChange("salesEndAt", value)}
									/>
								</div>
							</section>
						)}

						{/* Product Details */}
						<section>
							<h2 className="text-lg font-medium mb-4">Product Details</h2>
							<div className="space-y-6">
								<FormColors
									colors={data.colors}
									onAddColor={(color) =>
										handleFieldChange("colors", [...data.colors, color])
									}
									onDeleteColor={(color) => {
										const newColors = data.colors.filter((c) => c !== color);
										handleFieldChange("colors", newColors);
									}}
								/>

								<FormDynamicList
									label="Models"
									items={data.models}
									onAddItem={() =>
										handleFieldChange("models", [...data.models, ""])
									}
									onDeleteItem={(index) => {
										const newModels = [...data.models];
										newModels.splice(index, 1);
										handleFieldChange("models", newModels);
									}}
									onChangeItem={(index, value) => {
										const newModels = [...data.models];
										newModels[index] = value;
										handleFieldChange("models", newModels);
									}}
								/>

								<FormDynamicList
									label="Features"
									items={data.features}
									onAddItem={() =>
										handleFieldChange("features", [...data.features, ""])
									}
									onDeleteItem={(index) => {
										const newFeatures = [...data.features];
										newFeatures.splice(index, 1);
										handleFieldChange("features", newFeatures);
									}}
									onChangeItem={(index, value) => {
										const newFeatures = [...data.features];
										newFeatures[index] = value;
										handleFieldChange("features", newFeatures);
									}}
								/>

								<FormDynamicList
									label="Materials"
									items={data.materials}
									onAddItem={() =>
										handleFieldChange("materials", [...data.materials, ""])
									}
									onDeleteItem={(index) => {
										const newMaterials = [...data.materials];
										newMaterials.splice(index, 1);
										handleFieldChange("materials", newMaterials);
									}}
									onChangeItem={(index, value) => {
										const newMaterials = [...data.materials];
										newMaterials[index] = value;
										handleFieldChange("materials", newMaterials);
									}}
								/>
								<FormDynamicList
									label="Details"
									items={data.details}
									onAddItem={() =>
										handleFieldChange("details", [...data.details, ""])
									}
									onDeleteItem={(index) => {
										const newDetails = [...data.details];
										newDetails.splice(index, 1);
										handleFieldChange("details", newDetails);
									}}
									onChangeItem={(index, value) => {
										const newDetails = [...data.details];
										newDetails[index] = value;
										handleFieldChange("details", newDetails);
									}}
									placeholder="Enter product detail"
								/>
							</div>
						</section>

						{/* Images */}
						<section>
							<h2 className="text-lg font-medium mb-4">Product Images</h2>
							<FormImageUpload
								images={data.images}
								onUploadSuccess={handleUploadSuccess}
								onDeleteImage={handleDeleteImage}
							/>
						</section>

						<button
							type="submit"
							className={`w-full py-2 px-4 bg-amber-600 text-white rounded-md 
                ${
									isSubmitting
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-primary-dark"
								}
              `}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Adding Product..." : "Add Product"}
						</button>
					</form>
				</Wrapper>
			</div>
		</main>
	);
}
