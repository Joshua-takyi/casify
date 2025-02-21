"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { SignInAction } from "@/server/action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { localCartStorage, mergeCartsOnServer } from "@/utils/cartStorage";

const SignIn = () => {
	const router = useRouter();
	const [serverError, setServerError] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	interface SignInFormData {
		email: string;
		password: string;
	}

	interface SignInResponse {
		success?: boolean;
		error?: string;
	}

	const onSubmit = async (data: SignInFormData) => {
		setServerError("");
		try {
			const response: SignInResponse = await SignInAction(data);
			if (response?.success) {
				// Check if user came from checkout
				const checkoutRedirect = sessionStorage.getItem("checkoutRedirect");
				sessionStorage.removeItem("checkoutRedirect");

				if (checkoutRedirect) {
					// Merge local cart with server cart
					const localCart = localCartStorage.getCart();
					if (localCart.length > 0) {
						// Implement server-side cart merge
						await mergeCartsOnServer(localCart);
						localCartStorage.clearCart();
					}
					router.push("/cart");
				} else {
					router.push("/");
				}

				toast.success("Welcome back!");
				reset();
			}
			if (response?.success) {
				toast.success("Welcome back! You've successfully signed in.");
				reset();
				router.push("/");
			} else {
				const errorMessage = response?.error?.toLowerCase() || "";
				if (errorMessage.includes("password")) {
					setServerError(
						"The password you entered is incorrect. Please try again."
					);
				} else if (errorMessage.includes("email")) {
					setServerError(
						"We couldn't find an account with that email address."
					);
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
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full max-w-md"
			>
				<div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="space-y-6"
					>
						<div className="text-center space-y-2">
							<h2 className="text-2xl font-semibold text-gray-900">
								Welcome back
							</h2>
							<p className="text-gray-500 text-sm">
								Please enter your details to sign in
							</p>
						</div>

						{serverError && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600"
							>
								{serverError}
							</motion.div>
						)}

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Email address
									</label>
									<input
										type="email"
										{...register("email", {
											required: "Please enter your email address",
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: "Please enter a valid email address",
											},
										})}
										className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
										placeholder="Enter your email"
									/>
									{errors.email && (
										<p className="mt-1.5 text-sm text-red-600">
											{errors.email.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Password
									</label>
									<input
										type="password"
										{...register("password", {
											required: "Please enter your password",
											minLength: {
												value: 8,
												message: "Password must be at least 8 characters long",
											},
										})}
										className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
										placeholder="Enter your password"
									/>
									{errors.password && (
										<p className="mt-1.5 text-sm text-red-600">
											{errors.password.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										type="checkbox"
										id="remember"
										className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<label
										htmlFor="remember"
										className="ml-2 text-sm text-gray-600"
									>
										Remember me
									</label>
								</div>
								<Link
									href="#"
									className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
								>
									Forgot password?
								</Link>
							</div>

							<motion.button
								type="submit"
								disabled={isSubmitting}
								whileTap={{ scale: 0.98 }}
								className="w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{isSubmitting ? (
									<span className="flex items-center justify-center gap-2">
										<motion.span
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: "linear",
											}}
											className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"
										/>
										Signing in...
									</span>
								) : (
									"Sign in"
								)}
							</motion.button>
						</form>

						<p className="text-center text-sm text-gray-500">
							Don&apos;t have an account?{" "}
							<Link
								href="/auth/sign-up"
								className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
							>
								Create an account
							</Link>
						</p>
					</motion.div>
				</div>
			</motion.div>
		</main>
	);
};

export default SignIn;
