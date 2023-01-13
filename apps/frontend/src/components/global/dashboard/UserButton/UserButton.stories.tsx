import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IconSquareChevronRight } from "@tabler/icons";

import UserButton from "./UserButton";

export default {
    component: UserButton,
    argTypes: { onClick: { action: "onClick" } }
} as ComponentMeta<typeof UserButton>;

const Template: ComponentStory<typeof UserButton> = (args) => (
    <UserButton {...args} />
);

export const Default = Template.bind({});

Default.args = {
    image: "https://images.unsplash.com/photo-1589254065909-b7086229d08c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3087&q=80",
    name: "John Doe",
    email: "johndoe@email.com"
};

export const CustomIcon = Template.bind({});

CustomIcon.args = {
    image: "https://images.unsplash.com/photo-1589254065909-b7086229d08c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3087&q=80",
    name: "John Doe",
    email: "johndoe@email.com",
    icon: IconSquareChevronRight
};
