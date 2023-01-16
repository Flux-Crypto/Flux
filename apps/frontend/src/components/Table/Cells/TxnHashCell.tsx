import { Text, Tooltip, createStyles } from "@mantine/core";

interface TxnHashCellProps {
    hash: string;
    number: string;
}

const useStyles = createStyles((theme) => ({
    blockNumber: {
        fontSize: "11px"
    }
}));

const TxnHashCell = ({ hash, number }: TxnHashCellProps) => {
    const { classes } = useStyles();
    return (
        <Tooltip label={hash} style={{ fontSize: "12px" }}>
            <div className="w-fit">
                <Text color="dark.1">
                    {hash.substring(0, 6)}...{hash.substring(hash.length - 6)}
                </Text>
                <Text color="dark.2" className={classes.blockNumber}>
                    Block &#35;{number}
                </Text>
            </div>
        </Tooltip>
    );
};

export default TxnHashCell;
