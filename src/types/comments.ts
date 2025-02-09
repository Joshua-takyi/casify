import mongoose, { Document } from "mongoose";

export interface CommentProps extends Document {
	user: string;
	product: string;
	comment: string;
}
