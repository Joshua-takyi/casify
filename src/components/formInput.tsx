"use client";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
	type?: "textarea" | "text" | "email" | "password" | string;
	label: string;
	register: UseFormRegisterReturn;
	error?: string;
	onChange?: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
}

const FormInput: React.FC<InputProps> = ({
	type = "text",
	label,
	register,
	error,
	onChange,
}) => {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-sm font-medium text-gray-700">{label}</label>
			{type === "textarea" ? (
				<textarea
					{...register}
					onChange={onChange}
					className={`p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						error ? "border-red-500" : "border-gray-200"
					}`}
				/>
			) : (
				<input
					type={type}
					{...register}
					onChange={onChange}
					className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						error ? "border-red-500" : "border-gray-200"
					}`}
				/>
			)}
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};

export default FormInput;
