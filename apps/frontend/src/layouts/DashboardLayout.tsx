import { Box, Container, Flex, Title, createStyles } from "@mantine/core";
import { ReactNode } from "react";

import DashboardNavbar from "@src/components/global/dashboard/DashboardNavbar/DashboardNavbar";
import { UserSession } from "@src/lib/types/auth";

import Header from "@components/Header";

import MainLayout from "./MainLayout";

interface DashboardLayoutProps {
    pageTitle: string;
    children: ReactNode;
}

const useStyles = createStyles((theme) => ({
    parent: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%"
    },
    children: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        padding: theme.spacing.md
    }
}));
const DashboardLayout = ({ pageTitle, children }: DashboardLayoutProps) => {
    const { classes } = useStyles();
    
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
            <Box className={classes.parent}>
                <Header />
                <Flex className={classes.children}>{children}</Flex>
            </Box>
            <div
                id="portal"
                style={{ position: "fixed", left: 0, top: 0, zIndex: 9999 }}
            />
        </MainLayout>
    );
};

export default DashboardLayout;
