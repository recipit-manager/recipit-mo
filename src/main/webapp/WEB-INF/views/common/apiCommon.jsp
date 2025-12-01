<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<c:set var="apiHost" value="${recipitApiHost}" />
<c:if test="${empty apiHost}">
    <c:set var="apiHost" value="http://localhost:8080" />
</c:if>

<script type="text/javascript">
    const RECIPIT_API_HOST = "${apiHost}";
</script>