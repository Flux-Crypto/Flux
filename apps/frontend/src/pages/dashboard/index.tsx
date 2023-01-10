import { Box, Button } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";

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

export default Dashboard;
