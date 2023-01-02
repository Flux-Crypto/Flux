module.exports = {
    semi: true,
    trailingComma: "none",
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    importOrder: [
        "^@?(?!src|lib|docs|routes|plugins)\\w+",
        "^@src/(.*)$",
        "^@lib/(.*)$",
        "^@routes/(.*)$",
        "^@plugins/(.*)$"
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true
};
