import { Box, Checkbox, Stack, createStyles } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";

import { BlockchainTransaction, Transaction } from "@lib/types/api";

import DateCell from "@components/Table/Cells/DateCell";
import QuantityCell from "@components/Table/Cells/QuantityCell";

import AddressCell from "./Cells/AddressCell";
import TxnAmountCell from "./Cells/TxnAmountCell";
import TxnHashCell from "./Cells/TxnHashCell";
import TxnTypeCell from "./Cells/TxnTypeCell";
import Table from "./Table";

dayjs.extend(utc);

const DateCellWrapper = (props: any) => {
    const { cell } = props;
    const dateTime = dayjs(cell.getValue());
    const date = dateTime.format("MMM D, YYYY");
    const time = dateTime.format("hh:mm:ss A");
    return <DateCell {...{ date, time }} />;
};

const TxnHashCellWrapper = (props: any) => {
    const { cell } = props;
    return (
        // TODO: Display full address on hover as tooltip
        <TxnHashCell
            hash={cell.getValue()}
            number={cell.row.original.blockNumber}
        />
    );
};

const TxnAmountCellWrapper = (props: any) => {
    const { cell } = props;
    const { value } = cell.row.original;
    const { logo, symbol, address, decimals } = cell.row.original.token;
    return (
        <TxnAmountCell
            logo={logo}
            symbol={symbol}
            address={address}
            value={parseInt(value, 10) / 10 ** decimals}
        />
    );
};

const FeeCellWrapper = (props: any) => {
    const { cell } = props;
    return (
        <QuantityCell
            value={cell.getValue()}
            currency={cell.row.original.feeCurrency}
        />
    );
};

const AddressCellWrapper = (props: any) => {
    const { cell } = props;
    return <AddressCell address={cell.getValue()} />;
};

const TxnTypeCellWrapper = (props: any, walletAddress: string) => {
    const { cell } = props;
    return (
        <TxnTypeCell
            type={cell.getValue() !== walletAddress ? "Incoming" : "Outgoing"}
        />
    );
};

const useStyles = createStyles((_theme) => ({
    sizer: {
        flexGrow: 1,
        overflowX: "auto"
    }
}));

interface ChainTransactionsTableProps {
    data: BlockchainTransaction[];
    walletAddress: string;
}

const ChainTransactionsTable = ({
    data,
    walletAddress
}: ChainTransactionsTableProps) => {
    const { classes } = useStyles();
    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                header: "Date",
                id: "date",
                accessorKey: "blockTimestamp",
                cell: DateCellWrapper
            },
            {
                header: "Txn Hash",
                id: "hash",
                accessorKey: "transactionHash",
                cell: TxnHashCellWrapper
            },
            {
                header: "Amount",
                id: "value",
                accessorKey: "value",
                cell: TxnAmountCellWrapper
            },
            {
                header: "Fee",
                id: "fee",
                accessorKey: "gas",
                cell: FeeCellWrapper
            },
            {
                header: "From",
                id: "fromAddress",
                accessorKey: "fromAddress",
                cell: AddressCellWrapper
            },
            {
                header: "To",
                id: "to",
                accessorKey: "toAddress",
                cell: AddressCellWrapper
            },
            {
                header: "Type",
                id: "type",
                accessorKey: "fromAddress",
                cell: (props) => TxnTypeCellWrapper(props, walletAddress)
            }
        ],
        [walletAddress]
    );

    return (
        <Box className={classes.sizer}>
            <Stack spacing="md">
                <Table
                    {...{
                        columns,
                        data,
                        searchPlaceholder: "Search transactions..."
                    }}
                />
            </Stack>
        </Box>
    );
};

export default ChainTransactionsTable;
