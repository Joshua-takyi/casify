import { UserProps } from "@/types/user";
import mongoose, { Schema, Model } from "mongoose";

const userSchema: Schema = new mongoose.Schema(
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

const UserModel: Model<UserProps> =
	mongoose.models.UserModel ||
	mongoose.model<UserProps>("UserModel", userSchema);

export { UserModel };
