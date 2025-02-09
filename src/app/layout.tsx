import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/queryProviders";
import { Toaster } from "sonner";
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Casify - Premium Phone Accessories",
		template: "%s | Casify", // Dynamic title for subpages
	},
	description:
		"Discover premium phone accessories at Casify. Shop for stylish phone cases, screen protectors, chargers, and more. Protect and personalize your device today!",
	keywords: [
		"phone accessories",
		"phone cases",
		"screen protectors",
		"phone chargers",
		"premium phone accessories",
		"Casify",
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Toaster
					position="top-right"
					toastOptions={{ duration: 2000 }}
					richColors={true}
				/>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
