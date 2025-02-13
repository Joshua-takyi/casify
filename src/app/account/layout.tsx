import React from "react";
import AccountSideBar from "@/app/(with-nav)/components/accountSideBar";

export default function AccountLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex h-screen">
            <AccountSideBar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto ">
                {children}
            </main>
        </div>
    );
}