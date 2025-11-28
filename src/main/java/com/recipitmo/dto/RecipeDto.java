package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class RecipeDto {
    private final String recipeNo;
    private final String categoryCode;
    private final String name;
    private final String description;
    private final String imageUrl;
    private final int cookingTime;
    private final String difficultyCode;
    private final String difficultyCodeName;
    private final int likeCount;
    private final Boolean isLiked;
}
