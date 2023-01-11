import { AppShell, Box, Button, Flex } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { getSession, signOut, useSession } from "next-auth/react";

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

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    const session = await getSession({ req });

    if (session && !session?.user?.firstName) {
        return {
            redirect: {
                destination: "/onboard"
            }
        };
    }

    return {
        props: {}
    };
}

export default Dashboard;
