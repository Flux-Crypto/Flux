import {
    Alert,
    Button,
    Container,
    Modal,
    Paper,
    Text,
    TextInput,
    Title,
    createStyles
} from "@mantine/core";
import { matches, useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons";
import { GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";

import MainLayout from "@layouts/MainLayout";

const useStyles = createStyles((theme) => ({
    form: {
        maxWidth: 450,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: "100%"
        }
    },

    title: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: "1.75rem"
    },

    subtext: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: "1rem"
    },

    link: {
        paddingTop: 2,
        color: theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 6
        ],
        fontWeight: 300,
        fontSize: theme.fontSizes.sm,
        textDecoration: "none"
    }
}));

const Authentication = () => {
    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);
    const [error, setError] = useState("");

    const form = useForm({
        initialValues: {
            email: ""
        },

        validate: {
            email: matches(
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Invalid email"
            )
        }
    });

    const submitHandler = async ({ email }: typeof form.values) => {
        const response = await signIn("email", {
            redirect: false,
            email,
            callbackUrl: "http://localhost:3000/dashboard"
        });
        if (!response?.ok) setError("Unable to login at the moment.");
        else setOpened(true);
    };

    return (
        <MainLayout pageTitle="Login">
            <Modal
                transition="slide-down"
                transitionDuration={600}
                transitionTimingFunction="ease"
                opened={opened}
                onClose={() => setOpened(false)}
                size="auto"
                title="Welcome!"
            >
                <Text>Check your email for a magic link to sign in.</Text>
            </Modal>
            <Container size={420} mt="8rem">
                <Paper withBorder className={classes.form} radius="md" p={30}>
                    <Title className={classes.title} align="center" mt="md">
                        Alpha Access
                    </Title>
                    <Text
                        className={classes.subtext}
                        color="gray"
                        align="center"
                        mt="0.25rem"
                        mb={20}
                    >
                        Welcome to Aurora
                    </Text>
                    {error && (
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title="Something went wrong!"
                            color="red"
                            mt="md"
                        >
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={form.onSubmit(submitHandler)}>
                        <TextInput
                            label="Email address"
                            placeholder="johndoe@email.com"
                            {...form.getInputProps("email")}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="xl"
                            disabled={!form.isValid()}
                        >
                            Log in
                        </Button>
                    </form>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Authentication;

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: {
                destination: "/dashboard"
            }
        };
    }

    return {
        props: {}
    };
}
