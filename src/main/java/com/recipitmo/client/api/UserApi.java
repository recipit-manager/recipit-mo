package com.recipitmo.client.api;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.UserInfoDto;
import com.recipitmo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class UserApi {

    private final UserService userService = RetrofitClient.getUserApiService();

    public Optional<UserInfoDto> getUserInfo(HttpServletRequest request) {
        try {
            Response<ApiResponse<UserInfoDto>> response = userService.getUserInfo(request.getHeader("Cookie")).execute();

            if (response.isSuccessful() && response.body() != null) {
                return Optional.ofNullable(response.body().getData());
            } else {
                log.error("HTTP Error User Info API: {}", response.code());
            }
        } catch (Exception e) {
            log.error("User Info API Exception", e);
        }

        return Optional.empty();
    }
}