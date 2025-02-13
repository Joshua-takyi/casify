"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const ImageCarousel = ({ images = [], alt = "" }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [direction, setDirection] = useState(0);

	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
		}),
	};

	const swipeConfidenceThreshold = 10000;
	const swipePower = (offset: number, velocity: number) => {
		return Math.abs(offset) * velocity;
	};

	const paginate = useCallback(
		(newDirection: number) => {
			setDirection(newDirection);
			setActiveIndex(
				(prev) => (prev + newDirection + images.length) % images.length
			);
		},
		[images.length]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") {
				paginate(-1);
			} else if (event.key === "ArrowRight") {
				paginate(1);
			}
		},
		[paginate]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	if (!images.length) {
		return (
			<div className="flex items-center justify-center h-64 rounded-lg border-2 border-gray-200">
				<p className="text-gray-500">No images available</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center w-full h-full space-y-4 ">
			{/* Main Image Container */}
			<div className="relative w-full h-[330px] md:h-[430px] lg:h-[530px]  overflow-hidden group ">
				<AnimatePresence initial={false} custom={direction}>
					<motion.div
						key={activeIndex}
						custom={direction}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={1}
						onDragEnd={(e, { offset, velocity }) => {
							const swipe = swipePower(offset.x, velocity.x);
							if (swipe < -swipeConfidenceThreshold) {
								paginate(1);
							} else if (swipe > swipeConfidenceThreshold) {
								paginate(-1);
							}
						}}
						className="absolute w-full h-full"
					>
						<Image
							src={images[activeIndex]}
							alt={`${alt} - Image ${activeIndex + 1}`}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 80vw"
							className="object-contain"
							priority={true}
							quality={90}
						/>
					</motion.div>
				</AnimatePresence>

				{/* Navigation Buttons */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => paginate(-1)}
					className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center z-10 bg-white/80 hover:bg-white shadow-xs transition-all duration-300 border border-gray-200"
				>
					<ChevronLeftIcon className="w-6 h-6 text-gray-700" />
				</motion.button>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => paginate(1)}
					className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center z-10 bg-white/80 hover:bg-white shadow-xs  transition-all duration-300  border border-gray-200"
				>
					<ChevronRightIcon className="w-6 h-6 text-gray-700" />
				</motion.button>
			</div>

			{/* Thumbnails */}
			<div className="flex gap-2 overflow-x-auto max-w-full py-2 px-4 scrollbar-hide snap-x">
				{images.map((image, index) => (
					<motion.button
						key={index}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							setDirection(index > activeIndex ? 1 : -1);
							setActiveIndex(index);
						}}
						className={`relative flex-shrink-0 rounded-lg overflow-hidden  snap-start border-1  transition-all duration-200
                            ${
															activeIndex === index
																? "border-blue-500 opacity-100"
																: "border-gray-200 opacity-60 hover:opacity-80"
														}`}
						aria-label={`View image ${index + 1}`}
						aria-current={activeIndex === index ? "true" : "false"}
					>
						<div className="relative w-16 h-16 sm:w-20 sm:h-20">
							<Image
								src={image}
								fill
								alt={`Thumbnail ${index + 1}`}
								className="object-cover"
								sizes="(max-width: 640px) 64px, 80px"
							/>
						</div>
					</motion.button>
				))}
			</div>
		</div>
	);
};

export default ImageCarousel;
