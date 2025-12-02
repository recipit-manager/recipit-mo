package com.recipitmo.service;

import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.RefriItemRecipeListDto;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Query;

import java.util.List;

public interface RefriService {
    @GET("/refri-item/list")
    Call<ApiResponse<List<RefriItemRecipeListDto>>> getRefriRecipeList(
            @Header("Cookie") String cookie,
            @Query("keywordList") List<String> keywordList,
            @Query("page") Integer page,
            @Query("size") Integer size
    );
}
