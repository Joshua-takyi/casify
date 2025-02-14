"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Bars3Icon,
	XMarkIcon,
	ShoppingBagIcon,
	// MapPinIcon,
	// CreditCardIcon,
	// ShieldCheckIcon,
	// HeartIcon,
	// GiftIcon,
	UserIcon,
	// ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import SignOutBtn from "./signOutBtn";

// Types
interface NavLink {
	name: string;
	href: string;
	icon: React.ElementType;
	description: string;
}

interface NavItemProps {
	link: NavLink;
	isActive: boolean;
	onClick?: () => void;
}

// Constants
const SIDEBAR_WIDTH = 280;
const MOBILE_BREAKPOINT = 768;

const navLinks: NavLink[] = [
	{
		name: "Orders",
		href: "/account/orders",
		icon: ShoppingBagIcon,
		description: "View and manage your orders",
	},
	// {
	// 	name: "Addresses",
	// 	href: "/account/addresses",
	// 	icon: MapPinIcon,
	// 	description: "Manage your shipping addresses",
	// },
	// {
	// 	name: "Payments",
	// 	href: "/account/payments",
	// 	icon: CreditCardIcon,
	// 	description: "Manage payment methods",
	// },
	// {
	// 	name: "Security",
	// 	href: "/account/security",
	// 	icon: ShieldCheckIcon,
	// 	description: "Update security settings",
	// },
	// {
	// 	name: "Wishlist",
	// 	href: "/account/wishlist",
	// 	icon: HeartIcon,
	// 	description: "View saved items",
	// },
	// {
	// 	name: "Rewards",
	// 	href: "/account/rewards",
	// 	icon: GiftIcon,
	// 	description: "Check your rewards",
	// },
	{
		name: "Account",
		href: "/account/settings",
		icon: UserIcon,
		description: "Manage account details",
	},
];

const NavItem = ({ link, isActive, onClick }: NavItemProps) => {
	const Icon = link.icon;

	return (
		<Link href={link.href} onClick={onClick}>
			<motion.div
				className={`flex items-center p-3 rounded-lg cursor-pointer
                    ${
											isActive
												? "bg-indigo-100 text-indigo-600"
												: "hover:bg-gray-100 text-gray-600"
										}
                    transition-colors duration-200`}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
			>
				<Icon className="w-6 h-6" />
				<span className="ml-3 text-sm font-medium whitespace-nowrap">
					{link.name}
				</span>
			</motion.div>
		</Link>
	);
};

export default function AccountSidebar() {
	const [isMobile, setIsMobile] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	// const router = useRouter();

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < MOBILE_BREAKPOINT;
			setIsMobile(mobile);
			// On desktop, always show the sidebar
			if (!mobile) {
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			{/* Mobile Toggle Button */}
			{isMobile && !isOpen && (
				<motion.button
					onClick={() => setIsOpen(true)}
					className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Bars3Icon className="w-6 h-6 text-gray-600" />
				</motion.button>
			)}

			{/* Mobile Overlay */}
			<AnimatePresence>
				{isMobile && isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.5 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black z-40 md:hidden"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<AnimatePresence>
				{(isOpen || !isMobile) && (
					<motion.aside
						className={`${
							isMobile ? "fixed" : "relative"
						} top-0 left-0 h-full bg-white z-50 flex flex-col
                            ${
															isMobile
																? "shadow-xl"
																: "border-r border-gray-200"
														}
                            md:relative md:translate-x-0`}
						style={{ width: SIDEBAR_WIDTH }}
						initial={isMobile ? { x: -SIDEBAR_WIDTH } : undefined}
						animate={{ x: 0 }}
						exit={isMobile ? { x: -SIDEBAR_WIDTH } : undefined}
						transition={{ type: "spring", damping: 20 }}
					>
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b">
							<Link
								href={"/"}
								className="text-lg font-semibold text-gray-800 uppercase"
							>
								Casify
							</Link>
							{isMobile && (
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setIsOpen(false)}
									className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
								>
									<XMarkIcon className="w-5 h-5 text-gray-600" />
								</motion.button>
							)}
						</div>

						{/* Navigation */}
						<nav className="flex-1 overflow-y-auto p-4 space-y-2">
							{navLinks.map((link) => (
								<NavItem
									key={link.href}
									link={link}
									isActive={pathname === link.href}
									onClick={() => isMobile && setIsOpen(false)}
								/>
							))}
						</nav>

						{/* Footer */}
						<section>
							<SignOutBtn />
						</section>
					</motion.aside>
				)}
			</AnimatePresence>
		</>
	);
}
