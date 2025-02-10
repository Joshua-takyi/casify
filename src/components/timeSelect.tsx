"use client";

interface DateTimeInputProps {
	label: string;
	value: string | undefined;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	error?: string;
}

export const FormDateTimeInput = ({
	label,
	value,
	onChange,
	placeholder,
	required,
	error,
}: DateTimeInputProps) => {
	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-gray-700">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<input
				type="datetime-local"
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				className={`w-full p-3 border ${
					error ? "border-red-500" : "border-gray-200"
				} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all`}
				placeholder={placeholder}
				required={required}
				aria-invalid={!!error}
				aria-describedby={error ? `${label}-error` : undefined}
			/>
			{error && (
				<p id={`${label}-error`} className="text-red-500 text-sm">
					{error}
				</p>
			)}
		</div>
	);
};
