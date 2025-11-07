package com.recipitmo.interceptor;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.common.Constants;
import com.recipitmo.dto.apiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import retrofit2.Response;

public class LoginStatusInterceptor implements HandlerInterceptor {

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) throws Exception {

        if (modelAndView == null) return;

        try {
            Response<apiResponse<String>> apiResponse = RetrofitClient
                    .getUserApiService()
                    .getLoginStatus(request.getHeader("Cookie"))
                    .execute();

            for (String cookie : apiResponse.headers().values("Set-Cookie")) {
                response.addHeader("Set-Cookie", cookie);
            }

            apiResponse<String> body = apiResponse.body();

            boolean isLogin = body != null
                    && Constants.responseCode.SUCCESS.equals(body.getCode());

            modelAndView.addObject("isLogin", isLogin);
            modelAndView.addObject("userNickname",
                    isLogin ? body.getData() : null);

        } catch (Exception e) {
            modelAndView.addObject("isLogin", false);
        }
    }
}
