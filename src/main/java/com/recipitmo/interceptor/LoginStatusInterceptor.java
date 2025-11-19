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

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) throws Exception {
        if (modelAndView == null) {
            return;
        }

        try {
            Response<ApiResponse<String>> apiResponse = RetrofitClient
                    .getUserApiService()
                    .getLoginStatus(request.getHeader("Cookie"))
                    .execute();

            for (String cookie : apiResponse.headers().values("Set-Cookie")) {
                response.addHeader("Set-Cookie", cookie);
            }


            ApiResponse<String> body = apiResponse.body();

            boolean isLogin = body != null && Constants.responseCode.SUCCESS.equals(body.getCode());

            if (isLogin) {
                Response<ApiResponse<Boolean>> notificationResponse = RetrofitClient
                        .getUserApiService()
                        .getNotificationUnreadExists(request.getHeader("Cookie"))
                        .execute();

                ApiResponse<Boolean> notificationBody = notificationResponse.body();

                modelAndView.addObject("isUnreadNotification", notificationBody != null && notificationBody.getData());
            }

            modelAndView.addObject("isLogin", isLogin);
            modelAndView.addObject("userNickname",
                    isLogin ? body.getData() : null);
        } catch (Exception e) {
            log.error("Login status check failed", e);
        }
    }
}
