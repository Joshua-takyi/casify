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

		// Perform aggregation to fetch data and total count
		const [result] = await ProductModel.aggregate([
			{ $match: matchStage }, // Apply filtering conditions (ENSURE INDEXES ARE USED!)
			{
				$facet: {
					data: [
						// Paginate and sort data
						{ $sort: sortStage }, // (ENSURE INDEXES ARE USED!)
						{ $skip: skip },
						{ $limit: limit },
					],
					totalCount: [{ $count: "count" }], // Count total matching documents
				},
			},
		]);

		// Extract results and calculate pagination metadata
		const products = result.data || [];
		const total = result.totalCount[0]?.count || 0;
		const totalPages = Math.ceil(total / limit);

		// Return the response with data and pagination metadata
		return NextResponse.json({
			data: products,
			pagination: {
				page,
				limit,
				total,
				totalPages,
			},
		});
	} catch (error) {
		// Log errors and return a 500 response
		logger.error("Failed to fetch products", { error });
		return NextResponse.json(
			{ message: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
