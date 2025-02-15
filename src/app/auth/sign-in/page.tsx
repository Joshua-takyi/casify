import { redirect } from "next/navigation";
import SignIn from "../component/sign.in";
import { auth } from "@/auth";
export default async function SignInPage() {
	const session = await auth();
	if (session) {
		redirect("/");
	} else {
		return (
			<main>
				<SignIn />
			</main>
		);
	}
}
