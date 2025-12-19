<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<% request.setAttribute("pageTitleKey", "ui.myPage.preference.title"); %>

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
    <link rel="stylesheet" href="/css/preference.css">
</head>

<body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
    <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />
<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>

<main class="preference-container">

    <section class="preference-guide">
        <div class="guide-box">
            <img src="/images/info.png">
            <div class="guide-text">
                <strong data-i18n="ui.myPage.preference.guide_title"></strong>
                <p data-i18n="ui.myPage.preference.guide_desc"></p>
            </div>
        </div>
    </section>

    <section class="preference-grid">

        <c:forEach var="category" items="${preferCategory}">
            <div class="preference-card
                <c:if test='${category.statusCode eq "RF01"}'> selected-like</c:if>
                <c:if test='${category.statusCode eq "RF03"}'> selected-dislike</c:if>"
                 data-category-code="${category.categoryCode}"
                 data-current-status="${category.statusCode}">

                <div class="card-icon">
                    <img src="<c:out value='${category.iconUrl}'/>">
                </div>

                <div class="card-name">
                    <c:out value="${category.categoryName}" />
                </div>

                <div class="card-actions">
                    <button type="button"
                            class="preference-action dislike
                                <c:if test='${category.statusCode eq "RF03"}'> active-dislike</c:if>"
                            data-status-code="RF03">
                        <img src="/images/preference_dislike.png">
                    </button>

                    <button type="button"
                            class="preference-action normal
                                <c:if test='${category.statusCode eq "RF02"}'> active-normal</c:if>"
                            data-status-code="RF02">
                        <img src="/images/preference_normal.png">
                    </button>

                    <button type="button"
                            class="preference-action like
                                <c:if test='${category.statusCode eq "RF01"}'> active-like</c:if>"
                            data-status-code="RF01">
                        <img src="/images/preference_like.png">
                    </button>
                </div>

            </div>
        </c:forEach>

    </section>

</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/mypage/preference.js"></script>
</body>
</html>
