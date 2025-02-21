import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

const AccountDropdown = () => {
	return (
		<Link href={"/auth/sign-in"} className="flex items-center space-x-4">
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
