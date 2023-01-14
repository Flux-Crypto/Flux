import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IconSettings } from "@tabler/icons";

import LinksGroup from "./LinksGroup";

export default {
    component: LinksGroup,
    argTypes: { onClick: { action: "clicked" } }
} as ComponentMeta<typeof LinksGroup>;

const Template: ComponentStory<typeof LinksGroup> = (args) => (
    <LinksGroup {...args} />
);

export const UnopenedNoLinks = Template.bind({});

UnopenedNoLinks.args = {
    icon: IconSettings,
    label: "Settings"
};

export const UnopenedLinks = Template.bind({});

UnopenedLinks.args = {
    icon: IconSettings,
    label: "Settings",
    links: [
        { label: "Profile", link: "/" },
        { label: "Security", link: "/" }
    ]
};

export const OpenedNoLinks = Template.bind({});

OpenedNoLinks.args = {
    icon: IconSettings,
    label: "Settings",
    initiallyOpened: true
};

export const OpenedLinks = Template.bind({});

OpenedLinks.args = {
    icon: IconSettings,
    label: "Settings",
    initiallyOpened: true,
    links: [
        { label: "Profile", link: "/" },
        { label: "Security", link: "/" }
    ]
};
