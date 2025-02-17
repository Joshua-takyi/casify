import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect";
import { OrderModel } from "@/models/schema"; // Assuming you export the Order model
import logger from "@/utils/logger";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface Product {
	productId: string;
	quantity: number;
	price: number;
	color: string;
	model: string;
}

export async function POST(req: Request) {
	const { products, total } = await req.json();

	try {
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}
		const session = await auth();
		const userId = session?.user?.id;

		if (!products || !total || !userId) {
			return NextResponse.json(
				{
					message: "Products, total, and user ID are required",
				},
				{ status: 400 }
			);
		}

		// Create the order with nested products
		const order = await OrderModel.create({
			userId,
			total,
			status: "pending",
			products: products.map((product: Product) => ({
				productId: product.productId,
				quantity: product.quantity,
				price: product.price,
				color: product.color,
				model: product.model,
			})),
		});

		if (!order) {
			return NextResponse.json(
				{
					message: "Failed to create order",
				},
				{ status: 400 }
			);
		}

		return NextResponse.json({
			message: "Order created successfully",
			data: order,
		});
	} catch (error) {
		logger.error("Failed to create order", {
			error: error instanceof Error ? error.message : String(error),
		});

		return NextResponse.json(
			{
				message: "Failed to create order",
				error: error instanceof Error ? error.message : String(error),
			},
			{
				status: 500,
			}
		);
	}
}
