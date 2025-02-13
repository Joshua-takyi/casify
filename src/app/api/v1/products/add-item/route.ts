import { ProductModel } from "@/models/schema";
import { NextResponse } from "next/server";
import logger from "@/utils/logger";
import mongoose from "mongoose";
import { ConnectDb } from "@/libs/connect";
import slugify from "slugify";
import {productSchema} from "@/utils/productSchema";


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

		const validationResult = productSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{ message: "Validation failed", errors: validationResult.error.errors },
				{ status: 400 }
			);
		}

		const data = validationResult.data;

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