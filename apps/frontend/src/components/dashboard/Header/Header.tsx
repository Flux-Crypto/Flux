import { Flex, createStyles } from "@mantine/core";

import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const useStyles = createStyles((theme) => ({
    header: {
        padding: theme.spacing.md,
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        borderBottom: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[3]
        }`,
        position: "sticky",
        top: 0,
        zIndex: 5
    }
}));

const Header = () => {
    const { classes } = useStyles();
    return (
        <Flex w="100%" bg="cod_gray.9" className={classes.header} p="md">
            <Breadcrumbs />
        </Flex>
    );
};

export default Header;
