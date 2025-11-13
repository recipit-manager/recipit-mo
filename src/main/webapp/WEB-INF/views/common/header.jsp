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
        <a href="/notice/list" class="icon-btn notice-btn"
           style="${isLogin eq 'true' ? 'display:flex;' : 'display:none;'}">
            <img src="/images/notice.png">
            <span class="notice-dot" id="noticeDot" style="display:none;"></span>
        </a>

        <a href="${isLogin eq 'true' ? '/mypage' : '/login'}" class="icon-btn">
            <img src="/images/profile.png" alt="마이페이지">
            <span>
                <c:choose>
                    <c:when test="${isLogin eq 'true'}">${userNickname}</c:when>
                    <c:otherwise>로그인</c:otherwise>
                </c:choose>
            </span>
        </a>

        <select id="languageSelect">
            <option value="KO" ${selectedLanguage == 'KO' ? 'selected' : ''}>언어선택(한국어)</option>
            <option value="EN" ${selectedLanguage == 'EN' ? 'selected' : ''}>언어선택(English)</option>
        </select>
    </div>
</header>