// app/api/verify-payment/route.ts
import axios from "axios";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
	try {
		const { reference } = await req.json();

		const secretKey = process.env.PAYSTACK_SECRET_KEY;

		if (!secretKey) {
			console.error("PAYSTACK_SECRET_KEY is not set.");
			return NextResponse.json(
				{ status: "error", message: "Missing secret key" },
				{ status: 500 }
			);
		}

		console.log("Verifying Paystack reference:", reference); // Log the reference
		//console.log("Secret Key (first/last 4):", secretKey.substring(0,4), secretKey.substring(secretKey.length - 4)); //Debugging ONLY

		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${reference}`,
			{
				headers: {
					Authorization: `Bearer ${secretKey}`,
				},
			}
		);
		const data = response.data;

		if (data.status === true && data.data.status === "success") {
			return NextResponse.json(
				{ status: "success", message: "Payment verified" },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ status: "error", message: "Payment verification failed" },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("Paystack verification error:", error);
		return NextResponse.json(
			{ status: "error", message: "Internal server error" },
			{ status: 500 }
		);
	}
}
