const callAPI = (path: string, authToken: string, options: RequestInit = {}) =>
    // TODO: replace HOSTNAME with env var
    fetch(`http://localhost:8000/api${path}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
        } as HeadersInit,
        ...options
    });

export default callAPI;
