// app/api/clear-cart/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { CartModel } from "@/models/schema"; // Adjust the import path as needed
import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect"; // Adjust the import path as needed

export async function POST() {
	try {
		const session = await auth();
		const userId = session?.user.id;

		if (!userId) {
			return NextResponse.json(
				{ message: "Unauthorized - User not logged in" },
				{ status: 401 }
			);
		}

		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		const data = await CartModel.deleteMany({ userId: userId });

		if (!data) {
			return NextResponse.json(
				{ message: "Cart not found or already empty" },
				{ status: 404 }
			); // Use 404 for not found
		}

		return NextResponse.json(
			{ message: "Cart cleared successfully." },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error clearing cart:", error);
		return NextResponse.json(
			{
				message: "Failed to clear cart",
				error: error instanceof Error ? error.message : error,
			},
			{ status: 500 }
		);
	}
}
