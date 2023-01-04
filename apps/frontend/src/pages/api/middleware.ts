import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set the paths that don't require the user to be signed in
const publicPaths = ["/", "/login", "/register", "/forgot-password"];

const isPublic = (path: string) =>
    publicPaths.find((x) =>
        path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
    );

export default withClerkMiddleware((request: NextRequest) => {
    if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    // if the user is not signed in redirect them to the sign in page.
    const { userId } = getAuth(request);

    if (!userId) {
        // redirect the users to /pages/login.ts
        console.log("testing");
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect_url", request.url);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
});

// Stop Middleware running on static files
export const config = { matcher: "/((?!.*\\.).*)" };
