import { AppShell, Box, Button, Flex } from "@mantine/core";

import MainLayout from "@layouts/MainLayout";

const Landing = () => (
    <MainLayout pageTitle="Check Your Inbox">
        <AppShell padding="md">
            <Flex h="100%" justify="center" align="center">
                <Box>check your inbox for an email to sign in!</Box>
            </Flex>
        </AppShell>
    </MainLayout>
);

export default Landing;
