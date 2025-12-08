import {applyI18nTexts, loadLanguageFile, translate} from "/js/i18n/i18n.js";
import {uiUtil} from "/js/common/uiUtil.js";
import {log, responseCode} from "/js/common/constants.js";
import {apiUtil} from "/js/common/apiUtil.js";

document.addEventListener("DOMContentLoaded", initUpload);

async function initUpload() {
    await loadLanguageFile();
    applyI18nTexts();

    initRecipeMainImageUpload();
    initRecipeTextCounters();
    initNumberOnly();
    initIngredientSection();
    initStepSection();
    initStepModal();
    initCompleteSection();
}

function initTooltip(btnId, tooltipId, closeId) {
    const $btn = document.getElementById(btnId);
    const $tooltip = document.getElementById(tooltipId);
    const $close = document.getElementById(closeId);

    $btn?.addEventListener("click", e => {
        e.stopPropagation();
        $tooltip.classList.add("show");
    });

    $close?.addEventListener("click", e => {
        e.stopPropagation();
        $tooltip.classList.remove("show");
    });

    $tooltip?.addEventListener("click", e => e.stopPropagation());
}

function initRecipeMainImageUpload() {
    const $imageArea = document.getElementById("recipeMainImageArea");
    const $fileInput = document.getElementById("recipeMainImageInput");
    const $previewImage = document.getElementById("recipeMainImagePreview");

    $imageArea.addEventListener("click", () => {
        $fileInput.click();
    });

    $fileInput.addEventListener("change", async (event) => {
        const fileList = event.target.files;

        if (!fileList || fileList.length === 0) {
            return;
        }

        const file = fileList[0];

        const isValid = await validateRecipeImageFile(file);

        if (!isValid) {
            resetRecipeImagePreview($fileInput, $imageArea, $previewImage);
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = (loadEvent) => {
            $previewImage.src = loadEvent.target.result;
            $imageArea.classList.add("has-image");
        };

        fileReader.readAsDataURL(file);
    });

    initTooltip("recipeImageInfoBtn", "recipeImageTooltip", "recipeImageTooltipClose");
}

/**
 * 이미지 파일 검증:
 *  - 확장자: jpg, jpeg, png
 *  - 용량: 5MB 이하
 *  - 사이즈: 최소 800x800
 *  - 비율: 1:1 ~ 1:1.25
 */
async function validateRecipeImageFile(file) {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
        alert(translate("ui.upload_valid_image_type"));
        return false;
    }

    const maxSizeBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeBytes) {
        alert(translate("ui.upload_valid_image_size"));
        return false;
    }

    const imageSize = await readImageSize(file);
    const width = imageSize.width;
    const height = imageSize.height;

    if (width < 800 || height < 800) {
        alert(translate("ui.upload_valid_image_px"));
        return false;
    }

    const ratio = width / height;

    if (ratio < 1 || ratio > 1.25) {
        alert(translate("ui.upload_valid_image_ratio"));
        return false;
    }

    return true;
}

function readImageSize(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = (loadEvent) => {
            const image = new Image();

            image.onload = () => {
                resolve({
                    width: image.width,
                    height: image.height
                });
            };

            image.onerror = () => {
                reject(new Error("Failed image load"));
            };

            image.src = loadEvent.target.result;
        };

        fileReader.onerror = () => {
            reject(new Error("Failed file read"));
        };

        fileReader.readAsDataURL(file);
    });
}

function resetRecipeImagePreview($fileInput, $imageArea, $previewImage) {
    $fileInput.value = "";
    $previewImage.src = "";
    $imageArea.classList.remove("has-image");
}

