"use client";
import React from "react";
import { formattedPrice } from "@/utils/format";

interface HeaderComponentProps {
	readonly title: string;
	readonly price: number;
	readonly discount?: number;
}

// Helper function to remove non-alphanumeric characters (except spaces)
function sanitizeTitle(title: string): string {
	return title.replace(/[^a-zA-Z0-9\s]/g, "");
}

export default function HeaderComponent({
	title,
	price,
	discount,
}: HeaderComponentProps) {
	const sanitizedTitle = sanitizeTitle(title);
	const discountedPrice = discount ? price - (price * discount) / 100 : price;

	return (
		<div className="w-full">
			<div className="flex flex-col gap-3">
				<h1
					className="font-bold capitalize text-gray-900 w-full"
					style={{ fontSize: "clamp(1.6rem, 2vw, 3rem)" }}
				>
					{sanitizedTitle}
				</h1>
				<div className="flex items-center gap-3">
					<span className="text-xl font-semibold text-gray-900">
						{formattedPrice(discountedPrice)}
					</span>
					{discount ? (
						<span className="text-base text-gray-500 line-through">
							{formattedPrice(price)}
						</span>
					) : null}
				</div>
			</div>
		</div>
	);
}
