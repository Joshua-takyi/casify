import { auth } from "@/auth";
import { cache } from "react";

export const GetSession = cache(async () => {
	const session = await auth();
	if (!session) {
		return null;
	}
	return session;
});
