/* const callAPI = (path: string, authToken: string, options: RequestInit = {}) =>
    fetch(`http://localhost:8000/api${path}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
        } as HeadersInit,
        ...options
    }); */
import { QueryFunction, QueryKey } from "@tanstack/react-query";

type DefaultQueryKey = [
    path: string,
    authToken: string,
    options?: {
        method?: string;
        body?: BodyInit;
    }
];

// Define a default query function that will receive the query key
// the queryKey is guaranteed to be an Array here
const defaultQueryFn: QueryFunction<unknown, QueryKey> = async ({
    queryKey
}) => {
    const [path, authToken, options] = queryKey as DefaultQueryKey;
    // TODO: replace HOSTNAME with env var
    const response = await fetch(`http://localhost:8000/api${path}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
        } as HeadersInit,
        ...options
    });

    if (!response.ok) {
        throw new Error((await response.text()) || response.statusText);
    }

    const data = await response.json();

    return data;
};

export default defaultQueryFn;
