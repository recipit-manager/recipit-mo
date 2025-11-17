export const apiUtil = {

    getHeaders() {
        return {
            "Content-Type": "application/json",
            "Accept-Language": localStorage.getItem("language") || "KO"
        };
    },

    async request(url, options = {}) {
        const defaultOptions = {
            headers: this.getHeaders()
        };

        const mergedOptions = {
            credentials: "include",
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        };

        try {
            const response = await fetch(url, mergedOptions);

            if (!response.ok) {
                throw new Error("network");
            }

            return await response.json();
        } catch (e) {
            throw new Error("fetch-failed");
        }
    },

    async get(url) {
        return this.request(url, { method: "GET" });
    },

    async post(url, body) {
        return this.request(url, {
            method: "POST",
            body: JSON.stringify(body)
        });
    }
};
