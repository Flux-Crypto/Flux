module.exports = {
    env: {
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "prettier"
    ],
    plugins: ["import", "@typescript-eslint", "simple-import-sort"],
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".ts"],
                moduleDirectory: ["node_modules", "src/"]
            }
        }
    },
    rules: {
        "no-underscore-dangle": "off",
        "simple-import-sort/imports": "warn",
        "simple-import-sort/exports": "warn",
        "import/first": "warn",
        "import/newline-after-import": "warn",
        "import/no-duplicates": "error"
    },
    ignorePatterns: ["**/*.js", "node_modules", ".turbo", "dist", "coverage"]
};
