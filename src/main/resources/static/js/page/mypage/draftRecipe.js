import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { recipeUtil } from "/js/common/recipeUtil.js";
import { myRecipeUtil } from "/js/page/mypage/myRecipeUtil.js";

document.addEventListener("DOMContentLoaded", initDraftRecipe);

async function initDraftRecipe() {
    await loadLanguageFile();
    applyI18nTexts();

    myRecipeUtil.initCardClick({
        ignoreSelectors: [".recipe-delete-btn"],
        onCardClick: () => {
            alert("개발 진행중입니다. (레시피 편집)");
        }
    });
    myRecipeUtil.initDeleteButton();
    myRecipeUtil.initEmptyWriteButton();
    recipeUtil.initScrollTopButton();
    recipeUtil.initWriteButton();
}
