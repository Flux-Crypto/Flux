const callAPI = (
    path: string,
    options: RequestInit = {},
    sessionId?: string | undefined
) =>
    fetch(path, {
        headers: {
            sessionId
        } as HeadersInit,
        ...options
    });

export default callAPI;
