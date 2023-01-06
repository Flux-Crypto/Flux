import { AppShell, Box, Button, Flex } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import MainLayout from "@layouts/MainLayout";

const Dashboard = () => {
    const { data: session } = useSession();

    return (
        <MainLayout pageTitle="Dashboard">
            <AppShell padding="md">
                <Flex h="100%" justify="center" align="center">
                    <Box>
                        <Button
                            onClick={() => console.log(session)}
                            type="button"
                        >
                            Log session
                        </Button>
                        <Button
                            type="button"
                            onClick={() => signOut()}
                            fullWidth
                            mt="xl"
                        >
                            Logout
                        </Button>
                    </Box>
                </Flex>
            </AppShell>
        </MainLayout>
    );
};

export default Dashboard;
