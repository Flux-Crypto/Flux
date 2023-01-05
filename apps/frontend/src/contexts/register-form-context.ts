import { createFormContext } from "@mantine/form";

interface RegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const [RegisterFormProvider, useRegisterFormContext, useRegisterForm] =
    createFormContext<RegisterFormValues>();
