import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/queryProviders";
import { Toaster } from "sonner";
import localFont from "next/font/local"; // Correct import



const apercuMono = localFont({ // Correct variable name
	src: "../fonts/apercu-mono-pro-regular.woff2",
	display: 'swap', // Add display swap for performance.  Important for local fonts!
	variable: '--font-apercu-mono', // Add a variable name
});
const apercuPro = localFont({ // Correct variable name
	src: "../fonts/apercu-pro-regular.woff2",
	display: 'swap', // Add display swap for performance.  Important for local fonts!
	variable: '--font-apercu-pro', // Add a variable name
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
		<html lang="en" suppressHydrationWarning={true}>
		<body
			className={`${apercuMono.className} ${apercuPro.variable} antialiased`}
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