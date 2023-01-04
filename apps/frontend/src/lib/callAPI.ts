const callAPI = (
    path: string,
    options: RequestInit = {},
    sessionId?: string | null | undefined
) =>
    fetch(path, {
        headers: {
            Authorization: `Bearer ${sessionId}`
        },
        ...options
    });

export default callAPI;
