import { auth } from "@/auth";
import SignUp from "../component/sign.up";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
	const session = await auth();
	if (session) {
		redirect("/");
	}
	return <SignUp />;
}
