const path = require("path");

module.exports = {
    env: {
        node: true,
        es6: true
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
    plugins: ["import", "@typescript-eslint"],
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
                    path.resolve(
                        __dirname,
                        "../../apps/frontend/tsconfig.json"
                    ),
                    path.resolve(
                        __dirname,
                        "../../packages/prisma/tsconfig.json"
                    )
                ]
            }
        }
    },
    rules: {
        "no-underscore-dangle": "off",
        "import/first": "warn",
        "import/newline-after-import": "warn",
        "import/no-duplicates": "error",
        "@typescript-eslint/no-shadow": "warn",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_"
            }
        ],
        "@typescript-eslint/ban-ts-comment": "warn",
        "no-console": ["error", { allow: ["info", "warn", "error"] }]
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
