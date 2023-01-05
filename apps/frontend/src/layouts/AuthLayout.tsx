import type { AuthData } from "@clerk/nextjs/dist/server/types";
import { buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import { ReactNode } from "react";

import NextHead from "@src/components/Head";

interface AuthLayoutProps {
    pageTitle: string;
    children: ReactNode;
}

const AuthLayout = ({ pageTitle, children }: AuthLayoutProps) => (
    <>
        <NextHead title={`Aurora | ${pageTitle}`} />
        <main>{children}</main>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { userId }: AuthData = getAuth(req);
    const user = userId ? await clerkClient.users.getUser(userId) : null;

    console.log(userId);
    if (!userId) {
        return { redirect: { destination: "/login", permanent: true } };
    }

    return { props: { ...buildClerkProps(req, { user }) } };
};

export default AuthLayout;
