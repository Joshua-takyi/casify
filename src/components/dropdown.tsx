import React from "react";

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

const AccountDropdown = () => {
	return (
		<Link
			href={"/account/settings"}
			className="flex items-center space-x-4 cursor-pointer"
			title="account"
		>
			<Button
				variant="ghost"
				size="icon"
				className="text-gray-500 hover:text-gray-700"
			>
				<User className="w-5 h-5" />
			</Button>
		</Link>
	);
};

export default AccountDropdown;
