import { MantineProvider } from "@mantine/core";
import { themes } from "@storybook/theming";

export const parameters = {
    actions: { argTypesRegex: "^on.*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    },
    darkMode: {
        // Override the default dark theme
        dark: { ...themes.dark, appBg: "black" },
        // Override the default light theme
        light: { ...themes.normal, appBg: "white" },
        // Set the initial theme
        current: "dark"
    }
};

export const decorators = [
    (Story) => (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "dark",
                fontFamily: "Inter, sans-serif"
            }}
        >
            {Story()}
        </MantineProvider>
    )
];