function initRecipeTextCounters() {
    const $titleInput = document.getElementById("recipeTitleInput");
    const $descriptionInput = document.getElementById("recipeDescriptionInput");
    const $titleCounter = document.getElementById("recipeTitleCounter");
    const $descriptionCounter = document.getElementById("recipeDescriptionCounter");

    if ($titleInput && $titleCounter) {
        updateTextCounter($titleInput, $titleCounter, 40);

        $titleInput.addEventListener("input", () => {
            updateTextCounter($titleInput, $titleCounter, 40);
        });
    }

    if ($descriptionInput && $descriptionCounter) {
        updateTextCounter($descriptionInput, $descriptionCounter, 200);

        $descriptionInput.addEventListener("input", () => {
            updateTextCounter($descriptionInput, $descriptionCounter, 200);
        });
    }
}

function updateTextCounter($inputElement, $counterElement, maxLength) {
    const currentLength = $inputElement.value.length;
    const safeLength = currentLength > maxLength ? maxLength : currentLength;
    $counterElement.textContent = safeLength + "/" + maxLength;
}

function initNumberOnly() {
    document.querySelectorAll(".number-only").forEach($el => {
        $el.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
        });
    });
}

function initIngredientSection() {
    const $list = document.getElementById("ingredientList");
    const $addBtn = document.getElementById("ingredientAddBtn");
    const $count = document.getElementById("ingredientCount");
    const template = document.getElementById("ingredientItemTemplate");

    let ingredientCount = 0;

    function updateCount() {
        $count.textContent = `(${ingredientCount}/50)`;

        if (ingredientCount >= 50) {
            $addBtn.style.display = "none";
            $count.style.display = "none";
        } else {
            $addBtn.style.display = "inline-flex";
            $count.style.display = "inline-flex";
        }

        const $removeButtons = $list.querySelectorAll(".ingredient-remove-btn");
        $removeButtons.forEach(($btn) => {
            if (ingredientCount <= 1) {
                $btn.style.display = "none";
            } else {
                $btn.style.display = "flex";
            }
        });
    }

    function addIngredientItem() {
        if (ingredientCount >= 50) {
            return;
        }

        const node = template.content.cloneNode(true);
        const $item = node.querySelector(".ingredient-item");
        const $removeBtn = node.querySelector(".ingredient-remove-btn");

        $removeBtn.addEventListener("click", () => {
            if (ingredientCount === 1) {
                return;
            }

            $item.remove();
            ingredientCount--;
            updateCount();
        });

        node.querySelectorAll(".number-only").forEach($el => {
            $el.addEventListener("input", e => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
            });
        });

        $list.appendChild(node);
        ingredientCount++;
        updateCount();
        applyI18nTexts();
    }

    addIngredientItem();

    $addBtn.addEventListener("click", addIngredientItem);

    initTooltip("ingredientInfoBtn", "ingredientTooltip", "ingredientTooltipClose");
}

function initStepSection() {
    const $addBtn = document.getElementById("stepAddBtn");

    updateStepCountAndButton();

    $addBtn.addEventListener("click", () => {
        if (stepDataList.length >= 20) {
            return;
        }

        stepEditMode = null;
        openStepModal(false);
    });

    initTooltip("stepInfoBtn", "stepTooltip", "stepTooltipClose");
}

let stepDataList = [];
let stepEditMode = null;
let stepImages = [];

function updateStepCountAndButton() {
    const $addBtn = document.getElementById("stepAddBtn");
    const $count = document.getElementById("stepCount");

    const count = stepDataList.length;

    $count.textContent = `(${count}/20)`;

    if (count >= 20) {
        $addBtn.style.display = "none";
        $count.style.display = "none";
    } else {
        $addBtn.style.display = "inline-flex";
        $count.style.display = "inline-flex";
    }
}

