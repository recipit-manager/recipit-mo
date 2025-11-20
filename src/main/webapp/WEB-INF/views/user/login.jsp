<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<% request.setAttribute("pageTitleKey", "ui.login_link"); %>

<c:if test="${isLogin eq true}">
    <c:redirect url="/home"/>
</c:if>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인</title>

    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/pageHeader.css">
    <link rel="stylesheet" href="/css/login.css">

</head>
<body data-page="login" data-is-login="${isLogin}">
<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
</jsp:include>

<jsp:include page="/WEB-INF/views/common/pageHeader.jsp" />

<main class="login-container">

    <h2 class="page-title" data-i18n="ui.login_link">로그인</h2>

    <section class="form-section">
        <label class="form-label required" data-i18n="ui.email_label">이메일</label>
        <div class="email-input">
            <input type="text" id="emailInput" data-i18n-placeholder="ui.email_placeholder" placeholder="이메일을 입력하세요">
        </div>
        <p class="info-text" id="emailError"></p>
    </section>

    <section class="form-section">
        <div class="label-row">
            <label class="form-label required" data-i18n="ui.password_label">비밀번호</label>
            <button type="button" id="btnPasswordTooltip" class="icon-btn label-tooltip-btn">
                <img src="/images/information.png">
            </button>
        </div>
        <div id="passwordTooltip" class="tooltip-box">
            <ul>
                <li data-i18n="ui.password_rule_1">8자 이상 16자 이하</li>
                <li data-i18n="ui.password_rule_2">영문 대소문자, 숫자, 특수문자(!@#$%^&*) 각 1개 이상 포함</li>
                <li data-i18n="ui.password_rule_3">동일한 문자 3개 이상 반복 불가 (예: aaa, 111)</li>
            </ul>
        </div>
        <div class="password-input">
            <input type="password" id="password" data-i18n-placeholder="ui.password_placeholder" placeholder="8~16자 영문/숫자/특수문자 포함">
            <button type="button" id="btnTogglePassword" class="icon-btn">
                <img src="/images/eye.png">
            </button>
        </div>
        <p class="error-text" id="passwordError"></p>
    </section>

    <section class="form-section checkbox-section">
        <label class="checkbox-row">
            <input type="checkbox" id="autoLogin">
            <span data-i18n="ui.auto_login">자동로그인</span>
        </label>

        <label class="checkbox-row">
            <input type="checkbox" id="keepLogin">
            <span data-i18n="ui.keep_login">로그인 유지</span>
        </label>
    </section>

    <section class="form-section">
        <p class="error-text" id="errorInfo"></p>
        <button type="button" id="btnLogin" class="btn-primary" data-i18n="ui.login_button">로그인</button>
    </section>

    <section class="login-links">
        <a href="/user/signUp" class="login-link" data-i18n="ui.signup_button">회원가입</a>
        <span class="divider">|</span>
        <a href="/user/findId" class="login-link" data-i18n="ui.find_id">아이디 찾기</a>
        <span class="divider">|</span>
        <a href="/user/findPassword" class="login-link" data-i18n="ui.find_password">비밀번호 찾기</a>
    </section>

</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/user/login.js"></script>
</body>
</html>