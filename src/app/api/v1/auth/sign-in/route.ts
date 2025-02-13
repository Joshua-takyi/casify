// /app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { SignInAction } from "@/server/action";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const result = await SignInAction({ email, password });

        if (!result.success) { // Check the success property of the result
            return NextResponse.json({
                message: result.error || "An error occurred whiles logging in",
            }, {
                status: 401 // or a more appropriate error status
            });
        }

        return NextResponse.json({
            message: result.message || "Successfully logged in",
            data: result
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            message: `failed to sign in`,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 }); // Server error
    }
}