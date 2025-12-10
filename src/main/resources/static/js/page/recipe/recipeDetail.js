import { applyI18nTexts, loadLanguageFile, translate } from "/js/i18n/i18n.js";
import { recipeUtil } from "/js/common/recipeUtil.js";
import { uiUtil } from "/js/common/uiUtil.js";

let currentStepIndex = 0;
let recipeInfo = null;

document.addEventListener("DOMContentLoaded", initRecipeDetail);

async function initRecipeDetail() {
    await loadLanguageFile();
    applyI18nTexts();

    recipeInfo = loadRecipeData();
    recipeUtil.initLikeButton();
    recipeUtil.initBookmarkButton();

    const ingredientGroups = groupIngredients(recipeInfo.ingredientList);
    renderIngredients(ingredientGroups);

    renderSteps(recipeInfo.stepList);
    renderCompletionImages(recipeInfo.completionImageUrlList);

    initReportButton();
}

function loadRecipeData() {
    const $jsonScript = document.getElementById("recipeData");

    if (!$jsonScript) {
        return null;
    }

    try {
        return JSON.parse($jsonScript.textContent);
    } catch (error) {
        console.error("Failed to parse recipe JSON:", error);
        return null;
    }
}

function groupIngredients(ingredientList) {
    const ingredientGroupMap = new Map();
    const groupOrder = [];

    ingredientList.forEach(ingredientItem => {
        if (!ingredientGroupMap.has(ingredientItem.categoryCode)) {
            ingredientGroupMap.set(ingredientItem.categoryCode, {
                categoryCode: ingredientItem.categoryCode,
                categoryName: ingredientItem.categoryName,
                items: []
            });
            groupOrder.push(ingredientItem.categoryCode);
        }
        ingredientGroupMap.get(ingredientItem.categoryCode).items.push(ingredientItem);
    });

    return groupOrder.map(categoryCode => ingredientGroupMap.get(categoryCode));
}

function renderIngredients(ingredientGroups) {
    const $ingredientSection = document.getElementById("ingredientSection");

    if (!$ingredientSection) {
        return;
    }

    let html = `
        <h2 class="ingredient-title" data-i18n="ui.recipeDetail_ingredients"></h2>
        <table class="ingredient-table">
    `;

    ingredientGroups.forEach(group => {
        html += `
            <tr class="category-row">
                <td colspan="2" class="category-title">${group.categoryName}</td>
            </tr>
        `;

        group.items.forEach(item => {
            html += `
                <tr class="ingredient-row">
                    <td class="ingredient-name">${item.name}</td>
                    <td class="ingredient-qty">${item.quantity} ${item.unit}</td>
                </tr>
            `;

            if (item.tip) {
                html += `
                    <tr class="ingredient-tip-row">
                        <td colspan="2" class="ingredient-tip">${item.tip}</td>
                    </tr>
                `;
            }
        });
    });

    html += `</table>`;
    $ingredientSection.innerHTML = html;

    applyI18nTexts();
}

