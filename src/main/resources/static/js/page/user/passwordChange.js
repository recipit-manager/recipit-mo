import { validationUtil } from "/js/common/form/validationUtil.js";
import { loadLanguageFile, applyI18nTexts, translate } from "/js/i18n/i18n.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { log, responseCode } from "/js/common/constants.js";
import { uiUtil } from "/js/common/uiUtil.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadLanguageFile();
    applyI18nTexts();

    validationUtil.initSignUpPasswordValidation();
    initChangePasswordButton();
    initCloseButton();
});

function initChangePasswordButton() {
    const $btnChangePassword = document.getElementById("btnChangePassword");

    $btnChangePassword.addEventListener("click", async () => {
        if(validatePasswordBeforeSubmit()) {
            const payload = {
                password: document.getElementById("password").value.trim()
            }

            try {
                const response = await apiUtil.patch(apiUtil.url.USER.FIND_PASSWORD, payload);

                if (response.code === responseCode.SUCCESS) {

                    try {
                        await apiUtil.delete(apiUtil.url.USER.LOGOUT);
                    } catch (logoutErr) {
                        console.error(log.LOGOUT_FAILED, logoutErr);
                    }

                    uiUtil.showModal(
                        translate("password.change_success"),
                        {
                            title: translate("ui.notice"),
                            confirmText: translate("common.confirm"),
                            onClose: async () => {
                                window.location.href = "/user/login";
                            }
                        }
                    );
                }
            } catch (err) {
                uiUtil.showModal(translate("common.server_error"));
            }
        }
    })
}

function initCloseButton() {
    const $btnClose = document.getElementById("CloseBtn");

    $btnClose.addEventListener("click", async () => {
        try {
            await apiUtil.delete(apiUtil.url.USER.LOGOUT);
        } catch (logoutErr) {
            console.error(log.LOGOUT_FAILED, logoutErr);
        }

        window.location.href = "/user/login";
    });
}