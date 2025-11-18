<%@ page contentType="text/html;charset=UTF-8" %>
<html>
    <head>
        <title>Recipit Home</title>
        <link rel="stylesheet" href="/css/header.css">
    </head>

    <body data-is-login="${isLogin}" data-is-unread-notification="${isUnreadNotification}">

    <jsp:include page="/WEB-INF/views/common/header.jsp">
        <jsp:param name="isLogin" value="${isLogin}" />
        <jsp:param name="userNickname" value="${userNickname}" />
        <jsp:param name="isUnreadNotification" value="${isUnreadNotification}" />
    </jsp:include>

    <main>
        <h2>Recipit</h2>
        <p>MainPage</p>
    </main>

    <script type="module" src="/js/common/header.js"></script>
    <script type="module" src="/js/page/home.js"></script>
    </body>
</html>
