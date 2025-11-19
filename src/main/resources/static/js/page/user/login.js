import { translate, applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { uiUtil } from "/js/common/uiUtil.js";
import { validationUtil } from "/js/common/form/validationUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initLogin);

async function initLogin() {
    await loadLanguageFile();
    applyI18nTexts();

    validationUtil.initEmailValidation();
    validationUtil.initPasswordValidation();
    initLoginButton();
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