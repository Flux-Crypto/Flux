import {
    AssetTransfersCategory,
    SortingOrder
} from "alchemy-sdk/dist/src/types/types";

export interface AlchemyTransactionsOptions {
    fromBlock: string;
    fromAddress: string;
    excludeZeroValue: boolean;
    order: SortingOrder;
    withMetadata: boolean;
    maxCount: number;
    category: AssetTransfersCategory[];
    pageKey?: string;
}
