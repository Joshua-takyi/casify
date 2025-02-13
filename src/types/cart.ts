import { Document, Types } from "mongoose";
export interface CartProps extends Document {
	userId: Types.ObjectId;
	products: {
		productId: Types.ObjectId;
		quantity: number;
		color: string;
		model: string;
		totalPrice: number;
	}[];
	updatedAt: Date;
}
