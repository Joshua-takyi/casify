import React from "react";
import AdminSidebar from "./components/adminSideBar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen">
			{/* <div className=""> */}
			<AdminSidebar />
			{/* </div> */}
			<main className="flex-1 overflow-x-hidden overflow-y-auto">
				{children}
			</main>
		</div>
	);
}
