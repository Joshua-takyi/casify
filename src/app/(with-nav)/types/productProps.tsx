// Types
export interface ProductProps {
	_id: string;
	title: string;
	price: number;
	images: string[];
	slug: string;
	colors: string[];
	isNewItem: boolean;
	salesStartAt?: string;
	salesEndAt?: string;
}
