const path = require("path");

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
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 11,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: "./"
    },
    plugins: ["import", "@typescript-eslint", "simple-import-sort"],
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: [
                    path.resolve(__dirname, "../../tsconfig.json"),
                    path.resolve(__dirname, "../../apps/backend/tsconfig.json"),
                    path.resolve(__dirname, "../../apps/frontend/tsconfig.json")
                ]
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
    // overrides: [
    //     {
    //         env: {
    //             jest: true
    //         },
    //         files: ["**/__tests__/**/*.[jt]s", "**/?(*.)+(spec|test).[jt]s"],
    //         extends: ["plugin:jest/recommended"],
    //         rules: {
    //             "import/no-extraneous-dependencies": [
    //                 "off",
    //                 { devDependencies: ["**/?(*.)+(spec|test).[jt]s"] }
    //             ]
    //         }
    //     }
    // ],
    ignorePatterns: [
        "**/*.js",
        "node_modules",
        ".turbo",
        "dist",
        "coverage",
        "build"
    ]
};
