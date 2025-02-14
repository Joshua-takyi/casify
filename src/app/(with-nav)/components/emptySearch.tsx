"use client";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";

interface NoResultsFoundProps {
	query: string;
	onBrowseAll: () => void;
}

export default function NoResultsFound({
	query,
	onBrowseAll,
}: NoResultsFoundProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full flex flex-col items-center justify-center py-16 px-4"
		>
			{/* Icon */}
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				className="mb-6"
			>
				<Search className="w-12 h-12 text-gray-300 stroke-[1.5]" />
			</motion.div>

			{/* Search Query */}
			<div className="text-center space-y-2 mb-8">
				<p className="text-xl font-medium text-gray-900">
					No results found for &quot;
					<span className="text-gray-500">{query}</span>&quot;
				</p>
				<p className="text-sm text-gray-500">
					Try different keywords or browse our full collection
				</p>
			</div>

			{/* Button */}
			<button
				onClick={onBrowseAll}
				className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
			>
				<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
				Browse All Products
			</button>
		</motion.div>
	);
}
