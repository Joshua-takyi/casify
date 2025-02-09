"use client";
import React from "react";
import FormInput from "@/components/formInput";
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

export default function SignUp() {
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
			password: "", // Initialize password
		},
	});

	const password = watch("password", "");

	// Memoize the password requirements calculation for performance
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
				// Check for a success flag
				throw new Error(res.message || "Signup failed"); // Throw an error with the message
			}
			return res.data;
		},
		onSuccess: () => {
			toast.success("Account created successfully!");
			reset();
			router.push("/auth/sign-in");
		},
		onError: (error: Error) => {
			toast.error(error instanceof Error ? error.message : String(error)); // Display error message
		},
	});

	const onSubmit = async (data: FormValues) => {
		mutate(data);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
			<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Create an account
					</h1>
					<p className="text-gray-500 mt-2">
						Enter your details below to create your account
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FormInput
						type="text"
						label="Name"
						register={register("name")}
						error={errors.name?.message}
					/>

					<FormInput
						type="email"
						label="Email"
						register={register("email")}
						error={errors.email?.message}
					/>

					<FormInput
						type="password"
						label="Password"
						register={register("password")}
						error={errors.password?.message}
					/>

					<div className="space-y-2 mt-4">
						{passwordRequirements.map((req, index) => (
							<div key={index} className="flex items-center gap-2">
								<span
									className={`text-lg ${
										req.met ? "text-green-500" : "text-gray-300"
									}`}
								>
									{req.met ? "✓" : "×"}
								</span>
								<span
									className={`text-sm ${
										req.met ? "text-green-600" : "text-gray-500"
									}`}
								>
									{req.text}
								</span>
							</div>
						))}
					</div>

					<button
						type="submit"
						disabled={isSubmitting || isPending}
						className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting || isPending
							? "Creating account..."
							: "Create account"}
					</button>
				</form>

				<div className="text-center text-sm text-gray-500">
					Already have an account?{" "}
					<Link
						href={"/auth/sign-in"}
						className="text-blue-600 hover:underline font-medium"
					>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
