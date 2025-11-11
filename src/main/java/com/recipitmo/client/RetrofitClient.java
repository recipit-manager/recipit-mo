package com.recipitmo.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.recipitmo.service.TestService;
import retrofit2.Retrofit;
import retrofit2.Retrofit.Builder;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static final String BASE_URL = "http://local-recipit-api.com:8080/";

    public RetrofitClient() {
    }

    public static TestService getApiService() {
        return (TestService)getInstance().create(TestService.class);
    }

    private static Retrofit getInstance() {
        Gson gson = (new GsonBuilder()).setLenient().create();
        return (new Builder()).baseUrl("http://local-recipit-api.com:8080/").addConverterFactory(GsonConverterFactory.create(gson)).build();
    }
}