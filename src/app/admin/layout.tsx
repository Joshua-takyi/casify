import React from "react";
import AdminSidebar from "./components/adminSideBar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (session?.user.role !== "admin") {
		redirect("/");
	}
	return (
		<div className="flex h-screen font-family-apercu-pro">
			{/* <div className=""> */}
			<AdminSidebar />
			{/* </div> */}
			<main className="flex-1 overflow-x-hidden overflow-y-auto">
				{children}
			</main>
		</div>
	);
}
