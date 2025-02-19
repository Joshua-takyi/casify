import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { BuildQuery, BuildSort } from "@/utils/buildQuery";
import { ProductModel } from "@/models/schema";
import { ConnectDb } from "@/libs/connect";

export async function GET(req: NextRequest) {
	try {
		// Ensure the database connection is established
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Parse query parameters from the request URL
		const searchParams = req.nextUrl.searchParams;
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const sortBy = searchParams.get("sortBy") || "createdAt";
		const sortOrder = searchParams.get("sortOrder") || "desc";
		const skip = (page - 1) * limit;

		// Build query and sort stages
		const matchStage = BuildQuery(searchParams);
		const sortStage = BuildSort({ sortBy, sortOrder });

		// Use Promise.all to run queries concurrently
		const [products, totalCount] = await Promise.all([
			ProductModel.find(matchStage)
				.sort(sortStage)
				.skip(skip)
				.limit(limit)
				.lean()
				.exec(),
			ProductModel.countDocuments(matchStage),
		]);

		// Calculate pagination metadata
		const total = totalCount;
		const totalPages = Math.ceil(total / limit);

		// Return the response with data and pagination metadata
		return NextResponse.json(
			{
				data: products,
				pagination: {
					page,
					limit,
					total,
					totalPages,
				},
			},
			{
				headers: {
					"Cache-Control": "public, max-age=60", // Cache for 60 seconds
				},
			}
		);
	} catch (error) {
		// Log errors and return a 500 response
		logger.error("Failed to fetch products", { error });
		return NextResponse.json(
			{ message: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
