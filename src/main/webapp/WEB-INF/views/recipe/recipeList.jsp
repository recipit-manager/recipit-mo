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
    <link rel="stylesheet" href="/css/recipeList.css">
</head>

<body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
    <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
</jsp:include>

<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>


<main class="recipeList-container">

    <div class="fixed-top-section">
        <div class="search-bar">
            <img src="/images/left-arrow.png" class="back-btn" id="backBtn">

            <input type="text" id="searchInput"
                   value="${keyword}"
                   data-i18n-placeholder="ui.recipe_search_placeholder">

            <button class="search-btn" id="searchBtn">
                <img src="/images/search.png">
            </button>
        </div>

        <c:if test="${not empty keyword}">
            <div class="search-result">
                '<span>${keyword}</span>'
                <span data-i18n="ui.search_result_suffix">검색 결과</span>
                <button id="clearKeywordBtn" class="clear-btn">X</button>
            </div>
        </c:if>

        <div class="category-scroll">
            <div class="category-item ${empty categoryCode ? 'active' : ''}"
                 data-code="" data-i18n="ui.recipe_category_all">
                전체
            </div>

            <c:forEach var="cat" items="${recipeList.categorylist}">
                <div class="category-item ${categoryCode eq cat.code ? 'active' : ''}"
                     data-code="${cat.code}">
                        ${cat.codeName}
                </div>
            </c:forEach>
        </div>

        <div class="filter-bar">
            <img src="/images/filter.png" class="filter-icon">

            <div class="sort-options">
                <span class="sort-btn ${sort eq 'recent' ? 'active' : ''}"
                      data-sort="recent"
                      data-i18n="ui.recent_order">최신순</span>

                <span class="sort-btn ${sort eq 'like' ? 'active' : ''}"
                      data-sort="like"
                      data-i18n="ui.like_order">좋아요순</span>
            </div>
        </div>
    </div>

    <section class="recipe-scroll-area">

        <div class="empty-result" style="display:none;">
            <div class="empty-icon">
                <img src="/images/empty-search.png">
            </div>

            <p class="empty-title">
                '<span>${keyword}</span>'
                <span data-i18n="ui.empty_search_title_suffix">에 대한 검색 결과가 없습니다.</span>
            </p>

            <p class="empty-desc" data-i18n="ui.empty_search_desc">
                - 검색어가 정확한지 확인해주세요.<br>
                - 다른 검색어를 입력해보세요.
            </p>
        </div>

        <c:choose>
            <c:when test="${empty recipeList.recipelist}">
                <script type="text/plain" id="serverEmptyResultFlag">true</script>

            </c:when>

            <c:otherwise>
                <div class="recipe-list" id="recipeList">
                    <c:forEach var="recipe" items="${recipeList.recipelist}">
                        <div class="recipe-card"
                             data-id="${recipe.recipeNo}"
                             data-time="${recipe.cookingTime}"
                             data-diff="${recipe.difficultyCode}">

                            <div class="recipe-img-box">
                                <img src="${recipe.imageUrl}">
                            </div>

                            <div class="recipe-info">
                                <p class="recipe-name">${recipe.name}</p>
                                <p class="recipe-desc">${recipe.description}</p>

                                <div class="recipe-meta">
                                <span class="meta-item">
                                    <img src="/images/time.png" class="meta-icon">
                                    ${recipe.cookingTime}
                                    <span data-i18n="ui.time_unit">분</span>
                                </span>

                                    <span class="meta-item">
                                    <img src="/images/difficulty.png" class="meta-icon">
                                    ${recipe.difficultyCodeName}
                                </span>
                                </div>
                            </div>

                            <div class="recipe-like">
                                <img class="icon-unliked ${recipe.isLiked ? 'hidden' : ''}" src="/images/unlike.png">
                                <img class="icon-liked ${recipe.isLiked ? '' : 'hidden'}" src="/images/like.png">
                                <span class="like-count">${recipe.likeCount}</span>
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

    <div class="filter-modal" id="filterModal">

        <div class="filter-modal-content">

            <div class="filter-header">
                <span class="filter-title" data-i18n="ui.filter_title">검색 필터</span>
                <img src="/images/reset.png" id="filterResetBtn" class="filter-reset-icon">
            </div>

            <div class="filter-section">
                <p class="filter-label" data-i18n="ui.filter_difficulty">난이도</p>

                <div class="difficulty-options">
                    <label class="difficulty-item">
                        <input type="checkbox" value="D1" class="difficulty-check">
                        <span data-i18n="ui.difficulty_easy">쉬움</span>
                    </label>

                    <label class="difficulty-item">
                        <input type="checkbox" value="D2" class="difficulty-check">
                        <span data-i18n="ui.difficulty_medium">보통</span>
                    </label>

                    <label class="difficulty-item">
                        <input type="checkbox" value="D3" class="difficulty-check">
                        <span data-i18n="ui.difficulty_hard">어려움</span>
                    </label>
                </div>
            </div>

            <div class="filter-section">
                <p class="filter-label" data-i18n="ui.filter_time">요리 시간</p>

                <div class="range-container">
                    <input type="range" id="timeMin" min="0" max="120" value="0" class="range-slider thumb-left">
                    <input type="range" id="timeMax" min="0" max="120" value="120" class="range-slider thumb-right">

                    <div class="slider-track"></div>
                </div>

                <div class="time-values">
                    <span id="timeMinValue" data-i18n="ui.min_minute">0분</span>
                    <span id="timeMaxValue" data-i18n="ui.max_minute">120분+</span>
                </div>
            </div>

            <div class="filter-buttons">
                <button class="filter-cancel" id="filterCancelBtn" data-i18n="ui.close">닫기</button>
                <button class="filter-apply" id="filterApplyBtn" data-i18n="ui.apply">적용</button>
            </div>

        </div>
    </div>

</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/recipe/recipeList.js"></script>

</body>
</html>
