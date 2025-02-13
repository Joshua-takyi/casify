import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CartModel } from "@/models/schema";
import mongoose from "mongoose";
import { ConnectDb } from "@/libs/connect";

/**
 * DELETE handler for removing a product from the cart.
 * Only accessible for authenticated users and where the userId matches the cartId.
 */
export async function DELETE(req: Request) {
    const { productId, color, model } = await req.json();

    try {
        // 1. Validate productId.
        if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
            return NextResponse.json(
                { message: "Invalid productId" },
                { status: 400 }
            );
        }

        // 2. Authenticate the user.
        const session = await auth();
        const accessToken = session?.user?.accessToken;
        const userId = session?.user?.id;

        if (!accessToken) {
            return NextResponse.json(
                { message: "Access denied" },
                { status: 401 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // 3. Ensure the database connection is established.
        if (mongoose.connection.readyState !== 1) {
            await ConnectDb();
        }

        // 4. Retrieve the cart for the current user.
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }

        // 5. Find the index of the product to remove based on productId, color, and model.
        const productIndex = cart.products.findIndex(
            (product) =>
                product.productId.toString() === productId &&
                product.color === color &&
                product.model === model
        );

        if (productIndex === -1) {
            return NextResponse.json(
                { message: "Product not found in cart" },
                { status: 404 }
            );
        }

        // 6. Remove the product from the cart.
        cart.products.splice(productIndex, 1);

        // 7. Save the updated cart.
        await cart.save();

        return NextResponse.json(
            { message: "Product removed successfully", data: cart },
            { status: 200 }
        );
    } catch (error) {
        console.error("Cart DELETE error:", error);
        return NextResponse.json(
            {
                message: "Failed to delete product",
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
