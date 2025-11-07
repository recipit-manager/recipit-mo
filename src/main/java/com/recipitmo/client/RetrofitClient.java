package com.recipitmo.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.recipitmo.service.UserService;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static final String BASE_URL = "http://localhost:8080/";

    public RetrofitClient() {
    }

    public static UserService getUserApiService() {
        return getInstance().create(UserService.class);
    }

    private static Retrofit getInstance() {
        Gson gson = new GsonBuilder().create();

        return new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build();
    }
}