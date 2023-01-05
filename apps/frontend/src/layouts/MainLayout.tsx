import { ReactNode } from "react";

import NextHead from "@src/components/Head";

interface MainLayoutProps {
    pageTitle: string;
    children: ReactNode;
}

const MainLayout = ({ pageTitle, children }: MainLayoutProps) => (
    <>
        <NextHead title={`Aurora | ${pageTitle}`} />
        <main>{children}</main>
    </>
);

export default MainLayout;
