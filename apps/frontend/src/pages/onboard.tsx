import {
    Alert,
    Button,
    Container,
    Flex,
    Paper,
    Text,
    TextInput,
    Title,
    createStyles
} from "@mantine/core";
import { matches, useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons";
import { GetServerSidePropsContext } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import callAPI from "@lib/callAPI";
import { UserSession } from "@lib/types/auth";

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
        color:
            theme.colorScheme === "dark" ? theme.colors.gray[5] : theme.black,
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

const Landing = () => {
    const { classes } = useStyles();
    const { data: session } = useSession();
    const [error, setError] = useState("");
    const router = useRouter();

    const form = useForm({
        validateInputOnBlur: true,

        initialValues: {
            firstName: "",
            lastName: ""
        },

        validate: {
            firstName: (value) =>
                value.length < 2
                    ? "First name must have at least 2 letters"
                    : null,
            lastName: (value) =>
                value.length < 2
                    ? "Last name must have at least 2 letters"
                    : null
        }
    });

    const submitHandler = async (values: typeof form.values) => {
        if (session) {
            const { authToken, user } = session as UserSession;

            const response = await callAPI(`/v1/user`, authToken, {
                method: "PUT",
                body: JSON.stringify(values)
            });

            if (response.ok) {
                signIn("refresh-session", {
                    redirect: false,
                    id: user?.id,
                    token: authToken,
                    refresh: true
                });
                router.push("/dashboard");
            } else setError(response.statusText);
        }
    };

    return (
        <MainLayout pageTitle="Onboard">
            <Flex h="100%" justify="center" align="center" bg="slate-black.9">
                <Container w="100%" maw="24rem" mt="-8rem">
                    <Paper
                        withBorder
                        className={classes.form}
                        radius="md"
                        p={30}
                    >
                        <Title className={classes.title} align="center" mt="sm">
                            Nice to meet you
                        </Title>
                        <Text
                            className={classes.subtext}
                            color="gray"
                            align="center"
                            mt="0.25rem"
                            mb={20}
                            c="slate_black.5"
                        >
                            To get started, tell us about yourself.
                        </Text>
                        {error && (
                            <Alert
                                icon={<IconAlertCircle size={16} />}
                                title="Something went wrong!"
                                color="red"
                                mt="md"
                                mb="md"
                            >
                                {error}
                            </Alert>
                        )}
                        <form onSubmit={form.onSubmit(submitHandler)}>
                            <TextInput
                                label="First name"
                                placeholder="John"
                                {...form.getInputProps("firstName")}
                            />
                            <TextInput
                                label="Last name"
                                placeholder="Doe"
                                mt="md"
                                {...form.getInputProps("lastName")}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                mt="xl"
                                disabled={!form.isValid()}
                            >
                                Complete account setup
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </Flex>
        </MainLayout>
    );
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    const session = await getSession({ req });
    const { user } = session as UserSession;

    if (!session) {
        return {
            redirect: {
                destination: "/authentication"
            }
        };
    }
    if (user?.firstName) {
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

export default Landing;