function createSliderHtml(imageUrlList, option) {
    if (!imageUrlList || imageUrlList.length === 0) {
        return "";
    }

    const sliderClassName = option.slider;
    const trackClassName = option.track;
    const dotClassName = option.dot;

    let html = `
        <div class="${sliderClassName}">
            <div class="${trackClassName}">
    `;

    imageUrlList.forEach(imageUrl => {
        html += `
            <div class="image-item">
                <img src="${imageUrl}">
            </div>
        `;
    });

    html += `</div>`;

    if (imageUrlList.length > 1) {
        html += `<div class="image-dots">`;
        imageUrlList.forEach((_, index) => {
            html += `<span class="${dotClassName} ${index === 0 ? "active" : ""}" data-index="${index}"></span>`;
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function initSlider(sliderSelector, trackSelector, dotSelector) {
    const $sliderContainer = document.querySelector(sliderSelector);

    if (!$sliderContainer) {
        return;
    }

    const $trackElement = $sliderContainer.querySelector(trackSelector);
    const $dotElements = $sliderContainer.querySelectorAll(dotSelector);

    if (!$trackElement || $dotElements.length <= 1) {
        return;
    }

    let currentIndex = 0;
    let startX = 0;
    let moveX = 0;
    let isDragging = false;

    const updateSliderPosition = () => {
        $trackElement.style.transition = "transform 0.25s ease";
        $trackElement.style.transform = `translateX(-${currentIndex * 100}%)`;

        $dotElements.forEach(dotElement => dotElement.classList.remove("active"));
        $dotElements[currentIndex].classList.add("active");
    };

    $trackElement.addEventListener("touchstart", event => {
        isDragging = true;
        $trackElement.style.transition = "none";
        startX = event.touches[0].clientX;
    });

    $trackElement.addEventListener("touchmove", event => {
        if (!isDragging) {
            return;
        }

        moveX = event.touches[0].clientX - startX;
        const movePercent = moveX / $sliderContainer.clientWidth * 100;

        $trackElement.style.transform = `translateX(calc(-${currentIndex * 100}% + ${movePercent}%))`;
    });

    $trackElement.addEventListener("touchend", () => {
        isDragging = false;

        if (moveX < -50 && currentIndex < $dotElements.length - 1) {
            currentIndex++;
        } else if (moveX > 50 && currentIndex > 0) {
            currentIndex--;
        }

        updateSliderPosition();
        moveX = 0;
    });

    updateSliderPosition();
}

function renderCompletionImages(completionImageList) {
    const $completionContent = document.getElementById("completionContent");

    if (!$completionContent || !completionImageList || completionImageList.length === 0) {
        return;
    }

    $completionContent.innerHTML = createSliderHtml(completionImageList, {
        slider: "complete-slider",
        track: "complete-track",
        dot: "complete-dot"
    });

    initSlider(".complete-slider", ".complete-track", ".complete-dot");
}

function renderSteps(stepList) {
    currentStepIndex = 0;
    renderSingleStep(0, stepList);
}

function renderSingleStep(stepIndex, stepList) {
    currentStepIndex = stepIndex;

    const stepData = stepList[stepIndex];
    const $stepContentContainer = document.getElementById("stepContent");

    const stepImageList = stepData.imageUrlList || [];

    const sliderHtml = createSliderHtml(stepImageList, {
        slider: "step-image-slider",
        track: "step-image-track",
        dot: "step-dot"
    });

    const stepTitle = translate("ui.recipeDetail_step_name", { num: stepIndex + 1 });

    $stepContentContainer.innerHTML = `
        <div class="step-header">
            <img id="stepPrevBtn" class="step-nav-btn" src="/images/previous.png">
            <h3 class="step-name">${stepTitle}</h3>
            <img id="stepNextBtn" class="step-nav-btn" src="/images/next.png">
        </div>
        ${sliderHtml}
        <p class="step-description">${stepData.content}</p>
    `;

    updateStepButtons(stepIndex, stepList.length);

    const $prevButton = document.getElementById("stepPrevBtn");
    const $nextButton = document.getElementById("stepNextBtn");

    $prevButton.onclick = () => {
        if (currentStepIndex > 0) {
            renderSingleStep(currentStepIndex - 1, stepList);
        }
    };

    $nextButton.onclick = () => {
        if (currentStepIndex < stepList.length - 1) {
            renderSingleStep(currentStepIndex + 1, stepList);
        }
    };

    if (stepImageList.length > 1) {
        initSlider(".step-image-slider", ".step-image-track", ".step-dot");
    }
}

function updateStepButtons(currentIndex, totalCount) {
    const $prevButton = document.getElementById("stepPrevBtn");
    const $nextButton = document.getElementById("stepNextBtn");

    $prevButton.style.visibility = currentIndex === 0 ? "hidden" : "visible";
    $nextButton.style.visibility = currentIndex === totalCount - 1 ? "hidden" : "visible";
}

function initReportButton() {
    const $reportButton = document.getElementById("reportBtn");

    if (!$reportButton) {
        return;
    }

    const isLogin = document.body.dataset.isLogin === "true";

    $reportButton.addEventListener("click", () => {
        if (!isLogin) {
            window.location.href = "/user/login";
            return;
        }

        if (recipeInfo.reportYn === "Y") {
            uiUtil.showModal(translate("ui.recipeDetail_report_already"), {
                confirmText: translate("common.confirm")
            });
            return;
        }

        uiUtil.showModal(translate("ui.recipeDetail_report_dev"), {
            confirmText: translate("common.confirm")
        });
    });
}
