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
		<div style={{ marginBottom: "1rem" }}>
			<label
				htmlFor={name}
				style={{
					display: "block",
					marginBottom: "0.5rem",
					fontSize: "0.875rem",
					fontWeight: "500",
				}}
			>
				{label}
			</label>
			<textarea
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				rows={rows}
				placeholder={placeholder}
				style={{
					width: "100%",
					padding: "0.75rem",
					border: `1px solid ${error ? "#dc2626" : "#d1d5db"}`,
					borderRadius: "4px",
					fontSize: "0.875rem",
					fontFamily: "inherit",
					resize: "vertical",
					minHeight: "100px",
				}}
				aria-invalid={!!error}
				aria-describedby={error ? `${name}-error` : undefined}
			/>
			{error && (
				<p
					id={`${name}-error`}
					style={{
						color: "#dc2626",
						fontSize: "0.875rem",
						marginTop: "0.5rem",
					}}
				>
					{error}
				</p>
			)}
		</div>
	);
};
