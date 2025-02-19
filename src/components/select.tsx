"use client";

import { Tag, X } from "lucide-react";

interface SelectProps {
	options: Array<{
		label: string;
		items: Array<{
			value: string;
			label: string;
			subcategories?: Array<{ value: string; label: string }>;
		}>;
	}>;
	value: string[] | string | undefined;
	onChange: (value: string[] | string) => void;
	placeholder?: string;
	className?: string;
	isMulti?: boolean;
	label?: string;
	required?: boolean;
	error?: string;
}

export const FormSelect = ({
	options,
	value,
	onChange,
	placeholder,
	className,
	isMulti = false,
	label,
	required,
	error,
}: SelectProps) => {
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = event.target.value;
		if (isMulti) {
			if (Array.isArray(value) && !value.includes(selectedValue)) {
				onChange([...value, selectedValue]);
			}
		} else {
			onChange(selectedValue);
		}
	};

	const handleRemoveItem = (itemValue: string) => {
		if (isMulti) {
			const updatedValue = Array.isArray(value)
				? value.filter((val) => val !== itemValue)
				: [];
			onChange(updatedValue);
		} else {
			onChange("");
		}
	};

	const findLabel = (val: string[] | string | undefined): string => {
		const valueStr = Array.isArray(val) ? val[0] : val;

		if (!valueStr) return "";
		for (const group of options) {
			for (const item of group.items) {
				if (item.value === valueStr) return item.label;
				if (item.subcategories) {
					const subcategory = item.subcategories.find(
						(sub) => sub.value === valueStr
					);
					if (subcategory) return subcategory.label;
				}
			}
		}
		return valueStr;
	};

	// Flatten options and subcategories into a single array with proper indentation
	const flattenedOptions = options.flatMap((group) => [
		// Group label as disabled option
		{ value: group.label, label: group.label, disabled: true, isGroup: true },
		// Main items
		...group.items.flatMap((item) => [
			{ value: item.value, label: item.label },
			// Subcategories with indentation
			...(item.subcategories?.map((sub) => ({
				value: sub.value,
				label: `\u00A0\u00A0\u00A0\u00A0${sub.label}`,
			})) || []),
		]),
	]);

	return (
		<div className="space-y-2">
			{label && (
				<label className="block text-sm font-medium text-gray-700">
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}

			{error && <p className="text-red-500 text-sm">{error}</p>}

			{isMulti && Array.isArray(value) && value.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-2">
					{value.map((itemValue) => (
						<div
							key={itemValue}
							className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-md"
						>
							<Tag size={16} />
							<span className="text-sm font-medium">
								{findLabel(itemValue)}
							</span>
							<button
								type="button"
								onClick={() => handleRemoveItem(itemValue)}
								className="hover:bg-blue-100 rounded-full p-1"
								aria-label={`Remove ${findLabel(itemValue)}`}
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>
			)}

			{!isMulti && value && typeof value === "string" && (
				<div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-md mb-3">
					<Tag size={16} />
					<span className="text-sm font-medium">{findLabel(value)}</span>
					<button
						type="button"
						onClick={() => handleRemoveItem(value)}
						className="hover:bg-blue-100 rounded-full p-1"
						aria-label={`Remove ${findLabel(value)}`}
					>
						<X size={16} />
					</button>
				</div>
			)}

			<select
				className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${className || ""}`}
				onChange={handleChange}
				value={isMulti ? "" : (Array.isArray(value) ? value[0] : value) || ""}
			>
				<option value="" disabled>
					{isMulti
						? Array.isArray(value) && value.length > 0
							? `${value.length} selected`
							: placeholder
						: placeholder}
				</option>

				{flattenedOptions.map((option, index) => (
					<option
						key={`${option.value}-${index}`}
						value={option.value}
						disabled={"disabled" in option ? option.disabled : false}
						className={
							"isGroup" in option && option.isGroup
								? "font-bold bg-gray-100"
								: ""
						}
					>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};
