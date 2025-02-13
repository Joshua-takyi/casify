"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    X,
    Plus,
    Minus,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Define the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to format a number as Ghanaian Cedi currency
const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
    }).format(amount);
};

// Dynamically import PaystackButton to ensure it only runs client-side
const PaystackButtonWrapper = dynamic(
    () => import("react-paystack").then((mod) => mod.PaystackButton),
    { ssr: false }
);

// -------------------------------------------------------------------
// Type Definitions
// -------------------------------------------------------------------

// Represents an individual product item in the cart
export interface CartProduct {
    productId: string; // Assuming productId is stored as string after population
    slug: string;
    name: string;
    price: number;
    originalPrice: number;
    discount?: number;
    quantity: number;
    color: string;
    model: string;
    totalPrice: number;
    image: string;
    stock: number;
    available: boolean;
}

// Represents the cart data returned from the API
interface CartData {
    products: CartProduct[];
    total: number;
    updatedAt: string; // ISO string
}

// Represents the API response for getting the cart
interface CartResponse {
    data: CartData;
    message?: string;
}

// Variables used for updating the cart
interface UpdateCartVars {
    productId: string;
    color: string;
    model: string;
    action: "increase" | "decrease" | "remove";
}

// Type for previous data snapshot during mutation
// type PreviousCartData = CartResponse | undefined;

// Props for the Paystack button wrapper
interface PaystackProps {
    email: string;
    currency: string;
    amount: number;
    publicKey: string;
    text: string;
    onSuccess: (data: any) => void;
    onClose: () => void;
}

// Props for a single cart item component
interface CartItemProps {
    item: CartProduct;
}

