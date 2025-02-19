import { ConnectDb } from "@/libs/connect";
import { ProductModel } from "@/models/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ slug: string | string[] }> }
) {
	try {
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Await the params first
		const resolvedParams = await params;

		// If slug is an array, join it; otherwise, use it directly.
		const fullSlug = Array.isArray(resolvedParams.slug)
			? resolvedParams.slug.join("/")
			: resolvedParams.slug;

		if (!fullSlug) {
			return NextResponse.json(
				{ message: "A slug is required" },
				{ status: 400 }
			);
		}

		// Get a random number between 1 and 10 (inclusive)
		// const limit = Math.floor(Math.random() * 10) + 1;

		// Find the current product based on its slug.
		const currentProduct = await ProductModel.findOne({ slug: fullSlug });

		if (!currentProduct) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		// Exclude the current product using its _id
		const alsoLikeProducts = await ProductModel.aggregate([
			{
				$match: {
					_id: { $ne: currentProduct._id },
					$or: [
						{ category: { $in: currentProduct.category } },
						{ tags: { $in: currentProduct.tags } },
						{ models: { $in: currentProduct.models } },
					],
					available: true,
				},
			},
			{ $sample: { size: 10 } },
		]);

		return NextResponse.json({ data: alsoLikeProducts }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				message: "Failed to get items that match the product",
				error: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
