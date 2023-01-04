import {
    Box,
    Center,
    Group,
    PasswordInput,
    Progress,
    Text
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons";
import _ from "lodash";

function PasswordRequirement({
    meets,
    label
}: {
    meets: boolean;
    label: string;
}) {
    return (
        <Text color={meets ? "teal" : "red"} mt={5} size="sm">
            <Center inline>
                {meets ? (
                    <IconCheck size={14} stroke={1.5} />
                ) : (
                    <IconX size={14} stroke={1.5} />
                )}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    );
}

const requirements = [
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Includes lowercase letter" },
    { re: /[A-Z]/, label: "Includes uppercase letter" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" }
];

function getStrength(password: string) {
    let multiplier = password.length >= 8 ? 0 : 1;

    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

function PasswordStrength() {
    const [password, setPassword] = useInputState("");

    const strength = getStrength(password);

    let color: string;
    if (strength > 80) color = "teal";
    else if (strength > 50) color = "yellow";
    else color = "red";

    return (
        <div>
            <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="Your password"
                label="Password"
                required
            />

            <Group spacing={5} grow mt="xs" mb="md">
                {_.range(4).map((index) => (
                    <Progress
                        styles={{ bar: { transitionDuration: "0ms" } }}
                        value={
                            password.length > 0 && index === 0
                                ? 100
                                : strength >= ((index + 1) / 4) * 100
                                ? 100
                                : 0
                        }
                        color={color}
                        key={index}
                        size={4}
                    />
                ))}
            </Group>

            <PasswordRequirement
                label="Has at least 8 characters"
                meets={password.length > 8}
            />
            {requirements.map((requirement) => (
                <PasswordRequirement
                    key={requirement.label}
                    label={requirement.label}
                    meets={requirement.re.test(password)}
                />
            ))}
        </div>
    );
}

export default PasswordStrength;