// -------------------------------------------------------------------
// CartSheet Component
// -------------------------------------------------------------------
const CartSheet: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const [isPaying, setIsPaying] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [isClient, setIsClient] = useState<boolean>(false); // Client-side check

    // Determine if we are running on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Lock body scroll when cart is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Fetch cart data
    const {
        data,
        isLoading,
        error,
        isFetching,
        refetch,
    } = useQuery<CartResponse>({
        queryKey: ["cartData"],
        queryFn: async () => {
            try {
                const res = await axios.get(`${API_URL}/cart/get-cart`);
                if (res.status !== 200) {
                    throw new Error(`Failed to fetch cart (Status ${res.status})`);
                }
                return res.data;
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Failed to fetch cart";
                throw new Error(errorMessage);
            }
        },
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Mutation for updating cart (increase, decrease, remove)
    const updateQuantityMutation = useMutation({
        mutationFn: async ({
                               productId,
                               color,
                               model,
                               action,
                           }: UpdateCartVars) => {
            try {
                let res;
                if (action === "remove") {
                    res = await axios.delete(`${API_URL}/cart/delete-cart`, {
                        data: { productId, color, model },
                    });
                } else {
                    res = await axios.patch(`${API_URL}/cart/update-cart`, {
                        productId,
                        color,
                        model,
                        quantity: 1,
                        action: action === "increase" ? "increment" : "decrement",
                    });
                }
                if (res.status !== 200) {
                    throw new Error(`Failed to update cart (Status ${res.status})`);
                }
                return res.data;
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Failed to update cart";
                throw new Error(errorMessage);
            }
        },
        onMutate: async ({ productId, action, color, model }: UpdateCartVars) => {
            await queryClient.cancelQueries({ queryKey: ["cartData"] });
            const previousData = queryClient.getQueryData<CartResponse>(["cartData"]);
            queryClient.setQueryData<CartResponse>(["cartData"], (old) => {
                if (!old) return old;
                const newData = JSON.parse(JSON.stringify(old)) as CartResponse;
                const products = newData.data.products;
                const productIndex = products.findIndex(
                    (p) =>
                        p.productId === productId &&
                        p.color === color &&
                        p.model === model
                );

                if (productIndex > -1) {
                    if (action === "remove") {
                        products.splice(productIndex, 1);
                    } else {
                        const delta = action === "increase" ? 1 : -1;
                        products[productIndex].quantity += delta;
                        products[productIndex].totalPrice =
                            products[productIndex].price *
                            products[productIndex].quantity;
                    }
                    newData.data.total = products.reduce(
                        (sum, p) => sum + p.totalPrice,
                        0
                    );
                }
                return newData;
            });
            return { previousData };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(["cartData"], context?.previousData);
            toast.error("Failed to update cart. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cartData"] });
        },
    });

    // Derived values from cart data
    const cartItems: CartProduct[] = data?.data?.products || [];
    const cartTotal: number = data?.data?.total || 0;
    const itemCount: number = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    // Handler for quantity changes
    const handleQuantityChange = (
        productId: string,
        action: "increase" | "decrease" | "remove",
        color: string,
        model: string
    ) => {
        updateQuantityMutation.mutate({ productId, action, color, model });
    };

    // Clear the entire cart
    const clearCart = useCallback(async () => {
        try {
            const response = await axios.post(`${API_URL}/cart/clear-cart`);
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

    // Handler for Paystack success
    const handlePaystackSuccess = useCallback(
        async (data: { reference: string }) => {
            setIsPaying(false);
            toast.success("Payment successful!");
            try {
                const verificationResponse = await axios.post(
                    `${API_URL}/verify-payment`,
                    { reference: data.reference }
                );
                if (verificationResponse.data.status !== "success") {
                    toast.error("Payment verification failed. Please contact support.",{
                        richColors: false,
                        duration: 1000,
                    });
                    return;
                }
                await clearCart();
                setIsOpen(false);
            } catch (error) {
                toast.error(
                    `Failed to clear cart after successful payment: ${error instanceof Error ? error.message : String(error)},`,{
                        richColors: false,
                        duration: 1000,
                    }
                );
                console.error("Error during handlePaystackSuccess:", error);
            }
        },
        [clearCart]
    );

    const handlePaystackClose = () => {
        setIsPaying(false);
        toast.error("Payment cancelled.");
    };

    // Paystack props for the dynamic button
    const paystackProps: PaystackProps = {
        email: email,
        currency: "GHS",
        amount: cartTotal * 100,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        text: "Pay with Paystack",
        onSuccess: handlePaystackSuccess,
        onClose: handlePaystackClose,
    };

    // -------------------------------------------------------------------
    // Cart Item Component
    // -------------------------------------------------------------------
    const CartItem: React.FC<CartItemProps> = ({ item }) => (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
            <div className="flex-shrink-0">
                <img
                    src={item.image}
                    width={50}
                    height={50}
                    alt={item.name}
                    className="rounded-md object-cover"
                />
            </div>

            <div className="flex-grow min-w-0">
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                <div className="text-xs text-gray-500 space-x-2">
                    <span>{item.color}</span>
                    <span>•</span>
                    <span>{item.model}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                    <button
                        onClick={() =>
                            handleQuantityChange(item.productId, "decrease", item.color, item.model)
                        }
                        className="p-1 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="w-3 h-3" />
                    </button>

                    <motion.span
                        key={item.quantity}
                        initial={{ opacity: 0.6, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-6 text-center text-sm font-medium"
                    >
                        {item.quantity}
                    </motion.span>

                    <button
                        onClick={() =>
                            handleQuantityChange(item.productId, "increase", item.color, item.model)
                        }
                        className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <motion.span
                    key={item.totalPrice}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    className="font-medium text-sm min-w-[80px] text-right"
                >
                    {formatPrice(item.totalPrice)}
                </motion.span>

                <button
                    onClick={() =>
                        handleQuantityChange(item.productId, "remove", item.color, item.model)
                    }
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    // -------------------------------------------------------------------
    // Render Cart Items
    // -------------------------------------------------------------------
    const renderCartItems = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-8">
                    <p className="text-red-500">Error: {(error as Error).message}</p>
                </div>
            );
        }

        if (cartItems.length === 0) {
            return (
                <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add items to start shopping</p>
                </div>
            );
        }

        return (
            <motion.div layout className="space-y-3">
                {cartItems.map((item) => (
                    <motion.div
                        layout
                        key={`${item.productId}-${item.color}-${item.model}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CartItem item={item} />
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    // -------------------------------------------------------------------
    // Render Component
    // -------------------------------------------------------------------
    return (
        <>
            <div className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative group"
                    onClick={() => setIsOpen(true)}
                    disabled={isFetching}
                >
                    <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
                    <AnimatePresence mode="wait">
                        {itemCount > 0 && (
                            <motion.div
                                key="badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                {itemCount}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[32rem] bg-gray-50 shadow-2xl z-50 flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 border-b bg-white">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="w-5 h-5 text-primary" />
                                    <h2 className="font-semibold text-lg">
                                        Shopping Cart ({itemCount})
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {renderCartItems()}
                            </div>

                            <div className="border-t bg-white p-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <motion.span
                                            key={cartTotal}
                                            initial={{ opacity: 0.6 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {formatPrice(cartTotal)}
                                        </motion.span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Delivery</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <motion.span
                                            key={cartTotal}
                                            initial={{ opacity: 0.6 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {formatPrice(cartTotal)}
                                        </motion.span>
                                    </div>
                                </div>
                                {isClient && (
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                )}
                                {isClient &&
                                    (process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY && email ? (
                                        <PaystackButtonWrapper
                                            {...paystackProps}
                                            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            disabled={isPaying}
                                        />
                                    ) : (
                                        <Button disabled={!email} className="w-full">
                                            {process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
                                                ? "Enter Email to Pay"
                                                : "Paystack Key Not Configured"}
                                        </Button>
                                    ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default CartSheet;
