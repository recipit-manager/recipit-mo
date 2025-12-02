import { log } from "/js/common/constants.js";

export const apiUtil = {

    BASE_URL: RECIPIT_API_HOST,
    // BASE_URL: "http://localhost:8080",

    url: {
        USER : {
            LOGIN: "/user/login",
            SIGN_UP: "/user",
            NICKNAME_DUPLICATE: (nickname) => `/user/nickname/${encodeURIComponent(nickname)}/duplicateYn`,
            EMAIL_SEND: "/user/email/authentication",
            EMAIL_VERIFY: (code, email) =>
                `/user/email/authentication/${encodeURIComponent(code)}?email=${encodeURIComponent(email)}`,
            LOGOUT: "/user/logout",
            REFRESH: "/user/refresh",
            FIND_ID: "/user/id",
            FIND_PASSWORD: "/user/password/temporary",
            NOTICE_READ: "/user/notification/list/read",
        },
        RECIPE : {
            LIKE: (recipeNo) => `/recipe/${recipeNo}/like`,
            DRAFT_COUNT: "/recipe/draft/count",
            RECENT_ORDER_LIST: "/recipe/list/recent-order",
            LIKE_ORDER_LIST: "/recipe/list/like-order",
        },
        REFRI: {
            AUTO_COMPLETE: "/refri-item/ingredient/auto-complete",
            LIST: "/refri-item/list",
        }
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

            if (!response.ok) {
                throw new Error("response-error");
            }

            return await response.json();

        } catch (error) {
            console.error(log.REQUEST_FAILED, error);
            throw new Error(error);
        }
    },

    async get(url, params = null) {
        let finalUrl = url;

        if (params) {
            const query = new URLSearchParams(params).toString();
            finalUrl = `${url}?${query}`;
        }

        return this.request(finalUrl, { method: "GET" });
    },

    async post(url, body) {
        return this.request(url, {
            method: "POST",
            body: JSON.stringify(body)
        });
    },

    async patch(url, body) {
        return this.request(url, {
            method: "PATCH",
            body: JSON.stringify(body)
        });
    },

    async delete(url) {
        return this.request(url, {
            method: "DELETE"
        });
    }
};
