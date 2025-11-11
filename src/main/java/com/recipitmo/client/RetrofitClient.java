package com.recipitmo.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.recipitmo.service.CommonService;
import com.recipitmo.service.UserService;
import retrofit2.Retrofit;
import retrofit2.Retrofit.Builder;
import retrofit2.converter.gson.GsonConverterFactory;

@Component
public class RetrofitClient {
    private static String BASE_URL;

    @Value("${api.base-url}")
    private void setBaseUrl(String baseUrl) {
        BASE_URL = baseUrl;
    }

    public RetrofitClient() {
    }

    public static UserService getUserApiService() {
        return getInstance().create(UserService.class);
    }

    public static CommonService getCommonService() {
        return getInstance().create(CommonService.class);
    }

    private static Retrofit getInstance() {
        Gson gson = new GsonBuilder().create();

        return new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build();
    }
}