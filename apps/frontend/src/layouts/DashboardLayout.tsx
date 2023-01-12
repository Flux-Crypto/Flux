import { Flex } from "@mantine/core";
import { ReactNode } from "react";

import DashboardNavbar from "@src/components/global/dashboard/DashboardNavbar/DashboardNavbar";

import MainLayout from "./MainLayout";

interface DashboardLayoutProps {
    pageTitle: string;
    children: ReactNode;
}

const DashboardLayout = ({ pageTitle, children }: DashboardLayoutProps) => (
    <MainLayout {...{ pageTitle }}>
        <DashboardNavbar />
        <Flex h="100%" justify="center" align="center">
            {children}
        </Flex>
    </MainLayout>
);

export default DashboardLayout;
