import { useClerk } from "@clerk/nextjs";
import { AppShell, Box, Button, Flex } from "@mantine/core";
import { useRouter } from "next/router";

function Dashboard() {
    const router = useRouter();
    const { signOut } = useClerk();

    const logout = async () => {
        await signOut();
        router.push("/login");
    };

    return (
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
    );
}

export default Dashboard;
