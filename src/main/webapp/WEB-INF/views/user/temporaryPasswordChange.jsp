<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<c:if test="${isAccountLocked eq false}">
    <c:redirect url="/home"/>
</c:if>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="ui.password_change_title">비밀번호 변경</title>

    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/temporaryPasswordChange.css">

</head>

<body class="popup-body">

<div class="popup-wrapper">

    <h3 class="popup-title" data-i18n="ui.password_change_title">
        비밀번호 변경이 필요합니다.
    </h3>

    <p class="popup-desc">
        <span data-i18n="password.change_info_line1">현재 임시 비밀번호로 로그인하셨습니다.</span><br>
        <span data-i18n="password.change_info_line2">보안을 위해 새 비밀번호를 설정해주세요.</span>
    </p>

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

    <!-- 비밀번호 확인 영역 -->
    <section class="form-section">
        <label class="form-label required" data-i18n="ui.password_confirm_label">비밀번호 확인</label>
        <input type="password" id="passwordConfirm" data-i18n-placeholder="ui.password_confirm_placeholder" placeholder="비밀번호 재입력">
        <p class="error-text" id="passwordConfirmError"></p>
    </section>

    <!-- 버튼 -->
    <div class="popup-buttons">
        <button id="CloseBtn" class="btn-secondary" data-i18n="ui.close">닫기</button>
        <button id="btnChangePassword" class="btn-primary" data-i18n="password.change_button">비밀번호 변경</button>
    </div>

</div>

<script type="module" src="/js/page/user/temporaryPasswordChange.js"></script>

</body>
</html>
