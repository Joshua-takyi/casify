"use client";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCartIcon, CheckCircleIcon } from "lucide-react";

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
    const queryClient = useQueryClient(); // Get the query client

    const { mutate, isPending, reset } = useMutation({
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
            toast.success("Added to cart", { duration: 2000 });
            reset();
            // Instead of router.refresh(), invalidate the "cartData" query so it refetches
            queryClient.invalidateQueries(["cartData"]);
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

    // Complex button animations
    const buttonVariants = {
        initial: { scale: 1, backgroundColor: "rgb(17, 24, 39)" },
        hover: {
            scale: 1.02,
            backgroundColor: "rgb(31, 41, 55)",
            transition: {
                scale: {
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                }
            }
        },
        tap: { scale: 0.95 },
        disabled: {
            scale: 1,
            backgroundColor: "rgb(156, 163, 175)",
            cursor: "not-allowed"
        }
    };

    // Text slide animation
    const textVariants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 }
    };

    // Cart icon animations
    const iconVariants = {
        initial: { rotate: 0 },
        animate: { rotate: 360 },
        hover: {
            scale: 1.2,
            rotate: 15,
            transition: {
                scale: {
                    type: "spring",
                    stiffness: 500
                },
                rotate: {
                    duration: 0.5,
                    ease: "easeInOut"
                }
            }
        }
    };

    // Success animation
    const successVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 10
            }
        }
    };

    // Particle effect for success
    const particles = Array.from({ length: 12 }).map((_, i) => ({
        initial: { x: 0, y: 0, opacity: 0 },
        animate: {
            x: Math.cos(i * 30 * (Math.PI / 180)) * 50,
            y: Math.sin(i * 30 * (Math.PI / 180)) * 50,
            opacity: [0, 1, 0],
            transition: {
                duration: 0.8,
                ease: "easeOut",
                times: [0, 0.2, 1]
            }
        }
    }));

    return (
        <div className="relative">
            <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={isPending ? "disabled" : "initial"}
                className={`
                    w-full py-4 px-6 rounded-lg
                    text-white font-medium
                    overflow-hidden relative
                    flex items-center justify-center gap-2
                `}
                onClick={handleAddToCart}
                disabled={isPending || !selectedColor || !selectedModel}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isPending ? "pending" : "default"}
                        className="flex items-center gap-2"
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <motion.div
                            variants={iconVariants}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                        >
                            {isPending ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <ShoppingCartIcon className="w-5 h-5" />
                                </motion.div>
                            ) : (
                                <ShoppingCartIcon className="w-5 h-5" />
                            )}
                        </motion.div>
                        {isPending ? "Adding to Cart..." : "Add to Cart"}
                    </motion.div>
                </AnimatePresence>

                {/* Success animation overlay */}
                <AnimatePresence>
                    {isPending && (
                        <motion.div
                            className="absolute inset-0 bg-green-500"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            exit={{ scaleX: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    )}
                </AnimatePresence>

                {/* Particle effects */}
                {particles.map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                        variants={particle}
                        initial="initial"
                        animate={isPending ? "animate" : "initial"}
                    />
                ))}

                {/* Success checkmark */}
                <AnimatePresence>
                    {isPending && (
                        <motion.div
                            className="absolute"
                            variants={successVariants}
                            initial="initial"
                            animate="animate"
                            exit={{ scale: 0, transition: { duration: 0.2 } }}
                        >
                            <CheckCircleIcon className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default AddToCartButton;