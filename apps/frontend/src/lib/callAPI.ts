const callAPI = (path: string, authToken: string, options: RequestInit = {}) =>
    fetch(`http://localhost:8000/api${path}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
        } as HeadersInit,
        ...options
    });

export default callAPI;
