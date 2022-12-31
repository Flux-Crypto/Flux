export interface UsersRequestBody {
    email: string;
    name?: string;
}

export interface UserRequestParams {
    userId: string;
}

export interface UserWalletsRequestBody {
    walletAddress: string;
    operation: "link" | "unlink";
}

export interface AddressRequestParams {
    address: string;
}
