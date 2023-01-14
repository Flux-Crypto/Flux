import {
    Box,
    Button,
    Center,
    Flex,
    Group,
    LoadingOverlay,
    Notification,
    Stack,
    Text,
    Title,
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
import { useMemo, useState } from "react";

import callAPI from "@lib/callAPI";
import { UserSession } from "@lib/types/auth";
import { ImportContext } from "@src/contexts/importContext";
import { Transaction } from "@src/lib/types/api";

// import ImportTable from "@components/ImportTable";
import ImportTable from "@components/Table/ImportTable";
import CSVImport from "@components/transactions/import/CSVImport/CSVImport";
import DashboardLayout from "@layouts/DashboardLayout";

const Import = () => {
    const { data: session, status } = useSession();

    // TODO: implement selection from ImportTable
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isFetching, setFetching] = useState(false);
    const [rowSelection, setRowSelection] = useState({});

    const [error, setError] = useState("");
    const [isNotificationVisible, toggleNotificationVisible] = useState(false);

    const saveTransactions = async () => {
        if (!session) return;

        setFetching(true);

        const { authToken } = session as UserSession;

        const keys = Object.keys(rowSelection);
        const payload = _.filter(transactions, (_val: any, index: number) =>
            keys.includes(index.toString())
        );
        const response = await callAPI(`/v1/transactions`, authToken, {
            method: "POST",
            body: JSON.stringify({ transactions: payload })
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

    const contextValues = useMemo(
        () => ({ rowSelection, setRowSelection }),
        [rowSelection, setRowSelection]
    );

    return (
        <DashboardLayout pageTitle="Import Transactions">
            <ImportContext.Provider value={contextValues}>
                <Center w="100%">
                    <Stack spacing="md" w="100%">
                        <LoadingOverlay
                            visible={status === "loading"}
                            overlayBlur={2}
                        />
                        <Flex align="center" className="justify-between">
                            <Box className="space-y-1">
                                <Title order={3} m={0} color="gray.1">
                                    Import Transactions
                                </Title>
                                <Text fz="md" m={0} color="gray.5">
                                    {!transactions.length
                                        ? "Upload file containing transactions"
                                        : "Select transactions to import"}
                                </Text>
                            </Box>
                            {!!transactions.length && (
                                <Flex align="flex-end">
                                    <Group position="center">
                                        <Button
                                            className="font-medium"
                                            variant="outline"
                                            color="red"
                                            leftIcon={<IconTrashX size={16} />}
                                            onClick={() => setTransactions([])}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            disabled={
                                                !Object.keys(rowSelection)
                                                    .length
                                            }
                                            className="font-medium"
                                            variant="gradient"
                                            gradient={{
                                                from: "indigo",
                                                to: "violet"
                                            }}
                                            leftIcon={
                                                <IconDatabaseImport size={16} />
                                            }
                                            loading={isFetching}
                                            onClick={() => saveTransactions()}
                                        >
                                            Save Transactions
                                        </Button>
                                    </Group>
                                </Flex>
                            )}
                        </Flex>
                        {!transactions.length ? (
                            <CSVImport updateData={setTransactions} />
                        ) : (
                            <Stack spacing="md">
                                <ImportTable data={transactions} />
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
                                                error
                                                    ? "couldn't save"
                                                    : "saved"
                                            }!`}
                                            onClose={() =>
                                                toggleNotificationVisible(false)
                                            }
                                        >
                                            {error}
                                        </Notification>
                                    )}
                                </Transition>
                            </Stack>
                        )}
                    </Stack>
                </Center>
            </ImportContext.Provider>
        </DashboardLayout>
    );
};

export default Import;
