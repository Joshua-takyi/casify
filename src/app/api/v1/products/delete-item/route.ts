import { NextResponse } from "next/server";
import logger from "@/utils/logger";
import { ProductModel } from "@/models/schema";

export async function DELETE(req: Request) {
	try {
		const { id } = await req.json();

		if (!id) {
			return NextResponse.json(
				{ message: "An id is needed to delete a product" },
				{ status: 400 }
			);
		}

		const product = await ProductModel.findByIdAndDelete(id);
		if (!product) {
			return NextResponse.json(
				{ message: `No product matches with ${id}` },
				{ status: 404 }
			);
		}
		logger.info("Product deleted successfully");

		return NextResponse.json(
			{ message: "Successfully deleted item" },
			{ status: 200 }
		);
	} catch (error) {
		logger.error("Failed to delete product", {
			error: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ message: "Failed to delete item" },
			{ status: 500 }
		);
	}
}
