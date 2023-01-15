import {
    Avatar,
    Group,
    Menu,
    Text,
    UnstyledButton,
    createStyles
} from "@mantine/core";
import { IconLogout, IconSettings, IconUsers } from "@tabler/icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { UserSession } from "@lib/types/auth";

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

const UserButton = () => {
    const { classes } = useStyles();
    const router = useRouter();
    const { data: session, status } = useSession();

    if (status === "loading") {
        return null;
    }

    const {
        user: { firstName, lastName, email, image }
    } = session as UserSession;

    return (
        <Menu shadow="md" width={200} position="top" withArrow>
            <Menu.Target>
                <UnstyledButton className={classes.user}>
                    <Group>
                        <Avatar
                            src={
                                image ??
                                "https://images.unsplash.com/photo-1589254065909-b7086229d08c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3087&q=80"
                            }
                            radius="xl"
                        />

                        <div style={{ flex: 1 }}>
                            <Text size="sm" weight={500}>
                                {firstName} {lastName}
                            </Text>

                            <Text color="dimmed" size="xs">
                                {email}
                            </Text>
                        </div>
                        {/* // TODO: Add badge for user role */}
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
