import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnectDb } from "@/libs/connect";
import { z } from "zod";
import { auth } from "@/auth";
import { ProductModel, CartModel } from "@/models/schema"; // Import both ProductModel and CartModel

// Zod schema for cart item validation
const cartSchema = z.object({
	productId: z.string().min(1),
	color: z.string().min(1, { message: "Color is required" }),
	quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
	model: z.string().min(1, { message: "Model is required" }),
});

export async function POST(req: Request) {
	try {
		// Ensure database connection
		if (mongoose.connection.readyState !== 1) {
			await ConnectDb();
		}

		// Extract and validate request body
		const body = await req.json();
		const validateBody = cartSchema.safeParse(body); // Use safeParse for better error handling

		// Handle Zod validation errors
		if (!validateBody.success) {
			const errors = validateBody.error.errors.map((err) => ({
				field: err.path.join("."), // Field name (e.g., "color", "quantity")
				message: err.message, // Error message (e.g., "Color is required")
			}));

			return NextResponse.json(
				{
					message: "Validation failed",
					errors, // Structured error messages
				},
				{ status: 400 }
			);
		}

		// Destructure validated data
		const { productId, quantity, model, color } = validateBody.data;

		// Validate user session
		const session = await auth();
		const accessToken = session?.user?.accessToken;
		const userId = session?.user?.id;

		if (!accessToken) {
			logger.warn("Unauthorized attempt to access cart", { userId });
			return NextResponse.json(
				{
					message: "Unauthorized - Please log in",
				},
				{ status: 403 }
			);
		}

		// Check if the product exists and is available
		const product = await ProductModel.findById(
			new mongoose.Types.ObjectId(productId)
		);

		if (!product) {
			logger.warn("Product not found", { productId });
			return NextResponse.json(
				{
					message: "Product not found",
				},
				{ status: 404 }
			);
		}

		if (!product.available) {
			logger.warn("Product is not available", { productId });
			return NextResponse.json(
				{
					message: "Product not available",
				},
				{ status: 400 }
			);
		}

		// Check if stock is sufficient
		if (product.stock < quantity) {
			logger.warn("Insufficient stock", {
				productId,
				requested: quantity,
				available: product.stock,
			});
			return NextResponse.json(
				{
					message: "We don't have enough stock",
				},
				{ status: 400 }
			);
		}

		// Price Calculation
		const totalPrice = Math.round(
			product.price * (1 - (product.discount || 0) / 100)
		);

		// Find or create the user's cart
		// 9. Cart Handling:  Find or create the user's cart
		const cart = await CartModel.findOneAndUpdate(
			{ userId: userId }, // Find the cart by user ID
			{}, // Update document
			{
				upsert: true, // Create a new cart if one doesn't exist
				new: true, // Return the updated cart
				setDefaultsOnInsert: true, // Apply schema defaults if a new cart is created
			}
		);
		// Check if the product is already in the cart
		const existingProductIndex = cart.products.findIndex(
			(item) =>
				item.productId.toString() === productId &&
				(!color || item.color === color) &&
				(!model || item.model === model)
		);

		if (existingProductIndex > -1) {
			// Update existing product quantity
			const newQuantity =
				cart.products[existingProductIndex].quantity + quantity;

			// Ensure the updated quantity doesn't exceed the available stock
			if (newQuantity > product.stock) {
				logger.warn(
					`New quantity for product ID ${productId} exceeds stock. Requested: ${newQuantity}, Available: ${product.stock}`
				);
				return NextResponse.json(
					{ message: "New quantity is greater than stock" },
					{ status: 400 }
				);
			}

			// Update cart item
			cart.products[existingProductIndex].quantity = newQuantity;
			cart.products[existingProductIndex].totalPrice = totalPrice * newQuantity;
		} else {
			// Add new product to cart
			cart.products.push({
				productId: new mongoose.Types.ObjectId(productId), // Ensure productId is of ObjectId type
				quantity: quantity,
				color,
				model,
				totalPrice: totalPrice * quantity,
			});
		}

		// Save cart changes
		cart.updatedAt = new Date();
		await cart.save();

		// Return success response
		return NextResponse.json(
			{
				message: "Item added to cart",
				data: {
					cartId: cart._id,
					totalItems: cart.products.length,
					updatedProduct: {
						item: product.title,
						price: totalPrice,
						quantity,
						color,
						model,
						image: product.images[0],
					},
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		// Handle errors
		logger.error("Error adding item to cart:", error);
		return NextResponse.json(
			{
				message: "Failed to add items to cart",
				error: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
