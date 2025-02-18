import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect";
import { UserModel } from "@/models/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
	try {
		// Ensure database connection
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Authenticate user
		const session = await auth();
		const userId = session?.user.id;
		if (!userId) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Parse and validate request body
		const { avatar } = await req.json();
		if (!avatar) {
			return NextResponse.json(
				{ message: "Image URL is required" },
				{ status: 400 }
			);
		}

		// Update user's avatar
		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userId },
			{ avatar },
			{ new: true } // Return the updated document
		);

		if (!updatedUser) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		// Respond with the updated user data
		return NextResponse.json(updatedUser);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Failed to update user profile image",
				error: error instanceof Error ? error.message : error,
			},
			{ status: 500 }
		);
	}
}
