import { ComponentMeta, ComponentStory } from "@storybook/react";

import CSVImport from "./CSVImport";

export default {
    component: CSVImport
} as ComponentMeta<typeof CSVImport>;

const Template: ComponentStory<typeof CSVImport> = () => <CSVImport />;

export const CSVImportStory = Template.bind({});

CSVImportStory.args = {
    /*👇 The args you need here will depend on your component */
};
