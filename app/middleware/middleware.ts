import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token");
    console.log("Token:", token);
    const isAuthPage = req.nextUrl.pathname === "/login"; 
    const isProtectedRoute = !isAuthPage;

    if (!token && isProtectedRoute) {
        console.log("Redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token && isAuthPage) {
        console.log('entrei')
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
