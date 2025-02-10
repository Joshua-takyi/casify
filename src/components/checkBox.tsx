"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckProps {
	label: string;
	name: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
}

export const FormCheckbox = ({
	label,
	name,
	checked,
	onChange,
	error,
}: FormCheckProps) => {
	return (
		<div className="flex items-center gap-3 p-2 ">
			<Checkbox
				id={name}
				checked={checked}
				onCheckedChange={(isChecked) =>
					onChange({ target: { name, checked: isChecked as boolean } })
				}
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
