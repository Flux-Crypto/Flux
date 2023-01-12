import { Box, Container, Flex, Title, createStyles } from "@mantine/core";
import { ReactNode } from "react";

import DashboardNavbar from "@src/components/DashboardNavbar";

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
    return (
        <MainLayout {...{ pageTitle }}>
            <DashboardNavbar />
            <Box className={classes.parent}>
                <Header pageTitle={pageTitle} />
                <Flex className={classes.children}>{children}</Flex>
            </Box>
        </MainLayout>
    );
};

export default DashboardLayout;