function initStepModal() {
    const $stepInput = document.getElementById("stepTextInput");
    const $textCounter = document.getElementById("stepTextCounter");

    $stepInput.addEventListener("input", () => {
        const len = $stepInput.value.length;
        $textCounter.textContent = `${len}/500`;

        if (len > 0) {
            hideStepError();
        }
    });

    document.getElementById("stepImageUploadBtn").addEventListener("click", () => {
        if (stepImages.length >= 5) {
            return;
        }
        document.getElementById("stepImageInput").click();
    });

    document.getElementById("stepImageInput").addEventListener("change", async (e) => {
        const files = Array.from(e.target.files);

        for (const file of files) {
            if (stepImages.length >= 5) {
                break;
            }

            const valid = await validateRecipeImageFile(file);

            if (!valid) {
                continue;
            }

            const previewUrl = URL.createObjectURL(file);

            stepImages.push({
                name: file.name,
                file,
                previewUrl
            });

            renderStepImages();
        }

        e.target.value = "";
    });

    document.getElementById("stepSubmitBtn").addEventListener("click", submitStepModal);
    document.getElementById("stepCancelBtn").addEventListener("click", closeStepModal);
    document.getElementById("stepModalOverlay").addEventListener("click", closeStepModal);
}

function openStepModal(isEdit = false) {
    document.getElementById("stepModalOverlay").style.display = "block";
    document.getElementById("stepModal").style.display = "flex";

    if (!isEdit) {
        resetStepModal();
    }
}

function closeStepModal() {
    document.getElementById("stepModalOverlay").style.display = "none";
    document.getElementById("stepModal").style.display = "none";
    stepEditMode = null;
}

function resetStepModal() {
    stepEditMode = null;
    stepImages = [];
    document.getElementById("stepTextInput").value = "";
    document.getElementById("stepTextCounter").textContent = "0/500";
    hideStepError();
    renderStepImages();
}

function renderStepImages() {
    const $list = document.getElementById("stepImageList");
    const $count = document.getElementById("stepImageCount");

    $list.innerHTML = "";

    stepImages.forEach((img, index) => {
        const div = document.createElement("div");
        div.className = "step-image-item";

        div.innerHTML = `
            <span>${img.name}</span>
            <button type="button" class="step-image-remove-btn" data-index="${index}">
                <img src="/images/minus.png">
            </button>
        `;

        $list.appendChild(div);
    });

    $count.textContent = `(${stepImages.length}/5)`;

    document.querySelectorAll(".step-image-remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = e.target.closest("button").dataset.index;
            stepImages.splice(idx, 1);
            renderStepImages();
        });
    });
}

function showStepError() {
    document.getElementById("stepTextError").style.display = "block";
    document.getElementById("stepRequiredMark").style.display = "block";
}

function hideStepError() {
    document.getElementById("stepTextError").style.display = "none";
    document.getElementById("stepRequiredMark").style.display = "none";
}

function submitStepModal() {
    const text = document.getElementById("stepTextInput").value.trim();

    if (text.length === 0) {
        showStepError();
        return;
    }

    const images = stepImages.map(img => ({
        file: img.file,
        name: img.name,
        previewUrl: img.previewUrl
    }));

    if (stepEditMode !== null) {
        stepDataList[stepEditMode].text = text;
        stepDataList[stepEditMode].images = images;

        updateStepCard(stepEditMode);
    }
    else {
        stepDataList.push({
            id: Date.now(),
            text,
            images
        });

        createStepCard(stepDataList.length - 1);
    }

    updateStepNumbers();
    closeStepModal();
}

function createStepCard(index) {
    const step = stepDataList[index];
    const $list = document.getElementById("stepList");

    const wrapper = document.createElement("div");
    wrapper.className = "step-card";
    wrapper.dataset.index = index;

    wrapper.innerHTML = `
        <div class="step-card-header">

            <div class="step-drag-handle">⋮⋮</div>

            <span class="step-card-title">Step ${index + 1}</span>

            <button class="step-toggle-btn">▼</button>

            <button class="step-delete-btn">
                <img src="/images/minus.png">
            </button>
        </div>

        <div class="step-card-body" style="display:none;">
            <div class="step-card-images">
                ${step.images.map(img => `
                    <img src="${img.previewUrl}" class="step-preview-img">
                `).join("")}
            </div>

            <p class="step-card-text">${step.text}</p>

            <button class="step-edit-btn" data-i18="ui.upload_edit">편집</button>
        </div>
    `;

    $list.appendChild(wrapper);

    attachStepCardEvents(wrapper);
    updateStepNumbers();
    applyI18nTexts();
}

