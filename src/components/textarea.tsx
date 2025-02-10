"use client";

interface TextareaProps {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
	rows?: number;
	error?: string;
}

export const FormTextarea = ({
	label,
	name,
	value,
	onChange,
	placeholder,
	rows = 4,
	error,
}: TextareaProps) => {
	return (
		<div className="space-y-2">
			<label htmlFor={name} className="text-sm font-medium text-gray-700">
				{label}
			</label>
			<textarea
				name={name}
				value={value}
				onChange={onChange}
				rows={rows}
				className={`w-full p-3 border ${
					error ? "border-red-500" : "border-gray-200"
				} rounded-lg focus:ring-2 focus:ring-black outline-none transition-all`}
				placeholder={placeholder}
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
