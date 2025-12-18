import {apiUtil} from "/js/common/apiUtil.js";
import {log, responseCode} from "/js/common/constants.js";

let socket;

document.addEventListener("DOMContentLoaded", () => {
        const isLogin = document.body.getAttribute("data-is-login");
    if (isLogin === "true") {
        connectWebSocket();
        startSessionRefresh();
    }

    const isUnreadNotification = document.body.getAttribute("data-is-unread-notification");
    if (isUnreadNotification === "true") {
        showNoticeDot();
    }

    initLanguageSelect();

    const $languageSelect = document.getElementById("languageSelect");

    $languageSelect.addEventListener("change", () => {
        const newLang = $languageSelect.value;
        localStorage.setItem("language", newLang);
        document.cookie = `language=${newLang}; path=/;`;
        location.reload();
    });
});

window.addEventListener("pageshow", (event) => {
    initLanguageSelect();
});

window.addEventListener("close-socket", () => {
    if (socket) {
        socket.close();
        socket = null;
    }
});

function initLanguageSelect() {
    const $languageSelect = document.getElementById("languageSelect");

    if ($languageSelect) {
        $languageSelect.value = localStorage.getItem("language") || "KO";
    }
}

function connectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return;
    }

    socket = new WebSocket("ws://localhost:8080/ws/notice");

    socket.onopen = () => console.log(log.WEBSOCKET_CONNECTED);

    socket.onmessage = (event) => {
        const message = event.data;
        if (message === "NEW_NOTICE") {
            showNoticeDot();
        }
    };

    socket.onclose = () => {
        setTimeout(connectWebSocket, 5000);
    };

    socket.onerror = (err) => console.error(log.WEBSOCKET_ERROR, err);
}

function showNoticeDot() {
    document.getElementById("noticeDot").style.display = "block";
}

function startSessionRefresh() {
    if (!sessionStorage.getItem("keepLogin")) {
        return;
    }

    setInterval(refreshSession, 10 * 60 * 1000);
}

async function refreshSession() {
    try {
        const response = await apiUtil.post(apiUtil.url.USER.REFRESH);

        if (response.code !== responseCode.SUCCESS) {
            console.warn(log.REFRESH_FAILED, response.message);
        }
    } catch (err) {
        console.error(log.REFRESH_ERROR, err);
    }
}