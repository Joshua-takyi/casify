import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {ConnectDb} from "@/libs/connect";
import {auth} from "@/auth";
import {CartModel, ProductModel} from "@/models/schema";

export async function  PATCH(req:Request){
    const {productId,color,model,quantity,action}= await req.json()
    try {
        if (!productId || !quantity || !action) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const session = await auth()
        const accessToken = session?.user?.accessToken;
        const userId=session?.user?.id;

        if(!accessToken){
            return NextResponse.json({
                message:"user isn't authorized to access",
            },{status:403})
        }
        if (!userId) {
            return NextResponse.json(
                { message: "User ID not found" },
                { status: 401 }
            );
        }

        if(mongoose.connection.readyState !== 1){
            await ConnectDb()
        }

        // Fetch the product to get current price
        const productDetails = await ProductModel.findById(productId)
            .select("price discount")
            .lean();
        if (!productDetails) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }
        // Calculate price with discount
        const calculatedPrice =
            Math.round(productDetails.price * (1 - (productDetails.discount || 0) / 100))

        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }

        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                (!color || item.color === color) &&
                (!model || item.model === model)
        );
        if (productIndex === -1) {
            return NextResponse.json(
                { message: "Product not found in cart" },
                { status: 404 }
            );
        }
        if (quantity <= 0) {
            return NextResponse.json(
                { message: "Quantity must be a positive number" },
                { status: 400 }
            );
        }

        // Update the quantity based on the action
        const product = cart.products[productIndex];
        if (action === "increment") {
            product.quantity += quantity;
        } else if (action === "decrement") {
            product.quantity -= quantity;
        }
        // Update total price using the calculated price
        product.totalPrice = calculatedPrice * product.quantity;
        await cart.save();
        return NextResponse.json({
            message: `Product quantity ${action}ed successfully`,
            data: {
                cartId: cart._id,
                totalItems: cart.products.length,
                updatedProduct: {
                    productId: product.productId,
                    color: product.color,
                    model: product.model,
                    quantity: product.quantity,
                    totalPrice: product.totalPrice,
                },
            },
        });
    }catch (error){
        return NextResponse.json({
            message:"failed update cart.",
            error:error instanceof Error ? error.message : error
        },{status:500})
    }
}