import {
    Alert,
    Box,
    Button,
    Card,
    Center,
    LoadingOverlay,
    Notification,
    Stack,
    TextInput,
    Title,
    Transition,
    createStyles
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck, IconLink } from "@tabler/icons";
import { ethers } from "ethers";
import { useSession } from "next-auth/react";
import { useState } from "react";

import callAPI from "@lib/callAPI";
import { UserSession } from "@src/lib/types/auth";

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

const Wallets = () => {
    const { classes } = useStyles();

    const { data: session, status } = useSession();
    const [isFetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const [isNotificationVisible, toggleNotificationVisible] = useState(false);

    const form = useForm({
        validateInputOnBlur: true,

        initialValues: {
            walletAddress: "",
            seedPhrase: ""
        },

        validate: {
            walletAddress: (value) =>
                ethers.utils.isAddress(value) ? null : "Invalid address",
            seedPhrase: (value) =>
                !value || ethers.utils.isValidMnemonic(value)
                    ? null
                    : "Invalid seed phrase"
        }
    });

    const submitHandler = async (values: typeof form.values) => {
        setFetching(true);

        if (session) {
            const { authToken } = session as UserSession;

            // TODO: replace HOSTNAME with env var
            const response = await callAPI(
                `http://localhost:8000/api/v1/wallets`,
                authToken,
                {
                    method: "POST",
                    body: JSON.stringify(values)
                }
            );

            // TODO: incorporate better error checking? (duplicate wallet)
            if (!response.ok) setError(response.statusText);
            else {
                toggleNotificationVisible(true);
                setTimeout(() => toggleNotificationVisible(false), 5000);
            }
        }

        setFetching(false);
        form.reset();
    };

    return (
        <Center style={{ width: "100%", height: "100%" }} pt={20}>
            <Stack>
                <Card withBorder radius="sm" shadow="md">
                    <LoadingOverlay
                        visible={status === "loading"}
                        overlayBlur={2}
                    />
                    <Stack align="center">
                        <Title order={1} align="center">
                            Link Wallet
                        </Title>
                        <Box mx="auto">
                            <form onSubmit={form.onSubmit(submitHandler)}>
                                <TextInput
                                    withAsterisk
                                    required
                                    type="text"
                                    label="Wallet Address"
                                    placeholder="0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"
                                    classNames={classes}
                                    {...form.getInputProps("walletAddress")}
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

                <Transition
                    mounted={isNotificationVisible}
                    transition="slide-down"
                    duration={400}
                    timingFunction="ease"
                >
                    {(styles) => (
                        <Notification
                            style={styles}
                            icon={<IconCheck size={18} />}
                            color="teal"
                            title="Wallet linking successful!"
                            onClose={() => toggleNotificationVisible(false)}
                        />
                    )}
                </Transition>
            </Stack>
        </Center>
    );
};

export default Wallets;
