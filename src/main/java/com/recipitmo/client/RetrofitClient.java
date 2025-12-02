package com.recipitmo.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.recipitmo.service.CommonService;
import com.recipitmo.service.RecipeService;
import com.recipitmo.service.RefriService;
import com.recipitmo.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import retrofit2.Retrofit;
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

    public static RecipeService getRecipeService() {
        return getInstance().create(RecipeService.class);
    }

    public static RefriService getRefriService() {
        return getInstance().create(RefriService.class);
    }

    private static Retrofit getInstance() {
        Gson gson = new GsonBuilder().create();

        return new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build();
    }
}