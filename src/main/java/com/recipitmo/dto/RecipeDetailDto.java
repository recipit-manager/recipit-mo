package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class RecipeDetailDto {
    private final String nickname;
    private final String recipeNo;
    private final String title;
    private final String description;
    private final Integer cookingTime;
    private final Integer servingSize;
    private final String difficulty;
    private final String mainImageUrl;
    private final List<String> completionImageUrlList;
    private final List<IngredientDto> ingredientList;
    private final List<StepDto> stepList;
    private final Integer likeCount;
    private final String likeYn;
    private final String bookmarkYn;
    private final String reportYn;
    private final String statusCode;
    private final String statusName;
}
