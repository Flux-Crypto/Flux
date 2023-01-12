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
import { keys } from "@mantine/utils";
import { ImportTransaction } from "@prisma/client";
import {
    IconChevronDown,
    IconChevronUp,
    IconSearch,
    IconSelector
} from "@tabler/icons";
import { ReactNode, useState } from "react";

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

interface ThProps {
    children: ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

const Th = ({ children, reversed, sorted, onSort }: ThProps) => {
    const { classes } = useStyles();

    let Icon;
    if (!sorted) Icon = IconSelector;
    else Icon = reversed ? IconChevronUp : IconChevronDown;

    return (
        <th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Stack align="center">
                    <Text weight={500} size="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={14} stroke={1.5} />
                    </Center>
                </Stack>
            </UnstyledButton>
        </th>
    );
};

interface TdProps {
    children: ReactNode;
}

const Td = ({ children }: TdProps) => (
    <td>
        <Center>{children}</Center>
    </td>
);

const filterData = (data: ImportTransaction[], search: string) => {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) =>
            item[key].toString().toLowerCase().includes(query)
        )
    );
};

const sortData = (
    data: ImportTransaction[],
    payload: {
        sortBy: keyof ImportTransaction | null;
        reversed: boolean;
        search: string;
    }
) => {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            const multiple = payload.reversed ? 1 : -1;

            if (typeof bVal === "number" && typeof aVal === "number")
                return multiple * (bVal - aVal);
            if (bVal instanceof Date && aVal instanceof Date)
                return multiple * (bVal.valueOf() - aVal.valueOf());
            return multiple * (bVal as string).localeCompare(aVal as string);
        }),
        payload.search
    );
};

interface TableSortProps {
    data: ImportTransaction[];
}

const TransactionsTable = ({ data }: TableSortProps) => {
    const [search, setSearch] = useState("");
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof ImportTransaction | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const setSorting = (field: keyof ImportTransaction) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(
            sortData(data, {
                sortBy,
                reversed: reverseSortDirection,
                search: value
            })
        );
    };

    const rows = sortedData.map(
        ({
            id,
            date,
            receivedQuantity,
            receivedCurrency,
            sentQuantity,
            sentCurrency,
            feeAmount,
            feeCurrency,
            tag
        }) => (
            <tr key={id}>
                <Td>{id}</Td>
                <Td>{new Date(date).toLocaleString()}</Td>
                <Td>{receivedQuantity}</Td>
                <Td>{receivedCurrency}</Td>
                <Td>{sentQuantity}</Td>
                <Td>{sentCurrency}</Td>
                <Td>{feeAmount}</Td>
                <Td>{feeCurrency}</Td>
                <Td>
                    {tag && (
                        <Badge color="grape" size="lg">
                            {tag}
                        </Badge>
                    )}
                </Td>
            </tr>
        )
    );

    return (
        <ScrollArea>
            <TextInput
                placeholder="Search by any field"
                mb="md"
                icon={<IconSearch size={14} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
            />
            <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                sx={{ tableLayout: "fixed", minWidth: 700 }}
            >
                <thead>
                    <tr>
                        <Th
                            sorted={sortBy === "id"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("id")}
                        >
                            Id
                        </Th>
                        <Th
                            sorted={sortBy === "date"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("date")}
                        >
                            Date
                        </Th>
                        <Th
                            sorted={sortBy === "receivedQuantity"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("receivedQuantity")}
                        >
                            Received Quantity
                        </Th>
                        <Th
                            sorted={sortBy === "receivedCurrency"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("receivedCurrency")}
                        >
                            Received Currency
                        </Th>
                        <Th
                            sorted={sortBy === "sentQuantity"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("sentQuantity")}
                        >
                            Sent Quantity
                        </Th>
                        <Th
                            sorted={sortBy === "sentCurrency"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("sentCurrency")}
                        >
                            Sent Currency
                        </Th>
                        <Th
                            sorted={sortBy === "feeAmount"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("feeAmount")}
                        >
                            Fee Amount
                        </Th>
                        <Th
                            sorted={sortBy === "feeCurrency"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("feeCurrency")}
                        >
                            Fee Currency
                        </Th>
                        <Th
                            sorted={sortBy === "tag"}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting("tag")}
                        >
                            Tag
                        </Th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <tr>
                            <td colSpan={Object.keys(data[0]).length}>
                                <Text weight={500} align="center">
                                    Nothing found
                                </Text>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </ScrollArea>
    );
};

export default TransactionsTable;
