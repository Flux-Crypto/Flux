import { Container, Flex, LoadingOverlay, createStyles } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import callAPI from "@lib/callAPI";
import { UserSession } from "@lib/types/auth";

import TransactionsTable from "@components/Table/TransactionsTable";
import DashboardLayout from "@layouts/DashboardLayout";

const useStyles = createStyles((theme) => ({
    container: {
        display: "flex",
        flexGrow: 1,
        height: "100%"
    }
}));

const Transactions = () => {
    const { data: session, status } = useSession();

    const [isFetching, setFetching] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const { classes } = useStyles();

    useEffect(() => {
        if (!session) return;

        if (isFetching) {
            const { authToken } = session as UserSession;
            const fetchImportedTransactions = async () => {
                // get imported txns
                const response = await callAPI("/v1/transactions", authToken);

                if (!response.ok) {
                    console.log(await response.text());
                    return;
                }

                const transactionsData = await response.json();

                setTransactions(transactionsData);
            };
            const fetchBlockchainTransactions = async () => {
                const response = await callAPI("/v1/user", authToken);
                // get imported txns
                const response = await callAPI("/v1/wallets", authToken);

                if (!response.ok) {
                    console.log(await response.text());
                    return;
                }

                const transactionsData = await response.json();

                setTransactions(transactionsData);
            };

            Promise.all([fetchImportedTransactions, fetchWallets])
        }
    }, [isFetching, session]);

    return (
        <DashboardLayout pageTitle="Transactions">
            <Flex className={classes.container}>
                <LoadingOverlay
                    visible={status === "loading" || isFetching}
                    overlayBlur={2}
                />

                {!isFetching && <TransactionsTable data={transactions} />}
            </Flex>
        </DashboardLayout>
    );
};

export default Transactions;
