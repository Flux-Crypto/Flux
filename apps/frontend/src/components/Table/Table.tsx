import { Box, createStyles } from "@mantine/core";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";

const useStyles = createStyles((theme) => ({
    tableContainer: {
        display: "block",
        maxWidth: "100%",
        border: `1px solid ${theme.colors.dark[4]}`
    },
    table: {
        width: "100%",
        flex: 1,
        minWidth: "48rem",
        textAlign: "left",
        boxSizing: "border-box",
        borderCollapse: "collapse"
    },
    tbody: {
        borderBottom: `1px solid ${theme.colors.dark[6]}`
    },
    th: {
        borderBottom: `1px solid ${theme.colors.dark[6]}`,
        // borderRight: `1px solid ${theme.colors.dark[6]}`,
        backgroundColor: `1px solid ${theme.colors.dark[8]}`,
        fontSize: "14px",
        fontWeight: 500,
        padding: "0.75rem",
        width: "5%"
    },
    td: {
        // borderRight: `1px solid ${theme.colors.dark[6]}`,
        borderBottom: `1px solid ${theme.colors.dark[6]}`,
        fontSize: "12px",
        padding: "0.75rem"
    },
    cursorPointer: {
        cursor: "pointer"
    }
}));

interface TableProps {
    columns: ColumnDef<any>[];
    data: any[];
    rowSelection?: { [key: string]: any };
    setRowSelection?: (updatedSelection: any) => void;
}

const Table = ({
    columns,
    data,
    rowSelection,
    setRowSelection
}: TableProps) => {
    const { classes } = useStyles();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        state: {
            rowSelection
        },
        onRowSelectionChange: setRowSelection
    });

    return (
        <Box className={classes.tableContainer}>
            <div className="block max-w-full overflow-x-auto overflow-y-hidden">
                <table className={classes.table}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={classes.th}
                                        style={{
                                            width:
                                                header.id === "select"
                                                    ? "1%"
                                                    : "auto"
                                        }}
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
                            <tr
                                key={row.id}
                                onClick={() =>
                                    rowSelection &&
                                    row.toggleSelected(!row.getIsSelected())
                                }
                                className={classNames({
                                    "cursor-pointer": rowSelection
                                })}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className={classes.td}>
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
        </Box>
    );
};

Table.defaultProps = {
    rowSelection: undefined,
    setRowSelection: undefined
};

export default Table;
