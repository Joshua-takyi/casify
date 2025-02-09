import React, { FC } from "react";

const SecondLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return <main>{children}</main>;
};

export default SecondLayout;
