import { withAuth } from "next-auth/middleware";

import { AuthorizedParams } from "./lib/types/auth";

// TODO: TYPE THIS
const authorized = ({ req, token }: AuthorizedParams) => {
    // `/admin` requires admin role
    if (req.nextUrl.pathname === "/admin") {
        return token?.userRole === "admin";
    }
    // `/dashboard` only requires the user to be logged in

    // TODO: add check for /onboard if firstName exists
    return !!token;
};

export default withAuth({
    callbacks: {
        authorized
    },
    pages: {
        signIn: "/authentication",
        error: "/error"
    }
});

export const config = { matcher: ["/dashboard/:path*"] };
