import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect";
import { WishListModel } from "@/models/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
/**
 * @description "this get's  the items user added to their wishlist"
 * @param req
 * @returns
 * @access "private"/" accessed only the user whose id matches the document"
 */
export async function GET() {
	try {
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb(); // Always connect first
		}

		const session = await auth();
		const userId = session?.user?.id;

		if (!userId) {
			return NextResponse.json(
				{ message: "Authentication required" },
				{ status: 401 }
			);
		}

		const wishlist = await WishListModel.findOne({ userId });

		if (!wishlist) {
			return NextResponse.json(
				{ message: "Wishlist not found" },
				{ status: 404 }
			);
		}

		await wishlist.populate({
			path: "products.productId",
			model: "ProductModel",
			select: "title price images slug colors",
		});

		return NextResponse.json({
			message: "Wishlist retrieved successfully",
			data: wishlist.products,
		});
	} catch (error) {
		console.error("Wishlist error:", error);
		return NextResponse.json(
			{
				message: "Server error",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
