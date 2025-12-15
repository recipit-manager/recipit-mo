import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { recipeUtil } from "/js/common/recipeUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode, log } from "/js/common/constants.js";
import { myRecipeUtil } from "/js/page/mypage/myRecipeUtil.js";

document.addEventListener("DOMContentLoaded", initUploadRecipe);

let currentPage = 1;
let isLoading = false;
let isLastPage = false;

async function initUploadRecipe() {
    await loadLanguageFile();
    applyI18nTexts();

    myRecipeUtil.initCardClick({
        ignoreSelectors: [".like-button-area", ".recipe-delete-btn"],
        onCardClick: ($card) => {
            location.href = `/home/recipe/${$card.dataset.id}`;
        }
    });
    myRecipeUtil.initDeleteButton();
    myRecipeUtil.initEmptyWriteButton();
    recipeUtil.initLikeButton();
    recipeUtil.initScrollTopButton();
    recipeUtil.initWriteButton();
    initScroll();
}

function initScroll() {
    const $scrollArea = document.querySelector(".recipe-scroll-area");

    $scrollArea.addEventListener("scroll", async () => {

        if (isLoading || isLastPage) {
            return;
        }

        const isNearBottom =
            $scrollArea.scrollTop + $scrollArea.clientHeight >=
            $scrollArea.scrollHeight - 150;

        if (isNearBottom) {
            await loadNextPage();
        }
    });
}

async function loadNextPage() {
    isLoading = true;
    currentPage++;

    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("size", 10);

    try {
        const data = await apiUtil.get(apiUtil.url.RECIPE.UPLOAD_RECIPES, params);

        if (data.code !== responseCode.SUCCESS) {
            console.error(log.FAILED_LOAD_NEXT_PAGE, data.message);
            return;
        }

        const recipeList = data.data;
        if (!recipeList || recipeList.length === 0) {
            isLastPage = true;
            return;
        }

        appendRecipes(recipeList);

    } catch (error) {
        console.error(log.FAILED_LOAD_NEXT_PAGE, error);
    } finally {
        isLoading = false;
    }
}

function appendRecipes(recipes) {
    const $recipeList = document.getElementById("recipeList");
    const fragment = document.createDocumentFragment();

    recipes.forEach((recipe) => {
        const $card = document.createElement("div");
        $card.className = "recipe-card";
        $card.dataset.id = recipe.recipeNo;

        $card.innerHTML = `
            <div class="recipe-img-box">
                <img src="${recipe.imageUrl}">
            </div>

            <div class="recipe-info">
                <p class="recipe-name">${recipe.name}</p>
                <p class="recipe-desc">${recipe.description}</p>

                <div class="recipe-meta">
                    <span class="meta-item">
                        <img src="/images/time.png" class="meta-icon">
                        ${recipe.cookingTime}분
                    </span>

                    <span class="meta-item">
                        <img src="/images/difficulty.png" class="meta-icon">
                        ${recipe.difficulty}
                    </span>

                    <div class="recipe-like like-button-area">
                        <img class="icon-unliked ${recipe.isLiked ? "hidden" : ""}" src="/images/unlike.png">
                        <img class="icon-liked ${recipe.isLiked ? "" : "hidden"}" src="/images/like.png">
                        <span class="like-count">${recipe.likeCount}</span>
                    </div>
                </div>
            </div>

            <div class="recipe-delete-btn" data-id="${recipe.recipeNo}">
                <img src="/images/delete.png">
            </div>
        `;

        fragment.appendChild($card);
    });

    $recipeList.appendChild(fragment);
}
