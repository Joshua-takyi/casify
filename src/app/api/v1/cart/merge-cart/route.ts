import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CartModel } from "@/models/schema";
import mongoose from "mongoose";
import { ConnectDb } from "@/libs/connect";

export async function POST(req: Request) {
	try {
		const { products } = await req.json();

		// Authenticate user
		const session = await auth();
		const userId = session?.user.id;

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Find existing cart or create new one
		let cart = await CartModel.findOne({ userId });

		if (!cart) {
			cart = new CartModel({ userId, products: [] });
		}

		// Merge products
		for (const localProduct of products) {
			const existingProductIndex = cart.products.findIndex(
				(p) =>
					p.productId.toString() === localProduct.productId &&
					p.color === localProduct.color &&
					p.model === localProduct.model
			);

			if (existingProductIndex > -1) {
				// Update quantity if product exists
				cart.products[existingProductIndex].quantity += localProduct.quantity;
			} else {
				// Add new product if it doesn't exist
				cart.products.push(localProduct);
			}
		}

		await cart.save();

		return NextResponse.json(
			{ success: true, message: "Carts merged successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error merging carts:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to merge carts",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
