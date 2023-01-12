import type { GridColumn } from "@glideapps/glide-data-grid";
import {
    DataEditor,
    GridCell,
    GridCellKind,
    Item
} from "@glideapps/glide-data-grid";
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
import "@glideapps/glide-data-grid-cells/dist/index.css";
import type { TagsCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/tags-cell";
import "@glideapps/glide-data-grid/dist/index.css";
import {
    Badge,
    Box,
    Center,
    Table,
    Text,
    TextInput,
    UnstyledButton,
    createStyles
} from "@mantine/core";
import { ImportTransaction } from "@prisma/client";
import "@toast-ui/editor/dist/toastui-editor.css";
import _, { uniq } from "lodash";
import { ReactNode, useCallback, useState } from "react";

import { Transaction } from "@lib/types/db";

const possibleTags = [
    {
        tag: "PAYMENT",
        color: "#ff4d4d"
    },
    {
        tag: "BTC",
        color: "#35f8ff"
    },
    {
        tag: "Enhancement",
        color: "#48ff57"
    },
    {
        tag: "First Issue",
        color: "#436fff"
    },
    {
        tag: "PR",
        color: "#e0ff32"
    },
    {
        tag: "Assigned",
        color: "#ff1eec"
    }
];

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
    sizer: {
        flexGrow: 1,
        borderRadius: "4px",
        boxShadow:
            "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px"
    },
    sizerClip: {
        borderRadius: "4px",
        overflow: "hidden",
        transform: "translateZ(0)",
        height: "100%",
        border: `1px solid ${theme.colors.cod_gray[6]}`
    }
}));

interface TableSortProps {
    data: ImportTransaction[];
    rows: number;
}

const TransactionsTable = ({ data, rows }: TableSortProps) => {
    const { classes } = useStyles();
    const cellProps = useExtraCells();

    const getContent = useCallback(
        (cell: Item): GridCell => {
            const [col, row] = cell;
            const dataRow = data[row];
            // dumb but simple way to do this
            const d = dataRow[headers[col]];
            if (col === 8) {
                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: true,
                    copyData: "4",
                    data: {
                        kind: "tags-cell",
                        readonly: false,
                        possibleTags,
                        tags: [possibleTags[0].tag]
                    }
                } as TagsCell;
            }
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
        <Box className={classes.sizer}>
            <Box className={classes.sizerClip}>
                <DataEditor
                    {...cellProps}
                    getCellContent={getContent}
                    columns={columns}
                    rows={rows}
                    smoothScrollX
                    smoothScrollY
                    width="100%"
                    height="100%"
                    theme={{
                        bgCell: "#0A0A0A", // cell background
                        borderColor: "#4A4A4A", // cell border color
                        bgHeader: "#262626",
                        bgHeaderHasFocus: "#3B3B3B", // focused column
                        accentColor: "blue", // selected cell border and header bg
                        accentFg: "blue",
                        accentLight: "#4682f166", // selected cell bg
                        textHeader: "#C4C4C4", // header color
                        textDark: "white", // text color dark mode
                        textLight: "white", // text color light mode
                        bgHeaderHovered: "red"
                    }}
                />
            </Box>
        </Box>
    );
};

export default TransactionsTable;
