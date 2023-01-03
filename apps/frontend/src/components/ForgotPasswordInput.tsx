import {
  PasswordInput,
  Text,
  Group,
  PasswordInputProps,
  Anchor,
} from "@mantine/core";

export function ForgotPasswordInput({
  className,
  style,
  ...others
}: PasswordInputProps) {
  return (
    <div className={className} style={style}>
      <Group position="apart" mb={5}>
        <Text component="label" htmlFor="password-input" size="sm" weight={500}>
          Password
        </Text>

        <Anchor<"a">
          href="#"
          onClick={(event) => event.preventDefault()}
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
        </Anchor>
      </Group>
      <PasswordInput placeholder="Password" id="password-input" {...others} />
    </div>
  );
}

export default ForgotPasswordInput;
