document.addEventListener("DOMContentLoaded",  () => {
    initNicknameValidation();
    initEmailValidation();
    initPasswordValidation();
    initPhoneNumberValidation();
    initSignUpButton();
    applyI18nTexts();
});

const API_BASE = "http://localhost:8080";
const API_URL = {
    NICKNAME_DUPLICATE: (nick) => `${API_BASE}/user/nickname/${encodeURIComponent(nick)}/duplicateYn`,
    EMAIL_SEND: `${API_BASE}/user/email/authentication`,
    EMAIL_VERIFY: (code, email) =>
        `${API_BASE}/user/email/authentication/${encodeURIComponent(code)}?email=${encodeURIComponent(email)}`,
    SIGN_UP: `${API_BASE}/user`,
};
const COLORS = {
    ERROR: "#c00",
    SUCCESS: "#2e7d32",
    WARNING: "#555",
};
const uiUtils = {
    showMsg($el, text, color = COLORS.ERROR) {
        if (!$el) return;
        $el.textContent = text || "";
        $el.style.color = color;
    },
    clearMsg($el) {
        if (!$el) return;
        $el.textContent = "";
    },
    showSuccess($el, text) {
        this.showMsg($el, text, COLORS.SUCCESS);
    },
    showWarning($el, text) {
        this.showMsg($el, text, COLORS.WARNING);
    },
};

async function fetchJson(url, options = {}) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error("network");
        return await res.json();
    } catch (err) {
        console.error(`[fetchJson] ${url}`, err);
        throw new Error("fetch-failed");
    }
}

function initNicknameValidation() {
    const $nickname = document.getElementById("nickname");
    const $btnCheck = document.getElementById("btnCheckNickname");
    const $msg = document.getElementById("nicknameError");

    let nicknameVerified = false;
    let lastCheckedNickname = "";

    const isValidNickname = (v) => /^[A-Za-z0-9가-힣]{2,8}$/.test(v);

    $nickname.addEventListener("input", (e) => {
        if (e.isComposing) return;

        const cleaned = $nickname.value.replace(/[^A-Za-z0-9가-힣]/g, "");
        if (cleaned !== $nickname.value) $nickname.value = cleaned;

        if (nicknameVerified && $nickname.value !== lastCheckedNickname) {
            nicknameVerified = false;
            uiUtils.showWarning($msg, t("nickname.check_needed"));
        }

        if ($nickname.value.length >= 1 && $msg.textContent === t("nickname.input_required")) {
            uiUtils.clearMsg($msg);
        }
    });

    $btnCheck.addEventListener("click", async () => {
        const nick = ($nickname.value || "").trim();

        if (!nick) {
            uiUtils.showMsg($msg, t("nickname.input_required"));
            nicknameVerified = false;
            return;
        }
        if (!isValidNickname(nick)) {
            uiUtils.showMsg($msg, t("nickname.invalid"));
            nicknameVerified = false;
            return;
        }

        try {
            const data = await fetchJson(API_URL.NICKNAME_DUPLICATE(nick));

            if (data.code !== "0000") {
                uiUtils.showMsg($msg, data.message || t("common.server_error"));
                nicknameVerified = false;
                return;
            }

            if (data.data === "Y") {
                uiUtils.showMsg($msg, t("nickname.already_used"));
                nicknameVerified = false;
            } else if (data.data === "N") {
                uiUtils.showSuccess($msg, t("nickname.available"));
                nicknameVerified = true;
                lastCheckedNickname = nick;
            } else {
                uiUtils.showMsg($msg, t("nickname.bad_response"));
                nicknameVerified = false;
            }
        } catch (e) {
            uiUtils.showMsg($msg, t("common.server_error"));
            nicknameVerified = false;
        }
    });

    window.validateNicknameBeforeSubmit = function () {
        const nick = ($nickname.value || "").trim();

        if (!nick) {
            uiUtils.showMsg($msg, t("nickname.input_required"));
            return false;
        }
        if (!isValidNickname(nick)) {
            uiUtils.showMsg($msg, t("nickname.invalid"));
            return false;
        }
        if (!nicknameVerified || nick !== lastCheckedNickname) {
            uiUtils.showWarning($msg, t("nickname.check_needed"));
            return false;
        }

        return true;
    };
}

