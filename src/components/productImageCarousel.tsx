"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

	const thumbnails = useMemo(
		() =>
			images.map((image, index) => (
				<div key={index} className="relative flex-shrink-0">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							setDirection(index > activeIndex ? 1 : -1);
							setActiveIndex(index);
						}}
						className="relative w-16 h-16 sm:w-20 sm:h-20"
						aria-label={`View image ${index + 1}`}
						aria-current={activeIndex === index ? "true" : "false"}
					>
						<Image
							src={image}
							fill
							alt={`Thumbnail ${index + 1}`}
							className="object-cover rounded-md"
							sizes="(max-width: 640px) 64px, 80px"
						/>
					</motion.button>
					<motion.div
						initial={false}
						animate={{
							opacity: activeIndex === index ? 1 : 0,
							scale: activeIndex === index ? 1 : 0.8,
						}}
						transition={{
							duration: 0.3,
							ease: "easeInOut",
						}}
						className="absolute -bottom-2 left-0 w-full h-0.5 bg-black"
					/>
				</div>
			)),
		[images, activeIndex]
	);

	if (!images.length) {
		return (
			<div className="flex items-center justify-center h-64 rounded-lg border-2 border-gray-200">
				<p className="text-gray-500">No images available</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center w-full h-full space-y-6">
			<div className="relative w-full h-[330px] md:h-[430px] lg:h-[530px] overflow-hidden">
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
							quality={100}
						/>
					</motion.div>
				</AnimatePresence>
			</div>

			<div className="flex items-center justify-center w-full max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
				<div className="flex gap-4 px-4 mx-auto">{thumbnails}</div>
			</div>
		</div>
	);
};

export default ImageCarousel;
