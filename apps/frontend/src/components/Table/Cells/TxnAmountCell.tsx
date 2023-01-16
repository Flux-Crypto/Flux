import { Flex, Text, Tooltip } from "@mantine/core";

interface TxnAmountCellProps {
    logo: string;
    symbol: string;
    address: string;
    value: number;
}

const TxnAmountCell = ({
    logo,
    symbol,
    address,
    value
}: TxnAmountCellProps) => (
    <Tooltip label={`${address}`} position="top" style={{ fontSize: "12px" }}>
        <Flex align="center" className="w-fit space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} className="w-5 h-5" alt={symbol} />
            <Text>
                {value} {symbol}
            </Text>
        </Flex>
    </Tooltip>
);

export default TxnAmountCell;
