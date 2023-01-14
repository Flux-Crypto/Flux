import { createStyles } from "@mantine/core";

interface IdCellProps {
    id: string;
}

const useStyles = createStyles((theme) => ({}));

const IdCell = ({ id }: IdCellProps) => {
    const { classes } = useStyles();
    return <div>{id}</div>;
};

export default IdCell;
