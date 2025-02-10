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
