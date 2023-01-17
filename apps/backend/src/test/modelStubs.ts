export const objectIdRegex = /^[a-f\d]{24}$/i;
export const uuidRegex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export const stubUser = {
    // id: "63c1c90220dacbfef22a7ffb",
    email: "johndoe@email.com",
    // emailVerified: "2023-01-13T21:11:30.504Z",
    firstName: "",
    lastName: "",
    apiKey: "",
    processorAPIKeys: [],
    exchangeAPIKeys: [],
    rdWalletAddresses: [],
    rdwrWalletAddresses: [],
    importTransactions: [],
    chainTransactions: []
    // createdAt: "2023-01-13T21:11:30.504Z",
    // updatedAt: "2023-01-13T21:11:30.504Z"
};

export const stubWallet = {
    address: "0x6887246668a3b87f54deb3b94ba47a6f63f32985",
    seedPhrase:
        "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
};

export const stubImportTransaction = {
    // id: "63b27824cc5b18dda70b8442",
    date: new Date("06/14/2017 20:57:35"),
    receivedQuantity: 0.5,
    receivedCurrency: "BTC",
    sentQuantity: 4005.8,
    sentCurrency: "USD",
    feeAmount: 0.00001,
    feeCurrency: "BTC",
    tags: ["PAYMENT"]
};
