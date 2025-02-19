import React, { FC } from "react";
import Nav from "@/components/nav";
import Footer from "./components/footer";
const SecondLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<main>
			<Nav />
			{children}
			<Footer />
		</main>
	);
};

export default SecondLayout;
