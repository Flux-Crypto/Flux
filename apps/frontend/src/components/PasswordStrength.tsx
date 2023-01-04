import {
    Box,
    Center,
    Group,
    PasswordInput,
    Progress,
    Text
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
import _ from "lodash";

import { useRegisterFormContext } from "@contexts/register-form-context";

interface PasswordRequirementProps {
    meets: boolean;
    label: string;
}

function PasswordRequirement({ meets, label }: PasswordRequirementProps) {
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

interface PasswordStrengthProps {
    strength: number;
    requirements: { re: RegExp; label: string }[];
}

function PasswordStrength({ strength, requirements }: PasswordStrengthProps) {
    const form = useRegisterFormContext();
    const { password } = form.values;

    let color: string;
    if (strength > 80) color = "teal";
    else if (strength > 50) color = "yellow";
    else color = "red";

    return (
        <div>
            <PasswordInput
                placeholder="Your password"
                label="Password"
                required
                {...form.getInputProps("password")}
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
