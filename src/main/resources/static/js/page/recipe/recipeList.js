import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { recipeUtil } from "/js/common/recipeUtil.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode, log } from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initRecipeList);

async function initRecipeList() {
    await loadLanguageFile();
    applyI18nTexts();

    initBackButton();
    initSearchBox();
    initCategoryButtons();
    initSortButtons();
    initScroll();
    initFilterModal();
    initTimeRangeSlider();
    initEmptyResultDisplay();
    recipeUtil.initRecipeClick();
    recipeUtil.initLikeButton();
    recipeUtil.initWriteButton();
    recipeUtil.initScrollTopButton();
}

let currentPage = 1;
let isLoading = false;
let isLastPage = false;

function initBackButton() {
    document.getElementById("backBtn")?.addEventListener("click", () => {
        history.back();
    });
}

function initSearchBox() {
    const $input = document.getElementById("searchInput");
    const $btn = document.getElementById("searchBtn");

    const search = () => {
        const keyword = $input.value.trim();
        const current = new URLSearchParams(location.search);
        const params = new URLSearchParams();

        const sort = current.get("sort") || "recent";
        params.set("sort", sort);

        if (keyword) {
            params.set("keyword", keyword);
        }

        const categoryCode = current.get("categoryCode");
        if (categoryCode) {
            params.set("categoryCode", categoryCode);
        }

        location.href = `/home/recipe/${sort}-order/list?${params.toString()}`;
    };

    $btn.addEventListener("click", search);
    $input.addEventListener("keydown", (e) => e.key === "Enter" && search);

    const $clear = document.getElementById("clearKeywordBtn");
    $clear?.addEventListener("click", () => {
        const params = new URLSearchParams(location.search);
        params.delete("keyword");

        location.href = `/home/recipe/recent-order/list?${params.toString()}`;
    });
}

function initCategoryButtons() {
    document.querySelectorAll(".category-item").forEach($item => {
        $item.addEventListener("click", () => {
            const code = $item.dataset.code;

            const current = new URLSearchParams(location.search);
            const params = new URLSearchParams();

            const sort = current.get("sort") || "recent";
            params.set("sort", sort);

            if (code) {
                params.set("categoryCode", code);
            }

            const keyword = current.get("keyword");
            if (keyword) {
                params.set("keyword", keyword);
            }

            location.href = `/home/recipe/${sort}-order/list?${params.toString()}`;
        });
    });
}

function initSortButtons() {
    document.querySelectorAll(".sort-btn").forEach($button => {
        $button.addEventListener("click", () => {
            const sort = $button.dataset.sort;

            document.querySelectorAll(".sort-btn").forEach($activeButton => $activeButton.classList.remove("active"));
            $button.classList.add("active");

            const current = new URLSearchParams(location.search);
            const params = new URLSearchParams();

            params.set("sort", sort);

            const keyword = current.get("keyword");
            if (keyword) {
                params.set("keyword", keyword);
            }

            const categoryCode = current.get("categoryCode");
            if (categoryCode) {
                params.set("categoryCode", categoryCode);
            }

            const baseUrl =
                sort === "like"
                    ? "/home/recipe/like-order/list"
                    : "/home/recipe/recent-order/list";

            location.href = `${baseUrl}?${params.toString()}`;
        });
    });
}

function initEmptyResultDisplay() {
    const $emptyFlag = document.getElementById("serverEmptyResultFlag");
    const $empty = document.querySelector(".empty-result");

    if ($emptyFlag) {
        $empty.style.display = "block";
    } else {
        $empty.style.display = "none";
    }
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

    const categoryCode = current.get("categoryCode");
    const keyword = current.get("keyword");
    const sort = current.get("sort") || "recent";

    if (categoryCode) {
        params.set("categoryCode", categoryCode);
    }

    if (keyword) {
        params.set("keyword", keyword);
    }

    params.set("page", currentPage);
    params.set("size", 10);

    const apiUrl =
        sort === "like"
            ? apiUtil.url.RECIPE.LIKE_ORDER_LIST
            : apiUtil.url.RECIPE.RECENT_ORDER_LIST;

    try {
        const data = await apiUtil.get(apiUrl, params);

        if (data.code !== responseCode.SUCCESS) {
            console.error(log.FAILED_LOAD_NEXT_PAGE, data.message);
            isLoading = false;
            return;
        }

        const list = data.data.recipelist;

        if (!list || list.length === 0) {
            isLastPage = true;
            isLoading = false;
            return;
        }

        appendRecipes(list);

    } catch (err) {
        console.error(log.FAILED_LOAD_NEXT_PAGE,err);
    }

    isLoading = false;
}

