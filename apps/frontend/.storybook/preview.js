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
                fontFamily: "Inter, sans-serif",
                colors: {
                    cod_gray: [
                        "#C4C4C4",
                        "#969696",
                        "#828282",
                        "#636363",
                        "#4A4A4A",
                        "#3B3B3B",
                        "#262626",
                        "#141414",
                        "#0A0A0A",
                        "#030303"
                    ]
                }
            }}
        >
            {Story()}
        </MantineProvider>
    )
];
