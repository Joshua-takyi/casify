import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { CartModel } from "@/models/schema";
import mongoose from "mongoose";
import { ConnectDb } from "@/libs/connect";

// The shape of a Product document (populated from the Product model)
interface PopulatedProduct {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    price: number;
    discount?: number;
    images: string[];
    stock: number;
    available: boolean;
    color?: string;
    model?: string;
}

// The shape of each item stored in the Cart (before processing)
// Note: Although the document stores a totalPrice, we'll recalculate it based on the
// latest product data.
interface CartItem {
    productId: PopulatedProduct; // After population, this field contains full product details.
    quantity: number;
    color?: string;
    model?: string;
    // totalPrice is stored in the document but is recalculated below.
}

// The Cart document interface
interface Cart {
    userId: string;
    products: CartItem[];
    updatedAt: Date;
}

export async function GET() {
    try {
        // Authenticate the user.
        const session = await auth();
        const userId = session?.user.id;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Ensure the database connection is established (common for serverless environments)
        if (mongoose.connection.readyState !== 1) {
            await ConnectDb();
        }

        // Retrieve the cart for the current user and populate product details.
        const cart = await CartModel.findOne({userId: userId })
            .populate<{ products: CartItem[] }>({
                path: "products.productId",
                select: "title slug price discount images stock available color model",
                model: "ProductModel", // Ensure this matches your registered Product model name
            })
            .lean() as (Cart & { products: CartItem[] }) | null;

        // If no cart is found, return an empty cart response.
        if (!cart) {
            return NextResponse.json(
                {
                    message: "Cart is empty",
                    data: { products: [], total: 0, updatedAt: new Date().toISOString() },
                },
                { status: 200 }
            );
        }

        // Process each cart item: recalculate the price (applying any discount) and total.
        const formattedProducts = cart.products
            .filter((item) => item.productId) // Exclude items whose products may have been deleted.
            .map((item) => {
                const product = item.productId;
                const discount = product.discount || 0;
                // Calculate the price after discount.
                const discountedPrice = product.price * (1 - discount / 100);

                return {
                    productId: product._id.toString(),
                    slug: product.slug,
                    name: product.title,
                    price: Number(discountedPrice.toFixed(2)),
                    originalPrice: product.price,
                    discount,
                    quantity: item.quantity,
                    // Use cart overrides for color or model if provided; otherwise fall back to the product.
                    color: item.color || product.color,
                    model: item.model || product.model,
                    totalPrice: Number((discountedPrice * item.quantity).toFixed(2)),
                    image: product.images[0] || "",
                    stock: product.stock,
                    available: product.available,
                };
            });

        // Calculate the overall cart total.
        const cartTotal = formattedProducts.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        return NextResponse.json(
            {
                data: {
                    products: formattedProducts,
                    total: Number(cartTotal.toFixed(2)),
                    updatedAt: cart.updatedAt,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Cart Error:", error);
        return NextResponse.json(
            {
                message: "Failed to retrieve cart",
                error:
                    process.env.NODE_ENV === "development" && error instanceof Error
                        ? error.message
                        : null,
            },
            { status: 500 }
        );
    }
}
