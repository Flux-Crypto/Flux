import { ComponentMeta, ComponentStory } from "@storybook/react";

import CSVImport, { CSVImportProps } from "./CSVImport";

export default {
    component: CSVImport
} as ComponentMeta<typeof CSVImport>;

const Template: ComponentStory<typeof CSVImport> = (args: CSVImportProps) => (
    <CSVImport {...args} />
);

export const Default = Template.bind({});

Default.args = {
    updateData: (array) => {
        console.log(array);
    }
};
