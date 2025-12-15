<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<% request.setAttribute("pageTitleKey", "ui.myPage.menu.upload.title"); %>

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
           data-i18n="ui.myPage.upload_summary"
           data-i18n-params='{"count": ${uploadCount}}'>
        </p>

        <p class="summary-sub"
           data-i18n="ui.myPage.like_summary"
           data-i18n-params='{"count": ${likeCount}}'>
        </p>
    </div>

    <section class="recipe-scroll-area">
        <c:choose>
            <c:when test="${empty uploadRecipes}">
                <div class="empty-result empty-upload-recipe">

                    <div class="empty-icon">
                        <img src="/images/emptyUploadRecipe.png">
                    </div>

                    <button
                            class="empty-write-btn"
                            id="emptyWriteRecipeBtn"
                            data-i18n="ui.upload">
                    </button>

                </div>
            </c:when>

            <c:otherwise>
                <div class="recipe-list" id="recipeList">
                    <c:forEach var="recipe" items="${uploadRecipes}">
                        <div class="recipe-card"
                             data-id="<c:out value='${recipe.recipeNo}'/>"
                             data-time="<c:out value='${recipe.cookingTime}'/>"
                             data-diff="<c:out value='${recipe.difficulty}'/>">

                            <div class="recipe-delete-btn"
                                 data-id="<c:out value='${recipe.recipeNo}'/>">
                                <img src="/images/delete.png" alt="delete">
                            </div>

                            <div class="recipe-img-box">
                                <img src="<c:out value='${recipe.imageUrl}'/>" alt="recipe">
                            </div>

                            <div class="recipe-info">
                                <p class="recipe-name">
                                    <c:out value="${recipe.name}" />
                                </p>

                                <p class="recipe-desc">
                                    <c:out value="${recipe.description}" />
                                </p>

                                <div class="recipe-meta">
                                <span
                                        data-i18n="ui.recipe.time_unit"
                                        data-i18n-params='{"count": <c:out value="${recipe.cookingTime}"/>}'>
                                </span>

                                    <span class="meta-item">
                                    <img src="/images/difficulty.png" class="meta-icon" alt="difficulty">
                                    <c:out value="${recipe.difficulty}" />
                                </span>

                                    <div class="recipe-like like-button-area">
                                        <img class="icon-unliked ${recipe.isLiked ? 'hidden' : ''}"
                                             src="/images/unlike.png"
                                             alt="unlike">
                                        <img class="icon-liked ${recipe.isLiked ? '' : 'hidden'}"
                                             src="/images/like.png"
                                             alt="like">
                                        <span class="like-count">
                                        <c:out value="${recipe.likeCount}" />
                                    </span>
                                    </div>
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
<script type="module" src="/js/page/mypage/uploadRecipe.js"></script>
</body>
</html>