import React from "react";

export default function Wrapper({ children }: { children: React.ReactNode }) {
	return (
		<section className="@container mx-auto @md:px-15 px-3.5">
			{children}
		</section>
	);
}
