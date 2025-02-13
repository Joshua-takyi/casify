import React from "react";

export default function Wrapper({ children,className }: { children: React.ReactNode, className?: string }) {
	return (
		<section className={`container mx-auto md:px-18 lg:px-24 px-3.5 ${className}`}>
			{children}
		</section>
	);
}
