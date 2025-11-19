import { translate, applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { uiUtil } from "/js/common/uiUtil.js";
import { validationUtil } from "/js/common/form/validationUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initFindPassword);

async function initFindPassword() {
    await loadLanguageFile();
    applyI18nTexts();

    validationUtil.initPhoneNumberValidation();
    validationUtil.initEmailValidation();
    initFindPasswordButton();
}

function initFindPasswordButton() {
    const $btnFindId = document.getElementById("btnFindPassword");

    const $firstName = document.getElementById("firstName");
    const $middleName = document.getElementById("middleName");
    const $lastName = document.getElementById("lastName");
    const $nameError = document.getElementById("nameError");

    const $phoneNumber = document.getElementById("phoneNumber");
    const $phoneNumberError = document.getElementById("phoneNumberError");

    const $email = document.getElementById("emailInput");
    const $emailError = document.getElementById("emailError");

    const validateName = () => {
        const first = $firstName.value.trim();
        const last = $lastName.value.trim();

        if (!first || !last) {
            uiUtil.showMsg($nameError, translate("signup.need_full_name"));
            return false;
        }
        uiUtil.clearMsg($nameError);
        return true;
    };

    $btnFindId.addEventListener("click", async () => {
        const email = $email.value.trim();

        if (!validateName()) {
            uiUtil.showMsg($nameError, translate("signup.need_full_name"));
            return;
        }

        if (!window.validatePhoneBeforeSubmit()) {
            uiUtil.showMsg($phoneNumberError, translate("ui.phone_number_required"));
            return;
        }

        if (!email) {
            uiUtil.showMsg($emailError, translate("email.input_required"));
            return;
        }

        if (!validationUtil.isValidEmail(email)) {
            uiUtil.showMsg($emailError, translate("email.invalid"));
            return;
        }

        const $countrySelect = document.getElementById("countryCode");
        const selected = $countrySelect.options[$countrySelect.selectedIndex];
        const countryCode = selected.value;

        const payload = {
            firstName: $firstName.value.trim(),
            middleName: $middleName.value.trim(),
            lastName: $lastName.value.trim(),
            countryCode: countryCode,
            phoneNumber: $phoneNumber.value.trim(),
            email: email
        };

        try {
            const data = await apiUtil.post(apiUtil.url.FIND_PASSWORD, payload);

            if (data.code === responseCode.SUCCESS) {
                uiUtil.showModal(translate("ui.find_password_modal_content"), {
                    success: true,
                    onClose: () => window.location.href = "/user/login"
                });
            } else {
                uiUtil.showModal(data.message);
            }
        } catch (err) {
            uiUtil.showModal(translate("common.server_error"));
        }
    });
}