function initEmailValidation() {
    const $emailLocal = document.getElementById("emailLocal");
    const $emailDomain = document.getElementById("emailDomain");
    const $emailDomainDirect = document.getElementById("emailDomainDirect");

    const getEmailValue = () => {
        const local = ($emailLocal.value || "").trim();
        const domain =
            $emailDomain.value === "direct"
                ? ($emailDomainDirect.value || "").trim()
                : $emailDomain.value;
        if (!local || !domain) return "";
        return `${local}@${domain}`;
    };

    const isValidEmail = (email) =>
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

    initEmailSendCode();
    initEmailVerifyCode();

    function initEmailSendCode() {
        const $sendCodeBtn = document.getElementById("btnSendCode");
        const $emailInfo = document.getElementById("emailInfo");

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
                $sendCodeBtn.textContent = t("ui.send_code");
                uiUtils.clearMsg($emailInfo);
                if (waitTimer) {
                    clearInterval(waitTimer);
                    waitTimer = null;
                }
                isWaiting = false;
            });
        });

        $sendCodeBtn.addEventListener("click", async () => {
            const email = getEmailValue();

            if (!email)
                return uiUtils.showMsg($emailInfo, t("email.input_required"));
            if (!isValidEmail(email))
                return uiUtils.showMsg($emailInfo, t("email.invalid"));
            if (isWaiting)
                return uiUtils.showMsg($emailInfo, t("email.try_later", { sec: remainSeconds }));

            $sendCodeBtn.disabled = true;

            try {
                const data = await fetchJson(API_URL.EMAIL_SEND, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                if (data.code === "0000" && data.data) {
                    const { sendEmailResult, postDatetime } = data.data;
                    const postTime = new Date(`${postDatetime}Z`);
                    const now = new Date();
                    const diffSec = Math.max(0, Math.floor((now - postTime) / 1000));
                    const remain = Math.max(0, 60 - diffSec);

                    if (sendEmailResult === true) {
                        uiUtils.showSuccess($emailInfo, t("email.sent"));
                        $sendCodeBtn.textContent = t("ui.resend_code");
                        lastSentEmail = email;

                        const verifySection = document.getElementById("verifySection");
                        if (verifySection) verifySection.style.display = "block";

                        startCooldown(60);
                    } else if (remain > 0) {
                        uiUtils.showMsg($emailInfo, t("email.try_later", { sec: remain }));
                        startCooldown(remain);
                    } else {
                        uiUtils.showWarning($emailInfo, t("email.retry_available"));
                        resetButton();
                    }
                } else {
                    uiUtils.showMsg($emailInfo, data.message || t("email.send_failed"));
                }
            } catch (e) {
                console.error("[signUp] 이메일 전송 실패:", e);
                uiUtils.showMsg($emailInfo, t("common.server_error"));
            } finally {
                if (!isWaiting) $sendCodeBtn.disabled = false;
            }
        });

        function startCooldown(seconds) {
            remainSeconds = seconds;
            isWaiting = true;
            $sendCodeBtn.disabled = true;

            clearInterval(waitTimer);
            waitTimer = setInterval(() => {
                remainSeconds--;
                $sendCodeBtn.textContent = `${t("ui.resend_code")} (${remainSeconds}s)`;
                if (remainSeconds <= 0) resetButton();
            }, 1000);
        }

        function resetButton() {
            clearInterval(waitTimer);
            waitTimer = null;
            isWaiting = false;
            $sendCodeBtn.disabled = false;
            $sendCodeBtn.textContent = lastSentEmail
                ? t("ui.resend_code")
                : t("ui.send_code");
        }
    }

    function initEmailVerifyCode() {
        const $verifyCode = document.getElementById("verifyCode");
        const $btnVerify = document.getElementById("checkVerifyCode");
        const $verifyInfo = document.getElementById("verifyCodeInfo");

        window.isEmailVerified = false;

        $btnVerify.addEventListener("click", async () => {
            const verifyCode = ($verifyCode.value || "").trim();

            if (!verifyCode)
                return uiUtils.showMsg($verifyInfo, t("email.code_required"));
            if (!/^[A-Z0-9]{8}$/.test(verifyCode))
                return uiUtils.showMsg($verifyInfo, t("email.code_invalid_rule"));

            const email = getEmailValue();
            if (!isValidEmail(email))
                return uiUtils.showMsg($verifyInfo, t("email.invalid"));

            try {
                const data = await fetchJson(API_URL.EMAIL_VERIFY(verifyCode, email));

                if (data.code === "0000" && data.data === true) {
                    uiUtils.showSuccess($verifyInfo, t("email.verified"));
                    window.isEmailVerified = true;
                    $verifyCode.disabled = true;
                    $btnVerify.disabled = true;
                } else {
                    uiUtils.showMsg($verifyInfo, t("email.code_wrong"));
                    window.isEmailVerified = false;
                }
            } catch (e) {
                uiUtils.showMsg($verifyInfo, t("common.server_error"));
                window.isEmailVerified = false;
            }
        });

        window.validateEmailBeforeSubmit = function () {
            if (!window.isEmailVerified) {
                uiUtils.showMsg($verifyInfo, t("email.verify_required"));
                return false;
            }
            return true;
        };
    }
}


