import { CommentProps } from "@/types/comments";
import { ProductProps, WishListProps } from "@/types/products";
import { ShippingProps, UserProps } from "@/types/user";
import mongoose, { Schema, Model } from "mongoose";
import { CartProps } from "@/types/cart";

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
		isBestSeller: { type: Boolean, default: false },
		isNewItem: { type: Boolean, default: false },
		details: { type: [String], required: true },
		features: { type: [String], required: true },
		sku: { type: String, required: true, unique: true },
		stock: { type: Number, required: true },
		available: { type: Boolean, default: true, required: false },
		isOnSale: { type: Boolean, default: false },
		tags: { type: [String], default: [] },
		models: { type: [String], default: [] },
		images: { type: [String], default: [] },
		salesStartAt: { type: Date, default: null, required: false },
		salesEndAt: { type: Date, default: null, required: false },
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

const cartSchema: Schema<CartProps> = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "ProductModel", // Corrected ref
					required: true,
				},
				color: {
					type: String,
					required: true,
				},
				model: {
					type: String,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				totalPrice: {
					type: Number,
					required: true,
					default: 0,
				},
			},
		],
	},
	{ timestamps: true }
);

const deliverySchema: Schema<ShippingProps> = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "UserModel",
		},
		userInfo: {
			firstName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
				unique: true,
			},
			city: {
				type: String,
				required: true,
			},
			streetAddress: {
				type: String,
				required: true,
			},
			region: {
				type: String,
				required: true,
			},
			ghanaPost: {
				type: String,
				required: true,
			},
		},
	},
	{ timestamps: true }
);

const wishListSchema: Schema<WishListProps> = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "UserModel", // Must match your User model name
		},
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "ProductModel", // Must match your Product model name
				},
				slug: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

// TTL Index: Delete carts that haven't been updated in 5 days (5 * 24 * 60 * 60 seconds)
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 5 * 24 * 60 * 60 });
const WishListModel: Model<WishListProps> =
	mongoose.models.WishListModel ||
	mongoose.model<WishListProps>("WishListModel", wishListSchema);
const UserInfoModel: Model<ShippingProps> =
	mongoose.models.UserInfoModel ||
	mongoose.model<ShippingProps>("UserInfoModel", deliverySchema);
const UserModel: Model<UserProps> =
	mongoose.models.UserModel ||
	mongoose.model<UserProps>("UserModel", userSchema);
const ProductModel: Model<ProductProps> =
	mongoose.models.ProductModel || mongoose.model("ProductModel", productSchema);
const CartModel: Model<CartProps> =
	mongoose.models.CartModel ||
	mongoose.model<CartProps>("CartModel", cartSchema);
const CommentModel =
	mongoose.models.CommentModel || mongoose.model("CommentModel", commentSchema);
export {
	UserModel,
	CommentModel,
	ProductModel,
	CartModel,
	UserInfoModel,
	WishListModel,
};
