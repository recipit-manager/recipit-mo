import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { apiUtil } from "/js/common/apiUtil.js";
import {log, responseCode} from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initUserInfoPage);

async function initUserInfoPage() {
    await loadLanguageFile();
    applyI18nTexts();

    await setUserInfoEvents();
}

async function setUserInfoEvents() {
    const $nicknameEditButton = document.querySelector(".nickname-edit-button");
    const $passwordChangeButton = document.querySelector(".password-change-button");
    const $preferenceButton = document.querySelector(".preference-button");
    const $logoutButton = document.querySelector(".logout-button");

    $nicknameEditButton.addEventListener("click", function () {
        alert("개발 진행중입니다");
    });

    $passwordChangeButton.addEventListener("click", function () {
        alert("개발 진행중입니다");
    });

    $preferenceButton.addEventListener("click", function () {
        alert("개발 진행중입니다");
    });

    $logoutButton.addEventListener("click", async function () {
        try {
            const response = await apiUtil.delete(apiUtil.url.USER.LOGOUT);

            if (response.code === responseCode.SUCCESS) {
                sessionStorage.removeItem("keepLogin");

                window.dispatchEvent(new Event("close-socket"));

                window.location.href = "/user/login";
            }
        } catch (err) {
            console.error(log.LOGOUT_FAILED, err);
        }
    });
}