import { Document } from "mongoose";

export interface ProductProps extends Document {
	title: string;
	description: string;
	price: number;
	discount: number;
	slug: string;
	category: string[];
	details: string[];
	features: string[];
	sku: string;
	stock: number;
	available: boolean;
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
	comments?: string[];
}
