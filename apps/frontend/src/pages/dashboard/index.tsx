import { useAuth, useClerk } from "@clerk/nextjs";
import { AppShell, Box, Button, Flex } from "@mantine/core";
import { useRouter } from "next/router";

import MainLayout from "@layouts/MainLayout";

const Dashboard = () => {
    const router = useRouter();
    const { signOut } = useClerk();
    const { sessionId } = useAuth();

    const logout = async () => {
        await signOut();
        router.push("/login");
    };

    console.log(sessionId);

    return (
        <MainLayout pageTitle="Dashboard">
            <AppShell padding="md">
                <Flex h="100%" justify="center" align="center">
                    <Box>
                        <Button
                            type="button"
                            onClick={() => logout()}
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
