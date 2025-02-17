"use client";
import React from "react";

interface ModelSelectProps {
	itemModel: string[];
	value: string;
	onChange: (value: string) => void;
	title?: string;
}

export default function SelectPhoneModel({
	itemModel = [],
	value,
	onChange,
}: ModelSelectProps) {
	// Sorting logic (make a shallow copy before sorting)
	const sortedModels = React.useMemo(() => {
		return [...itemModel].sort((a, b) => {
			// Prioritize "pro max", then "pro", then alphabetical
			const priorityOrder = ["pro max", "pro"];

			for (const priority of priorityOrder) {
				const aHasPriority = a.toLowerCase().includes(priority);
				const bHasPriority = b.toLowerCase().includes(priority);

				if (aHasPriority && !bHasPriority) return -1;
				if (!aHasPriority && bHasPriority) return 1;
			}
			return a.localeCompare(b);
		});
	}, [itemModel]);

	// Format model name
	const formatModelName = (model: string) => {
		return model
			.replace(/iphone/gi, "")
			.trim()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<div>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full border rounded-md  p-2 bg-transparent appearance-none outline-hidden focus:ring-1 focus:ring-gray-300 "
			>
				<option value="">Choose a model</option>
				{sortedModels.map((model) => (
					<option key={model} value={model}>
						{formatModelName(model)}
					</option>
				))}
			</select>
		</div>
	);
}
