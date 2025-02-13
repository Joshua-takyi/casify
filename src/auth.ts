import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ConnectDb } from "./libs/connect";
import { UserModel } from "./models/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not defined");

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			name: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
				},
				password: {
					type: "password",
					label: "password",
				},
			},

			async authorize(credentials) {
				const { email, password } = credentials;
				if (!email || !password) {
					return null;
				}
				try {
					await ConnectDb();
					const user = await UserModel.findOne({ email: email }).select(
						"+password role"
					);
					if (!user) {
						return null;
					}
					const comparedPassword = await bcrypt.compare(
						password as string,
						user.password as string
					);
					if (!comparedPassword) {
						throw new Error("invalid email or password")
					}

					const accessToken = jwt.sign(
						{ id: user._id, name: user.name, role: user.role },
						jwtSecret,
						{
							expiresIn: "1h",
						}
					);
					return {
						id: user._id.toString(),
						name: user.name,
						role: user.role,
						accessToken,
					};
				} catch (error) {
					throw new Error(
						`failed to sign user in ${
							error instanceof Error ? error.message : String(error)
						}`
					);
				}
			},
		}),
	],
	pages: {
		signIn: "/auth/sign-in",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async jwt({token, user}) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.email = user.email;
				token.accessToken = user.accessToken
			}
			return token
		},

		async session({session, token}) {
			// Add token data to the session
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.email = token.email as string;
				session.user.accessToken = token.accessToken as string; // Add accessToken to the session
			}
			return session;
		},
	},
});
