import styled from "@emotion/styled";
import {
    Badge,
    Box,
    Center,
    Text,
    TextInput,
    UnstyledButton,
    createStyles
} from "@mantine/core";
import { ImportTransaction } from "@prisma/client";
import {
    ColumnDef,
    ColumnResizeMode,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import _ from "lodash";
import { ReactNode, useCallback, useMemo, useReducer, useState } from "react";

import { Transaction } from "@lib/types/db";

import IdCell from "@components/Table/Cells/IdCell";
import QuantityCell from "@components/Table/Cells/QuantityCell";

const headers: (keyof ImportTransaction)[] = [
    "id",
    "date",
    "receivedQuantity",
    "receivedCurrency",
    "sentQuantity",
    "sentCurrency",
    "feeAmount",
    "feeCurrency",
    "tag"
];

const useStyles = createStyles((theme) => ({
    sizer: {
        flexGrow: 1,
        overflowX: "auto"
    },
    tableContainer: {
        display: "block",
        maxWidth: "100%"
    }
}));

interface TransactionsTableProps {
    data: ImportTransaction[];
}

const Table = ({ columns, data }: any) => {
    const { classes } = useStyles();

    const rerender = useReducer(() => ({}), {})[1];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true
    });

    const Styles = styled.div`
        table {
            border: 1px solid red;
            width: 100%;
            flex: 1;
            min-width: 48rem;
            text-align: left;
            box-sizing: border-box;
            border-collapse: collapse;
        }

        tbody {
            border-bottom: 1px solid red;
        }

        tr {
            // border: 1px solid blue;
        }

        th {
            border-bottom: 1px solid red;
            border-right: 1px solid red;
            padding: 0.5rem;
        }
        td {
            border-right: 1px solid red;
        }
    `;

    return (
        <Box className={classes.tableContainer}>
            <Styles>
                <div className="block max-w-full overflow-x-scroll overflow-y-hidden">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className=""
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div>
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Styles>
        </Box>
    );
};

const IdCellWrapper = (props: any) => <IdCell id={props.cell.getValue()} />;

const QuantityCellWrapper = (props: any) => (
    <QuantityCell
        value={props.cell.getValue()}
        currency={props.cell.row.original.feeCurrency}
    />
);
const TransactionsTable = ({ data }: TransactionsTableProps) => {
    const { classes } = useStyles();
    const columns: ColumnDef<Transaction>[] = [
        {
            header: "Id",
            id: "id",
            accessorKey: "id",
            minSize: 0,
            size: 10,
            cell: IdCellWrapper
        },
        {
            header: "Date",
            id: "date",
            accessorKey: "date"
        },
        {
            header: "Received Quantity",
            id: "receivedQuantity",
            accessorKey: "receivedQuantity",
            cell: QuantityCellWrapper
        },
        {
            header: "Sent Quantity",
            id: "sentQuantity",
            accessorKey: "sentQuantity"
        },
        {
            header: "Fee Amount",
            id: "feeAmount",
            accessorKey: "feeAmount"
        },
        {
            header: "Fee Currency",
            id: "feeCurrency",
            accessorKey: "feeCurrency"
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
