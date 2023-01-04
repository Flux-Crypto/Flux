import { useSignUp } from "@clerk/clerk-react";
import {
    Anchor,
    Button,
    Checkbox,
    Container,
    LoadingOverlay,
    Paper,
    Text,
    TextInput,
    Title,
    createStyles
} from "@mantine/core";
import Link from "next/link";

import PasswordStrength from "../components/PasswordStrength";

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

function Register() {
    const { isLoaded, signUp } = useSignUp();
    const { classes } = useStyles();

    return (
        <Container size={420} my={40}>
            <Paper
                withBorder
                shadow="md"
                p={30}
                mt={30}
                radius="md"
                style={{ position: "relative" }}
            >
                <LoadingOverlay visible={!isLoaded} overlayBlur={2} />

                <Title align="center" className={classes.title}>
                    Register
                </Title>
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Already have an account?{" "}
                    <Anchor component={Link} href="/login" size="sm">
                        Login
                    </Anchor>
                </Text>

                <TextInput
                    label="Email"
                    placeholder="johndoe@email.com"
                    required
                    mt="xl"
                    mb="md"
                />
                <PasswordStrength />

                <Checkbox label="Remember me" sx={{ lineHeight: 1 }} mt="xl" />

                <Button fullWidth mt="xl">
                    Create Account
                </Button>
            </Paper>
        </Container>
    );
}

export default Register;
