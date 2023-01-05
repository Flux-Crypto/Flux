import { useClerk } from "@clerk/nextjs";
import { AppShell, Box, Button, Flex } from "@mantine/core";
import { useRouter } from "next/router";

import AuthLayout from "@src/layouts/AuthLayout";

const Dashboard = () => {
    const router = useRouter();
    const { signOut } = useClerk();

    const logout = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <AuthLayout pageTitle="Dashboard">
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
        </AuthLayout>
    );
};

export default Dashboard;
