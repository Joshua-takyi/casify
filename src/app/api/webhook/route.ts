// webhook.ts
import crypto from "crypto";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import { OrderModel } from "@/models/schema";

export async function POST(req: Request) {
	try {
		// Validate webhook signature with timing-safe comparison
		const rawBody = await req.text();
		const signature = req.headers.get("x-paystack-signature");
		const secret = process.env.PAYSTACK_SECRET_KEY;

		if (!secret) {
			logger.error("Missing Paystack secret key");
			return NextResponse.json(
				{ success: false, message: "Configuration error" },
				{ status: 500 }
			);
		}

		const computedSignature = crypto
			.createHmac("sha512", secret)
			.update(rawBody)
			.digest("hex");

		if (
			!crypto.timingSafeEqual(
				Buffer.from(signature || ""),
				Buffer.from(computedSignature)
			)
		) {
			logger.error("Invalid webhook signature");
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const data = JSON.parse(rawBody);

		if (data.event === "charge.success") {
			const { reference: transactionRef, amount, metadata } = data.data;

			// Enhanced validation
			if (!transactionRef || !amount || !metadata) {
				logger.error("Invalid webhook payload structure");
				return NextResponse.json(
					{ success: false, message: "Invalid payload" },
					{ status: 400 }
				);
			}

			// Validate metadata structure
			const { userId, products, shippingAddress } = metadata;
			if (!userId || !Array.isArray(products) || !shippingAddress) {
				logger.error("Invalid metadata structure");
				return NextResponse.json(
					{ success: false, message: "Invalid metadata" },
					{ status: 400 }
				);
			}

			// Add transaction
			const session = await OrderModel.startSession();
			try {
				await session.withTransaction(async () => {
					const newOrder = await OrderModel.create(
						[
							{
								userId,
								products,
								total: amount / 100,
								transactionRef,
								paymentStatus: "success",
								status: "paid",
								shippingAddress,
								createdAt: new Date(),
							},
						],
						{ session }
					);

					logger.info(`Order created successfully: ${newOrder[0]._id}`);
				});

				await session.endSession();
			} catch (error) {
				await session.abortTransaction();
				throw error;
			}

			return NextResponse.json(
				{ success: true, message: "Order processed" },
				{ status: 200 }
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		logger.error(`Webhook error: ${error}`);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
