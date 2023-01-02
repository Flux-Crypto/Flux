import {
  Center,
  Box,
  TextInput,
  Button,
  Textarea,
  Title,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLink } from "@tabler/icons";
import { ethers } from "ethers";

const Wallets = () => {
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
        ethers.utils.isValidMnemonic(value) ? null : "Invalid seed phrase",
    },
  });

  return (
    <Center style={{ width: "100%", height: "100%" }}>
      <Stack>
        <Title order={1} align="center">
          Link Wallet
        </Title>
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput
              withAsterisk
              required
              label="Wallet Address"
              placeholder="0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"
              {...form.getInputProps("address")}
            />

            <Textarea
              mt="md"
              label="Seed Phrase"
              placeholder="inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
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
    </Center>
  );
};

export default Wallets;
