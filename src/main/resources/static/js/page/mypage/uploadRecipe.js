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

        const $imgBox = document.createElement("div");
        $imgBox.className = "recipe-img-box";

        const $img = document.createElement("img");
        $img.src = recipe.imageUrl;
        $img.alt = "recipe image";

        $imgBox.appendChild($img);

        const $info = document.createElement("div");
        $info.className = "recipe-info";

        const $name = document.createElement("p");
        $name.className = "recipe-name";
        $name.textContent = recipe.name;

        const $desc = document.createElement("p");
        $desc.className = "recipe-desc";
        $desc.textContent = recipe.description;

        const $meta = document.createElement("div");
        $meta.className = "recipe-meta";

        const $time = document.createElement("span");
        $time.className = "meta-item";

        const $timeIcon = document.createElement("img");
        $timeIcon.src = "/images/time.png";
        $timeIcon.className = "meta-icon";

        const $timeText = document.createTextNode(`${recipe.cookingTime}분`);

        $time.append($timeIcon, $timeText);

        const $difficulty = document.createElement("span");
        $difficulty.className = "meta-item";

        const $diffIcon = document.createElement("img");
        $diffIcon.src = "/images/difficulty.png";
        $diffIcon.className = "meta-icon";

        const $diffText = document.createTextNode(recipe.difficulty);

        $difficulty.append($diffIcon, $diffText);

        const $like = document.createElement("div");
        $like.className = "recipe-like like-button-area";

        const $unliked = document.createElement("img");
        $unliked.src = "/images/unlike.png";
        $unliked.className = `icon-unliked ${recipe.isLiked ? "hidden" : ""}`;

        const $liked = document.createElement("img");
        $liked.src = "/images/like.png";
        $liked.className = `icon-liked ${recipe.isLiked ? "" : "hidden"}`;

        const $count = document.createElement("span");
        $count.className = "like-count";
        $count.textContent = recipe.likeCount;

        $like.append($unliked, $liked, $count);

        $meta.append($time, $difficulty, $like);
        $info.append($name, $desc, $meta);

        const $deleteBtn = document.createElement("div");
        $deleteBtn.className = "recipe-delete-btn";
        $deleteBtn.dataset.id = recipe.recipeNo;

        const $deleteImg = document.createElement("img");
        $deleteImg.src = "/images/delete.png";

        $deleteBtn.appendChild($deleteImg);

        $card.append($imgBox, $info, $deleteBtn);
        fragment.appendChild($card);
    });

    $recipeList.appendChild(fragment);
}

