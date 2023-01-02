import { SortingOrder } from "alchemy-sdk/dist/src/types/types";

export interface AlchemyOptions {
    fromBlock: string;
    fromAddress: string;
    excludeZeroValue: boolean;
    order: SortingOrder;
    withMetadata: boolean;
    maxCount: string;
    category: string[];
    pageKey?: string;
}
