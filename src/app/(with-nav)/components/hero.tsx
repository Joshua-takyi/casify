"use client";
import Link from "next/link";
import Head from "next/head";
import Wrapper from "@/components/wrapper";
import { ArrowRight, Shield, Sparkles, Truck } from "lucide-react";

export default function HeroSection() {
	// Simplified hero content
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

			<section
				className="relative h-dvh bg-slate-900"
				aria-label="Premium Phone Protection"
			>
				{/* Background layers */}
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
					style={{
						backgroundImage:
							"url(/images/jascent-leung-CubSQS4iYEE-unsplash.jpg)",
					}}
					role="presentation"
				/>
				{/* <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95" /> */}

				<Wrapper className="relative h-full">
					<div className="h-full flex items-center">
						<div className="max-w-4xl space-y-8 pt-10">
							{/* Announcement banner */}
							<span className="inline-block bg-slate-800/80 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm md:text-base">
								{heroContent.announcement}
							</span>

							<div className="space-y-6">
								{/* Tagline */}
								<span className="block text-slate-300 text-lg md:text-xl font-medium">
									{heroContent.tagline}
								</span>

								{/* Headline */}
								<h1 className="text-[1.5rem] md:text-[3rem] font-bold leading-tight text-white">
									{heroContent.headline}
								</h1>

								{/* Description */}
								<p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
									{heroContent.description}
								</p>
							</div>

							{/* CTA and Stats Section */}
							<div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
								<Link
									href={heroContent.ctaLink}
									className="group inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:transform hover:-translate-y-0.5"
								>
									{heroContent.ctaText}
									<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
								</Link>

								{/* Stats */}
								<div className="flex flex-wrap gap-6 text-sm text-slate-300">
									{heroContent.stats.map((stat, index) => (
										<div key={index} className="flex items-center gap-2">
											<stat.icon className="h-5 w-5 text-slate-400" />
											<span>
												<span className="block text-white font-medium">
													{stat.value}
												</span>
												<span className="text-slate-400">{stat.label}</span>
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Achievements */}
							<div className="border-t border-slate-700/50 pt-6">
								<p className="text-slate-400 text-sm">
									{heroContent.achievements}
								</p>
							</div>
						</div>
					</div>
				</Wrapper>
			</section>
		</>
	);
}
