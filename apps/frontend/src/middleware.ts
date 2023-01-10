import { withAuth } from "next-auth/middleware";

import { AuthorizedParams } from "@lib/types/auth";

// TODO: TYPE THIS
const authorized = ({ req, token }: AuthorizedParams) => {
    // `/admin` requires admin role
    if (req.nextUrl.pathname === "/admin") {
        return token?.userRole === "admin";
    }

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
