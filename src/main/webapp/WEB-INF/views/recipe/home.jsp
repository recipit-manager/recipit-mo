<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>


<c:if test="${isAccountLocked eq true}">
    <c:redirect url="/user/password/change"/>
</c:if>

<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

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
    <script type="module" src="/js/page/recipe/home.js"></script>
    </body>
</html>
