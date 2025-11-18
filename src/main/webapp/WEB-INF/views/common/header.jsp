<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<c:set var="isLogin" value="${param.isLogin}" />
<c:set var="userNickname" value="${param.userNickname}" />
<c:set var="selectedLanguage" value="${param.selectedLanguage}" />

<header class="recipit-header">
    <div class="logo-area">
        <a href="/home" class="logo-link">
            <img src="/images/logo.png" class="logo-img">
        </a>
    </div>

    <div class="header-icons">
        <a href="/notice/list" class="header-icon-btn notice-btn"
           style="${isLogin eq 'true' ? 'display:flex;' : 'display:none;'}">
            <img src="/images/notice.png">
            <span class="notice-dot" id="noticeDot" style="display:none;"></span>
        </a>

        <a href="${isLogin eq 'true' ? '/mypage' : '/user/login'}" class="header-icon-btn">
            <img src="/images/profile.png">
            <span data-i18n="${isLogin eq 'true' ? '' : 'ui.login_link'}">
                <c:if test="${isLogin eq 'true'}">${userNickname}</c:if>
            </span>
        </a>

        <c:if test="${isLogin eq 'true'}">
            <button id="logoutButton" class="header-icon-btn logout-btn">로그아웃</button>
        </c:if>

        <select class="language" id="languageSelect">
            <option value="KO"
            ${selectedLanguage == 'KO' ? 'selected' : ''}
                    data-i18n="ui.language_korean"></option>
            <option value="EN"
            ${selectedLanguage == 'EN' ? 'selected' : ''}
                    data-i18n="ui.language_english"></option>
        </select>
    </div>
</header>