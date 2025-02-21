// import logger from "@/utils/logger";
// import { auth } from "@/auth";
// import { NextResponse } from "next/server";

// export async function GET() {
// 	try {
// 		const session = await auth();
// 		if (!session) {
// 			return NextResponse.json(
// 				{
// 					message: "no session available",
// 				},
// 				{ status: 401 }
// 			);
// 		}
// 		logger.info("session", session.user);
// 		return NextResponse.json(session.user);
// 	} catch (error) {
// 		logger.error("failed to get session)", {
// 			error: error instanceof Error ? error.message : String(error),
// 		});
// 		return NextResponse.json({
// 			error: error instanceof Error ? error.message : String(error),
// 		});
// 	}
// }
