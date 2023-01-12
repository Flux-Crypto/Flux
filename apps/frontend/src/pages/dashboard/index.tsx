import { AppShell, Box, Button, Flex } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { getSession, signOut, useSession } from "next-auth/react";

import DashboardLayout from "@src/layouts/DashboardLayout";

const Dashboard = () => {
    const { data: session } = useSession();

    return (
        <DashboardLayout pageTitle="Dashboard">
            <Box>
                <Button onClick={() => console.log(session)} type="button">
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
        </DashboardLayout>
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
