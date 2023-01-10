const callAPI = (path: string, authToken: string, options: RequestInit = {}) =>
    fetch(path, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
        } as HeadersInit,
        ...options
    });

export default callAPI;
