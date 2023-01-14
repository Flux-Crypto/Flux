module.exports = {
    ...require("@flux/eslint-config-custom/next"),

    parserOptions: {
        root: true,
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
    }
};
