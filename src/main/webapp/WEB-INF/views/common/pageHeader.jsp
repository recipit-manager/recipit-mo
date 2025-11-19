<%@ page contentType="text/html;charset=UTF-8" %>
<% String title = (String) request.getAttribute("pageTitleKey"); %>

<div class="sub-header-container">
    <button class="btn-back" onclick="history.back()">
        <img src="/images/left-arrow.png" alt="back">
    </button>

    <h2 class="sub-header-title"
        data-i18n="<%= title %>">
    </h2>
</div>
