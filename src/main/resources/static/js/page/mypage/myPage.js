import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";

document.addEventListener("DOMContentLoaded", initMyPage);

async function initMyPage() {
    await loadLanguageFile();
    applyI18nTexts();

    initButtonEvents();
}

function initButtonEvents() {
    document.getElementById("userSettingButton").addEventListener("click", () => {
        alert("개발 진행중입니다. (사용자 설정 화면)");
    });

    document.getElementById("btn-uploadRecipe").addEventListener("click", () => {
        location.href = "/mypage/list/upload";
    });

    document.getElementById("btn-draftRecipe").addEventListener("click", () => {
        location.href = "/mypage/list/draft";
    });

    document.getElementById("btn-recentView").addEventListener("click", () => {
        location.href = "/mypage/list/recent";
    });

    document.getElementById("btn-bookmarkRecipe").addEventListener("click", () => {
        location.href = "/mypage/list/bookmark";
    });
}
