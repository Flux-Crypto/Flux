module.exports = {
    ...require("@aurora/eslint-config-custom/next"),
    parserOptions: {
        root: true,
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
    }
};