function attachStepCardEvents(card) {
    card.querySelector(".step-toggle-btn").addEventListener("click", () => {
        const body = card.querySelector(".step-card-body");
        const toggle = card.querySelector(".step-toggle-btn");

        if (body.style.display === "none") {
            body.style.display = "block";
            toggle.textContent = "▲";
        } else {
            body.style.display = "none";
            toggle.textContent = "▼";
        }
    });

    card.querySelector(".step-delete-btn").addEventListener("click", () => {
        const index = Number(card.dataset.index);

        stepDataList.splice(index, 1);
        card.remove();

        reorderStepCards();
        updateStepNumbers();
    });

    card.querySelector(".step-edit-btn").addEventListener("click", () => {
        const index = Number(card.dataset.index);
        openStepModalForEdit(index);
    });

    enableDragHandle(card);
}

function openStepModalForEdit(index) {
    const step = stepDataList[index];
    stepEditMode = index;

    document.getElementById("stepTextInput").value = step.text;
    document.getElementById("stepTextCounter").textContent = `${step.text.length}/500`;

    stepImages = step.images.map(x => ({ ...x }));
    renderStepImages();

    openStepModal(true);
}

function updateStepCard(index) {
    const step = stepDataList[index];
    const card = document.querySelector(`.step-card[data-index="${index}"]`);

    card.querySelector(".step-card-text").textContent = step.text;

    const imgBox = card.querySelector(".step-card-images");
    imgBox.innerHTML = step.images.map(img => `
        <img src="${img.previewUrl}" class="step-preview-img">
    `).join("");
}

function updateStepNumbers() {
    document.querySelectorAll(".step-card").forEach((card, idx) => {
        card.dataset.index = idx;
        card.querySelector(".step-card-title").textContent = `Step ${idx + 1}`;
    });

    updateStepCountAndButton();
}

function reorderStepCards() {
    const $list = document.getElementById("stepList");
    $list.innerHTML = "";

    stepDataList.forEach((step, index) => createStepCard(index));
}

function enableDragHandle(card) {
    const handle = card.querySelector(".step-drag-handle");
    const list = document.getElementById("stepList");

    let startY = 0;
    let draggingCard = null;
    let placeholder = null;

    handle.addEventListener("touchstart", (e) => {
        e.preventDefault();

        draggingCard = card;
        draggingCard.classList.add("dragging");

        startY = e.touches[0].clientY;

        placeholder = document.createElement("div");
        placeholder.className = "step-card placeholder";
        placeholder.style.height = draggingCard.offsetHeight + "px";

        draggingCard.parentNode.insertBefore(placeholder, draggingCard.nextSibling);
        draggingCard.style.position = "absolute";
        draggingCard.style.zIndex = "9999";
        draggingCard.style.width = placeholder.offsetWidth + "px";
    });

    handle.addEventListener("touchmove", (e) => {
        if (!draggingCard) {
            return;
        }

        const touchY = e.touches[0].clientY;

        draggingCard.style.top = (touchY - startY) + "px";

        const after = getTouchAfterElement(list, touchY);

        if (after == null) {
            list.appendChild(placeholder);
        } else {
            list.insertBefore(placeholder, after);
        }
    });

    handle.addEventListener("touchend", () => {
        if (!draggingCard) {
            return;
        }

        draggingCard.classList.remove("dragging");
        draggingCard.style.position = "";
        draggingCard.style.top = "";
        draggingCard.style.zIndex = "";
        draggingCard.style.width = "";

        placeholder.parentNode.insertBefore(draggingCard, placeholder);
        placeholder.remove();

        placeholder = null;
        draggingCard = null;

        rebuildStepDataByDOM();
        updateStepNumbers();
    });
}

