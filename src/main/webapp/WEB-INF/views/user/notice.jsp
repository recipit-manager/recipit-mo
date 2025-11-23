<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<% request.setAttribute("pageTitleKey", "ui.notice"); %>

<c:if test="${isLogin eq false}">
    <c:redirect url="/user/login"/>
</c:if>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>알림</title>

    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/pageHeader.css">
    <link rel="stylesheet" href="/css/notice.css">

</head>
<body data-page="notice" data-is-login="${isLogin}">
<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />

<div class="notice-wrapper">

    <div class="notice-top-bar">
        <div class="notice-left">
            <input type="checkbox" id="checkAll" class="check-all">
            <label for="checkAll" data-i18n="ui.notice_select_all">전체 선택</label>

            <span id="selectedCountBox" class="selected-count hidden">
                <span id="selectedCount">0</span>
                <span data-i18n="ui.notice_selected_count_suffix">개 선택됨</span>
            </span>
        </div>

        <div class="notice-right">
            <button id="btnRead" class="notice-btn" disabled data-i18n="ui.notice_mark_read">
                읽음
            </button>
        </div>
    </div>

    <ul id="noticeList" class="notice-list">
        <c:forEach var="item" items="${notificationList}">
            <li class="notice-item ${item.readYn eq 'N' ? 'unread' : ''}">
                <input type="checkbox" class="notice-check" data-id="${item.id}">

                <div class="notice-content">
                    <p class="text">${item.contents}</p>
                    <span class="time">${item.receivedTime}</span>
                </div>
            </li>
        </c:forEach>

        <c:if test="${empty notificationList}">
            <li class="notice-empty">
                <span data-i18n="ui.notice_empty">알림이 없습니다.</span>
            </li>
        </c:if>
    </ul>

</div>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/user/notice.js"></script>
</body>
</html>