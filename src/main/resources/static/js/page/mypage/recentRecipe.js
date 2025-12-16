import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { recipeUtil } from "/js/common/recipeUtil.js";
import { myRecipeUtil } from "/js/page/mypage/myRecipeUtil.js";

document.addEventListener("DOMContentLoaded", initRecentRecipe);

async function initRecentRecipe() {
    await loadLanguageFile();
    applyI18nTexts();

    myRecipeUtil.initCardClick({
        ignoreSelectors: [".like-button-area"],
        onCardClick: ($card) => {
            location.href = `/home/recipe/${$card.dataset.id}`;
        }
    });

    recipeUtil.initLikeButton();
    recipeUtil.initScrollTopButton();
    recipeUtil.initWriteButton();
}
