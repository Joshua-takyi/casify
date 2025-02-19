"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Wrapper from "@/components/wrapper";

export default function Newsletter() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		// Simulate API call
		setTimeout(() => {
			setStatus("success");
			setEmail("");
			// Reset status after 3 seconds
			setTimeout(() => setStatus("idle"), 3000);
		}, 1000);
	};

	return (
		<section className="py-12 md:py-16 bg-[#f5f5f7]">
			<Wrapper>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-2xl mx-auto text-center space-y-8"
				>
					<div className="space-y-2">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							Stay Updated
						</h2>
						<p className="text-gray-500 text-sm md:text-base">
							Sign up to receive the latest offers and updates
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
								required
							/>
							<button
								type="submit"
								disabled={status === "loading"}
								className={`px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap ${
									status === "loading" ? "opacity-75" : ""
								}`}
							>
								{status === "loading" ? "Subscribing..." : "Subscribe"}
							</button>
						</div>
						{status === "success" && (
							<motion.p
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-green-600 text-sm"
							>
								Thank you for subscribing!
							</motion.p>
						)}
						{status === "error" && (
							<motion.p
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-red-600 text-sm"
							>
								Something went wrong. Please try again.
							</motion.p>
						)}
					</form>
				</motion.div>
			</Wrapper>
		</section>
	);
}
