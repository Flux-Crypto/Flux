import { Text } from "@mantine/core";

interface DateCellProps {
    date: string;
    time: string;
}

const DateCell = ({ date, time }: DateCellProps) => (
    <Text span>
        <Text color="dark.0">{date}</Text>
        <Text color="dark.1" style={{ fontSize: "11px" }}>
            {time}
        </Text>
    </Text>
);

export default DateCell;
