import { apiUtil } from "/js/common/apiUtil.js";

let socket;

window.addEventListener("DOMContentLoaded", () => {
    const isLogin = document.body.getAttribute("data-is-login");
    if (isLogin === "true") {
        connectWebSocket();
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

async function logout() {
    try {
        const response = await apiUtil.request(apiUtil.url.LOGOUT, {
            method: "DELETE"
        });

        if (response.code === "0000") {
            sessionStorage.removeItem("keepLogin");

            socket.close();
            socket = null;

            window.location.href = "/user/login";
        }
    } catch (err) {
        console.error("Logout failed:", err);
    }
}

function connectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return;
    }

    socket = new WebSocket("ws://localhost:8080/ws/notice");

    socket.onopen = () => console.log("WebSocket 연결됨");

    socket.onmessage = (event) => {
        const message = event.data;
        console.log("서버로부터 수신:", message);
        if (message === "NEW_NOTICE") {
            showNoticeDot();
        }
    };

    socket.onclose = () => {
        console.log("WebSocket 종료됨. 5초 후 재연결...");
        setTimeout(connectWebSocket, 5000);
    };

    socket.onerror = (err) => console.error("WebSocket 오류:", err);
}

function showNoticeDot() {
    document.getElementById("noticeDot").style.display = "block";
}