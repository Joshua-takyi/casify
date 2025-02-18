import mongoose, { Document } from "mongoose";

export interface ProductProps extends Document {
	title: string;
	description: string;
	price: number;
	discount: number;
	slug?: string;
	category: string[];
	details: string[];
	features: string[];
	sku?: string;
	stock: number;
	isBestSeller?: boolean;
	isNewItem?: boolean;
	available?: boolean;
	isOnSale: boolean;
	tags: string[];
	models: string[];
	images: string[];
	salesStartAt?: Date;
	salesEndAt?: Date;
	rating?: number;
	reviews?: string[];
	materials: string[];
	colors: string[];
	featured: boolean;
	comments?: string[];
}

export interface ProductPropsForDb {
	title: string;
	description: string;
	price: number;
	discount: number;
	category: string[];
	details: string[];
	features: string[];
	stock: number;
	available?: boolean;
	isOnSale: boolean;
	tags: string[];
	models: string[];
	images: string[];
	salesStartAt?: Date;
	salesEndAt?: Date;
	rating?: number;
	materials: string[];
	colors: string[];
}

export interface ProductCardProps {
	title?: string;
	discount?: number;
	path?: string;
	tags?: string[];
	price?: number;
	images?: string[];
	image: string;
	colors?: string[];
}

export interface WishListProps extends Document {
	userId: mongoose.Schema.Types.ObjectId;
	products: {
		productId: mongoose.Schema.Types.ObjectId;
		slug: string;
	}[];
}
