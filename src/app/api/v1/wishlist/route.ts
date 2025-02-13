import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect";
import { WishListModel, ProductModel } from "@/models/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

/**
 * @access private
 * @param req
 */
export async function POST(req: Request) {
	try {
		const { productId } = await req.json();

		const session = await auth();
		const userId = session?.user.id;
		if (!userId) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}

		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		if (!productId) {
			return NextResponse.json(
				{ message: "productId is required" },
				{ status: 400 }
			);
		}

		// Fetch the product and validate it exists
		const product = await ProductModel.findById(productId);
		if (!product) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		// First check if wishlist exists for user
		let wishlist = await WishListModel.findOne({ userId });

		if (!wishlist) {
			// Create new wishlist if it doesn't exist
			wishlist = new WishListModel({
				userId,
				products: [],
			});
		}

		// Check if product already exists in wishlist
		const productExists = wishlist.products.some(
			(product) => product.productId.toString() === productId
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

		// Add new product to wishlist with the slug from the product document
		wishlist.products.push({
			productId: productId,
			slug: product.slug ?? "", // Use the slug from the product document
		});

		// Save the updated wishlist
		await wishlist.save();

		// Fetch the populated wishlist
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
		return NextResponse.json(
			{
				message: "failed to add user favorite to the wishlist",
				error: error instanceof Error ? error.message : error,
			},
			{ status: 500 }
		);
	}
}
