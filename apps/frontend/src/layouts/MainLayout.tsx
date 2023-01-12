import { AppShell, Box, createStyles } from "@mantine/core";
import { ReactNode } from "react";

import NextHead from "@src/components/Head";

interface MainLayoutProps {
    pageTitle: string;
    children: ReactNode;
}

const useStyles = createStyles((theme) => ({
    body: {
        display: "flex"
    },
    shell: {
        display: "flex",
        flexGrow: 1,
        height: "100%"
    }
}));

const MainLayout = ({ pageTitle, children }: MainLayoutProps) => {
    const { classes } = useStyles();
    return (
        <>
            <NextHead title={`Aurora | ${pageTitle}`} />
            <Box bg="cod_gray.8" className={classes.body}>
                <AppShell padding={0} className={classes.shell}>
                    {children}
                </AppShell>
            </Box>
        </>
    );
};

export default MainLayout;
