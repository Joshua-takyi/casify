"use client";
import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SignUpAction } from "@/server/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Schema = z.object({
	name: z.string().min(5, { message: "Name must be at least 5 characters" }),
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.refine((value) => /[A-Z]/.test(value), {
			message: "Password must contain at least one uppercase letter",
		})
		.refine((value) => /[a-z]/.test(value), {
			message: "Password must contain at least one lowercase letter",
		})
		.refine((value) => /[0-9]/.test(value), {
			message: "Password must contain at least one number",
		}),
});

type FormValues = z.infer<typeof Schema>;

const SignUp = () => {
	const router = useRouter();
	const {
		handleSubmit,
		register,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(Schema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const password = watch("password", "");

	const passwordRequirements = React.useMemo(
		() => [
			{ text: "At least 8 characters", met: password.length >= 8 },
			{ text: "One uppercase letter", met: /[A-Z]/.test(password) },
			{ text: "One lowercase letter", met: /[a-z]/.test(password) },
			{ text: "One number", met: /[0-9]/.test(password) },
		],
		[password]
	);

	const { mutate, isPending } = useMutation({
		mutationKey: ["signup"],
		mutationFn: async (data: FormValues) => {
			const res = await SignUpAction(data);
			if (!res.success) {
				throw new Error(res.message || "Signup failed");
			}
			return res.data;
		},
		onSuccess: () => {
			toast.success("Account created successfully!");
			reset();
			router.push("/auth/sign-in");
		},
		onError: (error: Error) => {
			toast.error(error instanceof Error ? error.message : String(error));
		},
	});

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
								Create an account
							</h2>
							<p className="text-gray-500 text-sm">
								Enter your details to get started
							</p>
						</div>

						<form
							onSubmit={handleSubmit((data) => mutate(data))}
							className="space-y-4"
						>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Full name
									</label>
									<input
										type="text"
										{...register("name")}
										className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
										placeholder="Enter your full name"
									/>
									{errors.name && (
										<p className="mt-1.5 text-sm text-red-600">
											{errors.name.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Email address
									</label>
									<input
										type="email"
										{...register("email")}
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
										{...register("password")}
										className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
										placeholder="Create a password"
									/>
									{errors.password && (
										<p className="mt-1.5 text-sm text-red-600">
											{errors.password.message}
										</p>
									)}
								</div>
							</div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="p-4 rounded-lg bg-gray-50 border border-gray-100"
							>
								<h3 className="text-sm font-medium text-gray-700 mb-2">
									Password requirements
								</h3>
								<div className="space-y-2">
									{passwordRequirements.map((req, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.1 * index }}
											className="flex items-center gap-2"
										>
											<motion.span
												animate={{ scale: req.met ? [1, 1.2, 1] : 1 }}
												transition={{ duration: 0.2 }}
												className={`flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${
													req.met ? "text-green-500" : "text-gray-300"
												}`}
											>
												{req.met ? "✓" : "○"}
											</motion.span>
											<span
												className={`text-sm ${
													req.met ? "text-gray-700" : "text-gray-500"
												}`}
											>
												{req.text}
											</span>
										</motion.div>
									))}
								</div>
							</motion.div>

							<motion.button
								type="submit"
								disabled={isSubmitting || isPending}
								whileTap={{ scale: 0.98 }}
								className="w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{isSubmitting || isPending ? (
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
										Creating account...
									</span>
								) : (
									"Create account"
								)}
							</motion.button>
						</form>

						<p className="text-center text-sm text-gray-500">
							Already have an account?{" "}
							<Link
								href="/auth/sign-in"
								className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
							>
								Sign in
							</Link>
						</p>
					</motion.div>
				</div>
			</motion.div>
		</main>
	);
};

export default SignUp;
