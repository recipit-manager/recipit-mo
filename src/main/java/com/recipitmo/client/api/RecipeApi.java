package com.recipitmo.client.api;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.PopularRecipeDto;
import com.recipitmo.dto.SearchRecipeDto;
import com.recipitmo.service.RecipeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class RecipeApi {
    private final RecipeService recipeService;

    public RecipeApi() {
        this.recipeService = RetrofitClient.getRecipeService();
    }

    public List<PopularRecipeDto> getPopularRecipeList(HttpServletRequest request) {
        try{
            Response<ApiResponse<List<PopularRecipeDto>>> response =
                    recipeService.getPopularRecipes(request.getHeader("Cookie"),10)
                            .execute();

            if(response.isSuccessful() && response.body() != null){
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
}
