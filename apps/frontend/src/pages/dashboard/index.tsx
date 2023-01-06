import { AppShell, Box, Button, Flex } from "@mantine/core";
import { User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import MainLayout from "@layouts/MainLayout";

const Dashboard = () => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session) router.push("/login");
        if (!(session?.user as User)?.firstName) router.replace("/onboard");
    }, [router, session]);

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

export async function getServerSideProps({ req, res }: { req: any; res: any }) {
    const session = await unstable_getServerSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: "/login"
            }
        };
    }

    return {};
}

export default Dashboard;
