<%@ page contentType="text/html;charset=UTF-8" %>
<html>
    <head>
        <title>Recipit Home</title>
        <link rel="stylesheet" href="/css/header.css">
    </head>

    <body data-is-login="${isLogin}">

        <%@ include file="/WEB-INF/views/common/header.jsp" %>

        <main>
            <h2>환영합니다!</h2>
            <p>여기는 홈 화면입니다.</p>
        </main>

        <script src="/js/header.js" defer></script>
    </body>
</html>
