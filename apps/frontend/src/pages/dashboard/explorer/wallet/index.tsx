import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Group,
    LoadingOverlay,
    Stack,
    Text,
    TextInput,
    Title,
    Transition,
    createStyles
} from "@mantine/core";
import {
    IconCheck,
    IconDatabaseImport,
    IconTrashX,
    IconX
} from "@tabler/icons";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";

import callAPI from "@lib/callAPI";
import { BlockchainTransactionsResponse } from "@lib/types/api";
import { UserSession } from "@lib/types/auth";

import ChainTransactionsTable from "@components/Table/ChainTransactionsTable";
import DashboardLayout from "@layouts/DashboardLayout";

const useStyles = createStyles((theme) => ({
    container: {
        display: "flex",
        flexGrow: 1,
        height: "100%"
    }
}));

const Transactions = () => {
    const [isFetching, setFetching] = useState(true);
    const [transactionsData, setTransactionsData] =
        useState<BlockchainTransactionsResponse>({
            total: 0,
            page: 0,
            pageKey: "",
            result: []
        });
    const [walletInfo, setWalletInfo] = useState(null);
    const { classes } = useStyles();
    const [address, setAddress] = useState("");

    const { data: session, status } = useSession();

    const fetchWallet = async () => {
        const { authToken } = session as UserSession;

        const response = await callAPI(
            `/v1/explorer/wallet/${address}`,
            authToken
        );
        const data = await response.json();
        setTransactionsData(data);
    };

    const fetchInfo = async () => {
        const { authToken } = session as UserSession;

        const response = await callAPI(
            `/v1/explorer/wallet/${address}/info`,
            authToken
        );
        const data = await response.json();
        console.log(data);
    };

    return (
        <DashboardLayout pageTitle="Wallet Explorer">
            <Center w="100%">
                <Stack spacing="md" w="100%">
                    <LoadingOverlay
                        visible={status === "loading"}
                        overlayBlur={2}
                    />
                    <Flex align="center" className="justify-between">
                        <Box className="space-y-1">
                            <Title order={3} m={0} color="gray.1">
                                Wallet Explorer
                            </Title>
                            <Text fz="md" m={0} color="gray.5">
                                View transactions for wallets
                            </Text>
                        </Box>
                    </Flex>
                    <Group>
                        <TextInput
                            placeholder="Search wallet address..."
                            className=""
                            value={address}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                setAddress(event.target.value.toLowerCase())
                            }
                        />
                        <Button onClick={() => fetchWallet()}>fetch</Button>
                        <Button onClick={() => fetchInfo()}>fetch info</Button>
                    </Group>
                    <ChainTransactionsTable
                        walletAddress={address}
                        data={transactionsData.result}
                    />
                    <button onClick={() => console.log(transactionsData)}>
                        log
                    </button>
                </Stack>
            </Center>
        </DashboardLayout>
    );
};

export default Transactions;
