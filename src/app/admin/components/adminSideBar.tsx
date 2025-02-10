"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Menu,
	X,
	LayoutDashboard,
	ShoppingCart,
	Package,
	Plus,
	Users,
	Settings,
	BarChart,
	LogOut,
	LucideIcon,
} from "lucide-react";

// Types
interface NavLink {
	name: string;
	href: string;
	icon: LucideIcon;
}

interface TooltipProps {
	children: string;
	isVisible: boolean;
}

// Constants
const MOBILE_BREAKPOINT = 768;
const SIDEBAR_WIDTH = {
	open: 280,
	closed: 80,
};

const navLinks: NavLink[] = [
	{
		name: "Dashboard",
		href: "/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		name: "Analytics",
		href: "/admin/analytics",
		icon: BarChart,
	},
	{
		name: "Orders",
		href: "/admin/orders",
		icon: ShoppingCart,
	},
	{
		name: "Products",
		href: "/admin/products",
		icon: Package,
	},
	{
		name: "Add Product",
		href: "/admin/add-product",
		icon: Plus,
	},
	{
		name: "Customers",
		href: "/admin/customers",
		icon: Users,
	},
	{
		name: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
];

// Component for tooltips when sidebar is collapsed
const Tooltip = ({ children, isVisible }: TooltipProps) => {
	if (!isVisible) return null;

	return (
		<div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
			{children}
		</div>
	);
};

// Component for navigation links
const NavItem = ({
	link,
	isActive,
	isOpen,
	isMobile,
	onClick,
}: {
	link: NavLink;
	isActive: boolean;
	isOpen: boolean;
	isMobile: boolean;
	onClick?: () => void;
}) => {
	const Icon = link.icon;

	return (
		<Link
			href={link.href}
			onClick={onClick}
			className={`flex items-center h-12 px-3 rounded-lg transition-colors relative group ${
				isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"
			}`}
		>
			<span className="inline-flex items-center justify-center w-5 shrink-0">
				<Icon className="w-5 h-5" />
			</span>
			<motion.span
				animate={{ opacity: isOpen ? 1 : 0 }}
				className="ml-3 overflow-hidden whitespace-nowrap"
			>
				{link.name}
			</motion.span>
			<Tooltip isVisible={!isOpen && !isMobile}>{link.name}</Tooltip>
		</Link>
	);
};

export default function AdminSidebar() {
	const [isOpen, setIsOpen] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleResize = () => {
			const isMobileView = window.innerWidth < MOBILE_BREAKPOINT;
			setIsMobile(isMobileView);
			setIsOpen(!isMobileView);
		};

		// Initial check
		handleResize();

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleLogout = async () => {
		try {
			// Add your logout logic here
			console.log("Logging out...");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const sidebarAnimation = {
		initial: isMobile ? { x: -SIDEBAR_WIDTH.open } : false,
		animate: isMobile
			? { x: isOpen ? 0 : -SIDEBAR_WIDTH.open }
			: { width: isOpen ? SIDEBAR_WIDTH.open : SIDEBAR_WIDTH.closed },
		transition: {
			type: "spring",
			damping: 25,
			duration: 0.3,
		},
	};

	return (
		<>
			{/* Mobile Toggle Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
				aria-label="Open Sidebar"
			>
				<Menu className="w-5 h-5" />
			</button>

			{/* Mobile Overlay */}
			<AnimatePresence>
				{isMobile && isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 z-40 md:hidden"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<AnimatePresence>
				<motion.aside
					className="fixed md:sticky top-0 h-screen bg-white border-r shadow-md flex flex-col justify-between z-50 overflow-hidden"
					style={{ height: "100vh" }} //Ensure it takes the full height
					{...sidebarAnimation}
				>
					{/* Header */}
					<div className="flex flex-col flex-1 min-w-0">
						<div className="h-16 flex items-center justify-between px-4 border-b">
							<motion.div
								animate={{ opacity: isOpen ? 1 : 0 }}
								className="font-semibold text-lg overflow-hidden whitespace-nowrap"
							>
								Admin Dashboard
							</motion.div>
							<button
								onClick={() => setIsOpen(!isOpen)}
								className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
								aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
							>
								{isOpen ? (
									<X className="w-5 h-5" />
								) : (
									<Menu className="w-5 h-5" />
								)}
							</button>
						</div>

						{/* Navigation */}
						<nav className="flex-1 overflow-y-auto p-3 space-y-1">
							{navLinks.map((link) => (
								<NavItem
									key={link.href}
									link={link}
									isActive={pathname === link.href}
									isOpen={isOpen}
									isMobile={isMobile}
									onClick={() => isMobile && setIsOpen(false)}
								/>
							))}
						</nav>
					</div>

					{/* Footer */}
					<div className="border-t p-3">
						<button
							onClick={handleLogout}
							className="flex items-center w-full h-12 px-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors relative group"
						>
							<span className="inline-flex items-center justify-center w-5 shrink-0">
								<LogOut className="w-5 h-5" />
							</span>
							<motion.span
								animate={{ opacity: isOpen ? 1 : 0 }}
								className="ml-3 overflow-hidden whitespace-nowrap"
							>
								Logout
							</motion.span>
							<Tooltip isVisible={!isOpen && !isMobile}>Logout</Tooltip>
						</button>
					</div>
				</motion.aside>
			</AnimatePresence>
		</>
	);
}
