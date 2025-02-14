"use client";
import {
	motion,
	useScroll,
	useTransform,
	useSpring,
	useAnimate,
	stagger,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Wrapper from "@/components/wrapper";
import Link from "next/link";

const genderSelect = [
	{
		id: 1,
		name: "shop masculine",
		path: "/male-preference",
		bgColor: "rgb(30, 30, 30)",
	},
	{
		id: 2,
		name: "shop feminine",
		path: "/female-preference",
		bgColor: "rgb(40, 40, 40)",
	},
];

const MotionLink = motion(Link);

export default function HeroSection() {
	const [scope, animate] = useAnimate();
	const containerRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);

	// Parallax scroll effect
	const { scrollY } = useScroll();
	const y = useTransform(scrollY, [0, 1000], [0, 400]);
	const opacity = useTransform(scrollY, [0, 300], [1, 0]);

	// Smooth spring animation for parallax
	const smoothY = useSpring(y, {
		stiffness: 100,
		damping: 30,
		mass: 0.5,
	});

	// Text reveal animation sequence
	useEffect(() => {
		if (!isLoaded) {
			const sequence = async () => {
				animate(
					scope.current,
					{ opacity: 1, y: 0 },
					{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }
				);
				animate(
					".hero-text",
					{ opacity: 1, x: 0 },
					{ duration: 0.6, delay: stagger(0.2) }
				);

				animate(
					".cta-button",
					{ opacity: 1, scale: 1 },
					{ type: "spring", stiffness: 200, damping: 20 }
				);
			};

			sequence();
			setIsLoaded(true);
		}
	}, [animate, isLoaded, scope]);

	// Background parallax effect
	const bgY = useTransform(scrollY, [0, 1000], ["0%", "50%"]);
	const bgScale = useTransform(scrollY, [0, 1000], [1, 1.2]);

	return (
		<section ref={containerRef} className="relative h-dvh overflow-hidden">
			{/* Animated background */}
			<motion.div
				style={{
					y: bgY,
					scale: bgScale,
					backgroundImage:
						"url(/images/jascent-leung--uF6u5Cmnsw-unsplash.jpg)",
				}}
				className="absolute inset-0 bg-no-repeat bg-cover bg-center"
			/>

			{/* Overlay gradient */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.4 }}
				transition={{ duration: 1.5 }}
				className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"
			/>

			<Wrapper className="relative h-full">
				<motion.div
					ref={scope}
					style={{ y: smoothY, opacity }}
					initial={{ opacity: 0, y: 100 }}
					className="flex flex-col h-full justify-end"
				>
					<div className="flex flex-col capitalize text-white space-y-6 pb-20 md:pb-32">
						{/* Animated text elements */}
						<motion.span
							className="hero-text text-xl md:text-2xl tracking-wide"
							initial={{ opacity: 0, x: -20 }}
						>
							sale of the season
						</motion.span>

						<motion.h1
							className="hero-text font-family-apercu-pro text-4xl md:text-6xl lg:text-7xl font-bold"
							initial={{ opacity: 0, x: -20 }}
						>
							up to 40% off
						</motion.h1>

						{/* Animated CTA buttons */}
						<motion.section
							className="flex flex-col md:flex-row gap-4 items-start md:items-center mt-8"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							{genderSelect.map((gender) => (
								<MotionLink
									href={gender.path}
									key={gender.id}
									className="cta-button px-8 py-4 rounded-lg text-lg md:text-xl border border-white/20 backdrop-blur-sm"
									initial={{ opacity: 0, scale: 0.9 }}
									whileHover={{
										backgroundColor: gender.bgColor,
										scale: 1.05,
										transition: {
											duration: 0.2,
											ease: "easeOut",
										},
									}}
									whileTap={{ scale: 0.98 }}
								>
									{gender.name}
								</MotionLink>
							))}
						</motion.section>
					</div>
				</motion.div>
			</Wrapper>
		</section>
	);
}
