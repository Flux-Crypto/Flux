import {
  Center,
  Box,
  TextInput,
  Button,
  Title,
  Stack,
  createStyles,
  Card,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLink } from "@tabler/icons";
import { ethers } from "ethers";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  input: {
    width: 400,
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

const Wallets = () => {
  const { classes } = useStyles();

  const form = useForm({
    validateInputOnBlur: true,

    initialValues: {
      address: "",
      seedPhrase: "",
    },

    validate: {
      address: (value) =>
        ethers.utils.isAddress(value) ? null : "Invalid address",
      seedPhrase: (value) =>
        !value || ethers.utils.isValidMnemonic(value)
          ? null
          : "Invalid seed phrase",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const response = await fetch("http://localhost:8000/");
  };

  return (
    <Center style={{ width: "100%", height: "100%" }} pt={20}>
      <Card withBorder radius="sm" shadow="md">
        <Stack align="center">
          <Title order={1} align="center">
            Link Wallet
          </Title>
          <Box mx="auto">
            <form onSubmit={form.onSubmit(handleSubmit)}>
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
                  gradient={{ from: "indigo", to: "violet" }}
                  leftIcon={<IconLink size={16} />}
                >
                  Link Wallet
                </Button>
              </Center>
            </form>
          </Box>
        </Stack>
      </Card>
    </Center>
  );
};

export default Wallets;
