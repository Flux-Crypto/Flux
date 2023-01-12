import {
    Anchor,
    Box,
    Collapse,
    Group,
    ThemeIcon,
    UnstyledButton,
    createStyles
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight, TablerIcon } from "@tabler/icons";
import Link from "next/link";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
    control: {
        fontWeight: 500,
        display: "block",
        width: "100%",
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        fontSize: theme.fontSizes.sm,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.cod_gray[7]
                    : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black
        }
    },

    link: {
        fontWeight: 500,
        display: "block",
        textDecoration: "none",
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        paddingLeft: 31,
        marginLeft: 30,
        fontSize: theme.fontSizes.sm,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        borderLeft: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
        }`,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.cod_gray[7]
                    : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
            textDecoration: "none"
        }
    },

    chevron: {
        transition: "transform 200ms ease"
    }
}));

interface LinksGroupProps {
    icon: TablerIcon;
    label: string;
    initiallyOpened?: boolean;
    links?: { label: string; link: string }[];
}

const LinksGroup = ({
    icon: Icon,
    label,
    initiallyOpened = false,
    links = []
}: LinksGroupProps) => {
    const { classes, theme } = useStyles();
    const [opened, setOpened] = useState(initiallyOpened);
    const ChevronIcon =
        theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;
    const items = links.map((link) => (
        <Anchor<typeof Link>
            component={Link}
            className={classes.link}
            href={`/dashboard${link.link}`}
            key={link.label}
        >
            {link.label}
        </Anchor>
    ));

    return (
        <>
            <UnstyledButton
                onClick={() => setOpened((o) => !o)}
                className={classes.control}
            >
                <Group position="apart" spacing={0}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon size={18} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
                    </Box>
                    {links.length && (
                        <ChevronIcon
                            className={classes.chevron}
                            size={14}
                            stroke={1.5}
                            style={{
                                transform: opened
                                    ? `rotate(${
                                          theme.dir === "rtl" ? -90 : 90
                                      }deg)`
                                    : "none"
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {links.length ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
};

LinksGroup.defaultProps = {
    initiallyOpened: false,
    links: []
};

export default LinksGroup;
