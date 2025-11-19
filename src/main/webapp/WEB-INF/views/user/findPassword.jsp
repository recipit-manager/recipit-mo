<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%--<c:if test="${isLogin eq true}">--%>
<%--    <c:redirect url="/home"/>--%>
<%--</c:if>--%>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인</title>

    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/findPassword.css">

</head>
<body data-page="login" data-is-login="${isLogin}">
<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
</jsp:include>

<main class="container">

    <h2 class="page-title" data-i18n="ui.find_password">비밀번호 찾기</h2>

    <section class="form-section">
        <label class="form-label required" data-i18n="ui.name_label">이름</label>
        <div class="name-inputs">
            <input type="text" id="firstName" data-i18n-placeholder="ui.name_last_placeholder" placeholder="성" maxlength="10">
            <input type="text" id="middleName" data-i18n-placeholder="ui.name_middle_placeholder" placeholder="중간이름" maxlength="20">
            <input type="text" id="lastName" data-i18n-placeholder="ui.name_first_placeholder" placeholder="이름" maxlength="20">
        </div>
        <p class="error-text" id="nameError"></p>
    </section>

    <section class="form-section">
        <label class="form-label required" data-i18n="ui.phone_label">휴대전화</label>
        <div class="phone-input">
            <select id="countryCode">
                <c:forEach var="country" items="${countries}" varStatus="vs">
                    <option
                            value="${country.code}"
                            data-regex="${country.regex}"
                            data-format="${country.format}"
                        ${vs.first ? 'selected' : ''}>
                            ${country.name} (${country.dialCode})
                    </option>
                </c:forEach>
            </select>
            <input type="text" id="phoneNumber" placeholder="${countries[0].format}">
        </div>
        <p class="error-text" id="phoneError"></p>
    </section>

    <section class="form-section">
        <label class="form-label required" data-i18n="ui.email_label">이메일</label>
        <div class="email-input">
            <input type="text" id="emailInput" data-i18n-placeholder="ui.email_placeholder" placeholder="이메일을 입력하세요">
        </div>
        <p class="info-text" id="emailError"></p>
    </section>

    <section class="form-section">
        <p class="error-text" id="errorInfo"></p>
        <button type="button" id="btnFindPassword" class="btn-primary" data-i18n="ui.find_password">비밀번호 찾기</button>
    </section>

    <section class="links">
        <a href="/user/findId" class="link" data-i18n="ui.find_id">아이디 찾기</a>
        <span class="divider">|</span>
        <a href="/user/login" class="link" data-i18n="ui.login_button">로그인</a>
        <span class="divider">|</span>
        <a href="/user/signUp" class="link" data-i18n="ui.signup_button">회원가입</a>

    </section>

</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/user/findPassword.js"></script>
</body>
</html>