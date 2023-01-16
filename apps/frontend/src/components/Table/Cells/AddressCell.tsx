import { Text, Tooltip } from "@mantine/core";

interface AddressCellProps {
    address: string;
}

const AddressCell = ({ address }: AddressCellProps) => (
    <Tooltip label={address} style={{ fontSize: "12px" }}>
        <Text className="w-fit">
            {address.substring(0, 6)}...{address.substring(address.length - 6)}
        </Text>
    </Tooltip>
);

export default AddressCell;
