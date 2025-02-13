"use client";

import { Tag, X } from "lucide-react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectGroup,
} from "@/components/ui/select";

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

			{!isMulti && value && (
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

			<Select
				onValueChange={(selectedValue) => {
					if (isMulti) {
						// For multi-select, add the selected value to the array
						if (Array.isArray(value) && !value.includes(selectedValue)) {
							onChange([...value, selectedValue]);
						}
					} else {
						// For single-select, return an array with the selected value
						onChange([selectedValue]);
					}
				}}
				value={isMulti ? "" : value?.[0] || ""} // Use the first item for single-select
			>
				<SelectTrigger className={className}>
					<SelectValue
						placeholder={
							isMulti
								? Array.isArray(value) && value.length > 0
									? `${value.length} selected`
									: placeholder
								: value?.[0] || placeholder
						}
					/>
				</SelectTrigger>
				<SelectContent>
					{options.map((group) => (
						<SelectGroup key={group.label}>
							<SelectLabel className="font-bold text-sm text-gray-700">
								{group.label}
							</SelectLabel>
							{group.items.map((item) => (
								<div key={item.value}>
									<SelectItem
										value={item.value}
										className="hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
									>
										{item.label}
									</SelectItem>
									{item.subcategories &&
										item.subcategories.map((subcategory) => (
											<SelectItem
												key={subcategory.value}
												value={subcategory.value}
												className="pl-8 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
											>
												{subcategory.label}
											</SelectItem>
										))}
								</div>
							))}
						</SelectGroup>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
