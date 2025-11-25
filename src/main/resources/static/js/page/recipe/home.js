import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { uiUtil } from "/js/common/uiUtil.js";
import { responseCode, log } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initHome);

async function initHome() {
    await loadLanguageFile();
    applyI18nTexts();

    initSearchBox();
    initCategoryButton();
    initRecipeCardClick();
    initLikeButton();
    initWriteButton();
}
function initSearchBox() {
    const $input = document.getElementById("searchInput");
    const $searchButton = document.getElementById("searchButton");

    function goSearch() {
        const keyword = $input.value.trim();
        if (!keyword) {
            return;
        }

        const query = new URLSearchParams({ keyword }).toString();
        window.location.href = `/recipe/list?${query}`;
    }

    $searchButton.addEventListener("click", goSearch);
    $input.addEventListener("keydown", (e) => e.key === "Enter" && goSearch());
}


function initCategoryButton() {
    document.querySelectorAll(".category-item").forEach($item => {
        $item.addEventListener("click", () => {
            const query = new URLSearchParams({
                categoryCode: $item.dataset.code,
            }).toString();

            window.location.href = `/recipe/list?${query}`;
        });
    });
}

function initRecipeCardClick() {
    document.querySelectorAll(".recipe-card").forEach($card => {
        $card.addEventListener("click", () => {
            const recipeId = $card.dataset.id;
            if (!recipeId) {
                return;
            }

            window.location.href = `/recipe/${recipeId}`;
        });
    });
}

function initLikeButton() {
    document.querySelectorAll(".like-icon").forEach($icon => {

        $icon.addEventListener("click", async (e) => {
            e.stopPropagation();

            if (document.body.dataset.isLogin !== "true") {
                window.location.href = "/user/login";
                return;
            }

            const $card = $icon.closest(".recipe-card");
            const recipeId = $card.dataset.id;

            const $count = $card.querySelector(".like-count");
            const isLiked = $icon.classList.contains("liked");

            try {
                const apiCall = isLiked
                    ? apiUtil.delete(apiUtil.url.RECIPE.LIKE(recipeId))
                    : apiUtil.post(apiUtil.url.RECIPE.LIKE(recipeId));

                const data = await apiCall;

                if (data.code !== responseCode.SUCCESS) {
                    console.error(log.LIKE_RECIPE_FAILED, data.message);
                    return;
                }

                if (isLiked) {
                    $icon.classList.remove("liked");
                    $icon.src = "/images/unlike.png";
                    $count.textContent = Number($count.textContent) - 1;
                } else {
                    $icon.classList.add("liked");
                    $icon.src = "/images/like.png";
                    $count.textContent = Number($count.textContent) + 1;
                }

            } catch (err) {
                console.error(log.LIKE_RECIPE_FAILED, err);
            }
        });
    });
}

function initWriteButton() {
    const $writeButton = document.getElementById("writeRecipeBtn");

    $writeButton.addEventListener("click", async () => {
        try {
            const data = await apiUtil.get(apiUtil.url.RECIPE.DRAFT_COUNT);

            if (data.code === responseCode.SUCCESS) {
                if (data.data >= 10) {
                    uiUtil.showDraftLimitModal();
                    return;
                }

                window.location.href = "/recipe/write";
            } else {
                console.error(log.DRAFT_COUNT_FAILED, data.message);
            }
        } catch (e) {
            console.error(log.DRAFT_COUNT_FAILED, e);
        }
    });
}