<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<% request.setAttribute("pageTitleKey", "ui.myPage.userInfo.title"); %>

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
    <link rel="stylesheet" href="/css/userInfo.css">
</head>

<body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
    <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />
<%@ include file="/WEB-INF/views/common/apiCommon.jsp" %>

<main class="userInfo-container">

    <section class="user-info-card">

        <h2 class="user-info-title" data-i18n="ui.myPage.userInfo.section_title"></h2>

        <div class="info-block">
            <span class="info-label" data-i18n="ui.myPage.userInfo.email"></span>
            <span class="info-value">
                <c:out value="${userInfo.email}" />
            </span>
        </div>

        <div class="info-block editable">
            <div class="editable-header">
                <span class="info-label" data-i18n="ui.myPage.userInfo.nickname"></span>
                <button type="button" class="icon-button nickname-edit-button">
                    <img src="/images/edit.png">
                </button>
            </div>
            <span class="info-value">
                <c:out value="${userInfo.nickName}" />
            </span>
        </div>

        <div class="info-block">
            <span class="info-label" data-i18n="ui.myPage.userInfo.name"></span>
            <span class="info-value">
                <c:out value="${userInfo.firstName}" />
                <c:if test="${not empty userInfo.middleName}">
                    <c:out value=" ${userInfo.middleName}" />
                </c:if>
                <c:out value=" ${userInfo.lastName}" />
            </span>
        </div>

        <div class="info-block">
            <span class="info-label" data-i18n="ui.myPage.userInfo.phoneNumber"></span>
            <span class="info-value">
                (<c:out value="${userInfo.countryCode}" />)
                <c:out value="${userInfo.phoneNumber}" />
            </span>
        </div>

        <div class="password-area">
            <button type="button" class="password-change-button">
                <span class="action-button-left">
                    <img src="/images/edit.png">
                </span>
                <span class="action-button-center" data-i18n="ui.myPage.userInfo.change_password"></span>
            </button>
        </div>

    </section>

    <section class="action-section">
        <button type="button" class="action-button preference-button">
            <span class="action-button-left">
                <img src="/images/preference.png">
            </span>
            <span class="action-button-center" data-i18n="ui.myPage.userInfo.set_preference"></span>
            <span class="action-button-right"></span>
        </button>
    </section>

</main>

<div class="logout-fixed">
    <button type="button" class="action-button logout-button">
        <span class="action-button-left">
            <img src="/images/logout.png">
        </span>
        <span class="action-button-center" data-i18n="ui.myPage.userInfo.logout"></span>
        <span class="action-button-right"></span>
    </button>
</div>

<div id="nicknameEditModal" class="nickname-modal hidden">

    <div class="nickname-modal-backdrop"></div>

    <div class="nickname-modal-content">
        <div class="nickname-modal-header">
            <img src="/images/user.png" class="nickname-icon"/>
            <h3 data-i18n="ui.myPage.nickname.change.title"></h3>
        </div>

        <div class="nickname-modal-body">

            <label class="nickname-label" data-i18n="ui.myPage.nickname.label"></label>

            <div class="nickname-input-row">
                <input type="text" id="nicknameInput" maxlength="8" placeholder="2~8자"/>
                <button type="button" id="nicknameDuplicateButton" class="btn-small" data-i18n="ui.myPage.nickname.duplicate_check">
                </button>
            </div>

            <p id="nicknameMessage" class="nickname-message"></p>

        </div>

        <div class="nickname-modal-footer">
            <button type="button" id="nicknameCancelButton" class="btn-small gray" data-i18n="ui.close"></button>
            <button type="button" id="nicknameChangeButton" class="btn-small" data-i18n="ui.myPage.nickname.change.confirm"></button>
        </div>
    </div>

</div>

<div id="passwordEditModal" class="nickname-modal hidden">

    <div class="nickname-modal-backdrop"></div>

    <div class="nickname-modal-content">

        <div class="nickname-modal-header">
            <img src="/images/lock.png" class="nickname-icon"/>
            <h3 data-i18n="ui.myPage.password.change.title"></h3>
        </div>

        <div class="nickname-modal-body">

            <label class="nickname-label required"
                   data-i18n="ui.myPage.password.current"></label>
            <div class="password-input-row">
                <input type="password" id="currentPassword"/>
                <button type="button" class="icon-btn toggle-password" data-target="currentPassword">
                    <img src="/images/eye.png">
                </button>
            </div>
            <p class="nickname-message" id="currentPasswordMessage"></p>

            <div class="password-label-row rule-anchor">
                <label class="nickname-label required" data-i18n="ui.myPage.password.new"></label>

                <button type="button" id="btnPasswordRuleInfo" class="icon-btn" aria-label="Password rules">
                    <img src="/images/information.png">
                </button>

                <div class="password-rule-tooltip hidden"
                     id="passwordRuleBox">
                    <ul>
                        <li data-i18n="ui.password_rule_1"></li>
                        <li data-i18n="ui.password_rule_2"></li>
                        <li data-i18n="ui.password_rule_3"></li>
                    </ul>
                </div>
            </div>

            <div class="password-input-row">
                <input type="password" id="newPassword"/>
                <button type="button" class="icon-btn toggle-password" data-target="newPassword">
                    <img src="/images/eye.png">
                </button>
            </div>
            <p class="nickname-message" id="newPasswordMessage"></p>

            <label class="nickname-label required" data-i18n="ui.myPage.password.confirm"></label>
            <div class="password-input-row">
                <input type="password" id="confirmPassword"/>
            </div>
            <p class="nickname-message" id="confirmPasswordMessage"></p>

        </div>

        <div class="nickname-modal-footer">
            <button type="button" class="btn-small gray" id="passwordCancelButton" data-i18n="ui.close"></button>
            <button type="button" class="btn-small" id="passwordChangeSubmitButton" data-i18n="ui.myPage.password.change.confirm"></button>
        </div>

    </div>
</div>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/mypage/userInfo.js"></script>
</body>
</html>
