import {
    Grid,
    Group,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from "@mantine/core";
import { IconEyeglass, IconPencil } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { UserSession } from "@lib/types/auth";
import { UserWallets } from "@lib/types/db";
import callAPI from "@src/lib/callAPI";

import WalletCard from "@components/WalletCard";
import DashboardLayout from "@layouts/DashboardLayout";

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
    console.log(rdwrWallets);

    return (
        <DashboardLayout pageTitle="Manage Wallets">
            <Stack spacing={56}>
                {rdWallets.length ? (
                    <Stack>
                        <Group>
                            <ThemeIcon
                                variant="light"
                                radius="sm"
                                color="indigo"
                                p={2}
                            >
                                <IconEyeglass />
                            </ThemeIcon>

                            <Title order={3}>
                                <Tooltip label="Wallets that you can view and track.">
                                    <Text underline span>
                                        Read-only
                                    </Text>
                                </Tooltip>{" "}
                                Wallets
                            </Title>
                        </Group>

                        <Grid columns={2} gutter="xl">
                            {rdWallets.map((wallet) => (
                                <Grid.Col span={1}>
                                    <WalletCard
                                        key={wallet.address}
                                        {...{ ...wallet }}
                                    />
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Stack>
                ) : null}

                {rdwrWallets.length ? (
                    <Stack>
                        <Group>
                            <ThemeIcon radius="sm" color="pink" p={2}>
                                <IconPencil />
                            </ThemeIcon>

                            <Title order={3}>
                                <Tooltip label="Wallets that you can access and use to transact.">
                                    <Text underline span>
                                        Read-write
                                    </Text>
                                </Tooltip>{" "}
                                Wallets
                            </Title>
                        </Group>

                        <Grid columns={2} gutter="xl">
                            {rdwrWallets.map((wallet) => (
                                <Grid.Col span={1}>
                                    <WalletCard
                                        key={wallet.address}
                                        {...{ ...wallet }}
                                    />
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Stack>
                ) : null}

                {!rdWallets.length && !rdwrWallets.length && (
                    <Text>You have no wallets!</Text>
                )}
            </Stack>
        </DashboardLayout>
    );
};

export default Manage;