function getTouchAfterElement(container, y) {
    const cards = [...container.querySelectorAll(".step-card:not(.dragging)")];

    return cards.find(card => {
        const rect = card.getBoundingClientRect();
        return y < rect.top + rect.height / 2;
    });
}

function rebuildStepDataByDOM() {
    const newOrder = [];
    const cardElements = document.querySelectorAll(".step-card");

    cardElements.forEach(card => {
        const oldIndex = Number(card.dataset.index);
        newOrder.push(stepDataList[oldIndex]);
    });

    stepDataList = newOrder;
}

let completeImages = [];

function initCompleteSection() {
    const $addBtn = document.getElementById("completeImageAddBtn");
    const $fileInput = document.getElementById("completeImageInput");

    updateCompleteCount();

    $addBtn.addEventListener("click", () => {
        if (completeImages.length >= 3) {
            return;
        }

        $fileInput.click();
    });

    $fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const valid = await validateRecipeImageFile(file);
        if (!valid) {
            return;
        }

        completeImages.push({
            name: file.name,
            file,
        });

        renderCompleteImages();
        updateCompleteCount();
        e.target.value = "";
    });

    initTooltip("completeInfoBtn", "completeTooltip", "completeTooltipClose");
}

function renderCompleteImages() {
    const $list = document.getElementById("completeImageList");
    $list.innerHTML = "";

    completeImages.forEach((img, idx) => {
        const div = document.createElement("div");
        div.className = "complete-image-item";

        div.innerHTML = `
            <span>${img.name}</span>
            <button class="complete-image-remove-btn" data-index="${idx}">
                <img src="/images/minus.png">
            </button>
        `;

        $list.appendChild(div);
    });

    document.querySelectorAll(".complete-image-remove-btn").forEach($btn => {
        $btn.addEventListener("click", e => {
            const idx = e.target.closest("button").dataset.index;
            completeImages.splice(idx, 1);
            renderCompleteImages();
            updateCompleteCount();
        });
    });
}

function updateCompleteCount() {
    const $count = document.getElementById("completeImageCount");
    const $addBtn = document.getElementById("completeImageAddBtn");

    $count.textContent = `(${completeImages.length}/3)`;

    if (completeImages.length >= 3) {
        $addBtn.style.display = "none";
        $count.style.display = "none";
    } else {
        $addBtn.style.display = "inline-flex";
        $count.style.display = "inline-flex";
    }
}

document.getElementById("completeCancelBtn").addEventListener("click", () => {
    uiUtil.showModal(
        translate("ui.upload_recipe_cancel"),
        {
            title: null,
            confirmText: translate("common.confirm"),
            onClose: () => {
                window.location.href = "/home";
            }
        }
    );
});

document.getElementById("completeTempSaveBtn").addEventListener("click", async () => {
    try {
        const data = await apiUtil.get(apiUtil.url.RECIPE.DRAFT_COUNT);

        if (data.code === responseCode.SUCCESS) {
            if (data.data >= 10) {
                uiUtil.showModal(translate("ui.upload_recipe_draft_limit"), {
                    confirmText: translate("common.confirm")
                });
                return;
            }
        } else {
            console.error(log.DRAFT_COUNT_FAILED, data.message);
        }
    } catch (e) {
        console.error(log.DRAFT_COUNT_FAILED, e);
    }

    await saveRecipeDraft();
});

document.getElementById("completeSubmitBtn").addEventListener("click", async () => {
    if (!validateRequiredBeforeSave()) {
        uiUtil.showModal(translate("ui.upload_input_need"), {confirmText: translate("common.confirm")});
        return;
    }

    await saveRecipeUpload();
});

async function saveRecipeDraft() {

    const formData = buildRecipeFormData();

    await submitRecipe(formData, {
        url: apiUtil.url.RECIPE.DRAFT_SAVE,
        successMessage: translate("ui.upload_draft_success"),
        failMessage: translate("ui.upload_draft_fail"),
        onSuccess: () => {
            // TODO 마이페이지로 이동 예정
            // window.location.href = "/myPage/draft";
        }
    });
}

