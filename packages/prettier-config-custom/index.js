module.exports = {
    semi: true,
    trailingComma: "none",
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    importOrder: [
        "^@aurora/(.*)$",
        "^@frontend/(.*)$",
        "^@backend/(.*)$",
        "^@ui/(.*)$",
        "^[./]"
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true
};
