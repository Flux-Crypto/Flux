module.exports = {
    ...require("@flux/eslint-config-custom/server"),
    parserOptions: {
        root: true,
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
    },
    rules: {
        "import/prefer-default-export": "warn",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_"
            }
        ],
        "no-param-reassign": ["error", { props: false }],
        "no-restricted-syntax": "off",
        "no-await-in-loop": "off"
    }
};