async function saveRecipeUpload() {

    const formData = buildRecipeFormData();

    await submitRecipe(formData, {
        url: apiUtil.url.RECIPE.UPLOAD,
        successMessage: translate("ui.upload_submit_success"),
        failMessage: translate("ui.upload_submit_fail"),
        onSuccess: () => {
            // TODO 마이페이지로 이동 예정
            // window.location.href = "/myPage/upload";
        }
    });
}

function validateRequiredBeforeSave() {
    const $title = document.getElementById("recipeTitleInput").value.trim();
    const $desc = document.getElementById("recipeDescriptionInput").value.trim();
    const $mainImg = document.getElementById("recipeMainImagePreview").src;
    const steps = stepDataList.length;

    if (!$title) {
        return false;
    }

    if (!$desc) {
        return false;
    }

    if (!$mainImg) {
        return false;
    }

    return steps >= 1;
}

async function submitRecipe(formData, {
    url,
    successMessage,
    onSuccess,
    failMessage = translate("ui.upload_request_fail")
}) {
    try {
        const result = await fetch(apiUtil.BASE_URL + url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Accept-Language": localStorage.getItem("language") || "KO"
            },
            body: formData
        });

        const json = await result.json();

        if (json.code === responseCode.SUCCESS) {
            uiUtil.showModal(successMessage, {
                confirmText: translate("common.confirm"),
                onClose: onSuccess
            });
        } else {
            uiUtil.showModal(failMessage, {
                confirmText: translate("common.confirm")
            });
        }

    } catch (e) {
        console.error(log.DRAFT_COUNT_FAILED, e);

        uiUtil.showModal(
            translate("ui.upload_request_error"),
            { confirmText: translate("common.confirm") }
        );
    }
}

function buildRecipeFormData() {
    const recipeInfo = buildRecipeInfoJSON();
    const formData = new FormData();

    formData.append(
        "recipeInfo",
        new Blob([JSON.stringify(recipeInfo)], { type: "application/json" })
    );

    const $mainFileInput = document.getElementById("recipeMainImageInput");
    if ($mainFileInput.files.length > 0) {
        formData.append("mainImage", $mainFileInput.files[0]);
    }

    stepDataList.forEach((step) => {
        step.images.forEach((imgObj) => {
            formData.append("stepImages", imgObj.file);
        });
    });

    completeImages.forEach((imgObj) => {
        formData.append("completionImages", imgObj.file);
    });

    return formData;
}

function buildRecipeInfoJSON() {

    const recipeInfo = {
        title: document.getElementById("recipeTitleInput").value.trim(),
        description: document.getElementById("recipeDescriptionInput").value.trim(),
        categoryCode: document.getElementById("recipeCategorySelect").value || null,
        cookingTime: Number(document.getElementById("recipeCookingTimeInput").value) || -1,
        servingSize: Number(document.getElementById("recipeServingInput").value) || -1,
        difficultyCode: document.querySelector("input[name='recipeDifficulty']:checked")?.value || null,

        ingredientList: [],
        stepList: []
    };

    document.querySelectorAll("#ingredientList .ingredient-item").forEach(($item) => {

        recipeInfo.ingredientList.push({
            name: $item.querySelector(".ingredient-name-input").value.trim(),
            categoryCode: $item.querySelector(".ingredient-type-select").value,
            quantity: Number($item.querySelector(".ingredient-amount-input").value) || 0,
            unit: $item.querySelector(".ingredient-unit-input").value.trim(),
            tip: $item.querySelector(".ingredient-tip-input").value.trim()
        });
    });

    stepDataList.forEach((step, index) => {
        recipeInfo.stepList.push({
            contents: step.text,
            imageIndexes: step.images.map((_, idx) => idx)
        });
    });

    return recipeInfo;
}