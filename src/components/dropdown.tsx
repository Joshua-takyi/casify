import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

const AccountDropdown = () => {
	return (
		<div className="flex items-center space-x-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild className=" cursor-pointer">
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-500 hover:text-gray-700"
					>
						<User className="w-5 h-5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem asChild>
						<Link href="/account/settings" className="w-full">
							Account Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/account/orders" className="w-full">
							Orders
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href="/auth/sign-in" className="w-full">
							Sign In
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default AccountDropdown;
