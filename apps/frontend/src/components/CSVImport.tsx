import { Button, Container, Group, Text, createStyles } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { IconDownload, IconUpload, IconX } from "@tabler/icons";
import { Dispatch, SetStateAction, useRef } from "react";

import { Transaction } from "@src/lib/types/api";

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
        marginBottom: 30
    },

    dropzone: {
        borderWidth: 1,
        paddingBottom: 50
    },

    icon: {
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.gray[4]
    },

    control: {
        position: "absolute",
        width: 250,
        left: "calc(50% - 125px)",
        bottom: -20
    }
}));

const parseCSV = (csvData: string) => {
    const rawData = csvData.split("\n");

    const txns = [];
    for (let i = 1; i < rawData.length; i += 1) {
        const rawTxn = rawData[i].split(",");

        const txn: Transaction = {
            date: new Date(rawTxn[0]),
            receivedQuantity: parseFloat(rawTxn[1]) || 0,
            receivedCurrency: rawTxn[2] || "",
            sentQuantity: parseFloat(rawTxn[3]) || 0,
            sentCurrency: rawTxn[4] || "",
            feeAmount: parseFloat(rawTxn[5]) || 0,
            feeCurrency: rawTxn[6] || "",
            tags: [(rawTxn[7] || "").toUpperCase()]
        };

        txns.push(txn);
    }

    return txns;
};

interface CSVImportProps {
    updateData: Dispatch<SetStateAction<Transaction[]>>;
}

const CSVImport = ({ updateData }: CSVImportProps) => {
    const { classes, theme } = useStyles();

    const openRef = useRef<() => void>(null);

    const readFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target?.result) return;

            const txnsData = parseCSV(e.target?.result as string);
            updateData(txnsData);
        };

        reader.readAsText(file);
    };

    const handleDrop = (files: FileWithPath[]) => {
        const file = files[0];

        // TODO: implement error handling for invalid file type
        if (file?.type === "text/csv") {
            readFile(file);
        }
    };

    return (
        <div className={classes.wrapper}>
            <Dropzone
                openRef={openRef}
                onDrop={handleDrop}
                className={classes.dropzone}
                radius="md"
                accept={[MIME_TYPES.csv]}
                maxSize={30 * 1024 ** 2}
            >
                <div style={{ pointerEvents: "none" }}>
                    <Group position="center">
                        <Dropzone.Accept>
                            <IconDownload
                                size={50}
                                color={theme.colors[theme.primaryColor][6]}
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                size={50}
                                color={theme.colors.red[6]}
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconUpload
                                size={50}
                                color={
                                    theme.colorScheme === "dark"
                                        ? theme.colors.dark[0]
                                        : theme.black
                                }
                                stroke={1.5}
                            />
                        </Dropzone.Idle>
                    </Group>

                    <Text align="center" weight={700} size="lg" mt="xl">
                        <Dropzone.Accept>Drop files here</Dropzone.Accept>
                        <Dropzone.Reject>
                            CSV file less than 30mb
                        </Dropzone.Reject>
                        <Dropzone.Idle>Import transactions</Dropzone.Idle>
                    </Text>
                    <Container size="sm">
                        <Text align="center" size="sm" mt="xs" color="dimmed">
                            Drag and drop files here to upload. We can accept
                            only <i>.csv</i> files that are less than 30mb in
                            size. Please follow the provided template to
                            properly format your transactions.
                        </Text>
                    </Container>
                </div>
            </Dropzone>

            <Button
                className={classes.control}
                size="md"
                radius="xl"
                onClick={() => openRef.current?.()}
            >
                Select files
            </Button>
        </div>
    );
};

export default CSVImport;
