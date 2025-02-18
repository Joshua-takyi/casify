"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
	targetDate: string;
	onComplete?: () => void;
}

interface TimeUnit {
	label: string;
	value: number;
}

export default function CountdownTimer({
	targetDate,
	onComplete,
}: CountdownTimerProps) {
	const calculateTimeLeft = () => {
		const difference = new Date(targetDate).getTime() - new Date().getTime();
		if (difference > 0) {
			return {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		}
		return null;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setInterval(() => {
			const updatedTime = calculateTimeLeft();
			if (updatedTime) {
				setTimeLeft(updatedTime);
			} else {
				clearInterval(timer);
				onComplete?.();
			}
		}, 1000);
		return () => clearInterval(timer);
	}, [targetDate, onComplete]);

	if (!timeLeft) return null;

	const timeUnits: TimeUnit[] = [
		{ label: "Days", value: timeLeft.days },
		{ label: "Hours", value: timeLeft.hours },
		{ label: "Minutes", value: timeLeft.minutes },
		{ label: "Seconds", value: timeLeft.seconds },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full max-w-2xl mx-auto py-8"
		>
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<h3 className="text-center text-gray-500 font-medium mb-6">
					Sale Starting In
				</h3>
				<div className="flex justify-center items-center gap-4">
					{timeUnits.map((unit, index) => (
						<div
							key={unit.label}
							className="flex flex-col items-center min-w-[80px]"
						>
							<div className="relative">
								<div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
									<AnimatePresence mode="popLayout">
										<motion.span
											key={unit.value}
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											exit={{ y: -20, opacity: 0 }}
											className="text-2xl font-medium text-gray-800"
										>
											{unit.value.toString().padStart(2, "0")}
										</motion.span>
									</AnimatePresence>
								</div>
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="block text-xs text-gray-400 mt-2 text-center font-medium"
								>
									{unit.label}
								</motion.span>
								{index < timeUnits.length - 1 && (
									<motion.span
										animate={{
											opacity: [1, 0.3, 1],
										}}
										transition={{
											repeat: Infinity,
											duration: 2,
											ease: "easeInOut",
										}}
										className="absolute -right-4 top-1/2 -translate-y-1/2 text-gray-300"
									>
										·
									</motion.span>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}
