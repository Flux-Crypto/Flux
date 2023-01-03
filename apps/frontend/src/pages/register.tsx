import PasswordStrength from "../components/PasswordStrength";
import {
  TextInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";

const Register = () => {
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

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
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
