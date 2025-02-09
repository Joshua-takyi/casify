import { z } from "zod";

/**
 * Reusable function that validates the provided data using the given Zod schema.
 * @param data - The data to validate.
 * @param schema - A Zod schema describing the expected data shape.
 * @returns An object containing a `valid` flag, and either the parsed `data` or an array of `errors`.
 */
export const validateData = <T>(
	data: unknown,
	schema: z.ZodSchema<T>
): { valid: boolean; data?: T; errors?: string[] } => {
	const result = schema.safeParse(data);
	if (!result.success) {
		// Map each error into a string message.
		const errors = result.error.errors.map(
			(err) => `${err.path.join(".") || "data"}: ${err.message}`
		);
		return { valid: false, errors };
	}
	return { valid: true, data: result.data };
};
