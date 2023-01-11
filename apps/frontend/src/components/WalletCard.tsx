import { Button, Card, Collapse, Stack, Text, Title } from "@mantine/core";
import {
    IconSquareRoundedChevronDown,
    IconSquareRoundedChevronUp
} from "@tabler/icons";
import { useState } from "react";

import { UserWallet } from "@lib/types/db";

interface WalletCardProps extends UserWallet {}

const WalletCard = ({ address, seedPhrase = "", name }: WalletCardProps) => {
    const [showSeedPhrase, toggleSeedPhrase] = useState(false);

    const ButtonIcon = showSeedPhrase
        ? IconSquareRoundedChevronUp
        : IconSquareRoundedChevronDown;

    return (
        <Card withBorder radius="md">
            <Stack>
                <Title order={4}>{name || "Unnamed Wallet"}</Title>
                <Text fz="sm" fw={500}>
                    {address}
                </Text>
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

WalletCard.defaultProps = {
    seedPhrase: ""
};

export default WalletCard;
