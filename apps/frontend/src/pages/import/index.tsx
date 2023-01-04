import { Button, Center, Stack } from "@mantine/core";
import { IconDatabaseImport } from "@tabler/icons";
import _ from "lodash";
import { useState } from "react";

import ImportTable from "@src/components/ImportTable";

import CSVImport from "../../components/CSVImport";
import { Transaction } from "../../lib/types";

function Import() {
    const [txns, setTxns] = useState<Transaction[]>([]);
    const [isFetching, setFetching] = useState(false);

    return (
        <Center mt="xl">
            <Stack spacing="xl">
                <CSVImport updateData={setTxns} />
                {txns.length !== 0 && (
                    <>
                        <ImportTable
                            data={_.map(txns, (txn, idx) => ({ idx, ...txn }))}
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
    );
}

export default Import;
