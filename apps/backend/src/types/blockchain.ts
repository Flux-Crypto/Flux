export interface AlchemyOptions {
    fromBlock: string;
    fromAddress: string;
    excludeZeroValue: boolean;
    order: string;
    withMetadata: boolean;
    maxCount: string;
    category: string[];
    pageKey?: string;
}
