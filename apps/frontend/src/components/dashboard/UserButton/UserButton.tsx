import {
    Avatar,
    Group,
    Menu,
    Text,
    UnstyledButton,
    UnstyledButtonProps,
    createStyles
} from "@mantine/core";
import { IconLogout, IconSettings, IconUsers } from "@tabler/icons";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const NavigationLinks = [
    {
        icon: IconUsers,
        text: "Organizations",
        href: "/dashboard/organizations"
    },
    {
        icon: IconSettings,
        text: "Settings",
        href: "/dashboard/settings"
    }
];

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
                    ? theme.colors.cod_gray[8]
                    : theme.colors.gray[0]
        }
    },
    logoutIcon: {
        color:
            theme.colorScheme === "dark"
                ? theme.colors.cod_gray[2]
                : theme.colors.gray[6],
        marginRight: theme.spacing.sm
    },
    dropdown: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.cod_gray[8]
                : theme.colors.gray[6],
        borderColor:
            theme.colorScheme === "dark"
                ? theme.colors.cod_gray[6]
                : theme.colors.gray[6]
    }
}));

export interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
    email: string;
}

const UserButton = ({ image, name, email, ...others }: UserButtonProps) => {
    const { classes } = useStyles();
    const router = useRouter();

    return (
        <Menu shadow="md" width={200} position="top" withArrow>
            <Menu.Target>
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
                        {/* TODO: Add badge for user role */}
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown className={classes.dropdown}>
                <Menu.Label>Navigation</Menu.Label>
                {NavigationLinks.map(({ href, text, icon: Icon }) => (
                    <Menu.Item
                        icon={<Icon size={14} />}
                        onClick={() => router.push(href)}
                        key={text}
                    >
                        {text}
                    </Menu.Item>
                ))}
                <Menu.Divider className={classes.dropdown} />
                <Menu.Item
                    color="red"
                    icon={<IconLogout size={14} />}
                    onClick={() => signOut()}
                >
                    Log out
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default UserButton;
