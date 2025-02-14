import { auth } from "@/auth";
import { ConnectDb } from "@/libs/connect";
import { UserInfoModel } from "@/models/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Authenticate the user
		const session = await auth();
		const userId = session?.user.id; // Fixed typo (was "session")

		if (!userId) {
			return NextResponse.json(
				{ message: "Unauthorized - User ID not found" },
				{ status: 401 }
			);
		}

		// Ensure the database is connected
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Fetch all user info documents that match the userId
		const result = await UserInfoModel.find({ userId });

		if (!result || result.length === 0) {
			return NextResponse.json(
				{ message: "User has no information provided" },
				{ status: 404 }
			);
		}

		// Return the retrieved user info
		return NextResponse.json(
			{ message: "User info retrieved successfully", data: result },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Failed to get user info",
				error: error instanceof Error ? error.message : error,
			},
			{ status: 500 }
		);
	}
}
