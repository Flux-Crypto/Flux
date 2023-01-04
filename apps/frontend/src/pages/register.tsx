import PasswordStrength from "../components/PasswordStrength";
import { useSignUp } from "@clerk/clerk-react";
import {
  TextInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  LoadingOverlay,
} from "@mantine/core";

const Register = () => {
  const { isLoaded, signUp } = useSignUp();

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 700,
        })}
      >
        Register
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor<"a"> href="/login" size="sm">
          Login
        </Anchor>
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        style={{ position: "relative" }}
      >
        <LoadingOverlay visible={!isLoaded} overlayBlur={2} />
        <TextInput
          label="Email"
          placeholder="johndoe@email.com"
          required
          mb="md"
        />
        <PasswordStrength />

        <Checkbox label="Remember me" sx={{ lineHeight: 1 }} mt="xl" />

        <Button fullWidth mt="xl">
          Create Account
        </Button>
      </Paper>
    </Container>
  );
};

export default Register;
