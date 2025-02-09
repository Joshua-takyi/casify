import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = "hello world";
		return NextResponse.json({
			data,
		});
	} catch (error) {
		return NextResponse.json({
			message: "failed to add items",
			error: error instanceof Error ? error.message : String(error),
		});
	}
}
