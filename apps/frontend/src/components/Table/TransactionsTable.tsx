import {
    Box,
    Container,
    Stack,
    Text,
    Title,
    createStyles
} from "@mantine/core";
import { ImportTransaction } from "@prisma/client";
import { compareItems } from "@tanstack/match-sorter-utils";
import { ColumnDef, SortingFn, sortingFns } from "@tanstack/react-table";
import _ from "lodash";

import { Transaction } from "@lib/types/api";

import DateCell from "@components/Table/Cells/DateCell";
import IdCell from "@components/Table/Cells/IdCell";
import QuantityCell from "@components/Table/Cells/QuantityCell";

import Table from "./Table";

interface TransactionsTableProps {
    data: ImportTransaction[];
}

const IdCellWrapper = (props: any) => {
    const { cell } = props;
    return <IdCell id={cell.getValue()} />;
};

const ReceivedQuantityCellWrapper = (props: any) => {
    const { cell } = props;
    return (
        <QuantityCell
            value={cell.getValue()}
            currency={cell.row.original.receivedCurrency}
        />
    );
};

const SentQuantityCellWrapper = (props: any) => {
    const { cell } = props;
    return (
        <QuantityCell
            value={cell.getValue()}
            currency={cell.row.original.sentCurrency}
        />
    );
};

const DateCellWrapper = (props: any) => {
    const { cell } = props;
    const date = new Date(cell.getValue()).valueOf();
    return <DateCell date={date} />;
};

const FeeAmountCellWrapper = (props: any) => {
    const { cell } = props;
    return (
        <QuantityCell
            value={cell.getValue()}
            currency={cell.row.original.feeCurrency}
        />
    );
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0;

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank!,
            rowB.columnFiltersMeta[columnId]?.itemRank!
        );
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const useStyles = createStyles((_theme) => ({
    sizer: {
        flexGrow: 1,
        overflowX: "auto"
    }
}));

const TransactionsTable = ({ data }: TransactionsTableProps) => {
    const { classes } = useStyles();
    const columns: ColumnDef<Transaction>[] = [
        {
            header: "ID / Transaction Hash",
            id: "id",
            accessorKey: "id",
            minSize: 0,
            size: 10,
            cell: IdCellWrapper
            // TODO: Add Block # underneath Id
        },
        {
            header: "Date",
            id: "date",
            accessorKey: "date",
            filterFn: "fuzzy",
            cell: DateCellWrapper
        },
        {
            header: "Received Amount",
            id: "receivedQuantity",
            accessorKey: "receivedQuantity",
            accessorFn: (row) =>
                `${row.receivedQuantity} ${row.receivedCurrency}`,
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            cell: ReceivedQuantityCellWrapper
        },
        {
            header: "Sent Amount",
            id: "sentQuantity",
            accessorKey: "sentQuantity",
            accessorFn: (row) => `${row.sentQuantity} ${row.sentCurrency}`,
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            cell: SentQuantityCellWrapper
        },
        {
            header: "Fee",
            id: "feeAmount",
            accessorKey: "feeAmount",
            accessorFn: (row) => `${row.feeAmount} ${row.feeCurrency}`,
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            cell: FeeAmountCellWrapper
        },
        {
            header: "Tag",
            id: "tag",
            accessorKey: "tag",
            filterFn: "fuzzy",
            accessorFn: (row) => `${row.tags[0]}`
        }
    ];

    return (
        <Box className={classes.sizer}>
            <Stack spacing="md">
                <Box className="space-y-1">
                    <Title order={3} m={0} color="gray.1">
                        Transactions
                    </Title>
                    <Text fz="md" color="gray.5">
                        View all account transactions
                    </Text>
                </Box>
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

export default TransactionsTable;
