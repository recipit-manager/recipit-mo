import { applyI18nTexts, loadLanguageFile, translate } from "/js/i18n/i18n.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode, log } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initPreferencePage);

async function initPreferencePage() {
    await loadLanguageFile();
    applyI18nTexts();

    bindPreferenceEvents();
}

function bindPreferenceEvents() {
    const $cards = document.querySelectorAll(".preference-card");

    $cards.forEach(function ($card) {
        const $buttons = $card.querySelectorAll(".preference-action");

        $buttons.forEach(function ($button) {
            $button.addEventListener("click", async function () {
                if ($card.dataset.loading === "true") {
                    return;
                }

                const categoryCode = $card.dataset.categoryCode;
                const statusCode = $button.dataset.statusCode;

                $card.dataset.loading = "true";
                $card.classList.add("is-loading");

                try {
                    const response = await apiUtil.patch(
                        apiUtil.url.RECIPE.PREFERENCE_CATEGORY_STATUS,
                        { categoryCode, statusCode }
                    );

                    if (response.code === responseCode.SUCCESS) {
                        renderState($card, statusCode);
                        alert(getPreferenceChangeMessage(statusCode));
                        return;
                    }

                    if (response.code === responseCode.BAD_REQUEST) {
                        alert(response.message);
                        return;
                    }

                    alert(translate("ui.myPage.preference.update_fail"));
                    console.error(log.PREFERENCES_UPDATE_FAILED, response.message);

                } catch (error) {
                    alert(translate("ui.myPage.preference.server_error"));
                    console.error(log.PREFERENCES_UPDATE_FAILED, error);

                } finally {
                    delete $card.dataset.loading;
                    $card.classList.remove("is-loading");
                }
            });
        });
    });
}

function renderState($card, statusCode) {
    $card.dataset.currentStatus = statusCode;

    $card.classList.remove("selected-like", "selected-dislike");

    const $buttons = $card.querySelectorAll(".preference-action");
    $buttons.forEach(function ($btn) {
        $btn.classList.remove("active-like", "active-normal", "active-dislike");
    });

    if (statusCode === "RF01") {
        $card.classList.add("selected-like");
        $card.querySelector('[data-status-code="RF01"]').classList.add("active-like");
    }

    if (statusCode === "RF02") {
        $card.querySelector('[data-status-code="RF02"]').classList.add("active-normal");
    }

    if (statusCode === "RF03") {
        $card.classList.add("selected-dislike");
        $card.querySelector('[data-status-code="RF03"]').classList.add("active-dislike");
    }
}

function getPreferenceChangeMessage(statusCode) {
    if (statusCode === "RF01") {
        return translate("ui.myPage.preference.set_like");
    } else if (statusCode === "RF02") {
        return translate("ui.myPage.preference.set_normal");
    } else if (statusCode === "RF03") {
        return translate("ui.myPage.preference.set_dislike");
    }

    return null;
}