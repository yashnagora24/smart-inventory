import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
    if (!request.auth) {
        const loginUrl = new URL("/login", request.nextUrl.origin);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/products/:path*",
        "/sales/:path*",
        "/purchases/:path*",
        "/customers/:path*",
    ]
}