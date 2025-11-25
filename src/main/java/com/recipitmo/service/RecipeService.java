package com.recipitmo.service;

import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.PopularRecipeDto;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Query;

import java.util.List;

public interface RecipeService {
    @GET("/recipe/popular/list")
    Call<ApiResponse<List<PopularRecipeDto>>> getPopularRecipes(
            @Header("Cookie") String cookie,
            @Query("size") int size
    );
}
