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

		// Get the current session
		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
			return NextResponse.json(
				{ message: "User must be logged in" },
				{ status: 401 }
			);
		}

		// Retrieve orders where the userId matches the one in session
		const orders = await OrderModel.find({ userId: userId });
		if (orders.length === 0) {
			return NextResponse.json(
				{ message: "User has no orders" },
				{ status: 404 }
			);
		}

		// Group products based on productId, model, and color
		const productMap = new Map();

		// Collect shipping addresses from each order
		const shippingAddresses = orders.map((order) => order.shippingAddress);

		orders
			.flatMap((order) => order.products)
			.forEach((product) => {
				const key = `${product.productId.toString()}-${product.model}-${
					product.color
				}`;
				const existingProduct = productMap.get(key);

				if (existingProduct) {
					existingProduct.quantity += product.quantity;
					existingProduct.totalPrice += product.price * product.quantity;
				} else {
					productMap.set(key, {
						productId: product.productId,
						name: product.name,
						color: product.color,
						model: product.model,
						image: product.image,
						quantity: product.quantity,
						price: product.price,
						totalPrice: product.price * product.quantity,
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
				success: true,
				message: "Orders retrieved successfully",
				data: {
					products: uniqueProducts,
					shippingAddresses: shippingAddresses,
					totalAmount: totalAmount,
				},
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
