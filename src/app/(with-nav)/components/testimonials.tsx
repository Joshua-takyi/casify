"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Wrapper from "@/components/wrapper";

// Mock testimonial data
const testimonials = [
	{
		id: 1,
		name: "Sarah Johnson",
		quote:
			"The phone case I bought is not only stylish but also incredibly durable. Best purchase ever!",
		avatar: "/images/sunset.jpg",
	},
	{
		id: 2,
		name: "Michael Chen",
		quote:
			"Amazing quality and fast shipping. The customer service team was very helpful.",
		avatar: "/images/jascent-leung-CubSQS4iYEE-unsplash.jpg",
	},
	{
		id: 3,
		name: "Emma Davis",
		quote:
			"I love how my new phone case looks! It's exactly what I was looking for.",
		avatar: "/images/jascent-leung--uF6u5Cmnsw-unsplash.jpg",
	},
	{
		id: 4,
		name: "James Wilson",
		quote:
			"Great products at reasonable prices. Will definitely shop here again!",
		avatar: "/images/i-m-zion-rhR20m0NBNw-unsplash.jpg",
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

export default function Testimonials() {
	return (
		<section className="">
			<Wrapper>
				<motion.div
					className="space-y-8"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.div className="text-center space-y-2" variants={itemVariants}>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							What Our Customers Say
						</h2>
						<p className="text-gray-500 text-sm md:text-base">
							Real experiences from our valued customers
						</p>
					</motion.div>

					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
						variants={containerVariants}
					>
						{testimonials.map((testimonial) => (
							<motion.div
								key={testimonial.id}
								variants={itemVariants}
								className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
							>
								<div className="flex flex-col space-y-4">
									<div className="flex items-center space-x-4">
										<div className="relative w-12 h-12 rounded-full overflow-hidden">
											<Image
												src={testimonial.avatar}
												alt={testimonial.name}
												fill
												className="object-cover"
											/>
										</div>
										<h3 className="font-medium text-gray-900">
											{testimonial.name}
										</h3>
									</div>
									<p className="text-gray-600 text-sm leading-relaxed">
										&quot;{testimonial.quote}&quot;
									</p>
								</div>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</Wrapper>
		</section>
	);
}
