module.exports = {
    ...require("@aurora/eslint-config-custom/next.js"),
    parserOptions: {
        root: true,
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
    }
};
