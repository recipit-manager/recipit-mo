import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { recipeUtil } from "/js/common/recipeUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode, log } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initRefriItemList);

async function initRefriItemList() {
    await loadLanguageFile();
    applyI18nTexts();

    initRemoveTagButtons();
    initAddIngredientButton();
    initScroll();
    recipeUtil.initLikeButton();
    recipeUtil.initRecipeClick();
    recipeUtil.initScrollTopButton();
}

let currentPage = 1;
let isLoading = false;
let isLastPage = false;

function initRemoveTagButtons() {
    document.querySelectorAll(".remove-tag-btn").forEach($btn => {
        $btn.addEventListener("click", () => {

            const removeName = $btn.dataset.name;

            const search = new URLSearchParams(location.search);
            const Ingredients = (search.get("ingredients") || "")
                .split(",")
                .filter(i => i && i !== removeName)
                .join(",");

            const params = recipeUtil.buildParams({
                ingredients: Ingredients
            });

            location.href = `/refri/list?${params.toString()}`;
        });
    });
}

function initAddIngredientButton() {
    document.getElementById("addIngredientBtn").addEventListener("click", () => {
        const params = new URLSearchParams(location.search);
        location.href = `/refri/ingredientList?${params.toString()}`;
    });
}

function initScroll() {
    const $scrollArea = document.querySelector(".recipe-scroll-area");

    $scrollArea.addEventListener("scroll", async () => {
        if (isLoading || isLastPage) {
            return;
        }

        const nearBottom = $scrollArea.scrollTop + $scrollArea.clientHeight >= $scrollArea.scrollHeight - 150;

        if (nearBottom) {
            await loadNextPage();
        }
    });
}

async function loadNextPage() {
    isLoading = true;
    currentPage++;

    const params = new URLSearchParams();
    const current = new URLSearchParams(location.search);

    const ingredients = current.get("ingredients");
    params.set("keywordList", ingredients);
    params.set("page", currentPage);
    params.set("size", 10);

    try {
        const data = await apiUtil.get(apiUtil.url.REFRI.LIST, params);

        if (data.code !== responseCode.SUCCESS) {
            console.error(log.FAILED_LOAD_NEXT_PAGE, data.message);
            isLoading = false;
            return;
        }

        const list = data.data;

        if (!Array.isArray(list) || list.length === 0) {
            isLastPage = true;
            isLoading = false;
            return;
        }

        appendRecipes(list);

        if (list.length < 10) {
            isLastPage = true;
        }

    } catch (e) {
        console.error(log.FAILED_LOAD_NEXT_PAGE, e);
    }

    isLoading = false;
}

function appendRecipes(recipes) {
    const $recipeList = document.getElementById("recipeListArea");
    const fragment = document.createDocumentFragment();

    recipes.forEach(recipe => {
        const $card = document.createElement("div");
        $card.className = "recipe-card";
        $card.dataset.id = recipe.id;
        $card.setAttribute("onclick", `goToRecipeDetail(${recipe.id})`);

        $card.innerHTML = `
            <div class="recipe-main">

                <div class="recipe-img-box">
                    <img src="${recipe.imageUrl}" alt="${recipe.name}">
                </div>

                <div class="recipe-title-box">
                    <div class="recipe-title-left">
                        <p class="recipe-name">${recipe.name}</p>
                        <p class="recipe-desc">${recipe.description}</p>
                    </div>

                    <div class="recipe-like">
                        <img class="icon-unliked ${recipe.isLiked ? "hidden" : ""}" src="/images/unlike.png">
                        <img class="icon-liked ${recipe.isLiked ? "" : "hidden"}" src="/images/like.png">
                        <span class="like-count">${recipe.likeCount}</span>
                    </div>
                </div>

            </div>

            <div class="unmatch-area">
                <span class="unmatch-title" data-i18n="ui.needIngredient"></span>
                <div class="unmatch-scroll">
                    ${recipe.unMatchIngredientlist
            .map(item => `<span class="unmatch-item">${item}</span>`)
            .join("")}
                </div>
            </div>

            <div class="recipe-meta-box">
                <div class="recipe-meta">
                    <span class="meta-item">
                        <img src="/images/time.png" class="meta-icon">
                        ${recipe.cookingTime}
                        <span data-i18n="ui.time_unit"></span>
                    </span>
                    <span class="meta-item">
                        <img src="/images/difficulty.png" class="meta-icon">
                        ${recipe.difficulty}
                    </span>
                    <span class="meta-item">
                        <img src="/images/serving.png" class="meta-icon">
                        ${recipe.servingSize}
                        <span data-i18n="ui.servingUnit"></span>
                    </span>
                </div>
            </div>
            `;

        fragment.appendChild($card);
    });

    $recipeList.appendChild(fragment);
    applyI18nTexts();
}
