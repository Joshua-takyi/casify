"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Instagram, Twitter } from "lucide-react";

export default function Footer() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			// Add your newsletter subscription logic here
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
			setSubmitStatus("success");
			setEmail("");
		} catch (error) {
			console.error("Error subscribing to newsletter:", error);
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<footer className="bg-gray-900 text-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
					{/* Newsletter Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-4"
					>
						<h2 className="text-3xl font-bold tracking-tight">
							Stay updated with our latest releases
						</h2>
						<p className="text-gray-400 max-w-md">
							Join our newsletter and get exclusive access to new products,
							special offers, and behind-the-scenes content.
						</p>

						<form onSubmit={handleSubmit} className="max-w-md mt-6">
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="flex-1">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
										className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                             text-white placeholder:text-gray-500 focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-colors"
										required
									/>
									{submitStatus === "success" && (
										<p className="mt-2 text-sm text-green-400">
											Successfully subscribed!
										</p>
									)}
									{submitStatus === "error" && (
										<p className="mt-2 text-sm text-red-400">
											Something went wrong. Please try again.
										</p>
									)}
								</div>
								<motion.button
									type="submit"
									disabled={isSubmitting}
									whileTap={{ scale: 0.98 }}
									className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                           hover:bg-blue-700 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           sm:w-auto w-full"
								>
									{isSubmitting ? "Subscribing..." : "Subscribe"}
								</motion.button>
							</div>
						</form>
					</motion.div>

					{/* Contact and Social Links */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="space-y-6"
						>
							<h3 className="text-lg font-semibold">Contact Us</h3>
							<ul className="space-y-4">
								<li className="flex items-center gap-3 text-gray-400 hover:text-gray-300 transition-colors">
									<Mail className="w-5 h-5" />
									<a href="mailto:hello@casify.com">hello@casify.com</a>
								</li>
								<li className="flex items-center gap-3 text-gray-400 hover:text-gray-300 transition-colors">
									<MapPin className="w-5 h-5" />
									<span>
										123 Business Street, Suite 100
										<br />
										City, State 12345
									</span>
								</li>
							</ul>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="space-y-6"
						>
							<h3 className="text-lg font-semibold">Follow Us</h3>
							<div className="flex gap-4">
								<a
									href="https://instagram.com/casify"
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white 
                           hover:bg-gray-700 transition-colors"
								>
									<Instagram className="w-5 h-5" />
								</a>
								<a
									href="https://twitter.com/casify"
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white 
                           hover:bg-gray-700 transition-colors"
								>
									<Twitter className="w-5 h-5" />
								</a>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-12 pt-8 border-t border-gray-800">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<p className="text-gray-400 text-sm">
							© {new Date().getFullYear()} Casify. All rights reserved.
						</p>
						<div className="flex gap-6 text-sm text-gray-400">
							<a
								href="/privacy"
								className="hover:text-gray-300 transition-colors"
							>
								Privacy Policy
							</a>
							<a
								href="/terms"
								className="hover:text-gray-300 transition-colors"
							>
								Terms of Service
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
