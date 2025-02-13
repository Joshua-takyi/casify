// /app/api/v1/products/get-item/[...slug]/route.ts

import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import { ProductModel } from "@/models/schema";
import mongoose from "mongoose";
import { ConnectDb } from "@/libs/connect";

interface Params {
	slug: string[]; // `slug` will be an array of URL segments
}

export async function GET(
	req: Request,
	{ params }: { params: Promise<Params> }
) {
	try {
		// Await the params object to resolve it
		const resolvedParams = await params;
		const { slug } = resolvedParams;

		if (!slug || slug.length === 0) {
			return NextResponse.json(
				{
					message: "No slug found",
				},
				{ status: 400 } // Use 400 for bad request
			);
		}

		// Ensure database connection
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Reconstruct the full slug from the array of segments
		const fullSlug = slug.join("/"); // e.g., 'iphone-16-silicone-case-with-magsafe-stone-gray'

		// Query the database by the combined slug value
		const product = await ProductModel.find({ slug: fullSlug })
			.select(
				"_id title price category description models colors images discount details features materials stock"
			)
			.lean();

		if (!product || product.length === 0) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			message: "Products found",
			data: product,
		});
	} catch (error) {
		logger.error("GET request failed: ", {
			message: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{
				message: "Failed to get request",
				error: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
