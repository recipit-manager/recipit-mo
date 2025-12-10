<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<% request.setAttribute("pageTitleKey", "ui.recipeDetail"); %>

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
    <link rel="stylesheet" href="/css/recipeDetail.css">
</head>

<body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
    <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />
<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>

<main class="recipe-detail-container">

    <div class="recipe-title-area">
        <h1 class="recipe-title">${recipeInfo.title}</h1>

        <img class="bookmark-icon"
                src="/images/${recipeInfo.bookmarkYn eq 'Y' ? 'bookmark.png' : 'unBookmark.png'}"
                data-bookmarked="${recipeInfo.bookmarkYn}"
                data-id="${recipeInfo.recipeNo}"/>
    </div>

    <div class="recipe-main-image-area">
        <img class="recipe-main-image" src="${recipeInfo.mainImageUrl}">
    </div>

    <div class="recipe-writer-like-row">
        <div class="recipe-writer-center">
            <div class="recipe-writer-name">${recipeInfo.nickname}</div>
        </div>

        <div class="recipe-card" data-id="${recipeInfo.recipeNo}">
            <div class="like-button-area">
                <img class="icon-unliked ${recipeInfo.likeYn eq 'N' ? '' : 'hidden'}" src="/images/unlike.png">
                <img class="icon-liked ${recipeInfo.likeYn eq 'Y' ? '' : 'hidden'}" src="/images/like.png">
                <span class="like-count">${recipeInfo.likeCount}</span>
            </div>
        </div>
    </div>

    <p class="recipe-description">
        ${recipeInfo.description}
    </p>

    <div class="recipe-basic-info">
        <div class="info-item">
            <img src="/images/serving.png" />
            <span>
        ${recipeInfo.servingSize}
        <span data-i18n="ui.servingUnit"></span>
    </span>
        </div>

        <div class="info-item">
            <img src="/images/time.png" />
            <span>
        ${recipeInfo.cookingTime}
        <span data-i18n="ui.time_unit"></span>
    </span>
        </div>

        <div class="info-item">
            <img src="/images/${recipeInfo.difficulty eq '어려움' ? 'difficulty.png' :
                   recipeInfo.difficulty eq '보통' ? 'normal.png' : 'easy.png'}"/>
            <span>${recipeInfo.difficulty}</span>
        </div>
    </div>

    <div id="ingredientSection"></div>

    <div id="stepSection">
        <h2 class="step-title" data-i18n="ui.recipeDetail_steps"></h2>
        <div id="stepContent"></div>
    </div>

    <div id="completionSection">
        <h2 class="step-title" data-i18n="ui.recipeDetail_completion"></h2>
        <div id="completionContent"></div>
    </div>

    <c:if test="${userNickname ne recipeInfo.nickname}">
        <div class="report-area">
            <button id="reportBtn" class="report-button">
                <img src="/images/report.png" class="report-icon">
                <span data-i18n="ui.recipeDetail_report"></span>
            </button>
        </div>
    </c:if>
</main>

<script id="recipeData" type="application/json">
    ${recipeInfoJson}
</script>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/recipe/recipeDetail.js"></script>
</body>
</html>
