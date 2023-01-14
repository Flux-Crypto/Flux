import { Box, Flex, createStyles } from "@mantine/core";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

import DashboardNavbar from "@src/components/dashboard/DashboardNavbar/DashboardNavbar";
import Header from "@src/components/dashboard/Header/Header";
import { UserSession } from "@src/lib/types/auth";

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

    if (status === "loading") {
        return null;
    }

    const {
        user: { firstName, lastName, email }
    } = session as UserSession;

    return (
        <MainLayout {...{ pageTitle }}>
            <DashboardNavbar name={`${firstName} ${lastName}`} {...{ email }} />
            <Box className={classes.parent}>
                <Header />
                <Flex className={classes.children}>{children}</Flex>
            </Box>
        </MainLayout>
    );
};

export default DashboardLayout;
