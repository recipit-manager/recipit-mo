<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<% request.setAttribute("pageTitleKey", "ui.myPage.menu.bookmark.title"); %>

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
           data-i18n="ui.myPage.bookmark_summary"
           data-i18n-params='{"count": ${bookmarkCount}}'>
        </p>

        <p class="summary-sub"
           data-i18n="ui.myPage.bookmark_limit">
        </p>
    </div>

    <section class="recipe-scroll-area">

        <c:choose>
            <c:when test="${empty recentRecipes}">
                <div class="empty-result empty-upload-recipe">
                    <div class="empty-icon">
                        <img src="/images/emptyBookmarkRecipe.png" alt="empty">
                    </div>
                </div>
            </c:when>

            <c:otherwise>
                <div class="recipe-list" id="recipeList">
                    <c:forEach var="recipe" items="${recentRecipes}">
                        <div class="recipe-card"
                             data-id="<c:out value='${recipe.recipeNo}'/>">

                            <div class="recipe-img-box">
                                <img src="<c:out value='${recipe.imageUrl}'/>">
                            </div>

                            <div class="recipe-info">
                                <p class="recipe-name">
                                    <c:out value="${recipe.name}" />
                                </p>

                                <p class="recipe-desc">
                                    <c:out value="${recipe.description}" />
                                </p>

                                <div class="recipe-meta">
                                    <span data-i18n="ui.recipe.time_unit"
                                        data-i18n-params='{"count": <c:out value="${recipe.cookingTime}"/>}'>
                                    </span>

                                    <span class="meta-item">
                                        <img src="/images/difficulty.png" class="meta-icon">
                                         <c:out value="${recipe.difficulty}" />
                                    </span>

                                    <div class="recipe-like like-button-area">
                                        <img class="icon-unliked ${recipe.isLiked ? 'hidden' : ''}"
                                             src="/images/unlike.png">
                                        <img class="icon-liked ${recipe.isLiked ? '' : 'hidden'}"
                                             src="/images/like.png">
                                        <span class="like-count">
                                            <c:out value="${recipe.likeCount}" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <img class="bookmark-icon"
                                 src="/images/${recipe.isBookmarked ? 'bookmark.png' : 'unBookmark.png'}"
                                 data-bookmarked="${recipe.isBookmarked ? 'Y' : 'N'}"
                                 data-id="<c:out value='${recipe.recipeNo}'/>"/>
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
<script type="module" src="/js/page/mypage/bookmarkRecipe.js"></script>
</body>
</html>
