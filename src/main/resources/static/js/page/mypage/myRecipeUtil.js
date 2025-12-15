import { translate } from "/js/i18n/i18n.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode, log } from "/js/common/constants.js";
import { uiUtil } from "/js/common/uiUtil.js";
import { recipeUtil } from "/js/common/recipeUtil.js";

export const myRecipeUtil = {

    initCardClick({
                      containerSelector = ".recipe-scroll-area",
                      ignoreSelectors = [],
                      onCardClick
                  }) {
        const $container = document.querySelector(containerSelector);
        if (!$container || !onCardClick) {
            return;
        }

        $container.addEventListener("click", (event) => {

            for (const selector of ignoreSelectors) {
                if (event.target.closest(selector)) {
                    return;
                }
            }

            const $card = event.target.closest(".recipe-card");
            if (!$card) {
                return;
            }

            onCardClick($card);
        });
    },

    initDeleteButton(containerSelector = ".recipe-scroll-area") {
        const $container = document.querySelector(containerSelector);
        if (!$container) {
            return;
        }

        $container.addEventListener("click", (event) => {
            const $deleteButton = event.target.closest(".recipe-delete-btn");
            if (!$deleteButton) {
                return;
            }

            event.stopPropagation();

            const recipeId = $deleteButton.dataset.id;

            uiUtil.showConfirmModal(
                translate("ui.recipe.delete.confirm"),
                {
                    title: translate("ui.recipe.delete.title"),
                    confirmText: translate("common.delete"),
                    cancelText: translate("common.cancel"),

                    onConfirm: async () => {
                        try {
                            const data = await apiUtil.delete(
                                apiUtil.url.RECIPE.DELETE(recipeId)
                            );

                            if (data.code !== responseCode.SUCCESS) {
                                console.error(log.RECIPE_DELETE_FAILED, data.message);
                                return;
                            }

                            location.reload();

                        } catch (error) {
                            console.error(log.RECIPE_DELETE_FAILED, error);
                        }
                    }
                }
            );
        });
    },

    initEmptyWriteButton() {
        const $btn = document.getElementById("emptyWriteRecipeBtn");
        if (!$btn) return;

        $btn.addEventListener("click", recipeUtil.handleWriteRecipe);
    }
};
