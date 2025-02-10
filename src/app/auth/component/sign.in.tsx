"use client";

import { SignInAction } from "@/server/action";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "@/components/input";

interface SignInFormData {
	email: string;
	password: string;
}

interface SignInResponse {
	success: boolean;
	error?: string;
}

export default function SignIn() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<SignInFormData>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [serverError, setServerError] = useState<string>("");

	const onSubmit = async (data: SignInFormData) => {
		setServerError("");

		try {
			const response = (await SignInAction(data)) as SignInResponse;

			if (response?.success) {
				toast.success("Welcome back! You've successfully signed in.");
				reset();
				router.push("/");
			} else {
				// Handle specific error cases
				const errorMessage = response?.error?.toLowerCase() || "";

				if (errorMessage.includes("password")) {
					setServerError(
						"The password you entered is incorrect. Please try again."
					);
				} else if (errorMessage.includes("email")) {
					setServerError(
						"We couldn't find an account with that email address."
					);
				} else if (errorMessage.includes("many attempts")) {
					setServerError(
						"Too many sign-in attempts. Please try again in a few minutes."
					);
				} else if (errorMessage.includes("verify")) {
					setServerError("Please verify your email address before signing in.");
				} else {
					setServerError(
						"Unable to sign in. Please check your credentials and try again."
					);
				}
			}
		} catch (err) {
			console.error("Sign-in error:", err);
			toast.error(
				"We're having trouble connecting to our servers. Please try again later."
			);
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-linear-to-b from-gray-50 to-gray-100 px-4">
			<div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all">
				<h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
					Welcome Back
				</h2>

				{serverError && (
					<div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-500 border border-red-200">
						<p className="flex items-center gap-2">
							<span className="font-medium">Error:</span> {serverError}
						</p>
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<FormInput
						type="email"
						label="Email address"
						register={register("email", {
							required: "Please enter your email address",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Please enter a valid email address",
							},
						})}
						error={errors.email?.message}
					/>

					<FormInput
						type="password"
						label="Password"
						register={register("password", {
							required: "Please enter your password",
							minLength: {
								value: 8,
								message: "Password must be at least 8 characters long",
							},
							validate: {
								containsNumber: (value) =>
									/\d/.test(value) ||
									"Password must contain at least one number",
								containsUppercase: (value) =>
									/[A-Z]/.test(value) ||
									"Password must contain at least one uppercase letter",
							},
						})}
						error={errors.password?.message}
					/>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="remember"
								className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<label
								htmlFor="remember"
								className="ml-2 block text-sm text-gray-700"
							>
								Remember me
							</label>
						</div>
						<a
							href="/auth/forgot-password"
							className="text-sm font-medium text-blue-600 hover:text-blue-500"
						>
							Forgot password?
						</a>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSubmitting ? (
							<span className="flex items-center justify-center gap-2">
								Signing in...
							</span>
						) : (
							"Sign in"
						)}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-gray-500">
					Don&apos;t have an account?{" "}
					<a
						href="/auth/sign-up"
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						Create an account
					</a>
				</p>
			</div>
		</main>
	);
}
