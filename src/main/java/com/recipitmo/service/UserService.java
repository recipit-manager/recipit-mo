package com.recipitmo.service;

import com.recipitmo.dto.ApiResponse;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;

public interface UserService {
    @GET("user/login/status")
    Call<ApiResponse<String>> getLoginStatus(@Header("Cookie") String cookie);
}
