<%@ page contentType="text/html;charset=UTF-8" %>

<header class="recipit-header">
    <div class="logo-area">
        <a href="/home" class="logo-link">
            <img src="/images/logo.png" class="logo-img">
        </a>
    </div>

    <div class="header-icons">
        <a href="/notice/list" class="icon-btn notice-btn"
           style="${isLogin ? 'display:flex;' : 'display:none;'}">
            <img src="/images/notice.png">
            <span class="notice-dot" id="noticeDot" style="display:none;"></span>
        </a>

        <a href="${isLogin ? '/mypage' : '/login'}" class="icon-btn">
            <img src="/images/profile.png" alt="마이페이지">
            <span>
                <c:choose>
                    <span>${isLogin ? userNickname : '로그인'}</span>
                </c:choose>
            </span>
        </a>

        <select class="lang-select">
            <option value="ko">언어선택(한국어)</option>
            <option value="en">언어선택(English)</option>
        </select>
    </div>
</header>
