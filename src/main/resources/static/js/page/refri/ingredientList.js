import { applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode, log } from "/js/common/constants.js";
import { translate } from "/js/i18n/i18n.js";

document.addEventListener("DOMContentLoaded", initIngredientList);
document.addEventListener("click", onDocumentClick);

let selectedSet = new Set();
let autoCompleteTimer = null;

async function initIngredientList() {
    await loadLanguageFile();
    applyI18nTexts();

    initIngredientInput();
    initAutoCompleteClick();
    initCategoryTabs();
    initIngredientIconClick();
    showFirstCategory();
    initSearchRecipeButton();
}

function onDocumentClick(e) {
    const $autoList = document.getElementById("autocompleteList");

    if (!e.target.closest("#ingredientInput") &&
        !e.target.closest("#autocompleteList")) {

        $autoList.classList.add("hidden");
        $autoList.innerHTML = "";
    }
}

function initIngredientInput() {
    const $inputIngredient = document.getElementById("ingredientInput");
    const $addButton = document.getElementById("addIngredientBtn");
    const $autoList = document.getElementById("autocompleteList");

    $inputIngredient.addEventListener("input", () => {
        const keyword = $inputIngredient.value.trim();

        if (!keyword) {
            $autoList.classList.add("hidden");
            $autoList.innerHTML = "";
            autoCompleteTimer = null;
            return;
        }

        if (autoCompleteTimer != null) {
            clearTimeout(autoCompleteTimer);
        }

        autoCompleteTimer = setTimeout(() => {
            getAutoComplete(keyword);
        }, 500);
    });

    $addButton.addEventListener("click", () => {
        const text = $inputIngredient.value.trim();

        if (!text) {
            return;
        }

        if (selectedSet.has(text)) {
            translate("ui.alreadySelectedIngredient");
            return;
        }

        if (selectedSet.size >= 10) {
            translate("ui.fullSelectIngredient");
            return;
        }

        addIngredient(text);
        $inputIngredient.value = "";
    });
}

function initAutoCompleteClick() {
    const $autoList = document.getElementById("autocompleteList");
    const $input = document.getElementById("ingredientInput");

    $autoList.addEventListener("click", (e) => {
        const $item = e.target.closest(".autocomplete-item");

        if (!$item) {
            return;
        }

        $input.value = $item.dataset.name;
        $autoList.classList.add("hidden");
        $autoList.innerHTML = "";
    });
}

async function getAutoComplete(keyword) {
    const $autoList = document.getElementById("autocompleteList");

    try {
        const res = await apiUtil.get(apiUtil.url.REFRI.AUTO_COMPLETE, {
            keyword: keyword
        });

        if (res.code === responseCode.SUCCESS) {
            renderAutoComplete(res.data, keyword);
        } else {
            $autoList.classList.add("hidden");
        }
    } catch (e) {
        console.error(log.FAILED_LOAD_AUTO_COMPLETE, e);
    }
}

function renderAutoComplete(items, keyword) {
    const $autoList = document.getElementById("autocompleteList");
    $autoList.innerHTML = "";

    if (items.length === 0) {
        $autoList.classList.add("hidden");
        return;
    }

    const regex = new RegExp(`(${keyword})`, "gi");

    items.forEach(name => {
        const highlighted = name.replace(regex, "<strong>$1</strong>");
        const $div = document.createElement("div");
        $div.className = "autocomplete-item";
        $div.dataset.name = name;
        $div.innerHTML = highlighted;
        $autoList.appendChild($div);
    });

    $autoList.classList.remove("hidden");
}

function addIngredient(name) {
    selectedSet.add(name);
    renderSelected();

    document.querySelectorAll(`[data-name="${name}"]`)
        .forEach(el => el.classList.add("selected"));
}

function removeIngredient(name) {
    selectedSet.delete(name);
    renderSelected();

    document.querySelectorAll(`[data-name="${name}"]`)
        .forEach(el => el.classList.remove("selected"));
}

function renderSelected() {
    const $selectIngredient = document.getElementById("selectedIngredients");
    $selectIngredient.innerHTML = "";

    selectedSet.forEach(name => {
        const $tag = document.createElement("div");
        $tag.className = "selected-tag";
        $tag.innerHTML = `
            <span>${name}</span>
            <button type="button" data-name="${name}">✕</button>
        `;
        $selectIngredient.appendChild($tag);
    });

    document.getElementById("selectedCount").innerText = selectedSet.size;

    $selectIngredient.onclick = (e) => {
        const $button = e.target.closest("button[data-name]");

        if (!$button) {
            return;
        }

        removeIngredient($button.dataset.name);
    };
}

function initCategoryTabs() {
    const $tabs = document.querySelectorAll(".category-tab");

    $tabs.forEach($tab => {
        $tab.addEventListener("click", () => {
            $tabs.forEach(t => t.classList.remove("active"));
            $tab.classList.add("active");
            showCategoryGroup($tab.dataset.category);
        });
    });
}

function showFirstCategory() {
    const $firstCategoryTab = document.querySelector(".category-tab");

    $firstCategoryTab.classList.add("active");
    showCategoryGroup($firstCategoryTab.dataset.category);
}

function showCategoryGroup(category) {
    document.querySelectorAll(".ingredient-group").forEach(group => {
        group.classList.remove("active");

        if (group.dataset.group === category) {
            group.classList.add("active");
        }
    });
}

function initIngredientIconClick() {
    const $area = document.getElementById("ingredientIconArea");

    $area.addEventListener("click", (e) => {
        const name = e.target.closest(".ingredient-icon-item").dataset.name;

        if (selectedSet.has(name)) {
            removeIngredient(name);
        } else {
            if (selectedSet.size >= 10) {
                translate("ui.fullSelectIngredient");
                return;
            }
            addIngredient(name);
        }
    });
}

function initSearchRecipeButton() {
    const $findBtn = document.getElementById("findRecipeBtn");

    $findBtn.addEventListener("click", () => {
        // TODO: 다음 단계 선택된 재료 기반 레시피 검색 개발 예정

        console.log("선택된 재료 목록:", Array.from(selectedSet));
    });
}