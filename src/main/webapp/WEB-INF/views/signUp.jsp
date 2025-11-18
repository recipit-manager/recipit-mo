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
    <title>회원가입</title>

    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/signUp.css">

</head>
<body data-page="signUp" data-is-login="${isLogin}">
<jsp:include page="/WEB-INF/views/common/header.jsp">
    <jsp:param name="isLogin" value="${isLogin}" />
    <jsp:param name="userNickname" value="${userNickname}" />
</jsp:include>

<main class="sign-up-container">

    <h2 class="page-title" data-i18n="ui.signup_title">회원가입</h2>

    <!-- 이름 영역 -->
    <section class="form-section">
        <label class="form-label required" data-i18n="ui.name_label">이름</label>
        <div class="name-inputs">
            <input type="text" id="firstName" data-i18n-placeholder="ui.name_last_placeholder" placeholder="성" maxlength="10">
            <input type="text" id="middleName" data-i18n-placeholder="ui.name_middle_placeholder" placeholder="중간이름" maxlength="20">
            <input type="text" id="lastName" data-i18n-placeholder="ui.name_first_placeholder" placeholder="이름" maxlength="20">
        </div>
        <p class="error-text" id="nameError"></p>
    </section>

    <!-- 닉네임 영역 -->
    <section class="form-section">
        <label class="form-label required" data-i18n="ui.nickname_label">닉네임</label>
        <div class="nickname-input">
            <input type="text" id="nickname" data-i18n-placeholder="ui.nickname_placeholder" placeholder="2~8자" maxlength="8">
            <button type="button" id="btnCheckNickname" class="btn-small" data-i18n="ui.nickname_check_duplicate">중복확인</button>
        </div>
        <p class="error-text" id="nicknameError"></p>
    </section>

    <!-- 이메일 영역 -->
    <section class="form-section">
        <label class="form-label required" data-i18n="ui.email_label">이메일</label>
        <div class="email-input">
            <input type="text" id="emailLocal" data-i18n-placeholder="ui.email_placeholder" placeholder="example">
            <span class="at-symbol">@</span>
            <select id="emailDomain">
                <option value="" data-i18n="ui.email_select_domain">선택</option>
                <c:forEach var="domain" items="${emailDomains}">
                    <option value="${domain}">${domain}</option>
                </c:forEach>
                <option value="direct" data-i18n="ui.email_custom_domain">직접입력</option>
            </select>
            <input type="text" id="emailDomainDirect" data-i18n-placeholder="ui.email_domain_placeholder" placeholder="도메인 입력" disabled>
            <button type="button" id="btnSendCode" class="btn-small" data-i18n="ui.send_code">인증코드 전송</button>
        </div>
        <p class="info-text" id="emailInfo"></p>
    </section>

    <!-- 인증코드 영역 -->
    <section class="form-section" id="verifySection" style="display:none;">
        <label class="form-label required" data-i18n="ui.verify_label">인증코드</label>
        <div class="verify-input">
            <input type="text" id="verifyCode" data-i18n-placeholder="ui.verify_placeholder" placeholder="인증코드 입력">
            <button type="button" id="checkVerifyCode" class="btn-small" data-i18n="common.confirm">확인</button>
        </div>
        <p class="error-text" id="verifyCodeInfo"></p>
    </section>

    <!-- 비밀번호 영역 -->
    <section class="form-section">
        <label class="form-label required" data-i18n="ui.password_label">비밀번호</label>
        <div class="password-input">
            <input type="password" id="password" data-i18n-placeholder="ui.password_placeholder" placeholder="8~16자 영문/숫자/특수문자 포함">
            <button type="button" id="btnTogglePassword" class="icon-eye" aria-label="비밀번호 보기"></button>
            <button type="button" id="btnPasswordTooltip" class="icon-info" aria-label="비밀번호 안내"></button>
            <div id="passwordTooltip" class="tooltip-box">
                <ul>
                    <li data-i18n="ui.password_rule_1">8자 이상 16자 이하</li>
                    <li data-i18n="ui.password_rule_2">영문 대소문자, 숫자, 특수문자(!@#$%^&*) 각 1개 이상 포함</li>
                    <li data-i18n="ui.password_rule_3">동일한 문자 3개 이상 반복 불가 (예: aaa, 111)</li>
                </ul>
            </div>
        </div>
        <p class="error-text" id="passwordError"></p>
    </section>

    <!-- 비밀번호 확인 영역 -->
    <section class="form-section">
        <label class="form-label required" data-i18n="ui.password_confirm_label">비밀번호 확인</label>
        <input type="password" id="passwordConfirm" data-i18n-placeholder="ui.password_confirm_placeholder" placeholder="비밀번호 재입력">
        <p class="error-text" id="passwordConfirmError"></p>
    </section>

    <!-- 휴대전화 영역 -->
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

    <!-- 가입 버튼 -->
    <section class="form-section">
        <button type="button" id="btnSignUp" class="btn-primary" data-i18n="ui.signup_button">회원가입</button>
    </section>

    <!-- 로그인 안내 -->
    <section class="form-section text-center">
        <p>
            <span data-i18n="ui.login_guide">이미 계정이 있으신가요?</span>
            <a href="/user/login" class="link" data-i18n="ui.login_link">로그인</a>
        </p>
    </section>

</main>

<script type="module" src="/js/common/header.js"></script>
<script type="module" src="/js/page/signUp.js"></script>
</body>
</html>
