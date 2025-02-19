"use client";
import Wrapper from "@/components/wrapper";
import SearchComponent from "@/components/search";
import Link from "next/link";
import CartSheet from "@/components/cartComponent";
import AccountDropdown from "./dropdown";
// import AnnouncementBar from "./announcementBar";

export default function Nav() {
	return (
		<div className="sticky top-0 z-50">
			{/* <AnnouncementBar /> */}
			<nav className="bg-white border-b border-gray-200">
				<Wrapper className="w-full flex justify-between items-center py-4 px-4 md:px-6">
					<Link
						href="/"
						className="flex items-center text-xl font-extrabold tracking-tight text-gray-900"
					>
						<span className="text-primary">CASIFY</span>
					</Link>

					<ul className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
						<li>
							<Link
								href={`/collection?category=phone-cases&available=true&limit=20`}
								className="hover:text-gray-900 transition-colors duration-200"
							>
								Phone Cases
							</Link>
						</li>
						<li className="border-l border-gray-300 pl-6">
							<Link
								href={`/collection?category=airpod-cases&available=true&limit=20`}
								className="hover:text-gray-900 transition-colors duration-200"
							>
								AirPods Cases
							</Link>
						</li>
						<li className="border-l border-gray-300 pl-6">
							<Link
								href={`/collection?category=airpod-cases&available=true&limit=20`}
								className="hover:text-gray-900 transition-colors duration-200"
							>
								Featured
							</Link>
						</li>
					</ul>

					<div className="flex items-center space-x-4">
						<AccountDropdown />
						<SearchComponent />
						<CartSheet />
					</div>
				</Wrapper>
			</nav>
		</div>
	);
}
