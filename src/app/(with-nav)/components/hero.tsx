"use client";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image"; // Added for optimized image loading
import Wrapper from "@/components/wrapper";
import { ArrowRight, Shield, Sparkles, Truck } from "lucide-react";
import { motion } from "framer-motion"; // Import framer-motion

// Animation variants for staggered animations
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2, // Delay between each child animation
			duration: 0.5,
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

export default function HeroSection() {
	// Hero content configuration
	const heroContent = {
		announcement: "Free Shipping in Ghana & West Africa!",
		tagline: "Made in Ghana",
		headline: "Protect Your Phone",
		description:
			"Durable, stylish cases for everyday use. Fast delivery and lifetime warranty.",
		ctaText: "Shop Now",
		ctaLink: "/collection?category=phone-cases&available=true&limit=20",
		stats: [
			{ value: "24h", label: "Fast Delivery", icon: Truck },
			{ value: "4.9/5", label: "Reviews", icon: Sparkles },
			{ value: "5Y", label: "Warranty", icon: Shield },
		],
		achievements: "Award-winning. Trusted across Africa.",
	};

	return (
		<>
			<Head>
				<title>Casify Ghana | Premium Phone Cases & Accessories</title>
				<meta
					name="description"
					content="Premium phone cases made in Ghana. Stylish protection with fast delivery."
				/>
				<meta property="og:title" content="Casify Ghana - Phone Cases" />
				<meta property="og:image" content="/images/casify-ghana-preview.jpg" />
				<meta
					name="keywords"
					content="phone cases ghana, premium phone cases, phone protection, africa phone cases"
				/>
				<link rel="canonical" href="https://casify.com.gh" />
			</Head>

			{/* Hero Section with optimized background image */}
			<section
				className="relative h-dvh overflow-hidden bg-slate-900"
				aria-label="Premium Phone Protection"
			>
				{/* Optimized background image using Next.js Image component */}
				<div className="absolute inset-0">
					<Image
						src="/images/yellow.jpg"
						alt="Background"
						fill
						priority // Preload the image
						quality={85} // Adjust quality for performance
						className="object-cover object-center"
						sizes="100vw" // Image will always be viewport width
					/>
					{/* Overlay gradient */}
					<div className="absolute inset-0 bg-slate-800/50" />
				</div>

				<Wrapper className="relative h-full">
					{/* Main content container with Framer Motion */}
					<motion.div
						className="h-full flex items-center"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						<div className="max-w-4xl space-y-8 pt-10">
							{/* Announcement banner */}
							<motion.span
								variants={itemVariants}
								className="inline-block bg-slate-800/80 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm md:text-base"
							>
								{heroContent.announcement}
							</motion.span>

							<motion.div variants={itemVariants} className="space-y-6">
								{/* Tagline */}
								<span className="block text-slate-300 text-lg md:text-xl font-medium">
									{heroContent.tagline}
								</span>

								{/* Headline */}
								<h1 className="text-[1.5rem] md:text-[3rem] font-bold leading-tight text-white">
									{heroContent.headline}
								</h1>

								{/* Description */}
								<p className="text-base md:text-lg text-white leading-relaxed max-w-2xl">
									{heroContent.description}
								</p>
							</motion.div>

							{/* CTA and Stats Section */}
							<motion.div
								variants={itemVariants}
								className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
							>
								{/* Animated CTA Button */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Link
										href={heroContent.ctaLink}
										className="group inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200"
									>
										{heroContent.ctaText}
										<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
									</Link>
								</motion.div>

								{/* Stats with staggered animation */}
								<div className="flex flex-wrap gap-6 text-sm text-white">
									{heroContent.stats.map((stat, index) => (
										<motion.div
											key={index}
											variants={itemVariants}
											className="flex items-center gap-2"
										>
											<stat.icon className="h-5 w-5 text-yellow-400" />
											<span>
												<span className="block text-white font-medium">
													{stat.value}
												</span>
												<span className="text-white">{stat.label}</span>
											</span>
										</motion.div>
									))}
								</div>
							</motion.div>

							{/* Achievements */}
							<motion.div
								variants={itemVariants}
								className="border-t border-slate-700/50 pt-6"
							>
								<p className="text-slate-400 text-sm">
									{heroContent.achievements}
								</p>
							</motion.div>
						</div>
					</motion.div>
				</Wrapper>
			</section>
		</>
	);
}
