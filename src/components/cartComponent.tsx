"use client";

import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	ShoppingCart,
	X,
	Plus,
	Minus,
	Trash2,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorBoundary } from "react-error-boundary";

/* ===================== */
/*      Type Definitions */
/* ===================== */

interface UserProfile {
	_id: string;
	userId: string;
	userInfo: {
		firstName: string;
		lastName: string;
		phone: string;
		email: string;
		city: string;
		streetAddress: string;
		region: string;
		ghanaPost: string;
	};
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface CartProduct {
	productId: string;
	slug: string;
	name: string;
	price: number;
	quantity: number;
	color: string;
	model: string;
	totalPrice: number;
	image: string;
	stock: number;
	available: boolean;
}
interface ApiResponse<T> {
	data: T[];
}
interface CartData {
	products: CartProduct[];
	total: number;
	updatedAt: string;
}
interface CustomField {
	display_name: string;
	variable_name: string;
	value: string | number;
}

interface PaystackMetadata {
	custom_fields: CustomField[];
	userId?: string;
	shippingAddress?: {
		street: string;
		city: string;
		region: string;
		country: string;
		ghanaPost: string;
	};
	products: {
		productId: string;
		name: string;
		price: number;
		quantity: number;
		color: string;
		model: string;
		image: string;
	}[];
}

interface PaystackProps {
	email: string;
	amount: number;
	publicKey: string;
	text: string;
	onSuccess: (data: { reference: string }) => void;
	onClose: () => void;
	metadata: PaystackMetadata;
}

/* ===================== */
/*      Constants        */
/* ===================== */

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

if (!API_URL || !PAYSTACK_KEY) {
	throw new Error("Missing required environment variables");
}

/* ===================== */
/*    Axios Instance     */
/* ===================== */

const api = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		// Only handle rate limiting errors
		if (error.response?.status === 429) {
			const retryAfter = error.response.headers["retry-after"] || 2;
			await new Promise((resolve) =>
				setTimeout(resolve, parseInt(retryAfter as string) * 1000)
			);
			return api(error.config!);
		}
		return Promise.reject(error);
	}
);

/* ===================== */
/*   Utility Functions   */
/* ===================== */

/**
 * Formats a number into a Ghanaian currency string.
 */
const formatPrice = (amount: number): string => {
	try {
		return new Intl.NumberFormat("en-GH", {
			style: "currency",
			currency: "GHS",
			minimumFractionDigits: 2,
		}).format(amount);
	} catch (error) {
		console.error("Price formatting error:", error);
		return `GHS ${amount.toFixed(2)}`;
	}
};

/**
 * Validates an email address.
 */
const validateEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/* ===================== */
/*   Dynamic Imports     */
/* ===================== */

const PaystackButtonWrapper = dynamic(
	() => import("react-paystack").then((mod) => mod.PaystackButton),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-12 bg-gray-100 animate-pulse rounded-md" />
		),
	}
);

/* ===================== */
/*   Cart Item Component */
/* ===================== */

interface CartItemProps {
	item: CartProduct;
	onUpdateQuantity: (vars: {
		productId: string;
		color: string;
		model: string;
		action: "increase" | "decrease" | "remove";
	}) => void;
	isUpdating: boolean;
}

const CartItem: React.FC<CartItemProps> = React.memo(
	({ item, onUpdateQuantity, isUpdating }) => (
		<div className="flex items-center gap-3 p-3 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
			<div className="relative w-16 h-16">
				<Image
					src={item.image}
					alt={item.name}
					fill
					className="rounded-md object-cover"
					sizes="64px"
					loading="lazy"
				/>
			</div>

			<div className="flex-grow min-w-0">
				<h3 className="font-medium text-sm truncate">{item.name}</h3>
				<div className="text-xs text-gray-500 space-x-2">
					<span>{item.color}</span>
					<span>•</span>
					<span>{item.model}</span>
				</div>
				{!item.available && (
					<span className="text-red-500 text-xs">Currently unavailable</span>
				)}
			</div>

			<div className="flex items-center gap-3">
				<div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
					<Button
						size="sm"
						variant="ghost"
						onClick={() =>
							onUpdateQuantity({
								productId: item.productId,
								color: item.color,
								model: item.model,
								action: "decrease",
							})
						}
						disabled={item.quantity <= 1 || isUpdating || !item.available}
						className="h-8 w-8"
					>
						<Minus className="w-3 h-3" />
					</Button>

					<span className="w-8 text-center text-sm font-medium">
						{item.quantity}
					</span>

					<Button
						size="sm"
						variant="ghost"
						onClick={() =>
							onUpdateQuantity({
								productId: item.productId,
								color: item.color,
								model: item.model,
								action: "increase",
							})
						}
						disabled={
							item.quantity >= item.stock || isUpdating || !item.available
						}
						className="h-8 w-8"
					>
						<Plus className="w-3 h-3" />
					</Button>
				</div>

				<span className="font-medium text-sm min-w-[80px] text-right">
					{formatPrice(item.totalPrice)}
				</span>

				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						onUpdateQuantity({
							productId: item.productId,
							color: item.color,
							model: item.model,
							action: "remove",
						})
					}
					disabled={isUpdating}
					className="text-gray-400 hover:text-red-500 transition-colors h-8 w-8"
				>
					<Trash2 className="w-4 h-4" />
				</Button>
			</div>
		</div>
	)
);

