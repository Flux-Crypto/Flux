const callAPI = (path: string, authToken: string, options: RequestInit = {}) =>
    fetch(path, {
        headers: {
            Authorization: `Bearer ${authToken}`
        } as HeadersInit,
        ...options
    });

export default callAPI;
