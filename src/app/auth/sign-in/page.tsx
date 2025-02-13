// import { redirect } from "next/navigation";
import SignIn from "../component/sign.in";
import { auth } from "@/auth";
// import {auth} from "@/auth";
// import {redirect} from "next/navigation";

export default async function SignInPage() {
	const session = await auth();
	if (session) {
		console.log(session);
	} else {
		return (
			<main>
				<SignIn />
			</main>
		);
	}
}
