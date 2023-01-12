import {
    ActionIcon,
    Button,
    Card,
    Code,
    Collapse,
    Flex,
    Group,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {
    IconEdit,
    IconShieldCheck,
    IconSquareRoundedChevronDown,
    IconSquareRoundedChevronUp,
    IconTrash
} from "@tabler/icons";
import { useContext, useState } from "react";

import { ManageContext, ModalModes } from "@src/contexts/manageContext";
import { UserWallet } from "@src/lib/types/api";

interface WalletCardProps extends UserWallet {
    walletAccess: "read-only" | "read-write";
}

const WalletCard = ({
    address,
    seedPhrase = "",
    name,
    walletAccess
}: WalletCardProps) => {
    const { setModalData } = useContext(ManageContext);

    const [showSeedPhrase, toggleSeedPhrase] = useState(false);

    const ButtonIcon = showSeedPhrase
        ? IconSquareRoundedChevronUp
        : IconSquareRoundedChevronDown;

    const showModal = (mode: ModalModes) =>
        setModalData({ mode, address, name, walletAccess });

    return (
        <Card withBorder radius="md">
            <Stack>
                <Flex justify="space-between">
                    <Title order={4}>{name || "Unnamed Wallet"}</Title>
                    <Group>
                        {!seedPhrase ? (
                            <ActionIcon
                                color="teal"
                                variant="light"
                                onClick={() => showModal("verify")}
                                p={4}
                            >
                                <IconShieldCheck />
                            </ActionIcon>
                        ) : null}
                        <ActionIcon
                            color="blue"
                            variant="light"
                            onClick={() => showModal("edit")}
                            p={4}
                        >
                            <IconEdit />
                        </ActionIcon>
                        <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => showModal("delete")}
                            p={4}
                        >
                            <IconTrash />
                        </ActionIcon>
                    </Group>
                </Flex>
                <Code>{address}</Code>
                {seedPhrase ? (
                    <>
                        <Collapse in={showSeedPhrase}>
                            <Text fz="xs" italic>
                                {seedPhrase}
                            </Text>
                        </Collapse>

                        <Button
                            leftIcon={<ButtonIcon />}
                            variant="subtle"
                            onClick={() => toggleSeedPhrase(!showSeedPhrase)}
                        >
                            {showSeedPhrase ? "Hide" : "Show"} Seed Phrase
                        </Button>
                    </>
                ) : null}
            </Stack>
        </Card>
    );
};

export default WalletCard;
