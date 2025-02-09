import { ProductModel } from "@/models/schema";
import { NextResponse } from "next/server";
import logger from "@/utils/logger";

export async function PUT(req: Request) {
	try {
		// Destructure the id and treat the rest as update data.
		const body = await req.json();
		const { id, ...updateData } = body;

		if (!id) {
			return NextResponse.json({ message: "An id is needed" }, { status: 400 });
		}

		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{ message: "Update data is required and must be a non-empty object" },
				{ status: 400 }
			);
		}

		const product = await ProductModel.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true }
		);

		if (!product) {
			return NextResponse.json(
				{ message: `No product matches with ${id}` },
				{ status: 404 }
			);
		}

		logger.info("Product updated successfully");

		return NextResponse.json(
			{ message: "Item updated successfully", data: product },
			{ status: 200 }
		);
	} catch (error) {
		logger.warn("Failed to update product", {
			error: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{
				message: "Failed to update product",
				error: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
