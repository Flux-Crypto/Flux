import {
    Alert,
    Anchor,
    Button,
    Container,
    Grid,
    Modal,
    Paper,
    Text,
    TextInput,
    Title,
    createStyles
} from "@mantine/core";
import { matches, notEmpty, useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        fontFamily: `Greycliff CF, ${theme.fontFamily}`
    }
}));

const Register = () => {
    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);
    const [error, setError] = useState("");

    const form = useForm({
        initialValues: {
            firstName: "",
            lastName: "",
            email: ""
        },

        validate: {
            firstName: notEmpty("Missing first name"),
            lastName: notEmpty("Missing last name"),
            email: matches(
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Invalid email"
            )
        }
    });

    const submitHandler = async ({
        firstName,
        lastName,
        email
    }: typeof form.values) => {
        const res = await fetch(`http://localhost:8000/api/v1/users`, {
            method: "POST",
            body: JSON.stringify({ email, firstName, lastName }),
            headers: {
                "Content-Type": "application/json",
                accept: "application/json"
            }
        });
        signIn("email", {
            email,
            callbackUrl: "http://localhost:3000/dashboard"
        });

        console.log(res);
        if (!res.ok) {
            setError("Unable to register.");
            form.resetTouched();
        } else {
            setOpened(true);
        }
    };

    const formTouched = form.isTouched();
    useEffect(() => {
        if (formTouched) setError("");
    }, [formTouched]);

    return (
        <MainLayout pageTitle="Register">
            <Modal
                transition="slide-down"
                transitionDuration={600}
                transitionTimingFunction="ease"
                opened={opened}
                onClose={() => setOpened(false)}
                size="auto"
                title="Successfuly registed!"
            >
                <Text>Check your email for a magic link to sign in.</Text>
            </Modal>
            <Container size={420} mt="8rem">
                <Paper
                    withBorder
                    shadow="md"
                    p={30}
                    mt={30}
                    radius="md"
                    style={{ position: "relative" }}
                >
                    <Title align="center" className={classes.title}>
                        Register
                    </Title>
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Already have an account?{" "}
                        <Anchor component={Link} href="/login" size="sm">
                            Login
                        </Anchor>
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
                        <Grid mt="md">
                            <Grid.Col span={6}>
                                <TextInput
                                    label="First Name"
                                    placeholder="John"
                                    required
                                    withAsterisk={false}
                                    {...form.getInputProps("firstName")}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Last Name"
                                    placeholder="Doe"
                                    required
                                    withAsterisk={false}
                                    {...form.getInputProps("lastName")}
                                />
                            </Grid.Col>
                        </Grid>
                        <TextInput
                            label="Email"
                            placeholder="johndoe@email.com"
                            required
                            withAsterisk={false}
                            mt="md"
                            {...form.getInputProps("email")}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="xl"
                            disabled={!form.isValid()}
                        >
                            Create Account
                        </Button>
                    </form>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Register;
