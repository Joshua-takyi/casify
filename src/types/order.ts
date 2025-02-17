import { Schema } from "mongoose";

export interface OrderDocument extends Document {
	userId: Schema.Types.ObjectId;
	products: {
		productId: Schema.Types.ObjectId;
		name: string;
		price: number;
		quantity: number;
		color: string;
		model: string;
		image: string;
	}[];
	total: number;
	status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
	transactionRef: string;
	paymentStatus: "pending" | "success" | "failed";
	shippingAddress: {
		street: string;
		city: string;
		state: string;
		country: string;
		postalCode: string;
	};
	createdAt: Date;
	updatedAt: Date;
}
