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


export interface ShippingProps {
	userId: mongoose.Schema.Types.ObjectId;
	userInfo: {
		firstName: string;
		lastName: string;
		phone: string;
		email: string;
		city: string;
		region: string;
		streetAddress: string; // Use the more common name
		ghanaPost:string
	}
}