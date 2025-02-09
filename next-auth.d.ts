// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
	interface User {
		id: string;
		email: string;
		role?: string;
		accessToken?: string;
	}

	interface Session {
		user: {
			id: string;
			email: string;
			role?: string;
			accessToken?: string;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		email?: string;
		role?: string;
		accessToken?: string;
	}
}
