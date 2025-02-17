import axios from "axios";
import { NextResponse } from "next/server";
import logger from "@/utils/logger"; // Assuming you have this

export async function POST(req: Request) {
	try {
		// Validate request body
		const body = await req.json();
		if (!body.reference) {
			logger.error("Missing reference in request body");
			return NextResponse.json(
				{ status: "error", message: "Reference is required" },
				{ status: 400 }
			);
		}

		const { reference } = body;

		// Validate environment variables
		const secretKey = process.env.PAYSTACK_SECRET_KEY;
		if (!secretKey) {
			logger.error("PAYSTACK_SECRET_KEY environment variable is not set");
			return NextResponse.json(
				{ status: "error", message: "Server configuration error" },
				{ status: 500 }
			);
		}

		logger.info("Initiating payment verification", { reference });

		// Make request to Paystack
		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${reference}`,
			{
				headers: {
					Authorization: `Bearer ${secretKey}`,
					"Content-Type": "application/json",
				},
				timeout: 10000, // 10 second timeout
			}
		);

		const { data } = response;

		// Log the verification result
		logger.info("Payment verification response received", {
			reference,
			status: data.status,
			transactionStatus: data.data?.status,
		});

		// Check both the API response status and the transaction status
		if (data.status === true && data.data.status === "success") {
			// You might want to store the transaction details or update your database here
			return NextResponse.json(
				{
					status: "success",
					message: "Payment verified successfully",
					data: {
						amount: data.data.amount,
						reference: data.data.reference,
						paidAt: data.data.paid_at,
						channel: data.data.channel,
					},
				},
				{ status: 200 }
			);
		} else {
			logger.warn("Payment verification failed", {
				reference,
				paystackStatus: data.status,
				transactionStatus: data.data?.status,
			});

			return NextResponse.json(
				{
					status: "error",
					message: "Payment verification failed",
					details: data.data?.gateway_response || "Unknown error",
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		// Enhanced error logging
		if (axios.isAxiosError(error)) {
			logger.error("Paystack API error", {
				status: error.response?.status,
				statusText: error.response?.statusText,
				data: error.response?.data,
				message: error.message,
			});

			// Return appropriate error message based on status
			if (error.response?.status === 404) {
				return NextResponse.json(
					{
						status: "error",
						message: "Transaction reference not found",
					},
					{ status: 404 }
				);
			}
		} else {
			logger.error("Unexpected error during payment verification", {
				error: error instanceof Error ? error.message : String(error),
			});
		}

		return NextResponse.json(
			{
				status: "error",
				message: "Payment verification failed",
				details: "An unexpected error occurred",
			},
			{ status: 500 }
		);
	}
}
