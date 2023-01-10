import { Button, Center, Stack } from "@mantine/core";
import { IconDatabaseImport } from "@tabler/icons";
import _ from "lodash";
import { useState } from "react";

import ImportTable from "@src/components/ImportTable";
import DashboardLayout from "@src/layouts/DashboardLayout";

import CSVImport from "../../../components/CSVImport";
import { Transaction } from "../../../lib/types/db";

const Import = () => {
    const [txns, setTxns] = useState<Transaction[]>([]);
    const [isFetching, setFetching] = useState(false);

    return (
        <DashboardLayout pageTitle="Import">
            <Center mt="xl">
                <Stack spacing="xl">
                    <CSVImport updateData={setTxns} />
                    {txns.length !== 0 && (
                        <>
                            <ImportTable
                                data={_.map(txns, (txn, idx) => ({
                                    idx,
                                    ...txn
                                }))}
                            />
                            <Button
                                type="submit"
                                size="md"
                                variant="gradient"
                                gradient={{
                                    from: "indigo",
                                    to: "violet"
                                }}
                                leftIcon={<IconDatabaseImport size={16} />}
                                loading={isFetching}
                            >
                                Save Transactions
                            </Button>
                        </>
                    )}
                </Stack>
            </Center>
        </DashboardLayout>
    );
};

export default Import;
