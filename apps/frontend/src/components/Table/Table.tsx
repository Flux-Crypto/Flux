import { Box, TextInput, createStyles } from "@mantine/core";
import {
    IconArrowsSort,
    IconCaretDown,
    IconCaretUp,
    IconSearch,
    IconSortAscending,
    IconSortDescending
} from "@tabler/icons";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
    ColumnDef,
    FilterFn,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";
import { useEffect, useState } from "react";

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
        backgroundColor: theme.colors.dark[8],
        fontSize: "14px",
        fontWeight: 500,
        padding: "0.75rem",
        width: "5%"
    },
    td: {
        borderBottom: `1px solid ${theme.colors.dark[6]}`,
        color: theme.colors.dark[1],
        fontSize: "12px",
        padding: "0.75rem"
    },
    cursorPointer: {
        cursor: "pointer"
    },
    sortIcon: {
        marginLeft: 8,
        stroke: theme.colors.dark[2]
    }
}));

declare module "@tanstack/table-core" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
        itemRank
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

interface TableProps {
    columns: ColumnDef<any>[];
    data: any[];
    rowSelection?: { [key: string]: any };
    setRowSelection?: (updatedSelection: any) => void;
    searchPlaceholder?: string;
}

const Table = ({
    columns,
    data,
    rowSelection,
    setRowSelection,
    searchPlaceholder
}: TableProps) => {
    const { classes } = useStyles();
    const [value, setValue] = useState("");

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        globalFilterFn: fuzzyFilter,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            rowSelection,
            sorting,
            globalFilter
        },
        onRowSelectionChange: setRowSelection
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setGlobalFilter(value);
        }, 200);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <>
            <TextInput
                icon={<IconSearch size={14} />}
                className="w-96"
                placeholder={searchPlaceholder}
                onChange={(event) => {
                    setValue(event.currentTarget.value);
                }}
            />
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
                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                                                <div
                                                    {...{
                                                        onClick:
                                                            header.column.getToggleSortingHandler()
                                                    }}
                                                    className={classNames(
                                                        "flex items-center",
                                                        {
                                                            "cursor-pointer select-none":
                                                                header.column.getCanSort()
                                                        }
                                                    )}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: (
                                                            <IconSortAscending
                                                                className={
                                                                    classes.sortIcon
                                                                }
                                                                size={16}
                                                                stroke={1.5}
                                                            />
                                                        ),
                                                        desc: (
                                                            <IconSortDescending
                                                                className={
                                                                    classes.sortIcon
                                                                }
                                                                size={16}
                                                                stroke={1.5}
                                                            />
                                                        )
                                                    }[
                                                        header.column.getIsSorted() as string
                                                    ] ?? null}
                                                    {header.column.getCanFilter() &&
                                                    !header.column.getIsSorted() ? (
                                                        <IconArrowsSort
                                                            className={classNames(
                                                                classes.sortIcon,
                                                                "text-dark-600"
                                                            )}
                                                            size={16}
                                                            stroke={1.5}
                                                        />
                                                    ) : null}
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
                                        <td
                                            key={cell.id}
                                            className={classes.td}
                                        >
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
        </>
    );
};

Table.defaultProps = {
    rowSelection: undefined,
    setRowSelection: undefined,
    searchPlaceholder: ""
};

export default Table;
