"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/wrapper";
import { motion } from "framer-motion";

const categoryData = [
	{
		id: 1,
		name: "Phone Cases",
		description: "Stylish protection for your device",
		path: "/collection?category=phone-cases&available=true&limit=20",
		image: "/images/smartphone-case.png",
	},
	{
		id: 2,
		name: "Airpod Cases",
		description: "Secure your audio companion",
		path: "/collection?category=airpod-cases&available=true&limit=20",
		image: "/images/airpod.png",
	},
	{
		id: 3,
		name: "Chargers",
		description: "Fast charging solutions",
		path: "/collection?category=chargers&available=true&limit=20",
		image: "/images/icon-category-charging-essentials.png",
	},
	{
		id: 4,
		name: "Audio",
		description: "Premium sound experience",
		path: "/collection?category=headphones&available=true&limit=20",
		image: "/images/icon-category-audio-music.png",
	},
	{
		id: 5,
		name: "Watch Protection",
		description: "Safeguard your timepiece",
		path: "/",
		image: "/images/icon-product-watch.png",
	},
	{
		id: 6,
		name: "Watch Straps",
		description: "Customize your style",
		path: "/collection?category=watch-straps&available=true&limit=20",
		image: "/images/icon-category-watch-bands.png",
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
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
};

const Category: React.FC = () => {
	return (
		<section className="py-16 md:py-24">
			<Wrapper>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={containerVariants}
					className="space-y-12"
				>
					<div className="text-center space-y-4">
						<motion.h2
							variants={itemVariants}
							className="text-3xl md:text-4xl font-bold text-gray-900"
						>
							Browse Categories
						</motion.h2>
						<motion.p
							variants={itemVariants}
							className="text-gray-600 max-w-2xl mx-auto"
						>
							Discover our curated collection of premium accessories
						</motion.p>
					</div>

					<motion.div
						variants={containerVariants}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
					>
						{categoryData.map((item) => (
							<motion.div key={item.id} variants={itemVariants}>
								<Link href={item.path} className="group block h-full">
									<div
										className="relative h-full bg-white rounded-2xl p-6 transition-all duration-300
                              hover:shadow-lg hover:shadow-gray-200/50 border border-gray-100"
									>
										<div className="space-y-4">
											<div className="relative w-16 h-16 mx-auto">
												<div
													className="absolute inset-0 bg-indigo-50 rounded-xl transform 
                                    rotate-6 transition-transform group-hover:rotate-12"
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													<Image
														src={item.image}
														alt={item.name}
														width={40}
														height={40}
														className="object-contain transform transition-transform 
                                     group-hover:scale-110 duration-300"
													/>
												</div>
											</div>

											<div className="text-center space-y-1">
												<h3
													className="font-medium text-gray-900 group-hover:text-indigo-600 
                                   transition-colors duration-300"
												>
													{item.name}
												</h3>
												<p className="text-xs text-gray-500 hidden sm:block">
													{item.description}
												</p>
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</Wrapper>
		</section>
	);
};

export default Category;
