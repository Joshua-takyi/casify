"use client";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckProps {
	label: string;
	name: string;
	checked: boolean;
	onChange: (e: { target: { name: string; checked: boolean } }) => void;
	error?: string;
}

export const FormCheckbox = ({
	label,
	name,
	checked,
	onChange,
	error,
}: FormCheckProps) => {
	const handleChange = (checked: boolean) => {
		onChange({
			target: {
				name,
				checked,
			},
		});
	};

	return (
		<div className="flex items-center gap-3 p-2">
			<Checkbox
				id={name}
				checked={checked}
				onCheckedChange={handleChange}
				className="w-5 h-5"
				aria-invalid={!!error}
			/>
			<label
				htmlFor={name}
				className="text-sm font-medium text-gray-700 cursor-pointer"
			>
				{label}
			</label>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
};
