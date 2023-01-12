import {
    Group,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    ThemeIconProps,
    Title,
    Tooltip
} from "@mantine/core";
import { IconEyeglass, IconPencil, TablerIcon } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { UserSession } from "@lib/types/auth";
import WalletModal from "@src/components/WalletModal";
import { ManageContext, ModalData } from "@src/contexts/manageContext";
import callAPI from "@src/lib/callAPI";
import { UserWallet, UserWallets } from "@src/lib/types/api";

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

        <SimpleGrid cols={2} spacing="xl">
            {wallets.map((wallet) => (
                <WalletCard
                    key={wallet.address}
                    walletAccess={
                        accessTitle.toLowerCase() as "read-only" | "read-write"
                    }
                    {...{ ...wallet }}
                />
            ))}
        </SimpleGrid>
    </Stack>
);

const Manage = () => {
    const { data: session } = useSession();

    const [isFetching, setFetching] = useState(true);
    const [wallets, setWallets] = useState<UserWallets>({
        rdWallets: [],
        rdwrWallets: []
    });

    const [modalData, setModalData] = useState<ModalData>({
        mode: "closed",
        address: "",
        name: "",
        walletAccess: "read-only"
    });

    useEffect(() => {
        if (!session) return;

        if (isFetching) {
            (async () => {
                const { authToken } = session as UserSession;

                const response = await callAPI(`/v1/wallets`, authToken);

                setFetching(false);

                // TODO: add better error handling
                if (!response.ok) {
                    console.log(response.statusText);
                    return;
                }

                const walletsData = await response.json();
                setWallets(walletsData);
            })();
        }
    }, [isFetching, session, wallets]);

    const contextValues = useMemo(
        () => ({ session, setModalData, setWallets }),
        [session, setModalData, setWallets]
    );

    const { rdWallets, rdwrWallets } = wallets;

    return (
        <ManageContext.Provider value={contextValues}>
            <WalletModal {...{ ...modalData }} />
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
        </ManageContext.Provider>
    );
};

export default Manage;
