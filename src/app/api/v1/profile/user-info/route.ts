import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import { ConnectDb } from "@/libs/connect";
import { z } from "zod";
import { UserInfoModel } from "@/models/schema";
import { auth } from "@/auth";
import mongoose from "mongoose";

const schema = z.object({
	userInfo: z.object({
		firstName: z.string().min(1, { message: "First name is required" }),
		lastName: z.string().min(1, { message: "Last name is required" }),
		email: z.string().email({ message: "Email is required" }),
		phone: z.string().min(1, { message: "Phone is required" }),
		city: z.string().min(1, { message: "City is required" }),
		region: z.string().min(1, { message: "Region is required" }),
		streetAddress: z.string().min(1, { message: "StreetAddress is required" }),
		ghanaPost: z.string().min(1, { message: "ghanaPost is required" }),
	}),
});

export async function POST(req: Request) {
	try {
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		const session = await auth();
		const userId = session?.user.id;

		if (!userId) {
			return NextResponse.json(
				{ message: "Unauthorized - User ID not found" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const validationResult = schema.safeParse(body);

		if (!validationResult.success) {
			const errors = validationResult.error.errors.map((err) => ({
				field: err.path.join("."),
				message: err.message,
			}));
			return NextResponse.json(
				{
					message: "Validation failed",
					errors,
				},
				{ status: 400 }
			);
		}

		const data = validationResult.data;

		// Check if user already exists
		const existingUserInfo = await UserInfoModel.findOne({
			userId: new mongoose.Types.ObjectId(userId),
		});
		if (existingUserInfo) {
			return NextResponse.json(
				{ message: "A user with the same information exists." },
				{ status: 409 }
			);
		}

		// Create new user info
		const result = await UserInfoModel.create({
			...data,
			userId: userId,
		});

		logger.info("User information saved successfully", result);

		return NextResponse.json(
			{
				message: "User information saved successfully",
				data: result,
			},
			{ status: 201 }
		);
	} catch (error) {
		logger.error("Failed to save user information", {
			message: error instanceof Error ? error.message : error,
		});
		return NextResponse.json(
			{
				message: "Failed to save user information",
				error: error instanceof Error ? error.message : error,
			},
			{ status: 500 }
		);
	}
}
