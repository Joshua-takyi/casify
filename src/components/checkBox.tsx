"use client";

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
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({
			target: {
				name,
				checked: e.target.checked,
			},
		});
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: "0.75rem",
				padding: "0.5rem",
				position: "relative",
			}}
		>
			<input
				type="checkbox"
				id={name}
				name={name}
				checked={checked}
				onChange={handleChange}
				style={{
					width: "1.25rem",
					height: "1.25rem",
					cursor: "pointer",
					accentColor: "#000",
				}}
				aria-invalid={!!error}
			/>
			<label
				htmlFor={name}
				style={{
					fontSize: "0.875rem",
					fontWeight: "500",
					color: "#374151",
					cursor: "pointer",
				}}
			>
				{label}
			</label>
			{error && (
				<p
					style={{
						color: "#dc2626",
						fontSize: "0.75rem",
						marginTop: "0.25rem",
						position: "absolute",
						bottom: "-1.25rem",
						left: "0.5rem",
					}}
				>
					{error}
				</p>
			)}
		</div>
	);
};
