import { useAuth } from "@clerk/nextjs";
import {
    Alert,
    Box,
    Button,
    Card,
    Center,
    LoadingOverlay,
    Stack,
    TextInput,
    Title,
    createStyles
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconLink } from "@tabler/icons";
import { ethers } from "ethers";
import { useState } from "react";

import callAPI from "@lib/callAPI";

const useStyles = createStyles((theme) => ({
    root: {
        position: "relative"
    },

    input: {
        width: 400,
        height: "auto",
        paddingTop: 18
    },

    label: {
        position: "absolute",
        pointerEvents: "none",
        fontSize: theme.fontSizes.xs,
        paddingLeft: theme.spacing.sm,
        paddingTop: theme.spacing.sm / 2,
        zIndex: 1
    }
}));

function Wallets() {
    const { classes } = useStyles();

    const { isLoaded, userId, sessionId } = useAuth();
    const [isFetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const form = useForm({
        validateInputOnBlur: true,

        initialValues: {
            address: "",
            seedPhrase: ""
        },

        validate: {
            address: (value) =>
                ethers.utils.isAddress(value) ? null : "Invalid address",
            seedPhrase: (value) =>
                !value || ethers.utils.isValidMnemonic(value)
                    ? null
                    : "Invalid seed phrase"
        }
    });

    const submitHandler = async (values: typeof form.values) => {
        setFetching(true);

        // replace HOSTNAME with env var
        const response = await callAPI(
            `http://localhost:8000/users/${userId}/wallets`,
            {
                method: "POST",
                body: JSON.stringify(values)
            },
            sessionId
        );

        setFetching(false);

        if (!response.ok) {
            setError(response.statusText);
            return;
        }

        form.reset();
    };

    return (
        <Center style={{ width: "100%", height: "100%" }} pt={20}>
            <Stack>
                <Card withBorder radius="sm" shadow="md">
                    <LoadingOverlay visible={!isLoaded} overlayBlur={2} />
                    <Stack align="center">
                        <Title order={1} align="center">
                            Link Wallet
                        </Title>
                        <Box mx="auto">
                            <form onSubmit={form.onSubmit(submitHandler)}>
                                <TextInput
                                    withAsterisk
                                    required
                                    label="Wallet Address"
                                    placeholder="0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"
                                    classNames={classes}
                                    {...form.getInputProps("address")}
                                />

                                <TextInput
                                    mt="md"
                                    label="Seed Phrase"
                                    placeholder="inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
                                    classNames={classes}
                                    {...form.getInputProps("seedPhrase")}
                                />

                                <Center mt="lg">
                                    <Button
                                        type="submit"
                                        size="md"
                                        variant="gradient"
                                        gradient={{
                                            from: "indigo",
                                            to: "violet"
                                        }}
                                        leftIcon={<IconLink size={16} />}
                                        loading={isFetching}
                                    >
                                        Link Wallet
                                    </Button>
                                </Center>
                            </form>
                        </Box>
                    </Stack>
                </Card>
                {error && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Something went wrong!"
                        color="red"
                    >
                        {error}
                    </Alert>
                )}
            </Stack>
        </Center>
    );
}

export default Wallets;
