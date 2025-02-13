import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect";
import { WishListModel, ProductModel } from "@/models/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import logger from "@/utils/logger";

/**
 * @access private
 * @param req
 */
export async function POST(req: Request) {
	try {
		// Authenticate the user.
		const session = await auth();
		const userId = session?.user.id;
		if (!userId) {
			logger.error("Unauthorized access attempt: no user ID found in session", {
				userId,
			});
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Parse request body.
		const { productId } = await req.json();
		if (!productId) {
			logger.error("Bad request: 'productId' is missing.");
			return NextResponse.json(
				{ message: "productId is required" },
				{ status: 400 }
			);
		}

		// Ensure database connection.
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Validate the product exists.
		const product = await ProductModel.findById(productId);
		if (!product) {
			logger.error(`Product not found: ${productId}`);
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		// Retrieve or create the wishlist for the user.
		let wishlist = await WishListModel.findOne({ userId });
		if (!wishlist) {
			wishlist = new WishListModel({
				userId,
				products: [],
			});
		}

		// Check if the product already exists in the wishlist.
		const productExists = wishlist.products.some(
			(item) => item.productId.toString() === productId
		);
		if (productExists) {
			return NextResponse.json(
				{
					message: "Product already exists in wishlist",
					data: wishlist,
				},
				{ status: 200 }
			);
		}

		// Add the new product to the wishlist.
		wishlist.products.push({
			productId: productId,
			slug: product.slug ?? "",
		});

		// Save the updated wishlist.
		await wishlist.save();

		// Fetch and populate the wishlist.
		const populatedWishlist = await WishListModel.findById(wishlist._id)
			.populate("userId")
			.populate("products.productId");

		return NextResponse.json(
			{
				message: "Product added to wishlist successfully",
				data: populatedWishlist,
			},
			{ status: 201 }
		);
	} catch (error) {
		logger.error("Error adding product to wishlist:", error);
		return NextResponse.json(
			{
				message: "Failed to add product to wishlist",
				error: error instanceof Error ? error.message : error,
			},
			{ status: 500 }
		);
	}
}
