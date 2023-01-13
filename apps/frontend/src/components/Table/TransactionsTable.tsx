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
import { ReactNode, useCallback, useMemo, useState } from "react";

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

const Styles = styled.div`
    /* This is required to make the table full-width */
    display: block;
    max-width: 100%;

    /* This will make the table scrollable when it gets too small */
    .tableWrap {
        display: block;
        max-width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        border-bottom: 1px solid black;
    }

    table {
        /* Make sure the inner table is always as wide as needed */
        width: 100%;
        border-spacing: 0;

        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid black;
            text-align: left;
            border-right: 1px solid black;

            /* The secret sauce */
            /* Each cell should grow equally */
            width: 1%;
            /* But "collapsed" cells should be as small as possible */
            &.collapse {
                width: 0.0000000001%;
            }

            :last-child {
                border-right: 0;
            }
        }
    }

    .pagination {
        padding: 0.5rem;
    }
`;

interface TransactionsTableProps {
    data: ImportTransaction[];
}

const Table = ({ columns, data }: any) => {
    const { classes } = useStyles();
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    return (
        <Box className={classes.tableContainer}>
            <Styles>
                <div className="tableWrap">
                    <table
                        {...getTableProps()}
                        style={{ border: "solid 1px blue" }}
                    >
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            style={{
                                                borderBottom: "solid 1px red",
                                                background: "aliceblue",
                                                color: "black",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => (
                                            <td
                                                {...cell.getCellProps()}
                                                style={{
                                                    padding: "10px",
                                                    background: "papayawhip"
                                                }}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Styles>
        </Box>
    );
};

// TODO: Add proper typing to props
const IncomingQuantityCellWrapper = (props: any) => {
    const { data, value, cell } = props;
    return (
        <QuantityCell
            value={value}
            currency={data[cell.row.index].receivedCurrency}
        />
    );
};

const OutgoingQuantityCellWrapper = (props: any) => {
    const { data, value, cell } = props;
    return (
        <QuantityCell
            value={value}
            currency={data[cell.row.index].sentCurrency}
        />
    );
};

const IdCellWrapper = (props: any) => {
    const { value } = props;
    return <IdCell id={value} />;
};

const TransactionsTable = ({ data }: TransactionsTableProps) => {
    const { classes } = useStyles();
    const columns = useMemo(
        () => [
            {
                Header: "Id",
                accessor: "id",
                Cell: IdCellWrapper
            },
            {
                Header: "Date",
                accessor: "date"
            },
            {
                Header: "Received Quantity",
                accessor: "receivedQuantity",
                Cell: IncomingQuantityCellWrapper
            },
            {
                Header: "Sent Quantity",
                accessor: "sentQuantity",
                Cell: OutgoingQuantityCellWrapper
            },
            {
                Header: "Fee Amount",
                accessor: "feeAmount"
            },
            {
                Header: "Fee Currency",
                accessor: "feeCurrency"
            },
            {
                Header: "Tag",
                accessor: "tag"
            }
        ],
        []
    );

    return (
        <Box className={classes.sizer}>
            <Table columns={columns} data={data} />
        </Box>
    );
};

export default TransactionsTable;
