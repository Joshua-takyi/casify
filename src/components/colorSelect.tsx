"use client";
import { Plus, X } from "lucide-react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import Modal from "./modal";
import { ColorData } from "@/database/db";

interface ColorsProps {
	colors: string[];
	onAddColor: (color: string) => void;
	onDeleteColor: (color: string) => void;
	error?: string;
}

export const FormColors = ({
	colors,
	onAddColor,
	onDeleteColor,
	error,
}: ColorsProps) => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [customColor, setCustomColor] = useState("");

	// Handle opening the modal.tsx
	const openModal = () => setModalOpen(true);

	// Handle closing the modal.tsx
	const closeModal = () => {
		setCustomColor("");
		setModalOpen(false);
	};

	// Handle confirming the custom color
	const handleConfirmCustomColor = () => {
		if (/^#([0-9A-F]{3}){1,2}$/i.test(customColor)) {
			onAddColor(customColor);
			closeModal();
		} else {
			alert("Please enter a valid hex color code (e.g., #FF0000).");
		}
	};

	// Handle removing a color
	const handleRemoveColor = (color: string) => {
		onDeleteColor(color);
	};

	return (
		<div className="space-y-4">
			<p className="text-xl font-semibold text-gray-800">Colors</p>
			{error && <p className="text-red-500 text-sm">{error}</p>}

			{/* Display selected colors */}
			{colors.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-2">
					{colors.map((color) => (
						<div
							key={color}
							className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg"
						>
							<div
								className="w-4 h-4 rounded-full"
								style={{ backgroundColor: color }}
							/>
							<span className="text-sm font-medium">{color}</span>
							<button
								type="button"
								onClick={() => handleRemoveColor(color)}
								className="hover:bg-blue-100 rounded-full p-1"
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>
			)}

			<div className="flex items-center gap-4">
				{/* Predefined Color Selection */}
				<Select
					onValueChange={(value) => onAddColor(value)}
					value="" // Clear the dropdown after selection
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Select a color" />
					</SelectTrigger>
					<SelectContent>
						{ColorData.map((color) => (
							<SelectItem
								key={color.value}
								value={color.value}
								className="flex items-center gap-2"
							>
								<div
									className="w-4 h-4 rounded-full"
									style={{ backgroundColor: color.value }}
								/>
								<span>{color.label}</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Add Custom Color Button */}
				<button
					type="button"
					onClick={openModal}
					className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
				>
					<Plus size={16} />
					<span>Add Custom Color</span>
				</button>
			</div>

			{/* Modal Component */}
			{isModalOpen && (
				<Modal onClose={closeModal}>
					<div className="space-y-4 p-6">
						<h2 className="text-xl font-semibold text-gray-800">
							Add Custom Color
						</h2>
						<p className="text-sm text-gray-600">
							Enter a valid hex color code (e.g., #FF0000).
						</p>

						{/* Color Preview */}
						<div
							className="w-full h-20 rounded-lg border border-gray-200"
							style={{ backgroundColor: customColor || "#FFFFFF" }}
						/>

						{/* Custom Color Input */}
						<input
							type="text"
							value={customColor}
							onChange={(e) => setCustomColor(e.target.value)}
							placeholder="#FF0000"
							className="w-full p-2 border border-gray-300 rounded-lg"
						/>

						{/* Modal Buttons */}
						<div className="flex justify-end gap-4">
							<button
								type="button"
								onClick={closeModal}
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleConfirmCustomColor}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
							>
								Add Color
							</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};