function initPasswordValidation() {
    const $pwd = document.getElementById("password");
    const $pwdConfirm = document.getElementById("passwordConfirm");
    const $errorPwd = document.getElementById("passwordError");
    const $errorConfirm = document.getElementById("passwordConfirmError");
    const $btnToggle = document.getElementById("btnTogglePwd");
    const $btnTooltip = document.getElementById("btnPwdTooltip");
    const $tooltip = document.getElementById("pwdTooltip");

    const isValidPassword = (pwd) => {
        const length = /^.{8,16}$/;
        const upper = /[A-Z]/;
        const lower = /[a-z]/;
        const number = /[0-9]/;
        const special = /[!@#$%^&*]/;
        const repeat = /(.)\1\1/;
        return (
            length.test(pwd) &&
            upper.test(pwd) &&
            lower.test(pwd) &&
            number.test(pwd) &&
            special.test(pwd) &&
            !repeat.test(pwd)
        );
    };

    $pwd.addEventListener("input", () => {
        const val = $pwd.value;
        if (!val) {
            uiUtils.clearMsg($errorPwd);
            uiUtils.clearMsg($errorConfirm);
            return;
        }

        if (!isValidPassword(val)) {
            uiUtils.showMsg($errorPwd, t("password.invalid"));
        } else {
            uiUtils.clearMsg($errorPwd);
        }

        if ($pwdConfirm.value) comparePasswords();
    });

    const comparePasswords = () => {
        if (!$pwdConfirm.value) {
            uiUtils.clearMsg($errorConfirm);
            return;
        }
        if ($pwd.value === $pwdConfirm.value) {
            uiUtils.showSuccess($errorConfirm, t("password.match"));
        } else {
            uiUtils.showMsg($errorConfirm, t("password.mismatch"));
        }
    };

    $pwdConfirm.addEventListener("input", comparePasswords);

    $btnToggle.addEventListener("click", () => {
        const isHidden = $pwd.type === "password";
        $pwd.type = isHidden ? "text" : "password";
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
        const pwd = $pwd.value.trim();
        const confirm = $pwdConfirm.value.trim();

        if (!pwd) {
            uiUtils.showMsg($errorPwd, t("password.input_required"));
            return false;
        }
        if (!isValidPassword(pwd)) {
            uiUtils.showMsg($errorPwd, t("password.invalid"));
            return false;
        }
        if (!confirm) {
            uiUtils.showMsg($errorConfirm, t("password.confirm_required"));
            return false;
        }
        if (pwd !== confirm) {
            uiUtils.showMsg($errorConfirm, t("password.mismatch"));
            return false;
        }

        uiUtils.clearMsg($errorPwd);
        uiUtils.showSuccess($errorConfirm, t("password.match"));
        return true;
    };
}

function initPhoneNumberValidation() {
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

    const parseFormatGroups = (format) => {
        if (!format) return [];
        const parts = format.split(/[^0-9]/).filter(Boolean);
        return parts.map((p) => p.length);
    };

    const autoFormatNumber = (digits, format) => {
        if (!format) return digits;
        const groups = parseFormatGroups(format);
        let formatted = "";
        let idx = 0;

        for (let i = 0; i < groups.length; i++) {
            const groupLen = groups[i];
            const part = digits.slice(idx, idx + groupLen);
            formatted += part;
            idx += groupLen;

            if (idx < digits.length && i < groups.length - 1) {
                formatted += " ";
            }
        }
        return formatted.trim();
    };

    $countryCode.addEventListener("change", () => {
        const { format } = getSelectedCountry();
        $phoneNumber.placeholder = format;
        $phoneNumber.value = "";
        uiUtils.clearMsg($phoneError);
    });

    $phoneNumber.addEventListener("input", (e) => {
        uiUtils.clearMsg($phoneError);
        const { regex, format } = getSelectedCountry();

        let digits = e.target.value.replace(/\D/g, "");
        e.target.value = autoFormatNumber(digits, format);

        const pattern = new RegExp(regex);
        if (digits && !pattern.test(e.target.value)) {
            uiUtils.showMsg($phoneError, t("phone.invalid"));
        }
    });

    window.validatePhoneBeforeSubmit = function () {
        const { regex } = getSelectedCountry();
        const value = $phoneNumber.value.trim();

        if (!value) {
            uiUtils.showMsg($phoneError, t("phone.input_required"));
            return false;
        }

        if (!regex) return true;

        const pattern = new RegExp(regex);

        if (!pattern.test(value)) {
            uiUtils.showMsg($phoneError, t("phone.invalid"));
            return false;
        }

        uiUtils.clearMsg($phoneError);
        return true;
    };
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
            uiUtils.showMsg($nameError, t("signup.need_full_name"));
            return false;
        }
        uiUtils.clearMsg($nameError);
        return true;
    };

    const showModal = (message, success = false) => {
        let $modal = document.getElementById("signUpModal");
        if (!$modal) {
            $modal = document.createElement("div");
            $modal.id = "signUpModal";
            $modal.className = "modal-overlay";
            $modal.innerHTML = `
                <div class="modal-box">
                    <p id="modalMsg"></p>
                    <button id="modalClose" class="btn-small">${t("common.confirm")}</button>
                </div>
            `;
            document.body.appendChild($modal);
        }

        const $msg = document.getElementById("modalMsg");
        $msg.textContent = message;
        $msg.style.color = success ? COLORS.SUCCESS : COLORS.ERROR;
        $modal.style.display = "flex";

        document.getElementById("modalClose").onclick = () => {
            $modal.style.display = "none";
            if (success) window.location.href = "/login";
        };
    };

    $btnSignUp.addEventListener("click", async () => {
        if (!validateName()) return $firstName.focus();
        if (!window.validateNicknameBeforeSubmit()) return $nickname.focus();
        if (!window.validateEmailBeforeSubmit()) return $emailLocal.focus();
        if (!window.validatePasswordBeforeSubmit()) return $password.focus();
        if (!window.validatePhoneBeforeSubmit()) return $phoneNumber.focus();

        const $countrySelect = document.getElementById("countryCode");
        const $selected = $countrySelect.options[$countrySelect.selectedIndex];
        const countryGroupCode = $selected.dataset.groupcode;
        const countryCode = $selected.value;

        const email = (() => {
            const local = $emailLocal.value.trim();
            const domainSelect = document.getElementById("emailDomain");
            const domainInput = document.getElementById("emailDomainDirect");
            const domain =
                domainSelect.value === "direct"
                    ? domainInput.value.trim()
                    : domainSelect.value;
            return `${local}@${domain}`;
        })();

        const payload = {
            firstName: $firstName.value.trim(),
            middleName: $middleName.value.trim(),
            lastName: $lastName.value.trim(),
            nickname: $nickname.value.trim(),
            email: email,
            password: $password.value.trim(),
            countryCode: {
                groupCode: countryGroupCode,
                code: countryCode,
            },
            phoneNumber: $phoneNumber.value.trim(),
        };

        try {
            const data = await fetchJson(API_URL.SIGN_UP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (data.code === "0000") {
                showModal(t("signup.success"), true);
            } else {
                showModal(data.message);
            }
        } catch (err) {
            showModal(t("common.server_error"));
        }
    });
}

