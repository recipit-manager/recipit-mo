package com.recipitmo.service;

import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.NotificationDto;
import com.recipitmo.dto.UserInfoDto;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;

import java.util.List;

public interface UserService {
    @GET("user/login/status")
    Call<ApiResponse<String>> getLoginStatus(@Header("Cookie") String cookie);

    @GET("user/notification/unread/exists")
    Call<ApiResponse<Boolean>> getNotificationUnreadExists(@Header("Cookie") String cookie);

    @GET("/user/notification/list")
    Call<ApiResponse<List<NotificationDto>>> getNotificationList(@Header("Cookie") String cookie);

    @GET("/user")
    Call<ApiResponse<UserInfoDto>> getUserInfo(@Header("Cookie") String cookie);
}
