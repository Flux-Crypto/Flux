import {
    Avatar,
    Button,
    Code,
    Flex,
    Group,
    LoadingOverlay,
    Navbar,
    ScrollArea,
    createStyles
} from "@mantine/core";
import {
    IconAdjustments,
    IconDashboard,
    IconLock,
    IconLogout,
    IconReceipt,
    IconWallet,
    IconZoomCode
} from "@tabler/icons";
import { signOut } from "next-auth/react";

import LinksGroup from "../../LinksGroup/LinksGroup";
import UserButton from "../UserButton/UserButton";

const navbarLinks = [
    { label: "Dashboard", icon: IconDashboard },
    {
        label: "Wallets",
        icon: IconWallet,
        links: [
            { label: "Manage", link: "/wallets/manage" },
            { label: "Link", link: "/wallets/link" }
        ]
    },
    {
        label: "Transactions",
        icon: IconReceipt,
        links: [
            { label: "Overview", link: "/transactions" },
            { label: "Import", link: "/transactions/import" }
        ]
    },
    { label: "Explorer", icon: IconZoomCode },
    { label: "Settings", icon: IconAdjustments },
    {
        label: "Security",
        icon: IconLock,
        links: [
            { label: "Enable 2FA", link: "/" },
            { label: "Change password", link: "/" },
            { label: "Recovery codes", link: "/" }
        ]
    }
];

const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0
    },

    header: {
        padding: theme.spacing.md,
        paddingTop: 0,
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        borderBottom: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
        }`
    },

    links: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md
    },

    linksInner: {
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl
    },

    logoutIcon: {
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.gray[6],
        marginRight: theme.spacing.sm
    },

    footer: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
        }`
    }
}));

export interface DashboardNavbarProps {
    name: string;
    email: string;
    status: "loading" | "authenticated" | "unauthenticated";
}

const DashboardNavbar = ({ name, email, status }: DashboardNavbarProps) => {
    const { classes } = useStyles();

    const links = navbarLinks.map((item) => (
        <LinksGroup {...item} key={item.label} />
    ));

    return (
        <Navbar width={{ sm: 250 }} p="md" className={classes.navbar}>
            <Navbar.Section className={classes.header}>
                <Group position="apart">
                    <Avatar alt="Aurora Logo" />
                    <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
                </Group>
            </Navbar.Section>

            <LoadingOverlay visible={status === "loading"} overlayBlur={2} />

            <Navbar.Section
                grow
                className={classes.links}
                component={ScrollArea}
            >
                <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <UserButton
                    image="https://images.unsplash.com/photo-1589254065909-b7086229d08c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3087&q=80"
                    name={name || ""}
                    email={email || ""}
                />

                <Flex justify="center">
                    <Button
                        fullWidth
                        color="gray"
                        onClick={() => signOut()}
                        leftIcon={
                            <IconLogout
                                className={classes.logoutIcon}
                                stroke={1.5}
                            />
                        }
                        ml="md"
                        mr="md"
                    >
                        Logout
                    </Button>
                </Flex>
            </Navbar.Section>
        </Navbar>
    );
};

export default DashboardNavbar;
