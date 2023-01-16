import { Badge } from "@mantine/core";

interface TxnTypeCellProps {
    type: "Incoming" | "Outgoing";
}

const TxnTypeCell = ({ type }: TxnTypeCellProps) => (
    <Badge
        variant="gradient"
        gradient={{
            from: type === "Incoming" ? "teal" : "orange",
            to: type === "Incoming" ? "lime" : "red",
            deg: 105
        }}
    >
        {type}
    </Badge>
);

export default TxnTypeCell;
