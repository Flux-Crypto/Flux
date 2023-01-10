import {
    Checkbox,
    Group,
    ScrollArea,
    Table,
    Text,
    createStyles
} from "@mantine/core";
import _ from "lodash";
import { useState } from "react";

import { Transaction } from "@lib/types/db";

const useStyles = createStyles((theme) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0]
    }
}));

interface TableSelectionProps {
    data: (Transaction & { idx: number })[];
}

const ImportTable = ({ data }: TableSelectionProps) => {
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState(_.range(0, data.length));
    const toggleRow = (idx: number) =>
        setSelection((current) =>
            current.includes(idx)
                ? current.filter((item) => item !== idx)
                : [...current, idx]
        );
    const toggleAll = () =>
        setSelection((current) =>
            current.length === data.length ? [] : data.map((item) => item.idx)
        );

    const rows = data.map(
        ({
            idx,
            date,
            receivedQuantity,
            receivedCurrency,
            sentQuantity,
            sentCurrency,
            feeAmount,
            feeCurrency,
            tag
        }) => {
            const selected = selection.includes(idx);
            return (
                <tr
                    key={idx}
                    className={cx({ [classes.rowSelected]: selected })}
                >
                    <td>
                        <Checkbox
                            checked={selection.includes(idx)}
                            onChange={() => toggleRow(idx)}
                            transitionDuration={0}
                        />
                    </td>
                    <td>
                        <Text align="center">{date.toISOString()}</Text>
                    </td>
                    <td>
                        <Group spacing="sm" align="center">
                            <Text size="sm">
                                {receivedQuantity} {receivedCurrency}
                            </Text>
                        </Group>
                    </td>
                    <td>
                        <Group spacing="sm">
                            <Text size="sm">
                                {sentQuantity} {sentCurrency}
                            </Text>
                        </Group>
                    </td>
                    <td>
                        <Group spacing="sm">
                            <Text size="sm">
                                {feeAmount} {feeCurrency}
                            </Text>
                        </Group>
                    </td>
                    <td>
                        <Text size="sm" align="center">
                            {tag}
                        </Text>
                    </td>
                </tr>
            );
        }
    );

    return (
        <ScrollArea>
            <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                <thead>
                    <tr>
                        <th style={{ width: 40 }}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={selection.length === data.length}
                                indeterminate={
                                    selection.length > 0 &&
                                    selection.length !== data.length
                                }
                                transitionDuration={0}
                            />
                        </th>
                        <th>
                            <Text align="center">Date</Text>
                        </th>
                        <th>Received</th>
                        <th>Sent</th>
                        <th>Fee</th>
                        <th>
                            {" "}
                            <Text align="center">Tag</Text>
                        </th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
};

export default ImportTable;
