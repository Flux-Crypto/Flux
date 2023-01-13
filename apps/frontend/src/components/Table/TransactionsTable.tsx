import { Box, createStyles } from "@mantine/core";
import { ImportTransaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
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
            header: "Id/Transaction Hash",
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
            cell: DateCellWrapper
        },
        {
            header: "Received Amount",
            id: "receivedQuantity",
            accessorKey: "receivedQuantity",
            cell: ReceivedQuantityCellWrapper
        },
        {
            header: "Sent Amount",
            id: "sentQuantity",
            accessorKey: "sentQuantity",
            cell: SentQuantityCellWrapper
        },
        {
            header: "Fee",
            id: "feeAmount",
            accessorKey: "feeAmount",
            cell: FeeAmountCellWrapper
        },
        {
            header: "Tag",
            id: "tag",
            accessorKey: "tag"
        }
    ];

    return (
        <Box className={classes.sizer}>
            <Table columns={columns} data={data} />
        </Box>
    );
};

export default TransactionsTable;
