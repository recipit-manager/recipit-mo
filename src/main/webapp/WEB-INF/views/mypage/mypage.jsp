<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<% request.setAttribute("pageTitleKey", "ui.myPage.title"); %>

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
    <link rel="stylesheet" href="/css/myPage.css">
</head>

<body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
    <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />
<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>

<main class="myPage-container">

    <div class="myPage-profile">
        <div class="profile-icon">
            <img src="/images/chef.png" alt="profile">
        </div>

        <div class="nickname-area">
            <span class="nickname">${userNickname}</span>
            <button id="userSettingButton" class="setting-button">
                <img src="/images/userEdit.png" alt="setting">
            </button>
        </div>
    </div>

    <div class="myPage-count-summary">
        <div class="count-item">
            <span class="count-number">${uploadCount}</span>
            <span class="count-label" data-i18n="ui.myPage.upload_count"></span>
        </div>
        <div class="count-item">
            <span class="count-number">${bookmarkCount}</span>
            <span class="count-label" data-i18n="ui.myPage.bookmark_count"></span>
        </div>
        <div class="count-item">
            <span class="count-number">${likeCount}</span>
            <span class="count-label" data-i18n="ui.myPage.like_count"></span>
        </div>
    </div>

    <div class="myPage-grid">
        <div class="grid-item" id="btn-uploadRecipe">
            <span class="badge">${uploadCount}</span>
            <div class="icon-wrap">
                <img src="/images/uploadRecipe.png">
            </div>
            <div class="grid-title" data-i18n="ui.myPage.menu.upload.title"></div>
            <div class="grid-desc" data-i18n="ui.myPage.menu.upload.desc"></div>
        </div>

        <div class="grid-item" id="btn-draftRecipe">
            <span class="badge">${draftCount}</span>
            <div class="icon-wrap">
                <img src="/images/draftRecipe.png">
            </div>
            <div class="grid-title" data-i18n="ui.myPage.menu.draft.title"></div>
            <div class="grid-desc" data-i18n="ui.myPage.menu.draft.desc"></div>
        </div>

        <div class="grid-item" id="btn-recentView">
            <div class="icon-wrap">
                <img src="/images/recent.png">
            </div>
            <div class="grid-title" data-i18n="ui.myPage.menu.recent.title"></div>
            <div class="grid-desc" data-i18n="ui.myPage.menu.recent.desc"></div>
        </div>

        <div class="grid-item" id="btn-bookmarkRecipe">
            <span class="badge">${bookmarkCount}</span>
            <div class="icon-wrap">
                <img src="/images/bookmarkRecipe.png">
            </div>
            <div class="grid-title" data-i18n="ui.myPage.menu.bookmark.title"></div>
            <div class="grid-desc" data-i18n="ui.myPage.menu.bookmark.desc"></div>
        </div>
    </div>
</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/mypage/myPage.js"></script>
</body>
</html>