import { applyI18nTexts, loadLanguageFile, translate } from "/js/i18n/i18n.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { log, responseCode } from "/js/common/constants.js";
import { uiUtil } from "/js/common/uiUtil.js";
import { validationUtil } from "/js/common/form/validationUtil.js";

document.addEventListener("DOMContentLoaded", initUserInfoPage);

async function initUserInfoPage() {
    await loadLanguageFile();
    applyI18nTexts();

    setUserInfoEvents();
    setNicknameEditEvents();
    setPasswordEditEvents();
}

function setUserInfoEvents() {
    const $nicknameEditButton = document.querySelector(".nickname-edit-button");
    const $passwordChangeButton = document.querySelector(".password-change-button");
    const $preferenceButton = document.querySelector(".preference-button");
    const $logoutButton = document.querySelector(".logout-button");

    $nicknameEditButton.addEventListener("click", function () {
        openNicknameModal();
    });

    $passwordChangeButton.addEventListener("click", function () {
        openPasswordModal();
    });

    $preferenceButton.addEventListener("click", function () {
        location.href = "/mypage/user/preference";
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

let nicknameVerified = false;
let lastCheckedNickname = null;

function setNicknameEditEvents() {
    const $modal = document.getElementById("nicknameEditModal");
    const $backdrop = $modal.querySelector(".nickname-modal-backdrop");
    const $nicknameInput = document.getElementById("nicknameInput");
    const $duplicateButton = document.getElementById("nicknameDuplicateButton");
    const $message = document.getElementById("nicknameMessage");
    const $cancelButton = document.getElementById("nicknameCancelButton");
    const $changeButton = document.getElementById("nicknameChangeButton");

    $backdrop.addEventListener("click", function () {
        closeNicknameModal();
    });

    $cancelButton.addEventListener("click", function () {
        closeNicknameModal();
    });

    $nicknameInput.addEventListener("input", function () {
        const nickname = $nicknameInput.value.trim();

        nicknameVerified = false;
        lastCheckedNickname = null;

        if (!nickname) {
            uiUtil.clearMsg($message);
            return;
        }

        if (!validationUtil.isValidNickname(nickname)) {
            uiUtil.showMsg($message, translate("nickname.invalid"));
            return;
        }

        uiUtil.clearMsg($message);
    });

    $duplicateButton.addEventListener("click", async function () {
        const nickname = $nicknameInput.value.trim();

        if (!nickname) {
            uiUtil.showMsg($message, translate("nickname.input_required"));
            return;
        }

        if (!validationUtil.isValidNickname(nickname)) {
            uiUtil.showMsg($message, translate("nickname.invalid"));
            return;
        }

        await checkNicknameDuplicate(nickname, $message);
    });

    $changeButton.addEventListener("click", async function () {
        const nickname = $nicknameInput.value.trim();

        if (!nicknameVerified || lastCheckedNickname !== nickname) {
            uiUtil.showMsg($message, translate("nickname.duplicate_required"));
            return;
        }

        await changeNickname(nickname);
    });
}

function openNicknameModal() {
    const $modal = document.getElementById("nicknameEditModal");
    const $nicknameInput = document.getElementById("nicknameInput");
    const $message = document.getElementById("nicknameMessage");

    $nicknameInput.value = "";
    uiUtil.clearMsg($message);

    nicknameVerified = false;
    lastCheckedNickname = null;

    $modal.classList.remove("hidden");
}

function closeNicknameModal() {
    const $modal = document.getElementById("nicknameEditModal");
    $modal.classList.add("hidden");
}

async function checkNicknameDuplicate(nickname, $msg) {
    try {
        const data = await apiUtil.get(
            apiUtil.url.USER.NICKNAME_DUPLICATE(nickname)
        );

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
            lastCheckedNickname = nickname;
        } else {
            uiUtil.showMsg($msg, translate("nickname.bad_response"));
            nicknameVerified = false;
        }
    } catch (e) {
        uiUtil.showMsg($msg, translate("common.server_error"));
        nicknameVerified = false;
    }
}

async function changeNickname(nickname) {
    try {
        const response = await apiUtil.patch(
            apiUtil.url.USER.NICKNAME,
            { nickname: nickname }
        );

        if (response.code === responseCode.SUCCESS) {
            alert(translate("nickname.change_success"));
            closeNicknameModal();
            location.reload();
        }  else if (response.code === responseCode.BAD_REQUEST) {
            alert(response.message);
        }
        else {
            console.log(log.NICKNAME_UPDATE_FAILED, response.message);
        }
    } catch (e) {
       console.log(log.NICKNAME_UPDATE_FAILED, e);
    }
}

function setPasswordEditEvents() {
    const $modal = document.getElementById("passwordEditModal");
    const $backdrop = $modal.querySelector(".nickname-modal-backdrop");

    const $currentPassword = document.getElementById("currentPassword");
    const $newPassword = document.getElementById("newPassword");
    const $confirmPassword = document.getElementById("confirmPassword");

    const $currentMsg = document.getElementById("currentPasswordMessage");
    const $newMsg = document.getElementById("newPasswordMessage");
    const $confirmMsg = document.getElementById("confirmPasswordMessage");

    const $cancelBtn = document.getElementById("passwordCancelButton");
    const $submitBtn = document.getElementById("passwordChangeSubmitButton");

    const $ruleInfoBtn = document.getElementById("btnPasswordRuleInfo");
    const $ruleBox = document.getElementById("passwordRuleBox");

    $backdrop.addEventListener("click", closePasswordModal);
    $cancelBtn.addEventListener("click", closePasswordModal);

    document.querySelectorAll(".toggle-password").forEach(($btn) => {
        $btn.addEventListener("click", function () {
            const targetId = $btn.dataset.target;
            const $input = document.getElementById(targetId);
            $input.type = $input.type === "password" ? "text" : "password";
        });
    });

    $currentPassword.addEventListener("input", function () {
        const value = $currentPassword.value.trim();

        if (!value) {
            uiUtil.clearMsg($currentMsg);
            return;
        }

        if (!validationUtil.isValidPassword(value)) {
            uiUtil.showMsg($currentMsg, translate("password.invalid"));
            return;
        }

        uiUtil.clearMsg($currentMsg);
    });

    $newPassword.addEventListener("input", function () {
        const value = $newPassword.value.trim();

        if (!value) {
            uiUtil.clearMsg($newMsg);
            return;
        }

        if (!validationUtil.isValidPassword(value)) {
            uiUtil.showMsg($newMsg, translate("password.invalid"));
            return;
        }

        uiUtil.clearMsg($newMsg);
    });

    $confirmPassword.addEventListener("input", function () {
        if (!$confirmPassword.value) {
            uiUtil.clearMsg($confirmMsg);
            return;
        }

        if ($newPassword.value === $confirmPassword.value) {
            uiUtil.showSuccess($confirmMsg, translate("password.match"));
        } else {
            uiUtil.showMsg($confirmMsg, translate("password.mismatch"));
        }
    });

    $submitBtn.addEventListener("click", async function () {
        if (!$currentPassword.value.trim()) {
            uiUtil.showMsg($currentMsg, translate("password.input_required"));
            return;
        }

        if (!validationUtil.isValidPassword($newPassword.value.trim())) {
            uiUtil.showMsg($newMsg, translate("password.invalid"));
            return;
        }

        if ($newPassword.value !== $confirmPassword.value) {
            uiUtil.showMsg($confirmMsg, translate("password.mismatch"));
            return;
        }

        await changePassword(
            $currentPassword.value.trim(),
            $newPassword.value.trim()
        );
    });

    $ruleInfoBtn.addEventListener("click", function () {
        $ruleBox.classList.toggle("hidden");
    });
}

function openPasswordModal() {
    document.getElementById("passwordEditModal").classList.remove("hidden");
    resetPasswordModal();

    const $ruleBox = document.getElementById("passwordRuleBox");
    if ($ruleBox) {
        $ruleBox.classList.add("hidden");
    }
}

function closePasswordModal() {
    document.getElementById("passwordEditModal").classList.add("hidden");
}

async function changePassword(currentPassword, newPassword) {
    try {
        const response = await apiUtil.patch(
            apiUtil.url.USER.PASSWORD,
            {
                currentPassword: currentPassword,
                password: newPassword
            }
        );

        if (response.code === responseCode.SUCCESS) {
            alert(translate("password.change_success"));
            closePasswordModal();
            location.reload();
        } else if (response.code === responseCode.BAD_REQUEST) {
            alert(response.message)
        } else {
            console.log(log.PASSWORD_UPDATE_FAILED, response.message);
        }
    } catch (e) {
        console.log(log.PASSWORD_UPDATE_FAILED, e);
    }
}

function resetPasswordModal() {
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    uiUtil.clearMsg(document.getElementById("currentPasswordMessage"));
    uiUtil.clearMsg(document.getElementById("newPasswordMessage"));
    uiUtil.clearMsg(document.getElementById("confirmPasswordMessage"));
}