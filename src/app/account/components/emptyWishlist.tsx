"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export default function EmptyWishlist() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 space-y-6"
		>
			{/* Icon */}
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2 }}
			>
				<Heart className="w-12 h-12 text-gray-300 stroke-[1.5]" />
			</motion.div>

			{/* Text */}
			<div className="text-center space-y-2">
				<h3 className="text-lg font-medium text-gray-900">
					Your wishlist is empty
				</h3>
				<p className="text-sm text-gray-500">
					Add items you love to your wishlist. Review them anytime and easily
					move them to the cart.
				</p>
			</div>

			{/* CTA Button */}
			<Link
				href="/collection?category=phone-cases&available=true&limit=20"
				className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
			>
				Continue Shopping
				<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
			</Link>
		</motion.div>
	);
}
