<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<% request.setAttribute("pageTitleKey", "ui.upload"); %>

<c:if test="${isLogin eq false}">
    <c:redirect url="/home"/>
</c:if>

<c:if test="${isAccountLocked eq true}">
    <c:redirect url="/user/temporary/password/change"/>
</c:if>

<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Recipit Home</title>
    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/pageHeader.css">
    <link rel="stylesheet" href="/css/upload.css">
</head>

<body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
    <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />
<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>

<main class="upload-container">

    <section class="recipe-basic-section">
        <div class="recipe-basic-layout">
            <div class="recipe-basic-layout">
                <div class="recipe-top-row">
                    <div class="recipe-image-block compact">
                        <div class="recipe-image-upload-area compact" id="recipeMainImageArea">
                            <input type="file" id="recipeMainImageInput"
                                   accept=".jpg,.jpeg,.png"
                                   class="recipe-image-file-input"/>

                            <div class="recipe-image-placeholder">
                                <div class="recipe-image-plus-circle">+</div>
                            </div>

                            <img id="recipeMainImagePreview"
                                 class="recipe-image-preview"
                                 alt="recipe main preview"/>
                            <span class="field-required-mark">*</span>

                            <div class="recipe-image-info-btn" id="recipeImageInfoBtn">
                                <img src="/images/information.png">
                            </div>

                            <div class="recipe-image-tooltip" id="recipeImageTooltip">
                                <button type="button" class="tooltip-close-btn" id="recipeImageTooltipClose">X</button>

                                <p class="tooltip-text" data-i18n="ui.upload_image_tooltip"></p>

                                <div class="tooltip-arrow"></div>
                            </div>
                        </div>

                        <div class="field-label-wrapper">
                            <span class="field-label" data-i18n="ui.upload_thumbnail"></span>
                            <span class="field-label-required">*</span>
                        </div>
                    </div>

                    <div class="recipe-text-title-block">

                        <div class="form-field">
                            <div class="field-label-wrapper">
                                <label for="recipeTitleInput" class="field-label" data-i18n="ui.recipe_title"></label>
                                <span class="field-label-required">*</span>
                            </div>

                            <div class="field-input-wrapper field-input-wrapper-bordered">
                                <input type="text"
                                       id="recipeTitleInput"
                                       maxlength="40"
                                       class="text-input"
                                       data-i18n-placeholder="ui.upload_title_placeholder">
                                <span class="field-required-mark">*</span>
                                <span class="field-counter" id="recipeTitleCounter">0/40</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="form-field">
                    <div class="field-label-wrapper">
                        <label for="recipeDescriptionInput"
                               class="field-label"
                               data-i18n="ui.upload_description_label">
                        </label>
                        <span class="field-label-required">*</span>
                    </div>

                    <div class="field-input-wrapper field-input-wrapper-bordered field-input-wrapper-textarea">
                        <textarea id="recipeDescriptionInput"
                                  name="recipeDescription"
                                  maxlength="200"
                                  class="textarea-input"
                                  data-i18n-placeholder="ui.upload_description"></textarea>
                        <span class="field-required-mark">*</span>
                        <span class="field-counter" id="recipeDescriptionCounter">0/200</span>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <section class="recipe-meta-section">
        <div class="form-field">
            <div class="field-label-wrapper">
                <label class="field-label" data-i18n="ui.upload_category"></label>
                <span class="field-label-required">*</span>
            </div>

            <div class="select-wrapper field-input-wrapper-bordered">
                <select id="recipeCategorySelect" class="select-input">
                    <option value="" data-i18n="ui.upload_type"></option>
                    <c:forEach var="cat" items="${recipeCategoryList}">
                        <option value="${cat.categoryCode}">
                                ${cat.categoryName}
                        </option>
                    </c:forEach>
                </select>
            </div>
        </div>


        <div class="recipe-meta-row">
            <div class="form-field meta-number-field">
                <div class="field-label-wrapper">
                    <label class="field-label" data-i18n="ui.upload_cooking_time"></label>
                    <span class="field-label-required">*</span>
                </div>

                <div class="field-input-wrapper field-input-wrapper-bordered">
                    <input type="text"
                           id="recipeCookingTimeInput"
                           maxlength="3"
                           class="text-input number-only"
                           data-i18n-placeholder="ui.upload_cooking_time">
                    <span class="meta-unit-text" data-i18n="ui.time_unit"></span>
                </div>
            </div>

            <div class="form-field meta-number-field">
                <div class="field-label-wrapper">
                    <label class="field-label" data-i18n="ui.servingUnit"></label>
                    <span class="field-label-required">*</span>
                </div>

                <div class="field-input-wrapper field-input-wrapper-bordered">
                    <input type="text"
                           id="recipeServingInput"
                           maxlength="3"
                           class="text-input number-only"
                           placeholder="인원">
                    <span class="meta-unit-text" data-i18n="ui.servingUnit"></span>
                </div>
            </div>

        </div>


        <div class="form-field">
            <div class="field-label-wrapper">
                <label class="field-label" data-i18n="ui.filter_difficulty"></label>
            </div>

            <div class="difficulty-radio-group">
                <c:forEach var="diff" items="${difficultyList}">
                    <label class="difficulty-item">
                        <input type="radio"
                               name="recipeDifficulty"
                               value="${diff.difficultyCode}"
                               <c:if test="${diff.difficultyName eq '보통'}">checked</c:if> />
                        <span>${diff.difficultyName}</span>
                    </label>
                </c:forEach>
            </div>
        </div>
    </section>

    <section class="ingredient-section">
        <div class="ingredient-title-row">
            <span class="field-label" data-i18n="ui.upload_ingredient_info"></span>

            <div class="ingredient-info-btn" id="ingredientInfoBtn">
                <img src="/images/information.png">
            </div>

            <div class="ingredient-tooltip" id="ingredientTooltip">
                <button type="button" class="tooltip-close-btn" id="ingredientTooltipClose">X</button>
                <p class="tooltip-text" data-i18n="ui.upload_ingredient_tooltip"></p>
                <div class="tooltip-arrow"></div>
            </div>
        </div>

        <div id="ingredientList"></div>

        <div class="ingredient-add-wrapper">
            <button type="button" class="ingredient-add-btn" id="ingredientAddBtn">
                <img src="/images/add.png">
            </button>
            <span class="ingredient-count" id="ingredientCount">(1/50)</span>
        </div>

    </section>

    <template id="ingredientItemTemplate">
        <div class="ingredient-item">
            <button type="button" class="ingredient-remove-btn">
                <img src="/images/minus.png">
            </button>

            <div class="form-field">
                <div class="field-label-wrapper">
                    <label class="field-label" data-i18n="ui.upload_ingredient_type"></label>
                    <span class="field-label-required">*</span>
                </div>

                <div class="select-wrapper field-input-wrapper-bordered">
                    <select class="select-input ingredient-type-select">
                        <option value="" data-i18n="ui.upload_select"></option>
                        <c:forEach var="type" items="${ingredientTypeList}">
                            <option value="${type.categoryCode}">
                                    ${type.categoryName}
                            </option>
                        </c:forEach>
                    </select>
                </div>
            </div>

            <div class="ingredient-row">
                <div class="form-field ingredient-name-field">
                    <div class="field-label-wrapper">
                        <label class="field-label" data-i18n="ui.upload_ingredient_name"></label>
                        <span class="field-label-required">*</span>
                    </div>
                    <div class="field-input-wrapper field-input-wrapper-bordered">
                        <input type="text" maxlength="10" class="text-input ingredient-name-input"
                               data-i18n-placeholder="ui.upload_ingredient_name_placeholder">
                    </div>
                </div>

                <div class="form-field ingredient-amount-field">
                    <div class="field-label-wrapper">
                        <label class="field-label" data-i18n="ui.upload_quantity"></label>
                        <span class="field-label-required">*</span>
                    </div>
                    <div class="field-input-wrapper field-input-wrapper-bordered">
                        <input type="text" maxlength="5" class="text-input number-only ingredient-amount-input"
                               placeholder="10">
                    </div>
                </div>

                <div class="form-field ingredient-unit-field">
                    <div class="field-label-wrapper">
                        <label class="field-label" data-i18n="ui.upload_unit"></label>
                        <span class="field-label-required">*</span>
                    </div>
                    <div class="field-input-wrapper field-input-wrapper-bordered">
                        <input type="text" maxlength="5" class="text-input ingredient-unit-input"
                               placeholder="g, ml">
                    </div>
                </div>

            </div>

            <div class="form-field ingredient-tip-field">
                <div class="field-label-wrapper">
                    <label class="field-label" data-i18n="ui.upload_tip"></label>
                </div>
                <div class="field-input-wrapper field-input-wrapper-bordered">
                    <input type="text" maxlength="50"
                           class="text-input ingredient-tip-input"
                           data-i18n-placeholder="ui.upload_tip_placeholder">
                </div>
            </div>
        </div>
    </template>

    <section class="step-section">

        <div class="step-title-row">
            <span class="field-label" data-i18n="ui.upload_step"></span>

            <div class="step-info-btn" id="stepInfoBtn">
                <img src="/images/information.png">
            </div>

            <div class="step-tooltip" id="stepTooltip">
                <button type="button" class="tooltip-close-btn" id="stepTooltipClose">X</button>

                <p class="tooltip-text" data-i18n="ui.upload_step_tooltip"></p>

                <div class="tooltip-arrow"></div>
            </div>
        </div>

        <div id="stepList"></div>

        <div class="step-add-wrapper">
            <button type="button" class="step-add-btn" id="stepAddBtn">
                <img src="/images/add.png">
            </button>
            <span class="step-count" id="stepCount">(0/20)</span>
        </div>

    </section>

    <div class="step-modal-overlay" id="stepModalOverlay"></div>

    <div class="step-modal" id="stepModal">

        <div class="step-modal-header">
            <span class="step-modal-title" data-i18n="ui.upload_input"></span>
        </div>

        <div class="form-field">
            <div class="field-label-wrapper">
                <label class="field-label" data-i18n="ui.upload_content"></label>
                <span class="field-label-required">*</span>
            </div>

            <div class="field-input-wrapper field-input-wrapper-bordered field-input-wrapper-textarea">
            <textarea id="stepTextInput"
                      maxlength="500"
                      class="textarea-input"
                      data-i18n-placeholder="ui.upload_step_placeholder"></textarea>
                <span class="field-required-mark" id="stepRequiredMark" style="display:none;">*</span>
                <span class="field-counter" id="stepTextCounter">0/500</span>
            </div>
            <p class="step-text-error" id="stepTextError" data-i18n="ui.upload_input_content"></p>
        </div>

        <div class="step-image-upload-box">
            <button type="button" id="stepImageUploadBtn" class="step-image-upload-btn" data-i18n="ui.upload_image"></button>
            <span class="step-image-count" id="stepImageCount">(0/5)</span>
        </div>

        <input type="file" id="stepImageInput" accept=".jpg,.jpeg,.png" multiple hidden />

        <div class="step-image-list" id="stepImageList"></div>

        <div class="step-modal-footer">
            <button class="step-cancel-btn" id="stepCancelBtn" data-i18n="ui.upload_cancel"></button>
            <button class="step-submit-btn" id="stepSubmitBtn" data-i18n="ui.upload_submit"></button>
        </div>
    </div>

    <section class="complete-section">

        <div class="complete-title-row">
            <span class="field-label" data-i18n="ui.upload_complete_image"></span>

            <div class="complete-info-btn" id="completeInfoBtn">
                <img src="/images/information.png">
            </div>

            <div class="complete-tooltip" id="completeTooltip">
                <button type="button" class="tooltip-close-btn" id="completeTooltipClose">X</button>
                <p class="tooltip-text" data-i18n="ui.upload_complete_image_tooltip"></p>
                <div class="tooltip-arrow"></div>
            </div>
        </div>

        <div id="completeImageList" class="complete-image-list"></div>

        <div class="complete-add-wrapper">
            <button type="button" id="completeImageAddBtn" class="complete-add-btn">
                <img src="/images/add.png">
            </button>
            <span class="complete-count" id="completeImageCount">(0/3)</span>
        </div>

        <input type="file" id="completeImageInput" accept=".jpg,.jpeg,.png" hidden />
    </section>

    <div class="complete-bottom-btn-row">
        <button class="complete-bottom-btn" id="completeCancelBtn" data-i18n="ui.upload_cancel"></button>
        <button class="complete-bottom-btn" id="completeTempSaveBtn" data-i18n="ui.upload_draft"></button>
        <button class="complete-bottom-btn complete-submit-btn" id="completeSubmitBtn" data-i18n="ui.upload_recipe_submit"></button>
    </div>

</main>


<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/recipe/upload.js"></script>
</body>
</html>
