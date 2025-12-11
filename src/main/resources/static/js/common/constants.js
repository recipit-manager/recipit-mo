export const log = {
    WEBSOCKET_CONNECTED: "WebSocket connected",
    WEBSOCKET_ERROR: "WebSocket Error:",
    LOGOUT_FAILED: "Logout failed:",
    REFRESH_FAILED: "Session refresh failed:",
    REFRESH_ERROR: "Refresh API Error:",
    EMAIL_SEND_FAILED: "Email send failed:",
    REQUEST_FAILED: "Request failed:",
    NOTIFICATION_READ_FAILED: "Notification read failed:",
    UNKNOWN_NOTIFICATION_TYPE: "Unknown notification type:",
    DRAFT_COUNT_FAILED: "Draft count failed:",
    LIKE_RECIPE_FAILED: "Like recipe failed:",
    FAILED_LOAD_NEXT_PAGE: "Failed to load next page:",
    FAILED_LOAD_AUTO_COMPLETE: "Failed to load auto complete data:",
    FAILED_UPLOAD_RECIPE: "Failed to upload recipe:",
    BOOKMARK_RECIPE_FAILED: "Bookmark recipe failed:",
    REPORT_RECIPE_FAILED: "Report recipe failed:",
};

export const responseCode = {
    SUCCESS: "0000",
    BAD_REQUEST: "1001",
}

export const commonCode = {
    NOTICE_TYPE: {
        DRAFT: "NT01",
        USER_REACTION: "NT02",
        RECIPE_STATUS: "NT03",
        REPORT: "NT04",
    }
}