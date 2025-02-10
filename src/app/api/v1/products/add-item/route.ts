import { ProductModel } from "@/models/schema";
import { validateData } from "@/utils/validator";
import { NextResponse } from "next/server";
import { z } from "zod";
import logger from "@/utils/logger";
import mongoose from "mongoose";
import { ConnectDb } from "@/libs/connect";
import slugify from "slugify";

// Define the schema without `sku` and `slug` because they are auto-generated.
export const productSchema = z.object({
	title: z
		.string()
		.min(4, { message: "Title must be at least 4 characters long" }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters long" }),
	price: z
		.number()
		.nonnegative({ message: "Price must be a non-negative number" }),
	discount: z.number().optional().default(0),
	category: z.array(z.string()),
	details: z.array(z.string()),
	features: z.array(z.string()),
	stock: z
		.number()
		.int()
		.nonnegative({ message: "Stock must be a non-negative integer" }),
	available: z.boolean(),
	isOnSale: z.boolean().default(false).optional(),
	tags: z.array(z.string()),
	models: z.array(z.string()),
	images: z.array(z.string()),
	salesStartAt: z.preprocess(
		(arg) =>
			typeof arg === "string" || arg instanceof Date
				? new Date(arg)
				: undefined,
		z.date().optional().nullable()
	),
	salesEndAt: z.preprocess(
		(arg) =>
			typeof arg === "string" || arg instanceof Date
				? new Date(arg)
				: undefined,
		z.date().optional().nullable()
	),
	rating: z
		.number()
		.min(0, { message: "Rating must be at least 0" })
		.max(5, { message: "Rating cannot exceed 5" })
		.optional(),
	reviews: z.array(z.string()).optional(),
	materials: z.array(z.string()),
	colors: z.array(z.string()),
	comments: z.array(z.string()).optional(),
});

// SKU generator uses title, price, and category values.
const generateSku = (title: string, price: number, category: string[]) => {
	const titlePrefix = title.slice(0, 3).trim().toUpperCase();
	const pricePrefix = price.toString().toUpperCase();
	const categoryPrefix = category[0].slice(0, 3).trim().toUpperCase();
	return `${titlePrefix}-${pricePrefix}-${categoryPrefix}`;
};

// Slug generator uses slugify to create a URL-friendly version of the title.
const generateSlug = (title: string) => {
	return slugify(title, { lower: true, strict: true });
};

export async function POST(req: Request) {
	try {
		const body = await req.json();

		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		const { data, valid, errors } = validateData(body, productSchema);

		if (!valid || !data) {
			return NextResponse.json(
				{
					message: "Failed to validate item",
					errors,
				},
				{ status: 400 }
			);
		}

		// Generate the SKU and slug automatically
		const readySku = generateSku(data.title, data.price, data.category);
		const readySlug = generateSlug(data.title);

		// Check if a product with the generated slug already exists
		const existingProduct = await ProductModel.findOne({ slug: readySlug });
		if (existingProduct) {
			return NextResponse.json(
				{ message: "A product with the same slug already exists." },
				{ status: 409 }
			);
		}

		// Create the product with the auto-generated SKU and slug
		const Product = await ProductModel.create({
			...data,
			slug: readySlug,
			sku: readySku,
		});

		logger.info("Product added to collection successfully");

		return NextResponse.json(
			{
				message: "Item added successfully",
				data: Product,
			},
			{ status: 201 }
		);
	} catch (error) {
		logger.error("Failed to add product", {
			error: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{
				message: "Failed to add items",
				error: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
