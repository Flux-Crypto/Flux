import { Flex } from "@mantine/core";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

import DashboardNavbar from "@src/components/global/dashboard/DashboardNavbar/DashboardNavbar";
import { UserSession } from "@src/lib/types/auth";

import MainLayout from "./MainLayout";

interface DashboardLayoutProps {
    pageTitle: string;
    children: ReactNode;
}

const DashboardLayout = ({ pageTitle, children }: DashboardLayoutProps) => {
    const { data: session, status } = useSession();
    const {
        user: { firstName, lastName, email }
    } = session as UserSession;

    return (
        <MainLayout {...{ pageTitle }}>
            <DashboardNavbar
                name={`${firstName} ${lastName}`}
                {...{ email, status }}
            />
            <Flex h="100%" justify="center" align="center">
                {children}
            </Flex>
        </MainLayout>
    );
};

export default DashboardLayout;
