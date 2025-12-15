<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<% request.setAttribute("pageTitleKey", "ui.myPage.menu.draft.title"); %>

<c:if test="${isLogin eq false}">
    <c:redirect url="/user/login"/>
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
    <link rel="stylesheet" href="/css/myPageRecipe.css">
</head>

<body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
    <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />
<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>

<main class="recipe-container">
    <div class="upload-summary-box fixed-summary">
        <p class="summary-line"
           data-i18n="ui.myPage.draft_summary"
           data-i18n-params='{"count": ${draftCount}}'>
        </p>

        <p class="summary-sub"
           data-i18n="ui.myPage.draft_limit">
        </p>
    </div>

    <section class="recipe-scroll-area">

        <c:choose>
            <c:when test="${empty draftRecipes}">
                <div class="empty-result empty-upload-recipe">

                    <div class="empty-icon">
                        <img src="/images/emptyDraftRecipe.png">
                    </div>

                    <button
                            class="empty-write-btn"
                            id="emptyWriteRecipeBtn"
                            data-i18n="ui.upload">
                    </button>

                </div>
            </c:when>

            <c:otherwise>
                <div class="recipe-list">
                    <c:forEach var="recipe" items="${draftRecipes}">
                        <div class="recipe-card"
                             data-id="${recipe.recipeNo}">

                            <div class="recipe-delete-btn" data-id="${recipe.recipeNo}">
                                <img src="/images/delete.png">
                            </div>

                            <div class="recipe-img-box">
                                <c:choose>
                                    <c:when test="${not empty recipe.imageUrl}">
                                        <img src="${recipe.imageUrl}">
                                    </c:when>
                                    <c:otherwise>
                                        <img src="/images/emptyDraftThumbnail.png" class="empty-thumbnail">
                                    </c:otherwise>
                                </c:choose>
                            </div>

                            <div class="recipe-info">
                                <p class="recipe-name">
                                    <c:choose>
                                        <c:when test="${not empty recipe.name}">
                                            ${recipe.name}
                                        </c:when>
                                        <c:otherwise>
                                            <span data-i18n="ui.recipe.draft_title_default"></span>
                                        </c:otherwise>
                                    </c:choose>
                                </p>

                                <p class="recipe-desc">
                                    <c:choose>
                                        <c:when test="${not empty recipe.description}">
                                            ${recipe.description}
                                        </c:when>
                                        <c:otherwise>
                                            <span data-i18n="ui.recipe.draft_desc_default"></span>
                                        </c:otherwise>
                                    </c:choose>
                                </p>

                                <div class="recipe-meta">
                                    <span
                                            data-i18n="ui.recipe.time_unit"
                                            data-i18n-params='{"count": ${recipe.cookingTime}}'>
                                    </span>

                                    <span class="meta-item">
                                        <img src="/images/difficulty.png" class="meta-icon">
                                        ${recipe.difficulty}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </c:forEach>
                </div>
            </c:otherwise>
        </c:choose>

    </section>

    <button class="floating-top-btn" id="scrollTopBtn">
        <img src="/images/scroll-top.png">
    </button>

    <button class="floating-write-btn" id="writeRecipeBtn">
        <img src="/images/write.png">
    </button>

</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/mypage/draftRecipe.js"></script>
</body>
</html>