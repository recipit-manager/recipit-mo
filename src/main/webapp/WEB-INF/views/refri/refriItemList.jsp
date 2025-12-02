<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<c:if test="${isAccountLocked eq true}">
    <c:redirect url="/user/temporary/password/change"/>
</c:if>

<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Recipit - Recipe List</title>
    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/refriItemList.css">
</head>

<body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
    <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
</jsp:include>

<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>

<main class="refriItemList-container">

    <section class="fixed-top-area">

        <div class="my-ingredients-title" data-i18n="ui.myIngredient"></div>

        <div class="selected-ingredients">
            <c:forEach var="ingredient" items="${keywordList}">
                <div class="ingredient-tag">
                    <span>${ingredient}</span>
                    <button class="remove-tag-btn" data-name="${ingredient}">✕</button>
                </div>
            </c:forEach>

            <button id="addIngredientBtn" class="ingredient-add-btn" data-i18n="ui.addIngredient"></button>
        </div>

    </section>

    <section class="recipe-scroll-area">

        <c:choose>
            <c:when test="${empty recipeList}">
                <div class="empty-view">
                    <img src="/images/empty-search.png" class="empty-icon" />
                    <p class="empty-title" data-i18n="ui.noRefriItem"></p>
                    <p class="empty-desc"></p>
                </div>
            </c:when>

            <c:otherwise>
                <div id="recipeListArea">

                    <c:forEach var="recipe" items="${recipeList}">
                        <div class="recipe-card" data-id="${recipe.id}" onclick="goToRecipeDetail(${recipe.id})">

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
                                        <img class="icon-unliked ${recipe.isLiked ? 'hidden' : ''}" src="/images/unlike.png">
                                        <img class="icon-liked ${recipe.isLiked ? '' : 'hidden'}" src="/images/like.png">
                                        <span class="like-count">${recipe.likeCount}</span>
                                    </div>
                                </div>

                            </div>

                            <div class="unmatch-area">
                                <span class="unmatch-title" data-i18n="ui.needIngredient"></span>
                                <div class="unmatch-scroll">
                                    <c:forEach var="item" items="${recipe.unMatchIngredientlist}">
                                        <span class="unmatch-item">${item}</span>
                                    </c:forEach>
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

                        </div>
                    </c:forEach>

                </div>
            </c:otherwise>
        </c:choose>

    </section>

    <button id="scrollTopBtn" class="scroll-top-btn">
        <img src="/images/scroll-top.png">
    </button>

</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/refri/refriItemList.js"></script>

</body>
</html>