function appendRecipes(recipes) {
    const $list = document.getElementById("recipeList");

    recipes.forEach(recipe => {
        const $card = document.createElement("div");
        $card.className = "recipe-card";
        $card.dataset.id = recipe.recipeNo;
        $card.dataset.time = recipe.cookingTime;
        $card.dataset.diff = recipe.difficultyCode;

        $card.innerHTML = `
            <div class="recipe-img-box">
                <img src="${recipe.imageUrl}">
            </div>

            <div class="recipe-info">
                <p class="recipe-name">${recipe.name}</p>
                <p class="recipe-desc">${recipe.description}</p>

                <div class="recipe-meta">
                    <span>${recipe.cookingTime}분</span>
                    <span>${recipe.difficultyCodeName}</span>
                </div>
            </div>

            <div class="recipe-like">
                <img class="icon-unliked ${recipe.isLiked ? 'hidden' : ''}" src="/images/unlike.png">
                <img class="icon-liked ${recipe.isLiked ? '' : 'hidden'}" src="/images/like.png">
                <span class="like-count">${recipe.likeCount}</span>
            </div>
        `;

        $list.appendChild($card);
    });

    recipeUtil.initRecipeClick();
    recipeUtil.initLikeButton();

    autoLoadIfScrollShort();
    applyFilterToCards()
}

function initFilterModal() {
    const $modal = document.getElementById("filterModal");
    const $icon = document.querySelector(".filter-icon");
    const $cancel = document.getElementById("filterCancelBtn");
    const $apply = document.getElementById("filterApplyBtn");
    const $reset = document.getElementById("filterResetBtn");

    $icon.addEventListener("click", () => {
        $modal.style.display = "flex";
        loadFilterState();
    });

    $cancel.addEventListener("click", () => ($modal.style.display = "none"));
    $reset.addEventListener("click", resetFilter);
    $apply.addEventListener("click", () => {
        saveFilterState();
        applyFilterToCards();
        $modal.style.display = "none";
    });
}

function saveFilterState() {
    const $difficulties = [...document.querySelectorAll(".difficulty-check")]
        .filter($chk => $chk.checked)
        .map($chk => $chk.value);

    sessionStorage.setItem("filter_difficulty", JSON.stringify($difficulties));
    sessionStorage.setItem("filter_time_min", document.getElementById("timeMin").value);
    sessionStorage.setItem("filter_time_max", document.getElementById("timeMax").value);
}

function loadFilterState() {
    let savedDiff = sessionStorage.getItem("filter_difficulty");

    if (!savedDiff) {
        savedDiff = ["D1", "D2", "D3"];
    } else {
        savedDiff = JSON.parse(savedDiff);
    }

    const savedMin = sessionStorage.getItem("filter_time_min") || 0;
    const savedMax = sessionStorage.getItem("filter_time_max") || 120;

    document.querySelectorAll(".difficulty-check").forEach($chk => {
        $chk.checked = savedDiff.includes($chk.value);
    });

    document.getElementById("timeMin").value = savedMin;
    document.getElementById("timeMax").value = savedMax;
}

function resetFilter() {
    document.querySelectorAll(".difficulty-check").forEach($chk => $chk.checked = true);
    document.getElementById("timeMin").value = 0;
    document.getElementById("timeMax").value = 120;
}

function applyFilterToCards() {
    const savedDiff = JSON.parse(sessionStorage.getItem("filter_difficulty") || "[]");
    let minTime = Number(sessionStorage.getItem("filter_time_min") || 0);
    let maxTime = Number(sessionStorage.getItem("filter_time_max") || 120);
    let showRecipeCount = 0;

    const $cards = document.querySelectorAll(".recipe-card");

    $cards.forEach($card => {
        const time = Number($card.dataset.time);
        const diff = $card.dataset.diff;

        const diffPass =
            savedDiff.length === 0 || savedDiff.includes(diff.trim());

        const timePass =
            time >= minTime && time <= maxTime;

        if (diffPass && timePass) {
            $card.style.display = "flex";
            showRecipeCount++;
        } else {
            $card.style.display = "none";
        }
    });

    toggleEmptyResult(showRecipeCount === 0);

    autoLoadIfScrollShort();
}

function initTimeRangeSlider() {
    const $minSlider = document.getElementById("timeMin");
    const $maxSlider = document.getElementById("timeMax");
    const $minValue = document.getElementById("timeMinValue");
    const $maxValue = document.getElementById("timeMaxValue");
    const minGap = 5;

    function updateLabels() {
        $minValue.textContent = $minSlider.value + "분";
        $maxValue.textContent = $maxSlider.value >= 120 ? "120분+" : $maxSlider.value + "분";
    }

    $minSlider.addEventListener("input", () => {
        if (+$maxSlider.value - +$minSlider.value < minGap) {
            $minSlider.value = +$maxSlider.value - minGap;
        }
        updateLabels();
    });

    $maxSlider.addEventListener("input", () => {
        if (+$maxSlider.value - +$minSlider.value < minGap) {
            $maxSlider.value = +$minSlider.value + minGap;
        }
        updateLabels();
    });

    updateLabels();
}

async function autoLoadIfScrollShort() {
    const $area = document.querySelector(".recipe-scroll-area");

    if ($area.scrollHeight <= $area.clientHeight + 50) {
        if (!isLastPage && !isLoading) {
            await loadNextPage();

            applyFilterToCards();
        }
    }
}

function toggleEmptyResult(show) {
    const $empty = document.querySelector(".empty-result");
    const $list = document.getElementById("recipeList");

    if (show) {
        $empty.style.display = "block";
        if ($list) {
            $list.style.display = "none";
        }
    } else {
        $empty.style.display = "none";
        if ($list) {
            $list.style.display = "block";
        }
    }
}

window.addEventListener("load", () => {
    applyFilterToCards();
});