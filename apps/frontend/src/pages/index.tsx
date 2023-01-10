import { AppShell, Box, Flex } from "@mantine/core";

import MainLayout from "@layouts/MainLayout";

const Landing = () => (
    <MainLayout pageTitle="Dashboard">
        <AppShell padding="md">
            <Flex h="100%" justify="center" align="center">
                <Box>hi</Box>
            </Flex>
        </AppShell>
    </MainLayout>
);

export default Landing;
