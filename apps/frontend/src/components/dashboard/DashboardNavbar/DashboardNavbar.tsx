import {
    Avatar,
    Code,
    Group,
    Navbar,
    ScrollArea,
    createStyles
} from "@mantine/core";
import {
    IconAdjustments,
    IconDashboard,
    IconLock,
    IconReceipt,
    IconWallet,
    IconZoomCode
} from "@tabler/icons";

import UserButton from "@components/dashboard/UserButton/UserButton";
import LinksGroup from "@components/global/LinksGroup/LinksGroup";

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
    {
        label: "Explorer",
        icon: IconZoomCode,
        links: [
            { label: "Wallet", link: "/explorer/wallet" },
            { label: "Transaction", link: "/explorer/transaction" }
        ]
    },
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
                ? theme.colors.cod_gray[2]
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

    const links = navbarLinks.map((item) => (
        <LinksGroup {...item} key={item.label} />
    ));

    return (
        <Navbar width={{ sm: 250 }} px="md" pt="md" className={classes.navbar}>
            <Navbar.Section className={classes.header}>
                <Group position="apart">
                    <Avatar alt="Flux Logo" />
                    <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
                </Group>
            </Navbar.Section>

            <Navbar.Section
                grow
                className={classes.links}
                component={ScrollArea}
            >
                <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <UserButton />
            </Navbar.Section>
        </Navbar>
    );
};

export default DashboardNavbar;
