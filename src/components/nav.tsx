"use client";
import React from "react";
import Wrapper from "@/components/wrapper";
import SearchComponent from "@/components/search";
import Link from "next/link";
import { User, Search, ShoppingCart } from 'lucide-react'; // Import the icons

export default function Nav() {
	return (
		<nav className="sticky top-0 bg-white border-b border-gray-200 z-10"> {/* Sticky navigation */}
			<Wrapper className="w-full flex justify-between items-center py-4 px-4 md:px-6"> {/* Use Wrapper for consistent padding */}

				{/* Logo */}
				<Link href="/" className="flex items-center text-xl font-extrabold tracking-tight text-gray-900"> {/* Brand link */}
					<span className="text-primary">CASIFY</span>
				</Link>

				{/* Navigation Links (Shop, About, Featured) */}
				<ul className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700"> {/* Hide on small screens */}
					<li>
						<Link href="/collection?category=phone-cases&available=true&limit=20" className="hover:text-gray-900 transition-colors duration-200"> {/* Shop link */}
							Phone Cases
						</Link>
					</li>
					<li className="border-l border-gray-300 pl-6"> {/* Border to separate items */}
						<Link href="/airpods-cases" className="hover:text-gray-900 transition-colors duration-200"> {/* About link */}
							AirPods Cases
						</Link>
					</li>
					<li className="border-l border-gray-300 pl-6"> {/* Border to separate items */}
						<Link href="/featured" className="hover:text-gray-900 transition-colors duration-200"> {/* Featured link */}
							Featured
						</Link>
					</li>

				</ul>

				{/* Right-Side Icons (Account, Search, Cart) */}
				<div className="flex items-center space-x-4"> {/* Icons section */}
					<Link href="/account" className="text-gray-500 hover:text-gray-700 transition-colors duration-200"> {/* Account icon */}
						<User className="w-5 h-5" /> {/* User icon (Lucide React) */}
					</Link>

					<SearchComponent /> {/* Search component integration */}

					<Link href="/cart" className="text-gray-500 hover:text-gray-700 transition-colors duration-200 relative"> {/* Cart icon */}
						<ShoppingCart className="w-5 h-5" /> {/* Shopping cart icon (Lucide React) */}
						{/* Cart Count Badge (if needed) */}
						{/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span> */}
					</Link>
				</div>
			</Wrapper>
		</nav>
	);
}