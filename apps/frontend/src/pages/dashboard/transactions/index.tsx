import { Container, LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import callAPI from "@lib/callAPI";
import { UserSession } from "@lib/types/auth";
import TransactionsTable from "@src/components/transactions/TransactionsTable/TransactionsTable";
import DashboardLayout from "@src/layouts/DashboardLayout";

const Transactions = () => {
    const { data: session, status } = useSession();

    const [isFetching, setFetching] = useState(false);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (!session) return;

        setFetching(true);

        (async () => {
            const { authToken } = session as UserSession;

            const response = await callAPI("/v1/transactions", authToken);

            setFetching(false);

            if (!response.ok) {
                console.log(await response.text());
                return;
            }

            const transactionsData = await response.json();

            setTransactions(transactionsData);
        })();
    }, [session]);

    return (
        <DashboardLayout pageTitle="Transactions">
            <Container>
                <LoadingOverlay
                    visible={status === "loading" || isFetching}
                    overlayBlur={2}
                />

                <TransactionsTable data={transactions} />
            </Container>
        </DashboardLayout>
    );
};

export default Transactions;
