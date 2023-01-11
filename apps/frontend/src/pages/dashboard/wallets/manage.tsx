import {
    Grid,
    Group,
    Stack,
    Text,
    ThemeIcon,
    ThemeIconProps,
    Title,
    Tooltip
} from "@mantine/core";
import { IconEyeglass, IconPencil, TablerIcon } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { UserSession } from "@lib/types/auth";
import { UserWallet, UserWallets } from "@lib/types/db";
import callAPI from "@src/lib/callAPI";

import WalletCard from "@components/WalletCard";
import DashboardLayout from "@layouts/DashboardLayout";

interface WalletGridProps {
    accessTitle: string;
    tooltipLabel: string;
    TitleIcon: TablerIcon;
    iconProps: Omit<ThemeIconProps, "children">;
    wallets: UserWallet[];
}

const WalletGrid = ({
    accessTitle,
    tooltipLabel,
    TitleIcon,
    iconProps,
    wallets
}: WalletGridProps) => (
    <Stack>
        <Group>
            <ThemeIcon radius="sm" {...iconProps} p={2}>
                <TitleIcon />
            </ThemeIcon>

            <Title order={3}>
                <Tooltip label={tooltipLabel}>
                    <Text underline span>
                        {accessTitle}
                    </Text>
                </Tooltip>{" "}
                Wallets
            </Title>
        </Group>

        <Grid columns={2} gutter="xl">
            {wallets.map((wallet) => (
                <Grid.Col span={1}>
                    <WalletCard key={wallet.address} {...{ ...wallet }} />
                </Grid.Col>
            ))}
        </Grid>
    </Stack>
);

const Manage = () => {
    const { data: session } = useSession();

    const [isFetching, setFetching] = useState(true);
    const [wallets, setWallets] = useState<UserWallets>({
        rdWallets: [],
        rdwrWallets: []
    });

    useEffect(() => {
        if (!session) return;

        if (isFetching) {
            (async () => {
                const { authToken } = session as UserSession;

                const response = await callAPI(`/v1/wallets`, authToken);

                setFetching(false);

                if (!response.ok) {
                    console.log(response.statusText);
                    return;
                }

                const walletsData = await response.json();
                setWallets(walletsData);
            })();
        }
    }, [isFetching, session, wallets]);

    const { rdWallets, rdwrWallets } = wallets;

    return (
        <DashboardLayout pageTitle="Manage Wallets">
            <Stack spacing={56}>
                {rdWallets.length ? (
                    <WalletGrid
                        accessTitle="Read-only"
                        tooltipLabel="Wallets that you can view and track."
                        TitleIcon={IconEyeglass}
                        iconProps={{
                            variant: "light",
                            color: "indigo"
                        }}
                        wallets={rdWallets}
                    />
                ) : null}

                {rdwrWallets.length ? (
                    <WalletGrid
                        accessTitle="Read-write"
                        tooltipLabel="Wallets that you can access and use to transact."
                        TitleIcon={IconPencil}
                        iconProps={{
                            color: "pink"
                        }}
                        wallets={rdwrWallets}
                    />
                ) : null}

                {!rdWallets.length && !rdwrWallets.length && (
                    <Text>You have no wallets!</Text>
                )}
            </Stack>
        </DashboardLayout>
    );
};

export default Manage;
