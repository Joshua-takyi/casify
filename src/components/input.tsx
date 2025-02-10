"use client";

interface InputProps {
	label: string;
	name: string;
	value: string | number | null; // Allow null but handle it properly
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	required?: boolean;
	type?: string;
	error?: string;
}

export const FormInput = ({
	label,
	name,
	value,
	onChange,
	placeholder,
	required,
	type = "text",
	error,
}: InputProps) => {
	return (
		<div className="space-y-2">
			<label htmlFor={name} className="text-sm font-medium text-gray-700">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<input
				type={type}
				name={name}
				value={value ?? ""} // If value is null, use an empty string instead
				onChange={onChange}
				className={`w-full p-3 border ${
					error ? "border-red-500" : "border-gray-200"
				} rounded-lg outline-none transition-all`}
				placeholder={placeholder}
				required={required}
				aria-invalid={!!error}
				aria-describedby={error ? `${name}-error` : undefined}
			/>
			{error && (
				<p id={`${name}-error`} className="text-red-500 text-sm">
					{error}
				</p>
			)}
		</div>
	);
};
