import axios from "axios";
import { CartProps } from "@/types/cart";

const CART_STORAGE_KEY = "casify_cart";

export interface LocalCartItem {
	productId: string;
	name: string;
	price: number;
	quantity: number;
	color: string;
	model: string;
	image: string;
	stock: number;
	available: boolean;
}

export const localCartStorage = {
	// Methods that work with LocalCartItem[]
	getLocalCart: (): LocalCartItem[] => {
		if (typeof window === "undefined") return [];
		const cart = localStorage.getItem(CART_STORAGE_KEY);
		return cart ? JSON.parse(cart) : [];
	},

	addItem: (item: LocalCartItem) => {
		const cart = localCartStorage.getLocalCart();
		const existingItemIndex = cart.findIndex(
			(i) =>
				i.productId === item.productId &&
				i.color === item.color &&
				i.model === item.model
		);

		if (existingItemIndex > -1) {
			cart[existingItemIndex].quantity += item.quantity;
		} else {
			cart.push(item);
		}

		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	},

	clearLocalCart: () => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(CART_STORAGE_KEY);
	},

	// Methods that work with CartProps[]
	// (Note: CartProps is defined in your server schema and may have a different shape.)
	getCart: (): CartProps[] => {
		if (typeof window === "undefined") return [];
		const cart = localStorage.getItem(CART_STORAGE_KEY);
		return cart ? JSON.parse(cart) : [];
	},

	setCart: (cart: CartProps[]) => {
		if (typeof window === "undefined") return;
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	},

	clearCart: () => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(CART_STORAGE_KEY);
	},

	mergeWithServerCart: async (
		serverCart: CartProps[]
	): Promise<CartProps[]> => {
		// Get the locally stored cart (as CartProps[])—you may need to convert LocalCartItem to CartProps if they differ.
		const localCart = localCartStorage.getCart();
		// Example merge logic: simply combine the arrays.
		// In a real-world scenario, you might want to combine quantities for duplicate items.
		const mergedCart = [...localCart, ...serverCart];
		localCartStorage.clearCart(); // Clear local storage after merging
		return mergedCart;
	},
};

export const mergeCartsOnServer = async (localCart: CartProps[]) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/cart/merge-cart`,
			{
				products: localCart,
			}
		);

		if (!response.data.success) {
			throw new Error(response.data.message || "Failed to merge carts");
		}

		return response.data;
	} catch (error) {
		console.error("Error merging carts:", error);
		throw new Error("Failed to merge your cart items. Please try again.");
	}
};
