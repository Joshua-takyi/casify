import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect";
import { OrderModel } from "@/models/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
			return NextResponse.json(
				{ message: "userId is required" },
				{ status: 400 }
			);
		}

		const orders = await OrderModel.find({ userId });
		if (orders.length === 0) {
			return NextResponse.json(
				{ message: "User has no orders" },
				{ status: 404 }
			);
		}

		// Group products based on productId, model, and color
		const productMap = new Map();

		// Keep track of shipping addresses
		const shippingAddresses = orders.map((order) => order.shippingAddress);

		orders
			.flatMap((order) => order.products)
			.forEach((product) => {
				// Create a unique key based on product attributes
				const key = `${product.productId.toString()}-${product.model}-${
					product.color
				}`;

				const existingProduct = productMap.get(key);

				if (existingProduct) {
					// If product already exists, increase quantity and update total price
					existingProduct.quantity += product.quantity;
					existingProduct.totalPrice += product.price * product.quantity;
				} else {
					// Otherwise, add the product with total price calculation
					productMap.set(key, {
						productId: product.productId,
						name: product.name,
						color: product.color,
						model: product.model,
						image: product.image,
						quantity: product.quantity,
						price: product.price, // Unit price
						totalPrice: product.price * product.quantity, // Total price
					});
				}
			});

		// Convert map back to an array
		const uniqueProducts = Array.from(productMap.values());

		// Calculate the overall total amount
		const totalAmount = uniqueProducts.reduce(
			(sum, product) => sum + product.totalPrice,
			0
		);

		return NextResponse.json(
			{
				message: "Orders retrieved successfully",
				totalAmount,
				products: uniqueProducts, // Optimized product list
				shippingAddresses, // Array of all shipping addresses from orders
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Failed to get orders",
				error: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
