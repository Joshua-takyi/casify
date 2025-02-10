"use server";

import { signIn } from "@/auth";
import { ProductProps } from "@/types/products";
import { SignInProps } from "@/types/user";
import axios, { AxiosError } from "axios";

interface SignUpData {
	name: string;
	email: string;
	password: string;
}

const API_URL = process.env.API_URL;

export async function SignUpAction(data: SignUpData) {
	try {
		// Ensure that API_URL is defined in your environment variables
		if (!API_URL) {
			console.error("API_URL is not defined in environment variables.");
			return {
				success: false,
				error: "API endpoint configuration error.",
			};
		}

		const response = await axios.post(`${API_URL}/auth/sign-up`, data);

		if (response.status >= 200 && response.status < 300) {
			return {
				success: true,
				data: response.data,
				message: "Signup successful!",
			};
		} else {
			console.error(
				"SignUpAction error: Non-successful HTTP status code",
				response.status,
				response.data
			);
			return {
				success: false,
				error: `Signup failed with status code: ${response.status}`,
				details: response.data,
			};
		}
	} catch (error) {
		console.error("SignUpAction error:", error);

		if (error instanceof AxiosError) {
			const axiosError = error;
			let errorMessage =
				"Signup failed due to a network error or server issue.";

			if (axiosError.response) {
				console.error(
					"Server responded with error:",
					axiosError.response.status,
					axiosError.response.data
				);
				errorMessage = `Signup failed: Server responded with status ${axiosError.response.status}`;
				return {
					success: false,
					error: errorMessage,
					details: axiosError.response.data,
				};
			} else if (axiosError.request) {
				console.error("No response received from server:", axiosError.request);
				errorMessage =
					"Signup failed: No response from server. Please check your network.";
			} else {
				console.error("Error setting up the request:", axiosError.message);
				errorMessage = `Signup failed: Error setting up the request. ${axiosError.message}`;
			}

			return {
				success: false,
				error: errorMessage,
				details: axiosError.message,
			};
		} else {
			return {
				success: false,
				error: "An unexpected error occurred during signup.",
				details: error instanceof Error ? error.message : String(error),
			};
		}
	}
}

export async function SignInAction(data: SignInProps) {
	try {
		const { email, password } = data;
		if (!email || !password) {
			console.error("Email and password are required for sign in."); // More specific error message
			return {
				success: false,
				error: "Email and password are required.", // User-friendly error
			};
		}

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
			// callbackUrl: "/", // You might want to handle callbackUrl differently
		});

		if (result?.error) {
			// signIn returns an object with an error property on failure when redirect: false
			console.error("SignInAction failed:", result.error);
			return {
				success: false,
				error: "Invalid credentials or sign-in error.", // More generic error for security
				details: result.error, // You can pass the specific error for debugging if needed
			};
		}

		if (!result) {
			// signIn might return undefined on success with redirect: false (though less common)
			return {
				success: true, // Assuming undefined means successful sign-in in this context
				message: "Sign-in successful!",
			};
		}

		// If result is not undefined and does not have error, it might be a success (check next-auth docs)
		return {
			success: true,
			message: "Sign-in successful!",
		};
	} catch (error) {
		console.error("SignInAction error:", error);
		const errorMessage = "An unexpected error occurred during sign-in.";

		return {
			success: false,
			error: errorMessage,
		};
	}
}

export interface ApiResponse {
	success: boolean;
	data?: ProductProps;
	message?: string;
}

export async function AddProduct(data: ProductProps): Promise<ApiResponse> {
	try {
		// Validate required fields before making the request
		if (!data.title || !data.description || data.price === undefined) {
			throw new Error("Missing required fields");
		}

		const response = await axios.post<ApiResponse>(
			`${API_URL}/products/add-item`,
			data,
			{
				headers: {
					"Content-Type": "application/json",
					// Add any authentication headers if needed
					// Authorization: `Bearer ${token}`
				},
			}
		);

		// Check for successful response
		if (response.status === 201) {
			return {
				success: true,
				data: response.data.data,
				message: "Product added successfully",
			};
		}

		// Handle unexpected status codes
		throw new Error(`Unexpected status code: ${response.status}`);
	} catch (error) {
		// Handle Axios errors
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<{ message: string }>;

			// Handle specific error status codes
			if (axiosError.response?.status === 400) {
				return {
					success: false,
					message: "Invalid product data provided",
				};
			}

			if (axiosError.response?.status === 401) {
				return {
					success: false,
					message: "Unauthorized - Please log in",
				};
			}

			// Handle server error message if available
			if (axiosError.response?.data?.message) {
				return {
					success: false,
					message: axiosError.response.data.message,
				};
			}

			// Handle network errors
			if (axiosError.code === "ECONNABORTED") {
				return {
					success: false,
					message: "Request timed out - please try again",
				};
			}

			return {
				success: false,
				message: axiosError.message || "Failed to add product",
			};
		}

		// Handle unknown errors
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "An unexpected error occurred",
		};
	}
}
