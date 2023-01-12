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
import { signOut, useSession } from "next-auth/react";

import LinksGroup from "./LinksGroup";
import UserButton from "./UserButton";

const mockdata = [
    { label: "Dashboard", icon: IconDashboard },
    {
        label: "Wallets",
        icon: IconWallet,
        links: [
            { label: "Manage", link: "/" },
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
            theme.colorScheme === "dark"
                ? theme.colors.cod_gray[9]
                : theme.white
    },

    header: {
        padding: theme.spacing.md,
        paddingTop: 0,
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        color: theme.colorScheme === "dark" ? theme.white : theme.black
        // borderBottom: `1px solid ${
        //     theme.colorScheme === "dark"
        //         ? theme.colors.dark[5]
        //         : theme.colors.gray[3]
        // }`
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
                ? theme.colors.tonal_gray[2]
                : theme.colors.gray[6],
        marginRight: theme.spacing.sm
    },

    footer: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[3]
        }`
    }
}));

const DashboardNavbar = () => {
    const { classes } = useStyles();

    const { data: session, status } = useSession();

    const links = mockdata.map((item) => (
        <LinksGroup {...item} key={item.label} />
    ));

    return (
        <Navbar width={{ sm: 250 }} px="md" pt="md" className={classes.navbar}>
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
                    name={
                        `${session?.user?.firstName} ${session?.user?.lastName}` ||
                        ""
                    }
                    email={session?.user?.email || ""}
                />
            </Navbar.Section>
        </Navbar>
    );
};

export default DashboardNavbar;
