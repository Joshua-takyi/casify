"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";

interface AddToCartButtonProps {
	productId: string;
	selectedColor: string;
	selectedModel: string;
	selectedQuantity: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AddToCartButton = ({
	productId,
	selectedColor,
	selectedModel,
	selectedQuantity,
}: AddToCartButtonProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationKey: [
			"add to cart",
			productId,
			selectedColor,
			selectedModel,
			selectedQuantity,
		],
		mutationFn: async () => {
			try {
				const res = await axios.post(`${API_URL}/cart/add-toCart`, {
					productId,
					color: selectedColor,
					model: selectedModel,
					quantity: selectedQuantity,
				});
				if (res.status !== 201) {
					throw new Error("Error creating cart");
				}
				return res.data;
			} catch (error) {
				if (error instanceof Error) {
					throw new Error(error.message || "Failed to add item to cart");
				}
			}
		},
		onSuccess: () => {
			toast.success("Added to cart", { duration: 2000, richColors: false });
			queryClient.invalidateQueries({ queryKey: ["cartData"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Something went wrong", {
				duration: 2000,
				onDismiss: () => {
					if (error.message === "Session expired. Please sign in again.") {
						router.push("/auth/signin");
					}
				},
			});
		},
	});

	const handleAddToCart = () => {
		if (!selectedColor || !selectedModel) {
			toast.error("Please select a color and model", { duration: 2000 });
			return;
		}
		mutate();
	};

	return (
		<button
			className="w-full py-4 px-6 rounded-lg bg-gray-900 text-white font-medium 
                    hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
			onClick={handleAddToCart}
			disabled={isPending || !selectedColor || !selectedModel}
		>
			<ShoppingCartIcon className="w-5 h-5" />
			{isPending ? "Adding to Cart..." : "Add to Cart"}
		</button>
	);
};

export default AddToCartButton;
