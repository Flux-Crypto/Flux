import { createStyles } from "@mantine/core";

interface IdCellProps {
    id: string;
}

const useStyles = createStyles((theme) => ({}));

const IdCell = ({ id }: IdCellProps) => {
    const { classes } = useStyles();
    return (
        <div>
            {id.substring(0, 3)}...{id.substring(id.length - 4)}
        </div>
    );
};

export default IdCell;
