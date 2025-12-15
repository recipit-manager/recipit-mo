package com.recipitmo.client.api;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.IngredientCategoryDto;
import com.recipitmo.dto.PopularRecipeDto;
import com.recipitmo.dto.RecipeDetailDto;
import com.recipitmo.dto.SearchRecipeDto;
import com.recipitmo.dto.UserDraftRecipeDto;
import com.recipitmo.dto.UserRecipeDto;
import com.recipitmo.service.RecipeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class RecipeApi {
    private final RecipeService recipeService;

    public RecipeApi() {
        this.recipeService = RetrofitClient.getRecipeService();
    }

    public List<PopularRecipeDto> getPopularRecipeList(HttpServletRequest request) {
        try {
            Response<ApiResponse<List<PopularRecipeDto>>> response =
                    recipeService.getPopularRecipes(request.getHeader("Cookie"), 10)
                            .execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("Failed to load popularRecipe List: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("Failed to load popularRecipe List", e);
        }

        return Collections.emptyList();
    }

    public SearchRecipeDto getRecentOrderRecipeList(
            String keyword,
            String categoryCode,
            int page,
            int size,
            HttpServletRequest request
    ) {
        try {
            Response<ApiResponse<SearchRecipeDto>> response =
                    recipeService.getRecentOrderRecipes(
                            request.getHeader("Cookie"),
                            categoryCode,
                            keyword,
                            page,
                            size
                    ).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("Failed to load recent-order list: HTTP {}", response.code());
            }

        } catch (IOException e) {
            log.error("Failed to load recent-order list", e);
        }

        return new SearchRecipeDto(Collections.emptyList(), Collections.emptyList());
    }

    public SearchRecipeDto getLikeOrderRecipeList(
            String keyword,
            String categoryCode,
            int page,
            int size,
            HttpServletRequest request
    ) {
        try {
            Response<ApiResponse<SearchRecipeDto>> response =
                    recipeService.getLikeOrderRecipes(
                            request.getHeader("Cookie"),
                            categoryCode,
                            keyword,
                            page,
                            size
                    ).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("Failed to load Like-order list: HTTP {}", response.code());
            }

        } catch (IOException e) {
            log.error("Failed to load order-order list", e);
        }

        return new SearchRecipeDto(Collections.emptyList(), Collections.emptyList());
    }

    public Optional<RecipeDetailDto> getRecipeDetail(String recipeNo, HttpServletRequest request) {
        try {
            Response<ApiResponse<RecipeDetailDto>> response =
                    recipeService.getRecipeDetail(
                            request.getHeader("Cookie"),
                            recipeNo
                    ).execute();

            if (response.isSuccessful() && response.body() != null) {
                return Optional.ofNullable(response.body().getData());
            } else {
                log.error("Failed to load recipe detail: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("Failed to load recipe detail", e);
        }

        return Optional.empty();
    }

    public Optional<Integer> getUserUploadRecipeCount(HttpServletRequest request) {
        try {
            Response<ApiResponse<Integer>> response =
                    recipeService.getUserUploadRecipeCount(request.getHeader("Cookie")).execute();

            if (response.isSuccessful() && response.body() != null) {
                return Optional.ofNullable(response.body().getData());
            }
            log.error("Failed to Upload Recipe Count: HTTP {}", response.code());
        } catch (IOException e) {
            log.error("Failed to Upload Recipe Count", e);
        }

        return Optional.empty();
    }

    public Optional<Integer> getUserDraftRecipeCount(HttpServletRequest request) {
        try {
            Response<ApiResponse<Integer>> response =
                    recipeService.getUserDraftRecipeCount(request.getHeader("Cookie")).execute();

            if (response.isSuccessful() && response.body() != null) {
                return Optional.ofNullable(response.body().getData());
            }
            log.error("Failed to Draft Recipe Count: HTTP {}", response.code());
        } catch (IOException e) {
            log.error("Failed to Draft Recipe Count", e);
        }

        return Optional.empty();
    }

    public Optional<Integer> getUserLikeRecipeCount(HttpServletRequest request) {
        try {
            Response<ApiResponse<Integer>> response =
                    recipeService.getUserLikeRecipeCount(request.getHeader("Cookie")).execute();

            if (response.isSuccessful() && response.body() != null) {
                return Optional.ofNullable(response.body().getData());
            }
            log.error("Failed to Like Recipe Count: HTTP {}", response.code());
        } catch (IOException e) {
            log.error("Failed to Like Recipe Count", e);
        }

        return Optional.empty();
    }

    public Optional<Integer> getUserBookmarkRecipeCount(HttpServletRequest request) {
        try {
            Response<ApiResponse<Integer>> response =
                    recipeService.getUserBookmarkRecipeCount(request.getHeader("Cookie")).execute();

            if (response.isSuccessful() && response.body() != null) {
                return Optional.ofNullable(response.body().getData());
            }
            log.error("Failed to Bookmark Recipe Count: HTTP {}", response.code());
        } catch (IOException e) {
            log.error("Failed to Bookmark Recipe Count", e);
        }

        return Optional.empty();
    }

    public List<UserRecipeDto> getUserUploadRecipes(
            HttpServletRequest request,
            int page,
            int size
    ) {
        try {
            Response<ApiResponse<List<UserRecipeDto>>> response =
                    recipeService.getUserRecipeList(
                            request.getHeader("Cookie"),
                            page,
                            size
                    ).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("Failed to load user recipe list: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("Failed to load user recipe list", e);
        }

        return Collections.emptyList();
    }

    public List<UserDraftRecipeDto> getUserDraftRecipes(HttpServletRequest request) {
        try {
            Response<ApiResponse<List<UserDraftRecipeDto>>> response = recipeService.getUserDraftRecipeList(request.getHeader("Cookie")).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("Failed to load user draft recipe list: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("Failed to load user draft recipe list", e);
        }

        return Collections.emptyList();
    }
}
