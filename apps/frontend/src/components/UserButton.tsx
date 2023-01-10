import {
    Avatar,
    Group,
    Text,
    UnstyledButton,
    UnstyledButtonProps,
    createStyles
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons";
import { ReactNode } from "react";

const useStyles = createStyles((theme) => ({
    user: {
        display: "block",
        width: "100%",
        padding: theme.spacing.md,
        color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0]
        }
    }
}));

interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
    email: string;
    icon?: ReactNode;
}

const UserButton = ({
    image,
    name,
    email,
    icon,
    ...others
}: UserButtonProps) => {
    const { classes } = useStyles();

    return (
        <UnstyledButton className={classes.user} {...others}>
            <Group>
                <Avatar src={image} radius="xl" />

                <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {name}
                    </Text>

                    <Text color="dimmed" size="xs">
                        {email}
                    </Text>
                </div>

                {icon || <IconChevronRight size={14} stroke={1.5} />}
            </Group>
        </UnstyledButton>
    );
};

UserButton.defaultProps = {
    icon: null
};

export default UserButton;
