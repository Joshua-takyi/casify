// components/SignOutBtn.tsx

import { handleSignOut } from "@/server/action";

export default function SignOutBtn() {
	return (
		<form action={handleSignOut}>
			<button type="submit" className="text-red-600 hover:text-red-700 p-3">
				Sign Out
			</button>
		</form>
	);
}
