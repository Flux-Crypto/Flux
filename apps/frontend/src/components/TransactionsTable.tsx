import type { GridColumn } from "@glideapps/glide-data-grid";
import {
    DataEditor,
    GridCell,
    GridCellKind,
    Item
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import {
    Badge,
    Center,
    ScrollArea,
    Stack,
    Table,
    Text,
    TextInput,
    UnstyledButton,
    createStyles
} from "@mantine/core";
import { ImportTransaction } from "@prisma/client";
import _ from "lodash";
import { ReactNode, useCallback, useState } from "react";

import { Transaction } from "@lib/types/db";

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

const columns: GridColumn[] = headers.map((header) => ({
    title: _.startCase(header),
    id: header
}));

const useStyles = createStyles((theme) => ({
    th: {
        padding: "0 !important"
    },

    control: {
        width: "100%",
        padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
        flex: 1,
        textAlign: "center",

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0]
        }
    },

    icon: {
        width: 21,
        height: 21,
        borderRadius: 21
    }
}));

interface TableSortProps {
    data: ImportTransaction[];
    rows: number;
}

const TransactionsTable = ({ data, rows }: TableSortProps) => {
    const getContent = useCallback(
        (cell: Item): GridCell => {
            const [col, row] = cell;
            const dataRow = data[row];
            // dumb but simple way to do this
            const d = dataRow[headers[col]];
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                displayData: d.toString(),
                data: d.toString()
            };
        },
        [data]
    );
    return (
        <DataEditor
            getCellContent={getContent}
            columns={columns}
            rows={rows}
            smoothScrollX
            smoothScrollY
        />
    );
};

export default TransactionsTable;
