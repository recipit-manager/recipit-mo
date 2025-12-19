package com.recipitmo.service;

import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.BookmarkRecipeDto;
import com.recipitmo.dto.PopularRecipeDto;
import com.recipitmo.dto.PreferCategoryDto;
import com.recipitmo.dto.RecipeDetailDto;
import com.recipitmo.dto.SearchRecipeDto;
import com.recipitmo.dto.UserDraftRecipeDto;
import com.recipitmo.dto.UserRecipeDto;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Path;
import retrofit2.http.Query;

import java.util.List;

public interface RecipeService {
    @GET("/recipe/popular/list")
    Call<ApiResponse<List<PopularRecipeDto>>> getPopularRecipes(
            @Header("Cookie") String cookie,
            @Query("size") int size
    );

    @GET("/recipe/list/recent-order")
    Call<ApiResponse<SearchRecipeDto>> getRecentOrderRecipes(
            @Header("Cookie") String cookie,
            @Query("categoryCode") String categoryCode,
            @Query("keyword") String keyword,
            @Query("page") int page,
            @Query("size") int size
    );

    @GET("/recipe/list/like-order")
    Call<ApiResponse<SearchRecipeDto>> getLikeOrderRecipes(
            @Header("Cookie") String cookie,
            @Query("categoryCode") String categoryCode,
            @Query("keyword") String keyword,
            @Query("page") int page,
            @Query("size") int size
    );

    @GET("/recipe/{recipeNo}")
    Call<ApiResponse<RecipeDetailDto>> getRecipeDetail(
            @Header("Cookie") String cookie,
            @Path("recipeNo") String recipeNo
    );

    @GET("/recipe/count")
    Call<ApiResponse<Integer>> getUserUploadRecipeCount(
            @Header("Cookie") String cookie
    );

    @GET("/recipe/draft/count")
    Call<ApiResponse<Integer>> getUserDraftRecipeCount(
            @Header("Cookie") String cookie
    );

    @GET("recipe/like/count")
    Call<ApiResponse<Integer>> getUserLikeRecipeCount(
            @Header("Cookie") String cookie
    );

    @GET("recipe/bookmark/count")
    Call<ApiResponse<Integer>> getUserBookmarkRecipeCount(
            @Header("Cookie") String cookie
    );

    @GET("/recipe/list")
    Call<ApiResponse<List<UserRecipeDto>>> getUserRecipeList(
            @Header("Cookie") String cookie,
            @Query("page") int page,
            @Query("size") int size
    );

    @GET("/recipe/draft/list")
    Call<ApiResponse<List<UserDraftRecipeDto>>> getUserDraftRecipeList(
            @Header("Cookie") String cookie
    );

    @GET("/recipe/recent/list")
    Call<ApiResponse<List<UserRecipeDto>>> getUserRecentRecipeList(
            @Header("Cookie") String cookie
    );

    @GET("/recipe/bookmark/list")
    Call<ApiResponse<List<BookmarkRecipeDto>>> getUserBookmarkRecipeList(
            @Header("Cookie") String cookie,
            @Query("page") int page,
            @Query("size") int size
    );

    @GET("/recipe/preference-category/list")
    Call<ApiResponse<List<PreferCategoryDto>>> getPreferenceCategoryList(
            @Header("Cookie") String cookie
    );
}