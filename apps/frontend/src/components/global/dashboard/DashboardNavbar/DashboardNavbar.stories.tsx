import { ComponentMeta, ComponentStory } from "@storybook/react";

import DashboardNavbar from "./DashboardNavbar";

export default {
    component: DashboardNavbar
} as ComponentMeta<typeof DashboardNavbar>;

const Template: ComponentStory<typeof DashboardNavbar> = () => (
    <DashboardNavbar />
);

export const Default = Template.bind({});

Default.args = {};
