<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="io.micrometer.common.util.StringUtils" %>
<%
    String apiHost = request.getAttribute("recipitApiHost");

    if (StringUtils.isEmpty(apiHost)) {
        apiHost = "http://localhost:8080";
    }
%>
<script language="javascript">
    const RECIPIT_API_HOST = "<%= apiHost %>";
</script>