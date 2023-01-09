import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // `/admin` requires admin role
            if (req.nextUrl.pathname === "/admin") {
                return token?.userRole === "admin";
            }
            // `/dashboard` only requires the user to be logged in

            // TODO: add check for /onboard if firstName exists
            return !!token;
        }
    },
    pages: {
        signIn: "/authentication",
        error: "/error"
    }
});

export const config = { matcher: ["/dashboard/:path*"] };
