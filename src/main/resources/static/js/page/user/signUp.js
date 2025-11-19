import { uiUtil } from "/js/common/uiUtil.js";
import { translate, applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { validationUtil } from "/js/common/form/validationUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { log, responseCode } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initSignUp);

async function initSignUp() {
    await loadLanguageFile();
    applyI18nTexts();

    initNicknameValidation();
    initEmailValidation();
    validationUtil.initSignUpPasswordValidation();
    validationUtil.initPhoneNumberValidation();
    initSignUpButton();
}

function initNicknameValidation() {
    const $nickname = document.getElementById("nickname");
    const $btnCheck = document.getElementById("btnCheckNickname");
    const $msg = document.getElementById("nicknameError");

    let nicknameVerified = false;
    let lastCheckedNickname = "";

    $nickname.addEventListener("input", (e) => {
        if (e.isComposing) { return; }

        const cleaned = $nickname.value.replace(/[^A-Za-z0-9가-힣]/g, "");
        if (cleaned !== $nickname.value) {
            $nickname.value = cleaned;
        }

        if (nicknameVerified && $nickname.value !== lastCheckedNickname) {
            nicknameVerified = false;
            uiUtil.showWarning($msg, translate("nickname.check_needed"));
        }

        if ($nickname.value.length >= 1 && $msg.textContent === translate("nickname.input_required")) {
            uiUtil.clearMsg($msg);
        }
    });

    $btnCheck.addEventListener("click", async () => {
        const nick = $nickname.value.trim();

        if (!nick) {
            uiUtil.showMsg($msg, translate("nickname.input_required"));
            nicknameVerified = false;
            return;
        }

        if (!validationUtil.isValidNickname(nick)) {
            uiUtil.showMsg($msg, translate("nickname.invalid"));
            nicknameVerified = false;
            return;
        }

        try {
            const data = await apiUtil.get(apiUtil.url.NICKNAME_DUPLICATE(nick));

            if (data.code !== responseCode.SUCCESS) {
                uiUtil.showMsg($msg, data.message || translate("common.server_error"));
                nicknameVerified = false;
                return;
            }

            if (data.data === "Y") {
                uiUtil.showMsg($msg, translate("nickname.already_used"));
                nicknameVerified = false;
            } else if (data.data === "N") {
                uiUtil.showSuccess($msg, translate("nickname.available"));
                nicknameVerified = true;
                lastCheckedNickname = nick;
            } else {
                uiUtil.showMsg($msg, translate("nickname.bad_response"));
                nicknameVerified = false;
            }
        } catch (e) {
            uiUtil.showMsg($msg, translate("common.server_error"));
            nicknameVerified = false;
        }
    });

    window.validateNicknameBeforeSubmit = function () {
        const nick = ($nickname.value || "").trim();

        if (!nick) {
            uiUtil.showMsg($msg, translate("nickname.input_required"));
            return false;
        }
        if (!validationUtil.isValidNickname(nick)) {
            uiUtil.showMsg($msg, translate("nickname.invalid"));
            return false;
        }
        if (!nicknameVerified || nick !== lastCheckedNickname) {
            uiUtil.showWarning($msg, translate("nickname.check_needed"));
            return false;
        }

        return true;
    };
}

function initEmailValidation() {
    const $emailLocal = document.getElementById("emailLocal");
    const $emailDomain = document.getElementById("emailDomain");
    const $emailDomainDirect = document.getElementById("emailDomainDirect");
    const $verifyCode = document.getElementById("verifyCode");
    const $btnVerify = document.getElementById("checkVerifyCode");
    const $verifyInfo = document.getElementById("verifyCodeInfo");
    const $sendCodeBtn = document.getElementById("btnSendCode");
    const $emailInfo = document.getElementById("emailInfo");

    const getEmailValue = () => {
        const local = $emailLocal.value.trim();
        const domain =
            $emailDomain.value === "direct"
                ? $emailDomainDirect.value.trim()
                : $emailDomain.value;

        if (!local || !domain) {
            return "";
        }

        return `${local}@${domain}`;
    };

    initEmailSendCode();
    initEmailVerifyCode();

    function initEmailSendCode() {
        let lastSentEmail = "";
        let isWaiting = false;
        let waitTimer = null;
        let remainSeconds = 0;

        if ($emailDomain && $emailDomainDirect) {
            $emailDomain.addEventListener("change", () => {
                if ($emailDomain.value === "direct") {
                    $emailDomainDirect.disabled = false;
                    $emailDomainDirect.focus();
                } else {
                    $emailDomainDirect.disabled = true;
                    $emailDomainDirect.value = "";
                }
            });
        }

        [$emailLocal, $emailDomain, $emailDomainDirect].forEach((el) => {
            el.addEventListener("input", () => {
                $sendCodeBtn.disabled = false;
                $sendCodeBtn.textContent = translate("ui.send_code");
                uiUtil.clearMsg($emailInfo);

                if (waitTimer) {
                    clearInterval(waitTimer);
                    waitTimer = null;
                }

                isWaiting = false;

                window.isEmailVerified = false;
                $verifyCode.disabled = false;
                $btnVerify.disabled = false;
                uiUtil.clearMsg($verifyInfo);
            });
        });

        $sendCodeBtn.addEventListener("click", async () => {
            const email = getEmailValue();

            if (!email) {
                return uiUtil.showMsg($emailInfo, translate("email.input_required"));
            }

            if (!validationUtil.isValidEmail(email)) {
                return uiUtil.showMsg($emailInfo, translate("email.invalid"));
            }

            if (isWaiting) {
                return uiUtil.showMsg($emailInfo, translate("email.try_later", { sec: remainSeconds }));
            }

            $sendCodeBtn.disabled = true;

            try {
                const data = await apiUtil.post(apiUtil.url.EMAIL_SEND, { email });

                if (data.code === responseCode.SUCCESS && data.data) {
                    const { sendEmailResult, postDatetime } = data.data;
                    const postTime = new Date(`${postDatetime}Z`);
                    const now = new Date();
                    const diffSec = Math.max(0, Math.floor((now - postTime) / 1000));
                    const remain = Math.max(0, 60 - diffSec);

                    if (sendEmailResult === true) {
                        uiUtil.showSuccess($emailInfo, translate("email.sent"));
                        $sendCodeBtn.textContent = translate("ui.resend_code");
                        lastSentEmail = email;

                        document.getElementById("verifySection").style.display = "block";

                        window.isEmailVerified = false;
                        $verifyCode.disabled = false;
                        $btnVerify.disabled = false;
                        $verifyCode.value = "";
                        uiUtil.clearMsg($verifyInfo);

                        startCooldown(60);
                    } else if (remain > 0) {
                        uiUtil.showMsg($emailInfo, translate("email.try_later", { sec: remain }));
                        startCooldown(remain);
                    } else {
                        uiUtil.showWarning($emailInfo, translate("email.retry_available"));
                        resetButton();
                    }
                } else {
                    uiUtil.showMsg($emailInfo, data.message || translate("email.send_failed"));
                }
            } catch (e) {
                console.error(log.EMAIL_SEND_FAILED, e);
                uiUtil.showMsg($emailInfo, translate("common.server_error"));
            } finally {
                if (!isWaiting) {
                    $sendCodeBtn.disabled = false;
                }
            }
        });

        function startCooldown(seconds) {
            remainSeconds = seconds;
            isWaiting = true;
            $sendCodeBtn.disabled = true;

            clearInterval(waitTimer);
            waitTimer = setInterval(() => {
                remainSeconds--;
                $sendCodeBtn.textContent = `${translate("ui.resend_code")} (${remainSeconds}s)`;
                if (remainSeconds <= 0) { resetButton(); }
            }, 1000);
        }

        function resetButton() {
            clearInterval(waitTimer);
            waitTimer = null;
            isWaiting = false;
            $sendCodeBtn.disabled = false;
            $sendCodeBtn.textContent = lastSentEmail
                ? translate("ui.resend_code")
                : translate("ui.send_code");
        }
    }

    function initEmailVerifyCode() {
        window.isEmailVerified = false;

        $btnVerify.addEventListener("click", async () => {
            const verifyCode = $verifyCode.value.trim();

            if (!verifyCode)
                return uiUtil.showMsg($verifyInfo, translate("email.code_required"));

            if (!validationUtil.isValidVerifyCode(verifyCode))
                return uiUtil.showMsg($verifyInfo, translate("email.code_invalid_rule"));

            const email = getEmailValue();
            if (!validationUtil.isValidEmail(email))
                return uiUtil.showMsg($verifyInfo, translate("email.invalid"));

            try {
                const data = await apiUtil.get(apiUtil.url.EMAIL_VERIFY(verifyCode, email));

                if (data.code === responseCode.SUCCESS && data.data === true) {
                    uiUtil.showSuccess($verifyInfo, translate("email.verified"));
                    window.isEmailVerified = true;
                    $verifyCode.disabled = true;
                    $btnVerify.disabled = true;
                } else {
                    uiUtil.showMsg($verifyInfo, translate("email.code_wrong"));
                    window.isEmailVerified = false;
                }
            } catch (e) {
                uiUtil.showMsg($verifyInfo, translate("common.server_error"));
                window.isEmailVerified = false;
            }
        });

        window.validateEmailBeforeSubmit = function () {
            if (!window.isEmailVerified) {
                uiUtil.showMsg($verifyInfo, translate("email.verify_required"));
                return false;
            }
            return true;
        };
    }
}

function initSignUpButton() {
    const $btnSignUp = document.getElementById("btnSignUp");

    const $firstName = document.getElementById("firstName");
    const $middleName = document.getElementById("middleName");
    const $lastName = document.getElementById("lastName");
    const $nameError = document.getElementById("nameError");

    const $nickname = document.getElementById("nickname");
    const $emailLocal = document.getElementById("emailLocal");
    const $password = document.getElementById("password");
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

    $btnSignUp.addEventListener("click", async () => {
        if (!validateName()) { return $firstName.focus(); }
        if (!window.validateNicknameBeforeSubmit()) { return $nickname.focus(); }
        if (!window.validateEmailBeforeSubmit()) { return $emailLocal.focus(); }
        if (!window.validatePasswordBeforeSubmit()) { return $password.focus(); }
        if (!window.validatePhoneBeforeSubmit()) { return $phoneNumber.focus(); }

        const $countrySelect = document.getElementById("countryCode");
        const selected = $countrySelect.options[$countrySelect.selectedIndex];
        const countryCode = selected.value;

        const email = (() => {
            const local = $emailLocal.value.trim();
            const $domainSelect = document.getElementById("emailDomain");
            const $domainInput = document.getElementById("emailDomainDirect");
            const domain =
                $domainSelect.value === "direct"
                    ? $domainInput.value.trim()
                    : $domainSelect.value;
            return `${local}@${domain}`;
        })();

        const payload = {
            firstName: $firstName.value.trim(),
            middleName: $middleName.value.trim(),
            lastName: $lastName.value.trim(),
            nickname: $nickname.value.trim(),
            email: email,
            password: $password.value.trim(),
            countryCode: countryCode,
            phoneNumber: $phoneNumber.value.trim(),
        };

        try {
            const data = await apiUtil.post(apiUtil.url.SIGN_UP, payload);

            if (data.code === responseCode.SUCCESS) {
                uiUtil.showModal(translate("signup.success"), {
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