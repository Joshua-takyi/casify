import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect";
import { WishListModel } from "@/models/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
	try {
		const { productId } = await request.json();

		// Authentication check
		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Database connection
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Validation
		if (!productId) {
			return NextResponse.json(
				{ message: "productId is required" },
				{ status: 400 }
			);
		}

		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return NextResponse.json(
				{ message: "Invalid product ID format" },
				{ status: 400 }
			);
		}

		// Atomic update operation
		const result = await WishListModel.findOneAndUpdate(
			{ userId },
			{
				$pull: {
					products: { productId: new mongoose.Types.ObjectId(productId) },
				},
			},
			{ new: true }
		);

		// Handle results
		if (!result) {
			return NextResponse.json(
				{ message: "Wishlist not found" },
				{ status: 404 }
			);
		}

		// Check if product was actually removed
		const productExists = result.products.some(
			(item) => item.productId.toString() === productId
		);

		if (productExists) {
			return NextResponse.json(
				{ message: "Product not found in wishlist" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Product removed from wishlist" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("DELETE Error:", error);
		return NextResponse.json(
			{
				message: "Server error",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
