"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Bars3Icon,
	XMarkIcon,
	ShoppingBagIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import SignOutBtn from "./signOutBtn";

const SIDEBAR_WIDTH = 280;

const navLinks = [
	{
		name: "Orders",
		href: "/account/orders",
		icon: ShoppingBagIcon,
		description: "View and manage your orders",
	},
	{
		name: "Account",
		href: "/account/settings",
		icon: UserIcon,
		description: "Manage account details",
	},
];

interface NavLink {
	name: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	description: string;
}

const NavItem = ({
	link,
	isActive,
	onClick,
}: {
	link: NavLink;
	isActive: boolean;
	onClick: () => void;
}) => {
	const Icon = link.icon;

	return (
		<Link href={link.href} onClick={onClick}>
			<motion.div
				className={`flex items-center p-3 rounded-lg cursor-pointer ${
					isActive
						? "bg-indigo-100 text-indigo-600"
						: "hover:bg-gray-100 text-gray-600"
				} transition-colors duration-200`}
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
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	return (
		<div>
			{/* Toggle Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
			>
				<Bars3Icon className="w-6 h-6 text-gray-600" />
			</button>

			{/* Sidebar Overlay */}
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.5 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black z-40"
							onClick={() => setIsOpen(false)}
						/>

						<motion.aside
							initial={{ x: -SIDEBAR_WIDTH }}
							animate={{ x: 0 }}
							exit={{ x: -SIDEBAR_WIDTH }}
							transition={{ type: "tween", duration: 0.2 }}
							className="fixed top-0 left-0 h-full bg-white z-50 shadow-xl"
							style={{ width: SIDEBAR_WIDTH }}
						>
							<div className="flex flex-col h-full">
								<div className="flex items-center justify-between p-4 border-b">
									<Link
										href="/"
										className="text-lg font-semibold text-gray-800 uppercase"
									>
										Casify
									</Link>
									<button
										onClick={() => setIsOpen(false)}
										className="p-2 rounded-lg hover:bg-gray-100"
									>
										<XMarkIcon className="w-5 h-5 text-gray-600" />
									</button>
								</div>

								<nav className="flex-1 overflow-y-auto p-4 space-y-2">
									{navLinks.map((link) => (
										<NavItem
											key={link.href}
											link={link}
											isActive={pathname === link.href}
											onClick={() => setIsOpen(false)}
										/>
									))}
								</nav>

								<div className="mt-auto p-4 border-t">
									<SignOutBtn />
								</div>
							</div>
						</motion.aside>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
