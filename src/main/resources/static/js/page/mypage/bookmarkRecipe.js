import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { recipeUtil } from "/js/common/recipeUtil.js";
import { myRecipeUtil } from "/js/page/mypage/myRecipeUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";

document.addEventListener("DOMContentLoaded", initBookmarkRecipe);

async function initBookmarkRecipe() {
    await loadLanguageFile();
    applyI18nTexts();

    myRecipeUtil.initCardClick({
        ignoreSelectors: [".like-button-area", ".bookmark-icon"],
        onCardClick: ($card) => {
            location.href = `/home/recipe/${$card.dataset.id}`;
        }
    });

    myRecipeUtil.initInfiniteScroll({
        apiUrl: apiUtil.url.RECIPE.BOOKMARK_RECIPES,
        buildCard: recipe =>
            myRecipeUtil.buildRecipeCard(recipe, {
                showBookmark: true
            }),
        afterAppend: () => {
            recipeUtil.initBookmarkButton();
            recipeUtil.initLikeButton();
        }
    });

    recipeUtil.initBookmarkButton();
    recipeUtil.initScrollTopButton();
    recipeUtil.initWriteButton();
    recipeUtil.initLikeButton();
}