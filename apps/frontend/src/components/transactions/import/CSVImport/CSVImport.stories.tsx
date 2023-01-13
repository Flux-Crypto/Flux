/* eslint-disable import/no-extraneous-dependencies */
import { action } from "@storybook/addon-actions";
import { useParameter } from "@storybook/addons";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import _ from "lodash";
import { useEffect, useState } from "react";

import CSVImport from "./CSVImport";

export default {
    component: CSVImport,
    decorators: [
        (Story) => {
            const initialState = useParameter("data", []);
            const [data, updateData] = useState(initialState);

            useEffect(() => action(`data uploaded!`));

            return (
                <div>
                    <Story args={{ updateData }} />
                    {data?.map((obj: Record<string, string | number | Date>) =>
                        Object.keys(obj).map((key) => (
                            <p>{obj[key].toString()}</p>
                        ))
                    )}
                </div>
            );
        }
    ]
} as ComponentMeta<typeof CSVImport>;

const Template: ComponentStory<typeof CSVImport> = (args) => (
    <CSVImport {...args} />
);

export const Default = Template.bind({});

Default.args = {};
