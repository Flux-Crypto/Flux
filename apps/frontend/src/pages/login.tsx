import { useSignIn } from "@clerk/clerk-react";
import {
    Anchor,
    Button,
    Container,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
    createStyles
} from "@mantine/core";
import { matches, useForm } from "@mantine/form";
import Link from "next/link";

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

const Login = () => {
    const { classes } = useStyles();
    const { isLoaded, signIn } = useSignIn();

    const form = useForm({
        initialValues: {
            email: "",
            password: ""
        },

        validate: {
            email: matches(
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Invalid email"
            )
        }
    });

    const submitHandler = async ({ email, password }: typeof form.values) => {
        try {
            const response = await signIn?.create({
                identifier: email,
                password
            });
            console.log(response);
        } catch (e) {
            console.log(e.errors);
        }
    };

    return (
        <MainLayout pageTitle="Login">
            <Container size={420} mt="8rem">
                <Paper withBorder className={classes.form} radius="md" p={30}>
                    <Title
                        className={classes.title}
                        align="center"
                        mt="md"
                        mb={20}
                    >
                        Login
                    </Title>
                    <form onSubmit={form.onSubmit(submitHandler)}>
                        <LoadingOverlay visible={!isLoaded} overlayBlur={2} />
                        <TextInput
                            label="Email address"
                            placeholder="johndoe@email.com"
                            {...form.getInputProps("email")}
                        />
                        <Stack>
                            <PasswordInput
                                label="Password"
                                mt="md"
                                placeholder="Your password"
                                {...form.getInputProps("password")}
                            />
                            <Group position="right">
                                <Anchor
                                    component={Link}
                                    href="/forgotpassword"
                                    className={classes.link}
                                >
                                    Forgot your password?
                                </Anchor>
                            </Group>
                        </Stack>

                        <Button type="submit" fullWidth mt="xl">
                            Log in
                        </Button>
                    </form>

                    <Flex gap="xs" justify="center" align="center" mt="md">
                        <Text align="center" size="sm">
                            Don&apos;t have an account?{" "}
                        </Text>
                        <Anchor
                            component={Link}
                            href="/register"
                            className={classes.link}
                        >
                            <Text size="sm">Register</Text>
                        </Anchor>
                    </Flex>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Login;
