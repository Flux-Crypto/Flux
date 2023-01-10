module.exports = {
    ...require("@aurora/eslint-config-custom/server"),
    parserOptions: {
        root: true,
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
    },
    rules: {
        "import/prefer-default-export": "warn"
    }
};
