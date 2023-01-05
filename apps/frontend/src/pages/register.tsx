import { useSignUp } from "@clerk/clerk-react";
import {
    Alert,
    Anchor,
    Box,
    Button,
    Checkbox,
    Container,
    Grid,
    LoadingOverlay,
    Paper,
    Text,
    TextInput,
    Title,
    createStyles
} from "@mantine/core";
import { matches, notEmpty } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
    RegisterFormProvider,
    useRegisterForm
} from "@contexts/register-form-context";
import MainLayout from "@src/layouts/AuthLayout";
import callAPI from "@src/lib/callAPI";

import PasswordStrength from "@components/PasswordStrength";

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

const requirements = [
    { re: /.{8,}/, label: "Has at least 8 characters" },
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Includes lowercase letter" },
    { re: /[A-Z]/, label: "Includes uppercase letter" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" }
];

function getStrength(password: string) {
    let multiplier = 0;

    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const Register = () => {
    const { classes } = useStyles();
    const router = useRouter();

    const { isLoaded, signUp } = useSignUp();

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState("");

    const form = useRegisterForm({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
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

    useEffect(() => {
        const strength = getStrength(form.values.password);
        setPasswordStrength(strength);
    }, [form.values.password]);

    const submitHandler = async ({
        firstName,
        lastName,
        email,
        password
    }: typeof form.values) => {
        try {
            const response = await signUp?.create({
                firstName,
                lastName,
                emailAddress: email,
                password
            });

            if (response?.status === "complete") {
                await callAPI("");
                router.replace("/dashboard");
            }
        } catch (e: any) {
            console.log(e.errors);
            if (e.status === 422) {
                setError(
                    "Insecure password or duplicate email, you figure it out."
                );
            } else {
                setError("Something went wrong. Try again later.");
            }
            form.resetTouched();
        }
    };

    const formTouched = form.isTouched();
    useEffect(() => {
        if (formTouched) setError("");
    }, [formTouched]);

    return (
        <MainLayout pageTitle="Register">
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
                            mt="xl"
                        >
                            {error}
                        </Alert>
                    )}
                    <RegisterFormProvider form={form}>
                        <form onSubmit={form.onSubmit(submitHandler)}>
                            <LoadingOverlay
                                visible={!isLoaded}
                                overlayBlur={2}
                            />
                            <Grid>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="First Name"
                                        placeholder="John"
                                        required
                                        mt="md"
                                        withAsterisk={false}
                                        {...form.getInputProps("firstName")}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Last Name"
                                        placeholder="Doe"
                                        required
                                        mt="md"
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
                            <Box mt="md">
                                <PasswordStrength
                                    strength={passwordStrength}
                                    {...{ requirements }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                mt="xl"
                                disabled={passwordStrength !== 100}
                            >
                                Create Account
                            </Button>
                        </form>
                    </RegisterFormProvider>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Register;
