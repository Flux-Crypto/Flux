const getMoralisTransactions = async (
    walletAddress: string,
    limit: number,
    fromDate?: Date,
    toDate?: Date,
    fromBlock?: number,
    toBlock?: number,
    cursor?: string,
    page?: number,
    chain = "eth"
) => {
    const fromDateQuery = fromDate ? `&from_date=${fromDate}` : "";
    const toDateQuery = toDate ? `&to_date=${toDate}` : "";
    const fromBlockQuery = fromBlock ? `&from_block=${fromBlock}` : "";
    const toBlockQuery = toBlock ? `&to_block=${toBlock}` : "";
    const cursorQuery = cursor ? `&cursor=${cursor}` : "";
    const pageQuery = page ? `&page=${page}` : "";

    const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20/transfers?&chain=${chain}&limit=${limit}${fromDateQuery}${toDateQuery}${fromBlockQuery}${toBlockQuery}${cursorQuery}${pageQuery}&disable_total=false`;

    const response = await fetch(url, {
        headers: {
            "x-api-key": process.env.MORALIS_API_KEY as string,
            accept: "application/json"
        }
    });
    return response;
};

export default getMoralisTransactions;
