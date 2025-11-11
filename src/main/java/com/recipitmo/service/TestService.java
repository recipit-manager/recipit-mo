package com.recipitmo.service;

import retrofit2.Call;
import retrofit2.http.GET;

public interface TestService {
    @GET("common/country/list")
    Call<Object> getTest();
}