CartItem.displayName = "CartItem";

/* ===================== */
/*      Main CartSheet   */
/* ===================== */

const CartSheet: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isPaying, setIsPaying] = useState(false);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const previousCartTotal = useRef<number>(0);
	const queryClient = useQueryClient();

	/* --------------------- */
	/*   Data Fetching Hooks */
	/* --------------------- */

	// Fetch user profile (assume response.data.data is an array and we take the first element)
	const { data: userProfile, isLoading: isProfileLoading } = useQuery<
		ApiResponse<UserProfile>,
		Error,
		UserProfile
	>({
		queryKey: ["userProfile"],
		queryFn: async () => {
			const res = await api.get("/profile/get-info");
			return res.data;
		},
		// Add a select function to transform the response
		select: (data) => data.data[0],
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
		// onError: (error) => {
		// 	console.error("Profile fetch error:", error);
		// 	toast.error("Failed to load profile. Please refresh.");
		// },
	});

	// Fetch cart data
	const {
		data: cartData,
		isLoading: isCartLoading,
		// error: cartError,
		refetch,
	} = useQuery<{ data: CartData }>({
		queryKey: ["cartData"],
		queryFn: async () => {
			const res = await api.get("/cart/get-cart");
			return res.data;
		},
		// onError: (error) => {
		// 	console.error("Cart fetch error:", error);
		// 	toast.error("Failed to load cart. Please refresh.");
		// },
		refetchOnWindowFocus: false,
	});

	/* --------------------- */
	/*       Mutations       */
	/* --------------------- */

	const updateQuantityMutation = useMutation({
		mutationFn: async (vars: {
			productId: string;
			color: string;
			model: string;
			action: "increase" | "decrease" | "remove";
		}) => {
			if (vars.action === "remove") {
				// DELETE request: send only the necessary data
				await api.delete("/cart/delete-cart", {
					data: {
						productId: vars.productId,
						color: vars.color,
						model: vars.model,
					},
				});
			} else {
				// PATCH request: include quantity and map action to "increment"/"decrement"
				const payload = {
					productId: vars.productId,
					color: vars.color,
					model: vars.model,
					quantity: 1,
					action: vars.action === "increase" ? "increment" : "decrement",
				};
				await api.patch("/cart/update-cart", payload);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cartData"] });
		},
		onError: (error) => {
			console.error("Cart update error:", error);
			toast.error("Failed to update cart. Please try again.");
		},
	});

	/* --------------------- */
	/*    Derived Values     */
	/* --------------------- */

	const cartItems = useMemo(() => cartData?.data?.products || [], [cartData]);
	const cartTotal = useMemo(() => cartData?.data?.total || 0, [cartData]);
	const itemCount = useMemo(
		() => cartItems.reduce((acc, item) => acc + item.quantity, 0),
		[cartItems]
	);

	/* --------------------- */
	/*         Effects       */
	/* --------------------- */

	// Pre-fill email from profile
	useEffect(() => {
		if (userProfile?.userInfo?.email) {
			setEmail(userProfile.userInfo.email);
		}
	}, [userProfile]);

	// Invalidate profile if cart total changes
	useEffect(() => {
		if (cartTotal !== previousCartTotal.current) {
			previousCartTotal.current = cartTotal;
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
		}
	}, [cartTotal, queryClient]);

	/* --------------------- */
	/*       Handlers        */
	/* --------------------- */

	// Clear the entire cart
	const clearCart = useCallback(async () => {
		try {
			const response = await api.post("/cart/clear-cart");
			if (response.status !== 200) {
				console.error(
					"Failed to clear cart. Server returned:",
					response.status,
					response.data
				);
				return;
			}
			queryClient.invalidateQueries({ queryKey: ["cartData"] });
			refetch();
			toast.success("Cart cleared!", {
				richColors: false,
				duration: 1000,
			});
		} catch (error) {
			console.error("Error clearing cart:", error);
			toast.error("Failed to clear cart.");
		}
	}, [queryClient, refetch]);

	const handlePaystackSuccess = useCallback(
		async (data: { reference: string }) => {
			setIsPaying(false);
			toast.success("Payment successful!");
			try {
				const verificationResponse = await axios.post(
					`${API_URL}/verify-payment`,
					{
						reference: data.reference,
					}
				);
				if (verificationResponse.data.status !== "success") {
					toast.error("Payment verification failed. Please contact support.", {
						richColors: false,
						duration: 1000,
					});
					return;
				}
				await clearCart();
				setIsOpen(false);
			} catch (error) {
				toast.error(
					`Failed to clear cart after successful payment: ${
						error instanceof Error ? error.message : String(error)
					}`,
					{ richColors: false, duration: 1000 }
				);
				console.error("Error during handlePaystackSuccess:", error);
			}
		},
		[clearCart]
	);

	const handlePaystackClose = useCallback(() => {
		setIsPaying(false);
		toast.error("Payment cancelled");
	}, []);

	// Validate checkout conditions
	const canCheckout = Boolean(
		validateEmail(email) &&
			userProfile?.userId !== undefined &&
			userProfile?.userInfo?.streetAddress &&
			cartItems.length > 0 &&
			cartItems.every((item) => item.available)
	);

	/* --------------------- */
	/*    Paystack Settings  */
	/* --------------------- */

	const paystackProps: PaystackProps & { currency: string } = {
		// custom_fields: [],
		email,
		amount: cartTotal * 100, // Amount in pesewas
		publicKey: PAYSTACK_KEY,
		text: "Complete Payment",
		currency: "GHS",
		onSuccess: handlePaystackSuccess,
		onClose: handlePaystackClose,
		metadata: {
			custom_fields: [], // providing an empty array to satisfy the type requirement
			userId: userProfile?.userId,
			shippingAddress: userProfile?.userInfo?.streetAddress
				? {
						street: userProfile.userInfo.streetAddress,
						city: userProfile.userInfo.city,
						region: userProfile.userInfo.region,
						country: "Ghana",
						ghanaPost: userProfile.userInfo.ghanaPost,
				  }
				: undefined,
			products: cartItems.map((item) => ({
				productId: item.productId,
				name: item.name,
				price: item.price,
				quantity: item.quantity,
				color: item.color,
				model: item.model,
				image: item.image,
			})),
		},
	};

	/* --------------------- */
	/*     Render Component  */
	/* --------------------- */

	// if (cartError) {
	// 	return (
	// 		<Alert variant="destructive">
	// 			<AlertCircle className="h-4 w-4" />
	// 			<AlertDescription>
	// 				Failed to load cart. Please refresh the page.
	// 			</AlertDescription>
	// 		</Alert>
	// 	);
	// }

	return (
		<>
			<div className="relative cursor-pointer" title="cart">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsOpen(true)}
					disabled={isCartLoading}
					aria-label="Shopping cart"
				>
					<ShoppingCart className="w-6 h-6" />
					{itemCount > 0 && (
						<span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
							{itemCount}
						</span>
					)}
				</Button>
			</div>

			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.4 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
						/>

						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							className="fixed top-0 right-0 h-full w-full sm:w-[32rem] bg-gray-50 shadow-2xl z-50 flex flex-col"
						>
							{/* Header */}
							<div className="flex items-center justify-between p-4 border-b bg-white">
								<div className="flex items-center gap-3">
									<ShoppingCart className="w-5 h-5 text-primary" />
									<h2 className="font-semibold text-lg">
										Shopping Cart ({itemCount})
									</h2>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setIsOpen(false)}
									className="rounded-full"
								>
									<X className="w-5 h-5" />
								</Button>
							</div>

							{/* Cart Items */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								{isCartLoading ? (
									<div className="space-y-4">
										{[...Array(3)].map((_, i) => (
											<div
												key={i}
												className="h-24 bg-gray-100 animate-pulse rounded-lg"
											/>
										))}
									</div>
								) : cartItems.length === 0 ? (
									<div className="text-center py-12 text-gray-500">
										Your cart is empty
									</div>
								) : (
									cartItems.map((item) => (
										<CartItem
											key={`${item.productId}-${item.color}-${item.model}`}
											item={item}
											onUpdateQuantity={updateQuantityMutation.mutate}
											isUpdating={updateQuantityMutation.isPending} // Updated here
										/>
									))
								)}
							</div>

							{/* Checkout Section */}
							<div className="border-t bg-white p-4 space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between">
										<span>Subtotal:</span>
										<span>{formatPrice(cartTotal)}</span>
									</div>
									<div className="flex justify-between">
										<span>Delivery:</span>
										<span> (Motorbike - Fee Applies)</span>
									</div>
									<div className="flex justify-between font-semibold">
										<span>Total:</span>
										<span>{formatPrice(cartTotal)}</span>
									</div>
								</div>

								{cartItems.some((item) => !item.available) && (
									<Alert variant="destructive" className="mt-4">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											Some items in your cart are currently unavailable. Please
											remove them to proceed.
										</AlertDescription>
									</Alert>
								)}

								<div className="space-y-4">
									{isProfileLoading ? (
										<div className="space-y-4">
											<div className="h-12 bg-gray-100 animate-pulse rounded-md" />
											<div className="h-12 bg-gray-100 animate-pulse rounded-md" />
										</div>
									) : (
										<>
											<div className="space-y-2">
												<input
													type="email"
													placeholder="Email address"
													value={email}
													onChange={(e) => {
														setEmail(e.target.value);
														if (!validateEmail(e.target.value)) {
															setEmailError(
																"Please enter a valid email address"
															);
														} else {
															setEmailError("");
														}
													}}
													className={`w-full p-3 border rounded-md transition-colors ${
														emailError ? "border-red-500" : "border-gray-200"
													}`}
													disabled={userProfile?.userInfo?.email !== undefined}
													aria-invalid={Boolean(emailError)}
													aria-describedby={
														emailError ? "email-error" : undefined
													}
												/>
												{emailError && (
													<p id="email-error" className="text-red-500 text-sm">
														{emailError}
													</p>
												)}
											</div>

											{!userProfile?.userInfo?.streetAddress && (
												<Alert>
													<AlertCircle className="h-4 w-4" />
													<AlertDescription>
														Please complete your shipping information in your
														profile to proceed with checkout.
													</AlertDescription>
												</Alert>
											)}

											<div className="space-y-2">
												{cartItems.length > 0 && (
													<PaystackButtonWrapper
														{...paystackProps}
														className={`w-full py-3 rounded-md font-medium transition-all ${
															canCheckout
																? "bg-green-600 hover:bg-green-700 text-white"
																: "bg-gray-100 text-gray-400 cursor-not-allowed"
														}`}
														disabled={!canCheckout || isPaying}
													/>
												)}
												{isPaying && (
													<div className="flex items-center justify-center">
														<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600" />
													</div>
												)}
												{!canCheckout && cartItems.length > 0 && (
													<p className="text-sm text-gray-500 text-center">
														{!validateEmail(email)
															? "Please enter a valid email address"
															: !userProfile?.userInfo?.streetAddress
															? "Complete your shipping information to proceed"
															: cartItems.some((item) => !item.available)
															? "Remove unavailable items to proceed"
															: "Unable to proceed with checkout"}
													</p>
												)}
											</div>
										</>
									)}
								</div>

								<div className="text-xs text-gray-500 text-center mt-4">
									By completing your purchase, you agree to our{" "}
									<button
										onClick={() => window.open("/terms", "_blank")}
										className="text-primary hover:underline"
									>
										Terms of Service
									</button>{" "}
									and{" "}
									<button
										onClick={() => window.open("/privacy", "_blank")}
										className="text-primary hover:underline"
									>
										Privacy Policy
									</button>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

/* ===================== */
/*   Error Boundary      */
/* ===================== */

const CartSheetWithErrorBoundary: React.FC = () => {
	return (
		<ErrorBoundary
			FallbackComponent={({ error }) => (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						Something went wrong: {error.message}
					</AlertDescription>
				</Alert>
			)}
		>
			<CartSheet />
		</ErrorBoundary>
	);
};

export default CartSheetWithErrorBoundary;
