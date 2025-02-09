import mongoose, { Document } from "mongoose";
export interface UserProps extends Document {
	_id: mongoose.Schema.Types.ObjectId;
	name: string;
	email: string;
	password: string;
	role: string;
}

export interface SignInProps {
	email: string;
	password: string;
}
