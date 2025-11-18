import { translate, applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { uiUtil } from "/js/common/uiUtil.js";
import { validationUtil } from "/js/common/validationUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initLogin);

async function initLogin() {
    await loadLanguageFile();
    applyI18nTexts();

    initEmailValidation();
    initPasswordValidation();
    initLoginButton();
}

function initEmailValidation() {
    const $email = document.getElementById("emailInput");
    const $emailInfo = document.getElementById("emailInfo");
    const $loginError =  document.getElementById("loginError");

    $email.addEventListener("input", () => {
        uiUtil.clearMsg($loginError);

        const email = $email.value.trim();

        if (!validationUtil.isValidEmail(email)) {
            uiUtil.showMsg($emailInfo, translate("email.invalid"));
        } else {
            uiUtil.clearMsg($emailInfo);
            uiUtil.clearMsg($loginError);
        }
    });
}

function initPasswordValidation() {
    const $password = document.getElementById("password");
    const $passwordError = document.getElementById("passwordError");
    const $btnToggle = document.getElementById("btnTogglePassword");
    const $btnTooltip = document.getElementById("btnPasswordTooltip");
    const $tooltip = document.getElementById("passwordTooltip");
    const $loginError =  document.getElementById("loginError");

    $password.addEventListener("input", () => {
        uiUtil.clearMsg($loginError);

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
    const $email = document.getElementById("emailInput");
    const $password = document.getElementById("password");

    const $autoLogin = document.getElementById("autoLogin");
    const $keepLogin = document.getElementById("keepLogin");
    const $passwordError =  document.getElementById("passwordError");
    const $loginError =  document.getElementById("loginError");

    $btnLogin.addEventListener("click", async () => {

        const email = $email.value.trim();
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
            return;
        } else {
            uiUtil.clearMsg($passwordError);
        }

        const bodyData = {
            email: email,
            password: password,
            autoLogin: $autoLogin.checked
        };

        try {
            const response = await apiUtil.post(apiUtil.url.LOGIN, bodyData);

            if (response.code === responseCode.SUCCESS) {
                if ($keepLogin.checked) {
                    sessionStorage.setItem("keepLogin", "true");
                } else {
                    sessionStorage.removeItem("keepLogin");
                }
                location.href = "/home";
            } else {
                uiUtil.showMsg($loginError, response.message);
            }
        } catch (e) {
            uiUtil.showMsg($loginError, translate("common.server_error"));
        }
    });
}