import { z } from "zod";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnectDb } from "@/libs/connect";
import { UserModel } from "@/models/schema";
import bcrypt from "bcryptjs";
const Schema = z.object({
	name: z.string().min(5, { message: "Name must be at least 5 characters" }),
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" })
		.refine(
			(value) => /[A-Z]/.test(value), // At least one uppercase letter
			{ message: "Password must contain at least one uppercase letter" }
		)
		.refine(
			(value) => /[a-z]/.test(value), // At least one lowercase letter
			{ message: "Password must contain at least one lowercase letter" }
		)
		.refine(
			(value) => /[0-9]/.test(value), // At least one number
			{ message: "Password must contain at least one number" }
		),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedBody = Schema.parse(body);

		const { email, name, password } = validatedBody;

		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		const existingUser = await UserModel.findOne({ email: email });
		if (existingUser) {
			logger.warn("user with the same email already registered", {
				status: 400,
			});
			return NextResponse.json(
				{
					message: "user with the same email already registered",
				},
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = await UserModel.create({
			name,
			email,
			password: hashedPassword,
		});

		return NextResponse.json(
			{
				message: "user successfully registered",
				id: newUser._id,
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.warn("validation error during user creation", {
				status: 400,
				error: error.errors,
			});
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: error.errors,
				},
				{
					status: 400,
				}
			);
		}

		logger.error("user creation failed ", {
			error: error instanceof Error ? error.message : String(error),
		});

		return NextResponse.json(
			{
				message: `failed to create user`,
				error: error instanceof Error ? error.message : String(error),
			},
			{
				status: 500,
			}
		);
	}
}
