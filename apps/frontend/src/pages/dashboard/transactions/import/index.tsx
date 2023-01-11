import {
    Button,
    Center,
    Group,
    LoadingOverlay,
    Notification,
    Stack,
    Transition
} from "@mantine/core";
import {
    IconCheck,
    IconDatabaseImport,
    IconTrashX,
    IconX
} from "@tabler/icons";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useState } from "react";

import callAPI from "@lib/callAPI";
import { UserSession } from "@lib/types/auth";
import { Transaction } from "@lib/types/db";

import CSVImport from "@components/CSVImport";
import ImportTable from "@components/ImportTable";
import DashboardLayout from "@layouts/DashboardLayout";

const Import = () => {
    const { data: session, status } = useSession();

    // TODO: implement selection from ImportTable
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isFetching, setFetching] = useState(false);

    const [error, setError] = useState("");
    const [isNotificationVisible, toggleNotificationVisible] = useState(false);

    const saveTransactions = async () => {
        if (!session) return;

        setFetching(true);

        const { authToken } = session as UserSession;

        const response = await callAPI(`/v1/transactions`, authToken, {
            method: "POST",
            body: JSON.stringify({ transactions })
        });

        setFetching(false);
        toggleNotificationVisible(true);

        if (!response.ok) {
            setError(response.statusText);
            return;
        }

        setTimeout(() => toggleNotificationVisible(false), 5000);
        setTransactions([]);
    };

    return (
        <DashboardLayout pageTitle="Import Transactions">
            <Center mt="xl">
                <Stack spacing="xl">
                    <LoadingOverlay
                        visible={status === "loading"}
                        overlayBlur={2}
                    />
                    {!transactions.length ? (
                        <CSVImport updateData={setTransactions} />
                    ) : (
                        <>
                            <ImportTable
                                data={_.map(transactions, (txn, idx) => ({
                                    idx,
                                    ...txn
                                }))}
                            />
                            <Group position="center" grow>
                                <Button
                                    variant="outline"
                                    color="red"
                                    size="md"
                                    uppercase
                                    leftIcon={<IconTrashX size={16} />}
                                    onClick={() => setTransactions([])}
                                >
                                    Clear
                                </Button>
                                <Button
                                    size="md"
                                    variant="gradient"
                                    gradient={{
                                        from: "indigo",
                                        to: "violet"
                                    }}
                                    leftIcon={<IconDatabaseImport size={16} />}
                                    loading={isFetching}
                                    onClick={() => saveTransactions()}
                                >
                                    Save Transactions
                                </Button>
                            </Group>
                            <Transition
                                mounted={isNotificationVisible}
                                transition="slide-down"
                                duration={400}
                                timingFunction="ease"
                            >
                                {(styles) => (
                                    <Notification
                                        style={styles}
                                        icon={
                                            error ? (
                                                <IconX size={18} />
                                            ) : (
                                                <IconCheck size={18} />
                                            )
                                        }
                                        color={error ? "red" : "teal"}
                                        title={`Transactions ${
                                            error ? "couldn't save" : "saved"
                                        }!`}
                                        onClose={() =>
                                            toggleNotificationVisible(false)
                                        }
                                    >
                                        {error}
                                    </Notification>
                                )}
                            </Transition>
                        </>
                    )}
                </Stack>
            </Center>
        </DashboardLayout>
    );
};

export default Import;
