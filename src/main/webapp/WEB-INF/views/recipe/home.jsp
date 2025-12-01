<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>


<c:if test="${isAccountLocked eq true}">
    <c:redirect url="/user/temporary/password/change"/>
</c:if>

<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Recipit Home</title>
        <link rel="stylesheet" href="/css/header.css">
        <link rel="stylesheet" href="/css/home.css">
    </head>

    <body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

    <jsp:include page="/WEB-INF/views/common/header.jsp">
        <jsp:param name="isLogin" value="${isLogin}" />
        <jsp:param name="userNickname" value="${userNickname}" />
        <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
    </jsp:include>

    <main class="home-container">

        <div class="search-box">
            <input type="text" id="searchInput" data-i18n-placeholder="ui.recipe_search_placeholder">
            <button class="search-btn" id="searchButton">
                <img src="/images/search.png">
            </button>
        </div>

        <div class="refri-banner" onclick="location.href='/refri/ingredientList'">
            <div class="banner-left">
                <img src="/images/refri.png">
            </div>
            <div class="banner-right" data-i18n="ui.refrigerator_item">
                냉템요리
            </div>
        </div>

        <section class="category-section">
            <h3 class="section-title" data-i18n="ui.category_title">어떤 요리를 하고 싶나요?</h3>

            <div class="category-grid">
                <c:forEach var="cat" items="${recipeCategoryList}">
                    <div class="category-item" data-code="${cat.categoryCode}">
                        <img class="category-icon" src="${cat.iconUrl}">
                        <span class="category-name">${cat.categoryName}</span>
                    </div>
                </c:forEach>
            </div>
        </section>

        <section class="popular-section">
            <h3 class="section-title" data-i18n="ui.weekly_recipe_title">주간 인기 레시피</h3>

            <div class="popular-slide-wrapper">
                <div class="popular-slide-track">
                    <c:forEach var="recipe" items="${popularRecipeList}">
                        <div class="recipe-card" data-id="${recipe.id}">
                            <div class="recipe-img-box">
                                <img src="${recipe.imageUrl}">
                            </div>

                            <p class="recipe-name">${recipe.name}</p>

                            <div class="recipe-like">
                                <img class="icon-unliked ${recipe.isLiked ? 'hidden' : ''}" src="/images/unlike.png">
                                <img class="icon-liked ${recipe.isLiked ? '' : 'hidden'}" src="/images/like.png">
                                <span class="like-count">${recipe.likeCount}</span>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </div>
        </section>

        <button class="floating-write-btn" id="writeRecipeBtn">
            <img src="/images/write.png">
        </button>

    </main>

    <%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>
    <script type="module" src="/js/common/header.js"></script>
    <script type="module" src="/js/page/recipe/home.js"></script>
    </body>
</html>
