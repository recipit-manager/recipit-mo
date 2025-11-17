import { translate, applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import {uiUtil} from "/js/common/uiUtil.js";
import {validationUtil} from "/js/common/validationUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";

export async function initLogin() {
    await loadLanguageFile();
    applyI18nTexts();

    initEmailValidation();
    initPasswordValidation();
    initLoginButton();
}

const API_BASE = "http://localhost:8080";
const API_URL = {
    LOGIN: `${API_BASE}/user/login`
};

function initEmailValidation() {
    const $emailLocal = document.getElementById("emailLocal");
    const $emailInfo = document.getElementById("emailInfo");

    $emailLocal.addEventListener("input", () => {
        const email = $emailLocal.value.trim();

        if (!validationUtil.isValidEmail(email)) {
            uiUtil.showMsg($emailInfo, translate("email.invalid"));
        } else {
            uiUtil.clearMsg($emailInfo);
        }
    });
}

function initPasswordValidation() {
    const $password = document.getElementById("password");
    const $passwordError = document.getElementById("passwordError");
    const $btnToggle = document.getElementById("btnTogglePwd");
    const $btnTooltip = document.getElementById("btnPwdTooltip");
    const $tooltip = document.getElementById("pwdTooltip");

    $password.addEventListener("input", () => {
        const val = $password.value;
        if (!val) {
            uiUtil.clearMsg($passwordError);
            return;
        }

        if (!validationUtil.isValidPassword(val)) {
            uiUtil.showMsg($passwordError, translate("password.invalid"));
        } else {
            uiUtil.clearMsg($passwordError);
        }
    });

    $btnToggle.addEventListener("click", () => {
        const isHidden = $password.type === "password";
        $password.type = isHidden ? "text" : "password";
        $btnToggle.classList.toggle("active", isHidden);
    });

    $btnTooltip.addEventListener("click", () => {
        $tooltip.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!$btnTooltip.contains(e.target) && !$tooltip.contains(e.target)) {
            $tooltip.classList.remove("show");
        }
    });
}

function initLoginButton() {
    const $emailInfo = document.getElementById("emailInfo")
    const $btnLogin = document.getElementById("btnLogin");
    const $emailLocal = document.getElementById("emailLocal");
    const $password = document.getElementById("password");

    const $autoLogin = document.getElementById("autoLogin");
    const $keepLogin = document.getElementById("keepLogin");
    const $passwordError =  document.getElementById("passwordError");
    const $loginError =  document.getElementById("loginError");

    $btnLogin.addEventListener("click", async () => {

        const email = $emailLocal.value.trim();
        const password = $password.value.trim();

        if (!email) {
            uiUtil.showMsg($emailInfo, translate("email.input_required"));
            return;
        }

        if (!validationUtil.isValidEmail(email)) {
            uiUtil.showMsg($emailInfo, translate("email.invalid"));
            return;
        }

        if (!password) {
            uiUtil.showMsg($passwordError, translate("password.input_required"));
            return;
        }

        if (!validationUtil.isValidPassword(password)) {
            uiUtil.showMsg($passwordError, translate("password.invalid"));
        } else {
            uiUtil.clearMsg($passwordError);
        }

        const bodyData = {
            email: email,
            password: password,
            autoLogin: $autoLogin.checked
        };

        try {
            const response = await apiUtil.post(API_URL.LOGIN, bodyData);

            if (response.code === "0000" && response.data === true) {
                if ($keepLogin.checked) {
                    sessionStorage.setItem
                } else {
                    sessionStorage.removeItem("keepLogin");
                }

                //location.href = "/home";
            } else {
                uiUtil.showMsg($loginError, response.message);
            }
        } catch (e) {
            uiUtil.showMsg($loginError, translate("common.server_error"));
        }
    });
}