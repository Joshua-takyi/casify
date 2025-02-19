"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface AccordionItemProps {
	title: string;
	children: React.ReactNode;
	isOpen: boolean;
	onToggle: () => void;
}

interface AccordionProps {
	mainHeader: string;
	items: {
		title: string;
		content: React.ReactNode;
	}[];
}

const AccordionItem = ({
	title,
	children,
	isOpen,
	onToggle,
}: AccordionItemProps) => {
	return (
		<div className="border-b border-gray-200">
			<button
				className="w-full py-4 flex justify-between items-center"
				onClick={onToggle}
			>
				<span className="text-base md:text-lg lg:text-xl font-semibold text-gray-900/80">
					{title}
				</span>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.2 }}
				>
					<ChevronDownIcon className="h-5 w-5 text-gray-500" />
				</motion.div>
			</button>
			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="pb-4 text-sm md:text-base text-gray-600 leading-relaxed">
							{children}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default function Accordion({ mainHeader, items }: AccordionProps) {
	const [openItems, setOpenItems] = useState<number[]>([]);

	const toggleItem = (index: number) => {
		setOpenItems((current) =>
			current.includes(index)
				? current.filter((i) => i !== index)
				: [...current, index]
		);
	};

	return (
		<div className="w-full px-4 sm:px-6 md:px-8 lg:px-24 mx-auto">
			<h2 className="text-2xl md:text-3xl  font-semibold mb-6">{mainHeader}</h2>
			<div className="border-t border-gray-200">
				{items.map((item, index) => (
					<AccordionItem
						key={index}
						title={item.title}
						isOpen={openItems.includes(index)}
						onToggle={() => toggleItem(index)}
					>
						{item.content}
					</AccordionItem>
				))}
			</div>
		</div>
	);
}
