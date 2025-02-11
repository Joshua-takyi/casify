import React, { FC } from "react";
import Nav from "@/components/nav";

const SecondLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return <main >
		<Nav/>
		{children}</main>;
};

export default SecondLayout;
