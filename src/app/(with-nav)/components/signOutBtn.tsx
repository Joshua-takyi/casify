"use client";

import { Loader } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignOutBtn() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { data: session, status } = useSession();
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			setIsLoading(true);
			await signOut({ redirect: false });
			router.refresh();
			router.push("/");
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// This effect will re-run whenever the session status changes
	}, [session]);

	// Show loading spinner while checking session status
	if (status === "loading") {
		return (
			<button
				disabled
				className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed flex items-center justify-center"
			>
				<Loader className="h-4 w-4 animate-spin" />
			</button>
		);
	}

	// Show sign out button when user is signed in
	if (session?.user) {
		return (
			<button
				onClick={handleSignOut}
				disabled={isLoading}
				className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex items-center justify-center"
			>
				{isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Sign Out"}
			</button>
		);
	}

	// Show sign in button when user is not signed in
	return (
		<Link href="/auth/sign-in">
			<button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
				Sign In
			</button>
		</Link>
	);
}
