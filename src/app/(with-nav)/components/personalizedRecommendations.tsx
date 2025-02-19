"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/productCard";
import Wrapper from "@/components/wrapper";

// Mock data for recommended products
const recommendedProducts = [
	{
		title: "Premium Phone Case",
		price: 29.99,
		images: ["/images/smartphone-case.png"],
		slug: "premium-phone-case",
		colors: ["#000000", "#FFFFFF", "#FF0000"],
		isNew: true,
	},
	{
		title: "Wireless Earbuds",
		price: 149.99,
		images: ["/images/airpod.png"],
		slug: "wireless-earbuds",
		colors: ["#000000", "#FFFFFF"],
		isNew: false,
	},
	{
		title: "Smart Watch Band",
		price: 39.99,
		images: ["/images/icon-product-watch.png"],
		slug: "smart-watch-band",
		colors: ["#000000", "#FF0000", "#0000FF"],
		isNew: true,
	},
	{
		title: "AirPods Pro",
		price: 249.99,
		images: ["/images/airpods-pro-2.jpg"],
		slug: "airpods-pro",
		colors: ["#FFFFFF"],
		isNew: false,
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 300,
		},
	},
};

export default function PersonalizedRecommendations() {
	return (
		<section className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/50 to-white">
			<Wrapper>
				<motion.div
					className="space-y-8"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.div className="text-center space-y-2" variants={itemVariants}>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							Recommended for You
						</h2>
						<p className="text-gray-500 text-sm md:text-base">
							Curated picks based on your preferences
						</p>
					</motion.div>

					<motion.div
						className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
						variants={containerVariants}
					>
						{recommendedProducts.map((product) => (
							<motion.div
								key={product.slug}
								variants={itemVariants}
								whileHover={{ y: -5 }}
								className="transform transition-all duration-200"
							>
								<ProductCard
									title={product.title}
									price={product.price}
									images={product.images}
									slug={product.slug}
									colors={product.colors}
									isNew={product.isNew}
								/>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</Wrapper>
		</section>
	);
}
