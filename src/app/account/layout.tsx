import React from "react";
import AccountSideBar from "@/app/(with-nav)/components/accountSideBar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	if (!session) {
		redirect("/auth/sign-in");
	}
	return (
		<div>
			<AccountSideBar />
			<main>{children}</main>
		</div>
	);
}
