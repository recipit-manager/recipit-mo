package com.recipitmo.interceptor;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.common.Constants;
import com.recipitmo.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import retrofit2.Response;

@Slf4j
public class LoginStatusInterceptor implements HandlerInterceptor {
    private String apiUrlHost;

    public LoginStatusInterceptor(String apiUrlHost) {
        this.apiUrlHost = apiUrlHost;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        try {
            Response<ApiResponse<String>> apiResponse = RetrofitClient
                    .getUserApiService()
                    .getLoginStatus(request.getHeader("Cookie"))
                    .execute();

            ApiResponse<String> body = apiResponse.body();
            String code = (body != null) ? body.getCode() : null;

            boolean isAccountLocked = Constants.responseCode.ACCOUNT_LOCK.equals(code);
            boolean isLogin = Constants.responseCode.SUCCESS.equals(code) || isAccountLocked;

            for (String cookie : apiResponse.headers().values("Set-Cookie")) {
                response.addHeader("Set-Cookie", cookie);
                log.info("Set-Cookie added: {}", cookie);
            }

            request.setAttribute("isLogin", isLogin);
            request.setAttribute("isAccountLocked", isAccountLocked);
            request.setAttribute("userNickname", isLogin ? body.getData() : null);
            request.setAttribute("recipitApiHost", apiUrlHost);

        } catch (Exception e) {
            log.error("Login status check failed", e);
        }

        return true;
    }


    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) throws Exception {
        if (modelAndView == null) {
            return;
        }

        if ((Boolean)request.getAttribute("isAccountLocked")) {
            modelAndView.addObject("isAccountLocked", true);
            return;
        }

        Boolean isLogin = (Boolean) request.getAttribute("isLogin");

        if (isLogin != null && isLogin) {
            try {
                Response<ApiResponse<Boolean>> notificationResponse = RetrofitClient
                        .getUserApiService()
                        .getNotificationUnreadExists(request.getHeader("Cookie"))
                        .execute();

                ApiResponse<Boolean> notificationBody = notificationResponse.body();

                modelAndView.addObject(
                        "isUnreadNotification",
                        Boolean.TRUE.equals(notificationBody != null ? notificationBody.getData() : null)
                );

            } catch (Exception e) {
                log.error("Notification check failed", e);
            }
        }

        modelAndView.addObject("isLogin", isLogin);
        modelAndView.addObject("userNickname",
                request.getAttribute("userNickname"));
    }
}
