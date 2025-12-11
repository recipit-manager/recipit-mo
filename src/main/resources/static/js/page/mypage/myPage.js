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
        alert("개발 진행중입니다. (작성한 레시피 목록 이동)");
    });

    document.getElementById("btn-draftRecipe").addEventListener("click", () => {
        alert("개발 진행중입니다. (임시저장 레시피 이동)");
    });

    document.getElementById("btn-recentView").addEventListener("click", () => {
        alert("개발 진행중입니다. (최근 열람 목록 이동)");
    });

    document.getElementById("btn-bookmarkRecipe").addEventListener("click", () => {
        alert("개발 진행중입니다. (즐겨찾기 레시피 이동)");
    });
}
