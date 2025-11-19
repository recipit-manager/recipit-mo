import { uiUtil } from "/js/common/uiUtil.js";
import { formatUtil } from "/js/common/form/formatUtil.js";
import { translate } from "/js/i18n/i18n.js";

export const validationUtil = {
    isValidNickname(nick) {
        return /^[A-Za-z0-9가-힣]{2,8}$/.test(nick);
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidVerifyCode(verifyCode) {
        return /^[A-Z0-9]{8}$/.test(verifyCode);
    },

    isValidPassword(password) {
        const length = /^.{8,16}$/;
        const upper = /[A-Z]/;
        const lower = /[a-z]/;
        const number = /[0-9]/;
        const special = /[!@#$%^&*]/;
        const repeat = /(.)\1\1/;
        return (
            length.test(password) &&
            upper.test(password) &&
            lower.test(password) &&
            number.test(password) &&
            special.test(password) &&
            !repeat.test(password)
        );
    },

    initPhoneNumberValidation() {
        const $countryCode = document.getElementById("countryCode");
        const $phoneNumber = document.getElementById("phoneNumber");
        const $phoneError = document.getElementById("phoneError");

        const getSelectedCountry = () => {
            const $selected = $countryCode.options[$countryCode.selectedIndex];
            return {
                regex: $selected.dataset.regex,
                format: $selected.dataset.format,
            };
        };

        $countryCode.addEventListener("change", () => {
            const {format} = getSelectedCountry();
            $phoneNumber.placeholder = format;
            $phoneNumber.value = "";
            uiUtil.clearMsg($phoneError);
        });

        $phoneNumber.addEventListener("input", (e) => {
            uiUtil.clearMsg($phoneError);
            const {regex, format} = getSelectedCountry();

            let digits = e.target.value.replace(/\D/g, "");
            e.target.value = formatUtil.autoFormatNumber(digits, format);

            const pattern = new RegExp(regex);
            if (digits && !pattern.test(e.target.value)) {
                uiUtil.showMsg($phoneError, translate("phone.invalid"));
            }
        });

        window.validatePhoneBeforeSubmit = function () {
            const {regex} = getSelectedCountry();
            const value = $phoneNumber.value.trim();

            if (!value) {
                uiUtil.showMsg($phoneError, translate("phone.input_required"));
                return false;
            }

            const pattern = new RegExp(regex);

            if (!pattern.test(value)) {
                uiUtil.showMsg($phoneError, translate("phone.invalid"));
                return false;
            }

            uiUtil.clearMsg($phoneError);
            return true;
        }
    },

    initEmailValidation() {
        const $email = document.getElementById("emailInput");
        const $emailError = document.getElementById("emailError");
        const $errorInfo =  document.getElementById("errorInfo");

        $email.addEventListener("input", () => {
            uiUtil.clearMsg($errorInfo);

            const email = $email.value.trim();

            if (!validationUtil.isValidEmail(email)) {
                uiUtil.showMsg($emailError, translate("email.invalid"));
            } else {
                uiUtil.clearMsg($emailError);
                uiUtil.clearMsg($errorInfo);
            }
        });
    },

    initPasswordValidation() {
        const $password = document.getElementById("password");
        const $passwordError = document.getElementById("passwordError");
        const $btnToggle = document.getElementById("btnTogglePassword");
        const $btnTooltip = document.getElementById("btnPasswordTooltip");
        const $tooltip = document.getElementById("passwordTooltip");
        const $errorInfo = document.getElementById("errorInfo");

        $password.addEventListener("input", () => {
            uiUtil.clearMsg($errorInfo);

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
    },

    initSignUpPasswordValidation() {
        const $password = document.getElementById("password");
        const $passwordConfirm = document.getElementById("passwordConfirm");
        const $errorPassword = document.getElementById("passwordError");
        const $errorConfirm = document.getElementById("passwordConfirmError");
        const $btnToggle = document.getElementById("btnTogglePassword");
        const $btnTooltip = document.getElementById("btnPasswordTooltip");
        const $tooltip = document.getElementById("passwordTooltip");

        $password.addEventListener("input", () => {
            const val = $password.value;
            if (!val) {
                uiUtil.clearMsg($password);
                uiUtil.clearMsg($errorConfirm);
                return;
            }

            if (!validationUtil.isValidPassword(val)) {
                uiUtil.showMsg($errorPassword, translate("password.invalid"));
            } else {
                uiUtil.clearMsg($errorPassword);
            }

            if ($passwordConfirm.value) {
                comparePasswords();
            }
        });

        const comparePasswords = () => {
            if (!$passwordConfirm.value) {
                uiUtil.clearMsg($errorConfirm);
                return;
            }

            if ($password.value === $passwordConfirm.value) {
                uiUtil.showSuccess($errorConfirm, translate("password.match"));
            } else {
                uiUtil.showMsg($errorConfirm, translate("password.mismatch"));
            }
        };

        $passwordConfirm.addEventListener("input", comparePasswords);

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

        window.validatePasswordBeforeSubmit = function () {
            const password = $password.value.trim();
            const confirm = $passwordConfirm.value.trim();

            if (!password) {
                uiUtil.showMsg($errorPassword, translate("password.input_required"));
                return false;
            }
            if (!validationUtil.isValidPassword(password)) {
                uiUtil.showMsg($errorPassword, translate("password.invalid"));
                return false;
            }
            if (!confirm) {
                uiUtil.showMsg($errorConfirm, translate("password.confirm_required"));
                return false;
            }
            if (password !== confirm) {
                uiUtil.showMsg($errorConfirm, translate("password.mismatch"));
                return false;
            }

            uiUtil.clearMsg($errorPassword);
            uiUtil.showSuccess($errorConfirm, translate("password.match"));
            return true;
        };
    }
}