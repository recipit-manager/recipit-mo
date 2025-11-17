export const apiUtil = {

    BASE_URL: "http://localhost:8080",

    url: {
        LOGIN: "/user/login",
        SIGN_UP: "/user",
        NICKNAME_DUPLICATE: (nickname) => `/user/nickname/${encodeURIComponent(nickname)}/duplicateYn`,
        EMAIL_SEND: "/user/email/authentication",
        EMAIL_VERIFY: (code, email) =>
            `/user/email/authentication/${encodeURIComponent(code)}?email=${encodeURIComponent(email)}`,
        LOGOUT: "/user/logout",
    },

    getHeaders() {
        return {
            "Content-Type": "application/json",
            "Accept-Language": localStorage.getItem("language") || "KO"
        };
    },

    async request(url, options = {}) {
        const requestUrl = this.BASE_URL + url;

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
            const response = await fetch(requestUrl, mergedOptions);

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
