import { ComponentMeta, ComponentStory } from "@storybook/react";

import DashboardNavbar from "./DashboardNavbar";

export default {
    component: DashboardNavbar
} as ComponentMeta<typeof DashboardNavbar>;

const Template: ComponentStory<typeof DashboardNavbar> = (args) => (
    <DashboardNavbar {...args} />
);

export const Loading = Template.bind({});

Loading.args = {
    name: "",
    email: "",
    status: "loading"
};

export const Authenticated = Template.bind({});

Authenticated.args = {
    name: "John Doe",
    email: "johndoe@email.com",
    status: "authenticated"
};
