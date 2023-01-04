import MainLayout from "../layouts/MainLayout";
import {
  Paper,
  createStyles,
  TextInput,
  Checkbox,
  Button,
  Title,
  Text,
  Flex,
  Stack,
  Box,
  Group,
  PasswordInput,
} from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundPositionX: "-25%",
    backgroundPositionY: "40%",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1794&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const Login = () => {
  const { classes } = useStyles();
  return (
    <MainLayout pageTitle="Login">
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={2}
            className={classes.title}
            align="center"
            mt="md"
            mb={50}
          >
            Welcome back to Aurora
          </Title>

          <TextInput label="Email address" size="md" />
          <Stack>
            <PasswordInput label="Password" mt="md" size="md" />
            <Group position="right">
              <Box
                component={Link}
                href="/forgotpassword"
                sx={(theme) => ({
                  paddingTop: 2,
                  color:
                    theme.colors[theme.primaryColor][
                      theme.colorScheme === "dark" ? 4 : 6
                    ],
                  fontWeight: 500,
                  fontSize: theme.fontSizes.xs,
                })}
              >
                Forgot your password?
              </Box>
            </Group>
          </Stack>

          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button fullWidth mt="xl" size="md">
            Login
          </Button>

          <Flex gap="xs" justify="center" align="center" mt="md">
            <Text align="center">Don&apos;t have an account? </Text>
            <Link href="/register">
              <Text weight={700}>Register</Text>
            </Link>
          </Flex>
        </Paper>
      </div>
    </MainLayout>
  );
};

export default Login;
