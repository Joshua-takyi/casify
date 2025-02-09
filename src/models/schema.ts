import { CommentProps } from "@/types/comments";
import { ProductProps } from "@/types/products";
import { UserProps } from "@/types/user";
import mongoose, { Schema, Model } from "mongoose";

const userSchema: Schema<UserProps> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			select: false,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{ timestamps: true }
);

const productSchema: Schema<ProductProps> = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		discount: { type: Number, default: 0 },
		slug: { type: String, required: true, unique: true },
		category: { type: [String], required: true },
		details: { type: [String], required: true },
		features: { type: [String], required: true },
		sku: { type: String, required: true, unique: true },
		stock: { type: Number, required: true },
		available: { type: Boolean, default: true },
		isOnSale: { type: Boolean, default: false },
		tags: { type: [String], default: [] },
		models: { type: [String], default: [] },
		images: { type: [String], default: [] },
		salesStartAt: { type: Date },
		salesEndAt: { type: Date },
		rating: { type: Number, min: 0, max: 5 },
		reviews: { type: [String], default: [] },
		materials: { type: [String], required: true },
		colors: { type: [String], required: true },
		comments: { type: [String], default: [] },
	},
	{ timestamps: true }
);

const commentSchema: Schema<CommentProps> = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "UserModel",
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		comment: {
			type: String, // Changed from ObjectId to String
			required: false,
		},
	},
	{ timestamps: true }
);
const UserModel: Model<UserProps> =
	mongoose.models.UserModel ||
	mongoose.model<UserProps>("UserModel", userSchema);
const ProductModel: Model<ProductProps> =
	mongoose.models.ProductModel || mongoose.model("ProductModel", productSchema);

const CommentModel =
	mongoose.models.CommentModel || mongoose.model("CommentModel", commentSchema);
export { UserModel, CommentModel, ProductModel };
