import { apiUtil } from "/js/common/apiUtil.js";
import { log, responseCode } from "/js/common/constants.js";

let socket;

document.addEventListener("DOMContentLoaded", () => {
    if (window.isAccountLocked === true) {
        openPasswordChangePopupWindow();
    }

    const isLogin = document.body.getAttribute("data-is-login");
    if (isLogin === "true") {
        connectWebSocket();
        startSessionRefresh();
    }

    const isUnreadNotification = document.body.getAttribute("data-is-unread-notification");
    if (isUnreadNotification === "true") {
        showNoticeDot();
    }

    const $logoutButton = document.getElementById("logoutButton");
    if ($logoutButton) {
        $logoutButton.addEventListener("click", logout);
    }

    const $languageSelect = document.getElementById("languageSelect");

    $languageSelect.value = localStorage.getItem("language") || "KO";

    $languageSelect.addEventListener("change", () => {
        const newLang = $languageSelect.value;
        localStorage.setItem("language", newLang);
        document.cookie = `language=${newLang}; path=/;`;
        location.reload();
    });
});

//TODO : 테스트용 로그아웃 - 추후 삭제
async function logout() {
    try {
        const response = await apiUtil.request(apiUtil.url.USER.LOGOUT, {
            method: "DELETE"
        });

        if (response.code === responseCode.SUCCESS) {
            sessionStorage.removeItem("keepLogin");

            socket.close();
            socket = null;

            window.location.href = "/user/login";
        }
    } catch (err) {
        console.error(log.LOGOUT_FAILED, err);
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

function openPasswordChangePopupWindow() {
    console.log("openPasswordChangePopupWindow");
    const popupWidth = 420;
    const popupHeight = 600;

    const left = (screen.width - popupWidth) / 2;
    const top = (screen.height - popupHeight) / 3;

    window.open(
        "/user/password/change-popup",
        "passwordChangePopup",
        `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=no`
    );
}