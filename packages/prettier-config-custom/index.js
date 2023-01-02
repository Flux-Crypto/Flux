module.exports = {
    semi: true,
    trailingComma: "none",
    singleQuote: false,
    tabWidth: 4,
    useTabs: false,
    importOrder: [
        "^@?(?!src|lib|docs)\\w+",
        "^@src/(.*)$",
        "^@lib/(.*)$",
        "^@docs/(.*)$",
        "^[./]"
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true
};
