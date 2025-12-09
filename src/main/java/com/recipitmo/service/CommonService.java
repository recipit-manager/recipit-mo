package com.recipitmo.service;

import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.CountryDto;
import com.recipitmo.dto.DifficultyDto;
import com.recipitmo.dto.IngredientCategoryDto;
import com.recipitmo.dto.IngredientTypeDto;
import com.recipitmo.dto.RecipeCategoryDto;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Query;

import java.util.List;

public interface CommonService {

    @GET("common/email-domain/list")
    Call<ApiResponse<List<String>>> getEmailDomainList(
            @Header("Accept-Language") String language
    );

    @GET("common/country/list")
    Call<ApiResponse<List<CountryDto>>> getCountryList(
            @Header("Accept-Language") String language,
            @Query("language") String groupCode
    );

    @GET("common/recipe/category/list")
    Call<ApiResponse<List<RecipeCategoryDto>>> getRecipeCategoryList();

    @GET("common/refri-item/ingredient/list")
    Call<ApiResponse<IngredientCategoryDto>> getIngredientCategoryList();

    @GET("common/difficulty/list")
    Call<ApiResponse<List<DifficultyDto>>> getDifficultyList();

    @GET("common/ingredient-type/list")
    Call<ApiResponse<List<IngredientTypeDto>>> getIngredientTypeList();
}