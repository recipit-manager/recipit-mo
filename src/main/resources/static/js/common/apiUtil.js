export const apiUtil = {

    getHeaders() {
        return {
            "Content-Type": "application/json",
            "Accept-Language": localStorage.getItem("language") || "KO"
        };
    },

    async request(url, options = {}) {
        const defaultHeaders = this.getHeaders();

        const mergedOptions = {
            credentials: "include",
            ...options,
            headers: {
                ...defaultHeaders,
                ...(options.headers || {})
            }
        };

        try {
            const response = await fetch(url, mergedOptions);

            if (!response.ok) {
                console.error(`[apiUtil] Network error: ${response.status}`);
                throw new Error("network");
            }

            return await response.json();

        } catch (error) {
            console.error("[apiUtil] Fetch failed:", error);
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
