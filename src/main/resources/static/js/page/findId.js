import { translate, applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { uiUtil } from "/js/common/uiUtil.js";
import { validationUtil } from "/js/common/form/validationUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initFindId);

async function initFindId() {
    await loadLanguageFile();
    applyI18nTexts();

    validationUtil.initPhoneNumberValidation();
    initFindIdButton();
}

function initFindIdButton() {
    const $btnFindId = document.getElementById("btnFindId");

    const $firstName = document.getElementById("firstName");
    const $middleName = document.getElementById("middleName");
    const $lastName = document.getElementById("lastName");
    const $nameError = document.getElementById("nameError");

    const $phoneNumber = document.getElementById("phoneNumber");

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
        if (!validateName()) {
            uiUtil.showMsg($nameError, translate("signup.need_full_name"));
            return;
        }

        if (!window.validatePhoneBeforeSubmit()) {
            uiUtil.showMsg($phoneNumber, translate("ui.phone_number_required"));
            return;
        }

        const $countrySelect = document.getElementById("countryCode");
        const selected = $countrySelect.options[$countrySelect.selectedIndex];
        const countryCode = selected.value;

        const params = {
            firstName: $firstName.value.trim(),
            middleName: $middleName.value.trim(),
            lastName: $lastName.value.trim(),
            countryCode: countryCode,
            phoneNumber: $phoneNumber.value.trim(),
        };

        try {
            const data = await apiUtil.get(apiUtil.url.FIND_ID, params);

            if (data.code === responseCode.SUCCESS) {
                uiUtil.showModal(data.data, {
                    title: translate("ui.findId_modal_title"),
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