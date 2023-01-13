import { Box, Checkbox, Stack, createStyles } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { useContext, useMemo } from "react";

import { Transaction } from "@lib/types/api";
import { ImportContext } from "@src/contexts/importContext";

import DateCell from "@components/Table/Cells/DateCell";
import QuantityCell from "@components/Table/Cells/QuantityCell";

import Table from "./Table";

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

const CheckboxHeaderWrapper = (props: any) => {
    <Checkbox
        {...props}
        checked={props.table.getIsAllRowsSelected()}
        onChange={props.table.getToggleAllRowsSelectedHandler()}
        indeterminate={props.table.getIsSomeRowsSelected()}
    />;
};

const CheckboxCellWrapper = (props: any) => {
    <Checkbox
        {...props}
        checked={props.row.getIsSelected()}
        onChange={props.row.getToggleSelectedHandler()}
        indeterminate={props.row.getIsSomeSelected()}
    />;
};

const useStyles = createStyles((_theme) => ({
    sizer: {
        flexGrow: 1,
        overflowX: "auto"
    }
}));

interface ImportTableProps {
    data: Transaction[];
}

const ImportTable = ({ data }: ImportTableProps) => {
    const { classes } = useStyles();
    const { rowSelection, setRowSelection } = useContext(ImportContext);
    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                id: "select",
                // eslint-disable-next-line react/no-unstable-nested-components
                header: ({ table }) => (
                    <Checkbox
                        className="flex items-center !cursor-pointer"
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                // eslint-disable-next-line react/no-unstable-nested-components
                cell: ({ row }) => (
                    <Checkbox
                        className="flex items-center !cursor-pointer"
                        checked={row.getIsSelected()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                )
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
                header: "Tags",
                id: "tags",
                accessorKey: "tags"
            }
        ],
        []
    );

    return (
        <Box className={classes.sizer}>
            <Stack spacing="md">
                <Table
                    {...{
                        rowSelection,
                        setRowSelection,
                        columns,
                        data,
                        searchPlaceholder: "Search transactions..."
                    }}
                />
            </Stack>
        </Box>
    );
};

export default ImportTable;
