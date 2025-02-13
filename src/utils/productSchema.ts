// src/lib/schemas.ts
import { z } from "zod";

export const productSchema = z.object({
    title: z.string().min(4, { message: "Title must be at least 4 characters long" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
    price: z.number().nonnegative({ message: "Price must be a non-negative number" }),
    discount: z.number().optional().default(0),
    category: z.array(z.string()),
    details: z.array(z.string()),
    features: z.array(z.string()),
    stock: z.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
    isOnSale: z.boolean().default(false).optional(),
    tags: z.array(z.string()),
    models: z.array(z.string()),
    images: z.array(z.string()),
    isBestSeller: z.boolean().default(false).optional(),
    isNewItem: z.boolean().default(false).optional(),
    salesStartAt: z
        .string()
        .optional()
        .nullable()
        .refine(
            (val) => {
                if (!val) return true; // Allow null/undefined
                try {
                    new Date(val);
                    return true;
                } catch {
                    return false; // Return false if date parsing fails
                }
            },
            {
                message: "Invalid sales start date format (ISO 8601 required)",
            }
        )
        .transform((val) => (val ? new Date(val) : null)), // Parse to Date,
    salesEndAt: z
        .string()
        .optional()
        .nullable()
        .refine(
            (val) => {
                if (!val) return true; // Allow null/undefined
                try {
                    new Date(val);
                    return true;
                } catch {
                    return false; // Return false if date parsing fails
                }
            },
            {
                message: "Invalid sales end date format (ISO 8601 required)",
            }
        )
        .transform((val) => (val ? new Date(val) : null)), // Parse to Date,
    rating: z.number().min(0, { message: "Rating must be at least 0" }).max(5, { message: "Rating cannot exceed 5" }).optional(),
    reviews: z.array(z.string()).optional(),
    materials: z.array(z.string()),
    colors: z.array(z.string()),
    comments: z.array(z.string()).optional(),
});