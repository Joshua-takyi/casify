"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetIsOnSale } from "@/server/action";

export default function AnnouncementBar() {
	const [isVisible, setIsVisible] = useState(true);
	const [nextSaleDate, setNextSaleDate] = useState<Date | null>(null); // Explicit type for Date
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const timerRef = useRef<NodeJS.Timeout | null>(null); // useRef for the timer

	const { data } = useQuery({
		queryKey: ["isOnSale"],
		queryFn: () => GetIsOnSale(100),
		staleTime: 60 * 1000,
	});

	useEffect(() => {
		interface SaleItem {
			salesStartAt: string;
		}

		if (data?.data) {
			const now = new Date();
			const futureSales = data.data
				.filter(
					(p: SaleItem) => p.salesStartAt && new Date(p.salesStartAt) > now
				)
				.sort(
					(a: SaleItem, b: SaleItem) =>
						new Date(a.salesStartAt).getTime() -
						new Date(b.salesStartAt).getTime()
				);

			if (futureSales.length > 0) {
				setNextSaleDate(new Date(futureSales[0].salesStartAt));
			}
		}
	}, [data]);

	useEffect(() => {
		if (!nextSaleDate) return;

		// Clear any existing timer before setting a new one
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		timerRef.current = setInterval(() => {
			const now = new Date();
			const difference = nextSaleDate.getTime() - now.getTime();

			if (difference > 0) {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24));
				const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
				const minutes = Math.floor((difference / 1000 / 60) % 60);
				const seconds = Math.floor((difference / 1000) % 60);

				setTimeLeft({ days, hours, minutes, seconds });
			} else {
				if (timerRef.current) {
					clearInterval(timerRef.current);
					timerRef.current = null;
				}
				setIsVisible(false);
			}
		}, 1000);

		// Cleanup function to clear the timer when the component unmounts or nextSaleDate changes
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [nextSaleDate]);

	const handleClose = () => {
		setIsVisible(false);
	};

	if (!nextSaleDate) return null;

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="relative bg-black text-white overflow-hidden"
				>
					<div className="container mx-auto px-4 py-2">
						<div className="flex items-center justify-center space-x-4">
							<span className="font-medium">Next Sale Starts In:</span>
							<div className="flex space-x-2">
								<TimeUnit value={timeLeft.days} unit="d" />
								<TimeUnit value={timeLeft.hours} unit="h" />
								<TimeUnit value={timeLeft.minutes} unit="m" />
								<TimeUnit value={timeLeft.seconds} unit="s" />
							</div>
						</div>
					</div>
					<button
						onClick={handleClose}
						className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity"
					>
						<X className="w-5 h-5" />
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

function TimeUnit({ value, unit }: { value: number; unit: string }) {
	return (
		<motion.div
			key={unit} //Use unit as key
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="flex items-center space-x-1"
		>
			<span className="font-mono">{value.toString().padStart(2, "0")}</span>
			<span className="text-sm">{unit}</span>
		</motion.div>
	);
}
