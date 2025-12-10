import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { recipeUtil } from "/js/common/recipeUtil.js";

document.addEventListener("DOMContentLoaded", initHome);

async function initHome() {
    await loadLanguageFile();
    applyI18nTexts();

    initSearchBox();
    initCategoryButton();
    initRecipeCardClick();
    recipeUtil.initLikeButton();
    recipeUtil.initWriteButton();
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

        window.location.href = `/home/recipe/list?${query}`;
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

            window.location.href = `/home/recipe/list?${query}`;
        });
    });
}

function initRecipeCardClick() {
    document.querySelectorAll(".recipe-card").forEach($card => {
        $card.addEventListener("click", () => {
            location.href = `/home/recipe/${$card.dataset.id}`;
        });
    });
}