module.exports = {
    stories: [
        {
            directory: "../components",
            titlePrefix: "",
            files: "*.stories.*"
        }
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions"
    ],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-webpack5"
    }
};
