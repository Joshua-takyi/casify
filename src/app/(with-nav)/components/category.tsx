// "use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
// import { ChevronDown, ChevronUp } from "lucide-react";

// Sample category data
const categoryData = [
	{
		id: 1,
		name: "Phone Cases",
		path: "/collection?category=phone-cases&available=true&limit=20",
		image: "/images/smartphone-case.png",
	},
	{
		id: 2,
		name: "Airpod Cases",
		path: "/collection?category=airpod-cases&available=true&limit=20",
		image: "/images/airpod.png",
	},
	{
		id: 3,
		name: "Chargers",
		path: "/collection?category=chargers&available=true&limit=20",
		image: "/images/icon-category-charging-essentials.png",
	},
	{
		id: 4,
		name: "Headphones and Audio",
		path: "/collection?category=headphones&available=true&limit=20",
		image: "/images/icon-category-audio-music.png",
	},
	{
		id: 5,
		name: "Watch Protection",
		path: "/",
		image: "/images/icon-product-watch.png",
	},
	{
		id: 6,
		name: "Watch Straps",
		path: "/",
		image: "/images/icon-category-watch-bands.png",
	},
];

const Category: React.FC = () => {
	return (
		<div className="w-full py-8 md:py-16 bg-white">
			<div className="max-w-[1280px] mx-auto px-4">
				<h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
					Filter by Category
				</h2>
				{/* Responsive Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
					{categoryData.map((item) => (
						<Link href={item.path} key={item.id} className="group">
							<div
								className="flex flex-col items-center space-y-3 p-4 border rounded-md 
                           transition-all duration-300 ease-in-out
                           hover:bg-gray-100 hover:shadow-md"
							>
								<div
									className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-full
                             flex items-center justify-center overflow-hidden
                             transition-transform duration-300 ease-in-out
                             group-hover:-translate-y-1"
								>
									<Image
										src={item.image}
										alt={item.name}
										width={48}
										height={48}
										className="object-contain p-3 w-12 h-12 md:w-14 md:h-14"
									/>
								</div>
								<span
									className="text-center text-sm md:text-base font-medium 
                             text-gray-800 line-clamp-2 min-h-[2.5rem]"
								>
									{item.name}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Category;
