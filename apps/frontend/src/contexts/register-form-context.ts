import { createFormContext } from "@mantine/form";

interface RegisterFormValues {
    email: string;
    password: string;
}

export const [RegisterFormProvider, useRegisterFormContext, useRegisterForm] =
    createFormContext<RegisterFormValues>();
