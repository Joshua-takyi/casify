import mongoose, { Document } from "mongoose";

export interface CommentProps extends Document {
	user: mongoose.Schema.Types.ObjectId;
	product: mongoose.Schema.Types.ObjectId;
	comment: string;
}
