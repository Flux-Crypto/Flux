import { AppShell } from "@mantine/core";
import { ReactNode } from "react";

import NextHead from "@src/components/global/Head/Head";

interface MainLayoutProps {
    pageTitle: string;
    children: ReactNode;
}

const MainLayout = ({ pageTitle, children }: MainLayoutProps) => (
    <>
        <NextHead title={`Aurora | ${pageTitle}`} />
        <AppShell padding="md">{children}</AppShell>
    </>
);

export default MainLayout;
