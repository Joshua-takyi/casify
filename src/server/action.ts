"use server";

import { auth, signIn, signOut } from "@/auth";
import { ProductPropsForDb } from "@/types/products";
import { SignInProps } from "@/types/user";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";

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

export async function handleSignOut() {
	await signOut();
	redirect("/");
}

export interface ApiResponse {
	success: boolean;
	data?: ProductPropsForDb;
	message?: string;
}

export async function AddProduct(
	data: ProductPropsForDb
): Promise<ApiResponse> {
	try {
		// Validate required fields BEFORE making the request
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

		// Handle unexpected status codes (let it drop to the catch block)
		throw new Error(`Unexpected status code: ${response.status}`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<{ message?: string }>;

			let errorMessage = "Failed to add product"; // Default error message

			// Prioritize error message from the backend, if available
			if (axiosError.response?.data?.message) {
				errorMessage = axiosError.response.data.message;
			} else if (axiosError.message) {
				errorMessage = axiosError.message;
			} else if (axiosError.code === "ECONNABORTED") {
				errorMessage = "Request timed out - please try again";
			}

			// Standardize error message based on status code (if needed)
			switch (axiosError.response?.status) {
				case 400:
					errorMessage = "Invalid product data provided";
					break;
				case 401:
					errorMessage = "Unauthorized - Please log in";
					break;
				// Add more cases as needed
			}

			return {
				success: false,
				message: errorMessage,
			};
		}

		// Handle non-Axios errors
		const errorMessage =
			error instanceof Error ? error.message : "An unexpected error occurred";
		return {
			success: false,
			message: errorMessage,
		};
	}
}

interface CatchAllSlugProps {
	slug: string;
	color?: string;
	model?: string;
}

export async function CatchAllSlug({
	slug = "",
	color = "",
	model = "",
}: CatchAllSlugProps) {
	try {
		const res = await axios.get(
			`${API_URL}/products/get-item/${slug}?color=${color}&model=${model}`
		);
		if (res.status === 200) {
			return {
				success: true,
				data: res.data.data,
				message: res.data.message,
			};
		}
		throw new Error(`Unexpected status code: ${res.status}`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<{ message?: string }>;
			let errorMessage = "Failed to fetch product"; // Updated message
			if (axiosError.response?.data?.message) {
				errorMessage = axiosError.response.data.message;
			}
			let statusCode = 500; // Default status code

			switch (axiosError.response?.status) {
				case 400:
					errorMessage = "Invalid request: Bad data provided"; // More specific message
					statusCode = 400;
					break;
				case 401:
					errorMessage = "Unauthorized: Please log in"; // More user-friendly message
					statusCode = 401;
					break;
				case 404:
					errorMessage = "Product not found"; // specific
					statusCode = 404;
					break;
				// You may add more cases based on API responses
			}

			return {
				success: false,
				message: errorMessage,
				statusCode: statusCode,
			};
		} else {
			// Handle non-Axios errors more generally
			console.error("Non-Axios error:", error);
			return {
				success: false,
				message: "An unexpected error occurred",
				statusCode: 500,
			};
		}
	}
}

export async function GetIsOnSale(limit: number) {
	try {
		const res = await axios.get(
			`${API_URL}/products/get-item?isOnSale=true&sortVy=price&limit=${limit}`
		);
		if (res.status === 200) {
			return {
				success: true,
				message: res.data.message,
				data: res.data.data,
			};
		}
		throw new Error("failed to get data");
	} catch (error) {
		if (error instanceof AxiosError) {
			const axiosError = error as AxiosError<{ message?: string }>;
			let errorMessage = "failed to get data";
			if (axiosError?.response?.data.message) {
				errorMessage = axiosError.message;
			}
			return {
				success: false,
				message: errorMessage,
			};
		}

		return {
			success: false,
			message: "data fetching failed",
		};
	}
}
// ... existing imports ...

// Add this interface near the top with other interfaces

export async function GetUserInfo() {
	try {
		const response = await axios.get(`${API_URL}/profile/get-info`);

		if (response.status === 200) {
			return {
				success: true,
				data: response.data,
				message: "User info fetched successfully",
			};
		}

		throw new Error(`Unexpected status code: ${response.status}`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<{ message?: string }>;
			let errorMessage = "Failed to fetch user info";

			if (axiosError.response?.data?.message) {
				errorMessage = axiosError.response.data.message;
			}

			return {
				success: false,
				message: errorMessage,
			};
		}

		return {
			success: false,
			message: "Failed to fetch user info",
		};
	}
}

export async function GetFeatured() {
	try {
		const res = await axios.get(`${API_URL}/products/get-item?featured=true`);
		if (res.status === 200) {
			return {
				success: true,
				message: "date fetched successfully",
				data: res.data.data,
			};
		}
		throw new Error("failed to get data)");
	} catch (error) {
		if (axios.AxiosError) {
			const axiosError = error as AxiosError<{ message?: string }>;
			let errorMessage = "failed to get data";
			if (axiosError.response?.data.message) {
				errorMessage = axiosError.response.data.message;
				return {
					success: false,
					message: errorMessage,
				};
			}
		}
		const errorMessage = "failed to get data";
		return {
			success: false,
			message: errorMessage,
		};
	}
}
export async function GetOrders() {
	try {
		// Get the session token if you're using one
		const session = await auth();

		const response = await axios.get(`${API_URL}/get-order`, {
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session?.user?.accessToken}`, // If you're using JWT
				// Or whatever auth header your API expects
			},
		});
		return response.data.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Failed to retrieve orders"
			);
		}
		throw new Error("Unable to retrieve orders");
	}
}

interface GetByProps {
	category: string;
	limit: number;
	tags?: string;
}
export async function GetBy({ category, limit, tags = "" }: GetByProps) {
	try {
		const res = await axios.get(`${API_URL}/products/get-item`, {
			params: { category, limit, tags },
		});

		if (res.status === 200) {
			return {
				success: true,
				message: "Data fetched successfully",
				data: res.data.data,
			};
		}

		throw new Error("Failed to get data");
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return {
				success: false,
				message: error.response?.data.message || "Failed to get data",
			};
		}

		return {
			success: false,
			message: "Failed to get data",
		};
	}
}

export async function GetSimilarProducts({ slug }: { slug: string }) {
	if (!slug || slug === "undefined") {
		console.error("GetSimilarProducts called with invalid slug:", slug);
		return {
			success: false,
			message: "Slug is required",
			data: [],
		};
	}

	try {
		// Ensure the slug is properly encoded for the URL
		const encodedSlug = encodeURIComponent(slug);
		console.log(`Encoded slug: ${encodedSlug}`);

		const url = `${API_URL}/products/get-similar-items/${encodedSlug}`;
		console.log(`Making request to: ${url}`);

		const res = await axios.get(url);

		// Check if the response has the expected structure
		if (res.data && res.data.data) {
			return {
				success: true,
				data: res.data.data,
				message: "Data fetched successfully",
			};
		}

		return {
			success: true,
			data: res.data || [], // Fallback to empty array if no data
			message: "Data fetched successfully",
		};
	} catch (error) {
		console.error("Error in GetSimilarProducts:", error);
		if (axios.isAxiosError(error)) {
			return {
				success: false,
				message: error.response?.data?.message || "Failed to get data",
				data: [],
			};
		}
		return {
			success: false,
			message: "Unknown error occurred",
			data: [],
		};
	}
}
