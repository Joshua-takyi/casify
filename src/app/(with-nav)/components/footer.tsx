"use client";

import Wrapper from "@/components/wrapper";
import { SelectCategories } from "@/database/db";
import { EnvelopeIcon, MapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
export default function Footer() {
	return (
		<footer className="bg-[#f5f5f7] md:my-10">
			<Wrapper>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Categories Grid */}
					<div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[0.7rem] border-t border-gray-200 pt-8">
						{/* Shop and Learn */}
						<div className="space-y-4">
							<h3 className="font-semibold">Shop and Learn</h3>
							<ul className="space-y-3">
								<li>
									{SelectCategories.map((category) => (
										<div key={category.label}>
											{category.items
												.sort((a, b) => a.label.localeCompare(b.label))
												.map((item) => (
													<Link
														key={item.label}
														href={`/collection?category=${item.value}&available=true&limit=20`}
														className="text-gray-500 hover:text-gray-700 flex flex-col gap-2"
													>
														{item.label}
													</Link>
												))}
										</div>
									))}
								</li>
								<li>
									<Link
										href="/iphone-cases"
										className="text-gray-500 hover:text-gray-700"
									>
										iPhone Cases
									</Link>
								</li>
								{/* ... rest of the Shop and Learn links ... */}
							</ul>
						</div>

						{/* Services */}
						<div className="space-y-4">
							<h3 className="font-semibold">Services</h3>
							<ul className="space-y-3">
								<li>
									<Link
										href="/custom-cases"
										className="text-gray-500 hover:text-gray-700"
									>
										Custom Cases
									</Link>
								</li>
								{/* ... rest of the Services links ... */}
							</ul>
						</div>

						{/* About Us */}
						<div className="space-y-4">
							<h3 className="font-semibold">About Us</h3>
							<ul className="space-y-3">
								<li>
									<Link
										href="/about"
										className="text-gray-500 hover:text-gray-700"
									>
										Our Story
									</Link>
								</li>
								{/* ... rest of the About Us links ... */}
							</ul>
						</div>

						{/* Contact */}
						<div className="space-y-4">
							<h3 className="font-semibold">Contact</h3>
							<ul className="space-y-3">
								<li className="flex items-center gap-2 text-gray-500">
									<EnvelopeIcon className="w-3 h-3" />
									<a href="mailto:hello@casify.com">hello@casify.com</a>
								</li>
								<li className="flex items-center gap-2 text-gray-500">
									<MapIcon className="w-3 h-3" />
									<span>123 Business Street</span>
								</li>
							</ul>
						</div>

						{/* Social */}
					</div>

					{/* Bottom Section */}
					<div className="mt-8 pt-8 border-t border-gray-200 text-[0.7rem]">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							<p className="text-gray-500">
								© {new Date().getFullYear()} Casify. All rights reserved.
							</p>
							<div className="flex gap-6 text-gray-500">
								<Link href="/privacy" className="hover:text-gray-700">
									Privacy Policy
								</Link>
								<Link href="/terms" className="hover:text-gray-700">
									Terms of Service
								</Link>
								<Link href="/sitemap" className="hover:text-gray-700">
									Site Map
								</Link>
							</div>
						</div>
					</div>
				</div>
			</Wrapper>
		</footer>
	);
}
