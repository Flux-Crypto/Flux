import { Button, Code, Flex, Modal, Text, TextInput } from "@mantine/core";
import { notEmpty, useForm } from "@mantine/form";
import {
    IconEdit,
    IconEraser,
    IconShieldCheck,
    IconTrash
} from "@tabler/icons";
import { ethers } from "ethers";
import _ from "lodash";
import { useContext, useState } from "react";

import callAPI from "@lib/callAPI";
import { UserSession } from "@lib/types/auth";
import {
    ManageContext,
    ModalData,
    ModalModes
} from "@src/contexts/manageContext";
import { UserWallet } from "@src/lib/types/api";

const getProps = (mode: ModalModes) => {
    let title = "Edit Wallet Name";
    let inputProps = {
        label: "Wallet Name",
        placeholder: "",
        fieldName: "walletName"
    };
    let buttonProps = {
        color: "blue",
        icon: IconEdit,
        text: "Save"
    };
    if (mode === "delete") {
        inputProps = {
            label: "Please enter the Wallet Address to confirm.",
            placeholder: "",
            fieldName: "walletAddress"
        };
        buttonProps = {
            color: "red",
            icon: IconTrash,
            text: "Delete"
        };
        title = "Delete Wallet";
    } else if (mode === "verify") {
        inputProps = {
            label: "Seed Phrase",
            placeholder:
                "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur",
            fieldName: "seedPhrase"
        };
        buttonProps = {
            color: "teal",
            icon: IconShieldCheck,
            text: "Verify"
        };
        title = "Verify Wallet";
    }

    return { inputProps, buttonProps, title };
};

interface WalletModalProps extends ModalData {}

const WalletModal = ({
    mode,
    address,
    name,
    walletAccess
}: WalletModalProps) => {
    const { session, setModalData, setWallets } = useContext(ManageContext);

    const [isFetching, setFetching] = useState(false);

    const form = useForm({
        validateInputOnBlur: true,

        initialValues: {
            walletName: name,
            seedPhrase: "",
            walletAddress: ""
        },

        validate: {
            walletName: notEmpty("Invalid name"),
            seedPhrase: (value) =>
                !value || ethers.utils.isValidMnemonic(value)
                    ? null
                    : "Invalid seed phrase",
            walletAddress: (value) =>
                value === address ? null : "Incorrect address"
        }
    });

    const closeModal = () => {
        form.reset();
        setModalData({
            mode: "closed",
            address: "",
            name: "",
            walletAccess: "read-only"
        });
    };

    const filterWalletCollection = (walletCollection: UserWallet[]) =>
        _.filter(
            walletCollection,
            ({ address: walletAddress }) => walletAddress !== address
        );

    const submitHandler = async (
        { walletName, seedPhrase }: typeof form.values,
        clear: boolean = false
    ) => {
        setFetching(true);

        const { authToken } = session as UserSession;

        if (mode === "edit") {
            const response = await callAPI(
                `/v1/wallets/${address}`,
                authToken,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        walletName: clear ? "" : walletName.trim()
                    })
                }
            );

            // TODO: add better error handling
            if (!response.ok) {
                console.log(await response.text());
                setFetching(false);
                return;
            }

            const wallet = await response.json();

            setWallets((wallets) => {
                const walletCollection =
                    walletAccess === "read-only" ? "rdWallets" : "rdwrWallets";
                const idx = _.findIndex(wallets[walletCollection], { address });
                wallets[walletCollection][idx] = wallet;
                return wallets;
            });
            setModalData((modalData) => ({ ...modalData, name: walletName }));
        } else if (mode === "verify") {
            const response = await callAPI(
                `/v1/wallets/${address}`,
                authToken,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        seedPhrase
                    })
                }
            );

            setFetching(false);

            // TODO: add better error handling
            if (!response.ok) {
                console.log(await response.text());
                setFetching(false);
                return;
            }

            const wallet = await response.json();

            setWallets(({ rdWallets, rdwrWallets }) => ({
                rdWallets: filterWalletCollection(rdWallets),
                rdwrWallets: _.concat(rdwrWallets, wallet)
            }));
            setModalData((modalData) => ({
                ...modalData,
                walletAccess: "read-write"
            }));
        } else if (mode === "delete") {
            const response = await callAPI(
                `/v1/wallets/${address}`,
                authToken,
                {
                    method: "DELETE"
                }
            );

            // TODO: add better error handling
            if (!response.ok) {
                console.log(await response.text());
                setFetching(false);
                return;
            }

            setWallets((wallets) => {
                const walletCollection =
                    walletAccess === "read-only" ? "rdWallets" : "rdwrWallets";
                return {
                    ...wallets,
                    [walletCollection]: filterWalletCollection(
                        wallets[walletCollection]
                    )
                };
            });
            setModalData({
                mode: "closed",
                address: "",
                name: "",
                walletAccess: "read-only"
            });
        }

        form.resetDirty();
        setFetching(false);
        if (mode === "verify" || mode === "delete") closeModal();
    };

    const isFormValid = () => {
        let fieldName = "walletName";
        if (mode === "verify") fieldName = "seedPhrase";
        else if (mode === "delete") fieldName = "walletAddress";
        const check = form.isDirty(fieldName) && form.isValid(fieldName);
        return check && (mode !== "edit" || form.values.walletName !== name);
    };

    const { title, inputProps, buttonProps } = getProps(mode);
    const {
        label: inputLabel,
        placeholder: inputPlaceholder,
        fieldName
    } = inputProps;
    const {
        color: buttonColor,
        icon: ButtonIcon,
        text: buttonText
    } = buttonProps;

    return (
        <Modal
            centered
            opened={mode !== "closed"}
            onClose={() => closeModal()}
            title={title}
        >
            <Text mb="lg">Current Name: {name || "Unnamed Wallet"}</Text>
            <Text mb="lg">
                Address: <Code>{address}</Code>
            </Text>

            <form onSubmit={(e) => e.preventDefault()}>
                <TextInput
                    label={inputLabel}
                    placeholder={inputPlaceholder}
                    {...form.getInputProps(fieldName)}
                />
                <Flex mt="lg" justify="space-evenly">
                    {mode === "edit" && (
                        <Button
                            type="button"
                            size="sm"
                            color="pink"
                            variant="outline"
                            leftIcon={<IconEraser size={16} />}
                            loading={isFetching}
                            onClick={() => {
                                form.clearErrors();
                                form.values.walletName = "";
                                submitHandler(form.values, true);
                            }}
                        >
                            Clear
                        </Button>
                    )}
                    <Button
                        type="button"
                        size="sm"
                        color={buttonColor}
                        variant="filled"
                        leftIcon={<ButtonIcon size={16} />}
                        loading={isFetching}
                        disabled={!isFormValid()}
                        onClick={() => submitHandler(form.values)}
                    >
                        {buttonText}
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default WalletModal;
