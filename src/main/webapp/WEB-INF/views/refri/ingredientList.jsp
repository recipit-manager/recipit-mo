<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<% request.setAttribute("pageTitleKey", "ui.putIngredient"); %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>냉템요리 재료</title>

    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/pageHeader.css">
    <link rel="stylesheet" href="/css/ingredientList.css">

</head>
<body data-page="notice" data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">
<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />
<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>

<main class="refri-ingredient-container">

    <section class="manual-input-section">
        <div class="input-title">
            <img src="/images/inputIngredient.png" class="input-icon"/>
            <span data-i18n="ui.selfInput"></span>
        </div>

        <div class="manual-input-wrap">
            <input id="ingredientInput"
                   type="text"
                   data-i18n-placeholder="ui.inputIngredient"
                   autocomplete="off" />

            <button id="addIngredientBtn" type="button" data-i18n="ui.add"></button>
        </div>

        <div id="autocompleteList" class="autocomplete-list hidden"></div>
    </section>


    <section class="selected-ingredients-section">
        <div class="selected-title">
            <img src="/images/selectIngredient.png" class="selected-icon" />
            <span data-i18n="ui.selectedIngredient"></span>
            (<span id="selectedCount">0</span>/ 10 )
        </div>

        <div id="selectedIngredients" class="selected-ingredients-wrap"></div>
    </section>

    <section class="ingredient-category-section">
        <div class="ingredient-category-scroll">
            <c:forEach var="category" items="${ingredientCategoryList.categoryList}">
                <button class="category-tab" data-category="${category}">
                        ${category}
                </button>
            </c:forEach>
        </div>

        <div id="ingredientIconArea" class="ingredient-icon-area">
            <c:forEach var="group" items="${ingredientCategoryList.ingredientGroupList}">
                <div class="ingredient-group" data-group="${group.categoryName}">
                    <c:forEach var="item" items="${group.ingredientList}">
                        <div class="ingredient-icon-item"
                             data-name="${item.name}"
                             data-group="${group.categoryName}">
                            <img src="${item.iconUrl}">
                            <span>${item.name}</span>
                        </div>
                    </c:forEach>
                </div>
            </c:forEach>
        </div>
    </section>

    <div class="bottom-fixed-button">
        <button id="findRecipeBtn" data-i18n="ui.recipe_search_placeholder"></button>
    </div>

</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/refri/ingredientList.js"></script>
</body>
</html>