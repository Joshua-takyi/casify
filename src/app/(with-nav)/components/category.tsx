"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/wrapper";

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

const Category: React.FC = () => {
	return (
		<section className="py-12 md:py-16">
			<Wrapper>
				<div className="space-y-8">
					<div className="text-center space-y-2">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900">
							Browse Categories
						</h2>
						<p className="text-gray-600 text-sm md:text-base">
							Discover our curated collection of premium accessories
						</p>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{categoryData.map((item) => (
							<Link
								href={item.path}
								key={item.id}
								className="group block bg-white rounded-lg p-4 border border-gray-100 
                                 hover:shadow-sm transition-shadow duration-200"
							>
								<div className="space-y-3">
									<div className="relative w-12 h-12 mx-auto">
										<Image
											src={item.image}
											alt={item.name}
											fill
											className="object-contain transition-transform duration-200 
                                             group-hover:scale-105"
										/>
									</div>

									<div className="text-center">
										<h3
											className="font-medium text-sm text-gray-900 group-hover:text-indigo-600 
                                         transition-colors duration-200"
										>
											{item.name}
										</h3>
										<p className="text-xs text-gray-500 hidden sm:block mt-1">
											{item.description}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</Wrapper>
		</section>
	);
};

export default Category;
